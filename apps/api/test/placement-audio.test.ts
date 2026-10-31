import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { placementRouter } from '../src/routes/placement.js';
import { prisma } from '../src/lib/prisma.js';

// Logic xác định playback mode giống component frontend
export type AudioPlaybackMode =
  | 'REAL_AUDIO_SEGMENT'
  | 'TTS_PENDING_TIMESTAMP'
  | 'TTS_NO_AUDIO';

export function determinePlaybackMode(
  audioUrl?: string | null,
  start?: number | null,
  end?: number | null
): AudioPlaybackMode {
  const hasUrl = !!audioUrl && audioUrl.trim().length > 0;
  const hasValidTimestamp =
    typeof start === 'number' &&
    typeof end === 'number' &&
    end > start;

  if (hasUrl && hasValidTimestamp) {
    return 'REAL_AUDIO_SEGMENT';
  }
  if (hasUrl && !hasValidTimestamp) {
    return 'TTS_PENDING_TIMESTAMP';
  }
  return 'TTS_NO_AUDIO';
}

function createTestApp(userId: string = 'demo-user-id-001') {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    (req as any).user = { id: userId, role: 'STUDENT' };
    next();
  });
  app.use('/api/v1/placement', placementRouter);
  return app;
}

test('Placement Audio DoD 1: Mode Determination conforms strictly to 3 spec cases', () => {
  // Case (a): Section có audioUrl VÀ có start/end hợp lệ -> REAL_AUDIO_SEGMENT
  assert.equal(
    determinePlaybackMode('/audio/placement/cam11_t1_s4_ocean_biodiversity.mp3', 0, 236),
    'REAL_AUDIO_SEGMENT',
    'Phải dùng audio thật khi có url và timestamp hợp lệ'
  );
  assert.equal(
    determinePlaybackMode('/audio/section1.mp3', 12.5, 95.8),
    'REAL_AUDIO_SEGMENT'
  );

  // Case (b): Section có audioUrl full nhưng CHƯA CÓ start/end (hoặc timestamp không hợp lệ) -> TTS_PENDING_TIMESTAMP
  // TUYỆT ĐỐI KHÔNG phát file full cho 1 section (sẽ lộ đáp án section sau)
  assert.equal(
    determinePlaybackMode('/audio/ielts-listening/cambridge-ielts-01/Cambridge IELTS 1.1.mp3', null, null),
    'TTS_PENDING_TIMESTAMP',
    'Có file full nhưng null timestamp -> bắt buộc tạm dùng TTS'
  );
  assert.equal(
    determinePlaybackMode('/audio/cam02.mp3', 0, null),
    'TTS_PENDING_TIMESTAMP'
  );
  assert.equal(
    determinePlaybackMode('/audio/cam02.mp3', null, 200),
    'TTS_PENDING_TIMESTAMP'
  );
  assert.equal(
    determinePlaybackMode('/audio/cam02.mp3', 100, 50), // end <= start
    'TTS_PENDING_TIMESTAMP',
    'endSec <= startSec -> không hợp lệ -> fallback TTS'
  );

  // Case (c): Section audioUrl NULL -> TTS_NO_AUDIO
  assert.equal(
    determinePlaybackMode(null, null, null),
    'TTS_NO_AUDIO',
    'AudioUrl NULL -> dùng TTS'
  );
  assert.equal(
    determinePlaybackMode('', null, null),
    'TTS_NO_AUDIO'
  );
  assert.equal(
    determinePlaybackMode('   ', 0, 100),
    'TTS_NO_AUDIO'
  );
});

test('Placement Audio DoD 2: GET /api/v1/placement/questions returns listening questions with audio fields', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/placement/questions`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as any;

    const listeningQuestions = body.questions.filter((q: any) => q.section === 'listening');
    assert.equal(listeningQuestions.length, 5, 'Phải có 5 câu hỏi phần Listening');

    for (const q of listeningQuestions) {
      assert.ok(q.id.startsWith('list-cam11-t1-l4'), 'ID câu hỏi phải bắt đầu bằng list-cam11-t1-l4');
      assert.equal(q.section, 'listening');
      assert.ok('audioUrl' in q, 'Phải có field audioUrl');
      assert.ok('audioStartSec' in q, 'Phải có field audioStartSec');
      assert.ok('audioEndSec' in q, 'Phải có field audioEndSec');
      assert.ok('audioscript' in q, 'Phải có field audioscript cho TTS fallback');

      // Khi trong DB đã có start/end, mode phải là REAL_AUDIO_SEGMENT
      if (q.audioUrl && q.audioStartSec !== null && q.audioEndSec !== null) {
        const mode = determinePlaybackMode(q.audioUrl, q.audioStartSec, q.audioEndSec);
        assert.equal(mode, 'REAL_AUDIO_SEGMENT');
        assert.ok(q.audioEndSec > q.audioStartSec, 'audioEndSec phải lớn hơn audioStartSec');
      }
    }
  } finally {
    server.close();
  }
});

test('Placement Audio DoD 3: DB Record cam11-academic-t1-l4 has valid audio_url and timestamps', async () => {
  const section = await prisma.ieltsListeningSection.findUnique({
    where: { id: 'cam11-academic-t1-l4' },
    select: {
      id: true,
      audioUrl: true,
      audioStartSec: true,
      audioEndSec: true,
      scriptJson: true,
    },
  });

  assert.ok(section, 'cam11-academic-t1-l4 phải tồn tại trong DB');
  assert.equal(section.audioUrl, '/audio/placement/cam11_t1_s4_ocean_biodiversity.mp3');
  assert.equal(section.audioStartSec, 0);
  assert.equal(section.audioEndSec, 236);
  assert.ok(section.scriptJson, 'Phải có scriptJson bài giảng');
});

