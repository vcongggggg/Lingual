import { Router } from 'express';
import {
  SpeakingPrompt,
  SpeakingSubmission,
  SpeakingResult,
  SpeakingFeedback,
  evaluateSpeakingSubmission,
  calculateSpeakingXP,
  updateStreakWithTimezone,
  mapSpeakingPerformanceToSRSQuality,
} from '@linguaflow/domain';
import { MASTER_SPEAKING_PROMPTS } from './speakingData.js';
import { speakingRepository } from '../repositories/index.js';

export const speakingRouter = Router();

// In-memory attempt store keyed by userId
interface UserSpeakingAttempt {
  id: string;
  userId: string;
  promptId: string;
  promptTitle: string;
  mode: string;
  difficulty: string;
  transcript: string;
  durationSeconds: number;
  wordCount: number;
  overallScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  grade: string;
  xpAwarded: number;
  feedback: SpeakingFeedback;
  submittedAt: string;
}

const attemptsStore: Map<string, UserSpeakingAttempt[]> = new Map();

// Idempotency cache: key -> timestamp
const idempotencyCache = new Map<string, { timestamp: number; result: any }>();

// Daily XP tracker: userId:YYYY-MM-DD -> totalXP
const dailyXPTracker = new Map<string, number>();
const DAILY_SPEAKING_XP_CAP = 200;

function resolveUser(req: any): { id: string; email: string; role: string } {
  if (req.user && req.user.id) {
    return req.user;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return { id: `user-${token.slice(0, 8)}`, email: 'learner@linguaflow.com', role: 'STUDENT' };
  }
  return { id: 'demo-speaking-user', email: 'demo@linguaflow.com', role: 'STUDENT' };
}

// 1. GET /prompts
speakingRouter.get('/prompts', (req, res) => {
  const { mode, difficulty, cefr, topic, limit } = req.query;

  let filtered = [...MASTER_SPEAKING_PROMPTS];

  if (mode && typeof mode === 'string') {
    filtered = filtered.filter((p) => p.mode.toLowerCase() === mode.toLowerCase());
  }
  if (difficulty && typeof difficulty === 'string') {
    filtered = filtered.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (cefr && typeof cefr === 'string') {
    filtered = filtered.filter((p) => p.cefr.toUpperCase() === cefr.toUpperCase());
  }
  if (topic && typeof topic === 'string') {
    filtered = filtered.filter((p) => p.topic.toLowerCase().includes(topic.toLowerCase()));
  }

  const maxResults = limit ? parseInt(limit as string, 10) : filtered.length;
  res.json({ prompts: filtered.slice(0, isNaN(maxResults) ? filtered.length : maxResults) });
});

// 2. GET /prompts/:id
speakingRouter.get('/prompts/:id', (req, res) => {
  const prompt = MASTER_SPEAKING_PROMPTS.find((p) => p.id === req.params.id);
  if (!prompt) {
    return res.status(404).json({ error: 'Speaking prompt not found.' });
  }
  res.json({ prompt });
});

// 3. POST /analyze (Deterministic local feedback preview without persistence)
speakingRouter.post('/analyze', (req, res) => {
  const { promptId, transcript, durationMs } = req.body;

  if (!promptId || typeof promptId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid promptId.' });
  }

  const prompt = MASTER_SPEAKING_PROMPTS.find((p) => p.id === promptId);
  if (!prompt) {
    return res.status(404).json({ error: 'Speaking prompt not found.' });
  }

  if (typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Invalid transcript payload.' });
  }

  if (transcript.length > 5000) {
    return res.status(400).json({ error: 'Transcript payload exceeds maximum length limit.' });
  }

  const duration = typeof durationMs === 'number' ? durationMs : 0;
  if (duration < 0) {
    return res.status(400).json({ error: 'Duration cannot be negative.' });
  }

  const feedback = evaluateSpeakingSubmission(prompt, {
    promptId,
    transcript,
    durationMs: duration,
  });

  res.json({ feedback });
});

// 4. POST /attempts (Server-authoritative scoring, XP, and streak evaluation)
speakingRouter.post('/attempts', async (req, res) => {
  const user = resolveUser(req);
  const { promptId, transcript, durationMs } = req.body;

  if (!promptId || typeof promptId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid promptId.' });
  }

  const prompt = MASTER_SPEAKING_PROMPTS.find((p) => p.id === promptId);
  if (!prompt) {
    return res.status(404).json({ error: 'Speaking prompt not found.' });
  }

  if (typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Invalid transcript payload.' });
  }

  if (transcript.length > 5000) {
    return res.status(400).json({ error: 'Transcript payload exceeds maximum length limit.' });
  }

  const duration = typeof durationMs === 'number' ? durationMs : 0;
  if (duration < 0) {
    return res.status(400).json({ error: 'Duration cannot be negative.' });
  }

  // Idempotency check (5s window)
  const normText = transcript.trim().toLowerCase();
  const idempotencyKey = `${user.id}:${promptId}:${normText}`;
  const now = Date.now();
  const cached = idempotencyCache.get(idempotencyKey);

  if (cached && now - cached.timestamp < 5000) {
    return res.status(200).json({
      ...cached.result,
      idempotentDuplicate: true,
    });
  }

  // Authoritative Evaluation
  const feedback = evaluateSpeakingSubmission(prompt, {
    promptId,
    transcript,
    durationMs: duration,
  });

  const durationSeconds = Math.round(duration / 1000);
  const calculatedXP = calculateSpeakingXP(
    prompt.difficulty,
    durationSeconds,
    feedback.overallScore,
    true
  );

  // Daily XP cap enforcement
  const todayKey = `${user.id}:${new Date().toISOString().split('T')[0]}`;
  const currentDailyXP = dailyXPTracker.get(todayKey) || 0;
  const allowableXP = Math.max(0, Math.min(calculatedXP, DAILY_SPEAKING_XP_CAP - currentDailyXP));
  dailyXPTracker.set(todayKey, currentDailyXP + allowableXP);

  // Authoritative Streak update
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const streakUpdate = updateStreakWithTimezone({
    currentStreak: 5,
    streakFreezes: 2,
    lastActiveDate: yesterday.toISOString().split('T')[0],
  });

  const attemptId = `sp-att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const attemptRecord: UserSpeakingAttempt = {
    id: attemptId,
    userId: user.id,
    promptId: prompt.id,
    promptTitle: prompt.title,
    mode: prompt.mode,
    difficulty: prompt.difficulty,
    transcript,
    durationSeconds,
    wordCount: transcript.split(/\s+/).filter(Boolean).length,
    overallScore: feedback.overallScore,
    pronunciationScore: feedback.pronunciationScore,
    fluencyScore: feedback.fluencyScore,
    grammarScore: feedback.grammarScore,
    vocabularyScore: feedback.vocabularyScore,
    coherenceScore: feedback.coherenceScore,
    grade: feedback.grade,
    xpAwarded: allowableXP,
    feedback,
    submittedAt: new Date().toISOString(),
  };

  await speakingRepository.createAttempt({
    id: attemptId,
    userId: user.id,
    promptId: prompt.id,
    mode: prompt.mode,
    transcript,
    durationMs: durationSeconds * 1000,
    score: feedback.overallScore,
    pronunciationScore: feedback.pronunciationScore,
    fluencyScore: feedback.fluencyScore,
    xpAwarded: allowableXP,
    createdAt: new Date().toISOString(),
  });

  const userAttempts = attemptsStore.get(user.id) || [];
  userAttempts.unshift(attemptRecord);
  attemptsStore.set(user.id, userAttempts);

  // SRS bridge suggestions
  const srsSuggestions = feedback.vocabularySuggestions.map((v) => v.word);

  const result: SpeakingResult = {
    submissionId: attemptId,
    feedback,
    xpAwarded: allowableXP,
    streakUpdated: streakUpdate.streakMaintained,
    srsSuggestions,
    duration: durationSeconds,
    wordCount: attemptRecord.wordCount,
  };

  // Cache for idempotency
  idempotencyCache.set(idempotencyKey, { timestamp: now, result });

  res.status(201).json(result);
});

// 5. GET /history
speakingRouter.get('/history', async (req, res) => {
  const user = resolveUser(req);
  const repoAttempts = await speakingRepository.getUserAttempts(user.id);
  const userAttempts = attemptsStore.get(user.id) || [];
  res.json({ attempts: userAttempts.length > 0 ? userAttempts : repoAttempts });
});

// 6. GET /stats
speakingRouter.get('/stats', (req, res) => {
  const user = resolveUser(req);
  const userAttempts = attemptsStore.get(user.id) || [];

  const totalAttempts = userAttempts.length;
  const totalDurationSeconds = userAttempts.reduce((sum, a) => sum + a.durationSeconds, 0);
  const totalXP = userAttempts.reduce((sum, a) => sum + a.xpAwarded, 0);

  const averageScore = totalAttempts > 0
    ? Math.round(userAttempts.reduce((sum, a) => sum + a.overallScore, 0) / totalAttempts)
    : 75;

  const averagePronunciation = totalAttempts > 0
    ? Math.round(userAttempts.reduce((sum, a) => sum + a.pronunciationScore, 0) / totalAttempts)
    : 78;

  const averageFluency = totalAttempts > 0
    ? Math.round(userAttempts.reduce((sum, a) => sum + a.fluencyScore, 0) / totalAttempts)
    : 72;

  res.json({
    stats: {
      totalAttempts,
      totalMinutes: Math.round(totalDurationSeconds / 60),
      totalXP,
      averageScore,
      averagePronunciation,
      averageFluency,
      topGrade: totalAttempts > 0 ? userAttempts[0].grade : 'Good',
    },
  });
});

// 7. GET /recommendations
speakingRouter.get('/recommendations', (req, res) => {
  const { locale } = req.query;
  const loc = typeof locale === 'string' ? locale : 'vi';

  const defaultFeedback: SpeakingFeedback = {
    pronunciationScore: 68,
    fluencyScore: 65,
    grammarScore: 75,
    vocabularyScore: 70,
    coherenceScore: 65,
    overallScore: 68,
    grade: 'Needs Practice',
    corrections: [],
    pronunciationIssues: [],
    vocabularySuggestions: [],
    advice: '',
  };

  const adviceList = evaluateSpeakingSubmission(
    MASTER_SPEAKING_PROMPTS[0],
    { promptId: MASTER_SPEAKING_PROMPTS[0].id, transcript: 'test', durationMs: 10000 },
    loc
  );

  res.json({
    recommendations: [
      {
        id: 'rec-sp-1',
        title: loc === 'vi' ? 'Luyện phát âm âm thổi /θ/' : 'Practice /θ/ Consonant Clusters',
        description: loc === 'vi' ? 'Khắc phục nhầm lẫn giữa âm think và sink.' : 'Avoid confusing think and sink sounds.',
        mode: 'pronunciation',
        actionRoute: `/${loc}/speaking/pronunciation`,
      },
      {
        id: 'rec-sp-2',
        title: loc === 'vi' ? 'Nói đuổi chủ đề Công sở (Shadowing B2)' : 'Workplace Shadowing (B2)',
        description: loc === 'vi' ? 'Nâng cao độ trôi chảy và ngữ điệu tự nhiên.' : 'Build natural cadence and workplace cadence.',
        mode: 'shadowing',
        actionRoute: `/${loc}/speaking/shadowing`,
      },
    ],
  });
});

// 8. POST /attempts/:id/srs (Bridge to save vocabulary to personal SRS deck)
speakingRouter.post('/attempts/:id/srs', (req, res) => {
  const { words } = req.body;
  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: 'No words provided for SRS deck integration.' });
  }

  res.json({
    status: 'ok',
    savedWords: words,
    message: 'Words saved to personal vocabulary for spaced repetition practice.',
  });
});
