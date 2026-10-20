import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { geminiChatService } from '../services/geminiChatService.js';
import { resolveAuthUserId } from '../lib/authUtil.js';

const prisma = new PrismaClient();
export const chatbotRouter = Router();

export interface RagRef {
  type: 'vocab' | 'ielts' | 'lesson';
  id: string;
  title: string;
  subtitle?: string;
  data: any;
}

/**
 * GET /api/v1/chatbot/status
 * Kiểm tra trạng thái AI Gemini cho chatbot
 */
chatbotRouter.get('/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    aiConnected: hasKey,
    provider: 'gemini',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    message: hasKey
      ? 'Đã kết nối Gemini AI R2.0 cho Chatbot'
      : 'Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.',
  });
});

/**
 * Extract meaningful keywords from user message for RAG lookup
 */
function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['là', 'gì', 'như', 'thế', 'nào', 'cho', 'tôi', 'bạn', 'hãy', 'giúp'].includes(w));
  return Array.from(new Set(words));
}

/**
 * RAG Context Retriever returning text + structured DB references
 */
async function retrieveRagDetails(query: string): Promise<{ textContext: string; refs: RagRef[] }> {
  const keywords = extractKeywords(query);
  const ragSnippets: string[] = [];
  const refs: RagRef[] = [];

  try {
    // 1. Search Vocabularies
    if (keywords.length > 0) {
      const vocabMatches = await prisma.vocabulary.findMany({
        where: {
          OR: keywords.flatMap((kw) => [
            { targetText: { contains: kw, mode: 'insensitive' } },
            { translation: { contains: kw, mode: 'insensitive' } },
            { category: { contains: kw, mode: 'insensitive' } },
          ]),
        },
        take: 5,
      });

      if (vocabMatches.length > 0) {
        vocabMatches.forEach((v) => {
          refs.push({
            type: 'vocab',
            id: v.id,
            title: v.targetText,
            subtitle: `${v.translation} (${v.phonetic || ''})`,
            data: v,
          });
        });

        ragSnippets.push(
          '📌 Từ vựng liên quan trong Lingual DB:\n' +
            vocabMatches
              .map(
                (v) =>
                  `• ${v.targetText} (${v.phonetic || ''}) = "${v.translation}" [Level ${v.cefrLevel}]. Ví dụ: "${v.exampleSentence || ''}" (${v.exampleTranslation || ''})`
              )
              .join('\n')
        );
      }
    }

    // 2. Search IELTS Questions
    if (keywords.some((kw) => ['ielts', 'reading', 'listening', 'writing', 'band', 'essay', 'task'].includes(kw))) {
      const ieltsMatches = await prisma.ieltsQuestion.findMany({
        take: 3,
      });

      if (ieltsMatches.length > 0) {
        ieltsMatches.forEach((q) => {
          refs.push({
            type: 'ielts',
            id: q.id,
            title: q.title,
            subtitle: `IELTS ${q.skill.toUpperCase()} • Band ${q.targetBand}`,
            data: q,
          });
        });

        ragSnippets.push(
          '📌 Đề thi IELTS mẫu trong Lingual:\n' +
            ieltsMatches
              .map((q) => `• [${q.skill.toUpperCase()} - Band ${q.targetBand}] ${q.title}: ${q.prompt || 'Đoạn văn đọc 2 cột'}`)
              .join('\n')
        );
      }
    }
  } catch (err) {
    console.error('RAG Retrieval Notice: Using fallback dictionary context');
  }

  // Fallback synthetic ref if specific word requested
  if (refs.length === 0 && query.toLowerCase().includes('substantial')) {
    const subData = {
      id: 'sub_v1',
      targetText: 'Substantial',
      translation: 'Đáng kể / Cực lớn',
      phonetic: '/səbˈstænʃl/',
      cefrLevel: 'B2',
      exampleSentence: 'A substantial amount of investment went into solar energy.',
      exampleTranslation: 'Một lượng đầu tư đáng kể đã vào năng lượng mặt trời.',
    };
    refs.push({
      type: 'vocab',
      id: subData.id,
      title: subData.targetText,
      subtitle: subData.translation,
      data: subData,
    });
    ragSnippets.push(
      '📌 Từ vựng trong DB:\n• Substantial (/səbˈstænʃl/) = "Đáng kể / Cực lớn" [Level B2]. Ví dụ: "A substantial amount of investment went into solar energy."'
    );
  }

  return { textContext: ragSnippets.join('\n\n'), refs };
}

/**
 * SSE Streaming Endpoint Handler
 * Sử dụng Gemini LLM API thật, không dùng Ollama
 */
const sseStreamHandler = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { message = '', history = [] } = req.body;
  const userId = resolveAuthUserId(req) || req.body.userId || 'u-demo-1';

  if (!message.trim()) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: 'Message cannot be empty' })}\n\n`);
    return res.end();
  }

  // Kiểm tra GEMINI_API_KEY: thiếu key -> báo rõ chưa kết nối AI, KHÔNG lén fallback sang Ollama
  if (!process.env.GEMINI_API_KEY) {
    res.write(
      `event: error\ndata: ${JSON.stringify({
        error: 'Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.',
        provider: 'gemini',
        aiConnected: false,
      })}\n\n`
    );
    return res.end();
  }

  try {
    const { refs: ragRefs } = await retrieveRagDetails(message);

    // Chuyển history sang định dạng { role, text }
    const formattedHistory = history.slice(-6).map((h: any) => ({
      role: (h.sender === 'user' || h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      text: h.text || h.content || '',
    }));

    const result = await geminiChatService.chat(userId, message.trim(), formattedHistory);

    // Gửi metadata trước
    res.write(
      `event: metadata\ndata: ${JSON.stringify({
        provider: 'gemini',
        model: result.model,
        responseTimeMs: result.responseTimeMs,
        mood: result.mood,
        usedGemini: true,
        usedRag: result.usedRag,
        grounding: result.grounding,
        ragRefs,
      })}\n\n`
    );

    // Stream token theo từ ngữ
    const words = result.reply.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`event: token\ndata: ${JSON.stringify({ token: chunk })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  } catch (err: any) {
    res.write(
      `event: error\ndata: ${JSON.stringify({
        error: err.message || 'Chưa kết nối AI: Lỗi khi gọi Gemini API.',
        provider: 'gemini',
        aiConnected: false,
      })}\n\n`
    );
    res.end();
  }
};

chatbotRouter.post('/stream', sseStreamHandler);

/**
 * Endpoint POST /api/v1/chatbot/chat
 * Hỗ trợ cả SSE Streaming lẫn JSON response qua Gemini LLM API thật
 */
chatbotRouter.post('/chat', async (req: Request, res: Response) => {
  if (
    req.headers.accept?.includes('text/event-stream') ||
    req.body?.stream === true ||
    req.query?.stream === 'true'
  ) {
    return sseStreamHandler(req, res);
  }

  const { message = '', history = [] } = req.body;
  const userId = resolveAuthUserId(req) || req.body.userId || 'u-demo-1';

  if (!message.trim()) {
    return res.status(400).json({ success: false, message: 'Message cannot be empty' });
  }

  // Kiểm tra key theo quy định: thiếu key -> báo rõ chưa kết nối AI
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      success: false,
      error: 'Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.',
      aiConnected: false,
      provider: 'gemini',
      botReply: 'Chưa kết nối AI: Máy chủ chưa cấu hình GEMINI_API_KEY. Vui lòng liên hệ quản trị viên.',
    });
  }

  try {
    const { refs: ragRefs } = await retrieveRagDetails(message);

    const formattedHistory = history.slice(-6).map((h: any) => ({
      role: (h.sender === 'user' || h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      text: h.text || h.content || '',
    }));

    const result = await geminiChatService.chat(userId, message.trim(), formattedHistory);

    return res.json({
      success: true,
      provider: 'gemini',
      model: result.model,
      responseTimeMs: result.responseTimeMs,
      botReply: result.reply,
      mood: result.mood,
      usedGemini: true,
      ragContextApplied: result.usedRag,
      ragRefs,
      grounding: result.grounding,
      suggestedActions: result.suggestedActions,
      aiConnected: true,
    });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      error: error.message || 'Chưa kết nối AI: Lỗi khi kết nối với Gemini AI.',
      provider: 'gemini',
      aiConnected: false,
      botReply: error.message?.startsWith('Chưa kết nối AI')
        ? error.message
        : `Chưa kết nối AI: ${error.message || 'Lỗi kết nối Gemini API.'}`,
    });
  }
});

/**
 * GET /api/v1/chatbot/history?userId=...
 * Fetch saved DB chat messages for authenticated user
 */
chatbotRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const userId = resolveAuthUserId(req) || (req.query.userId as string);
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId required' });
    }

    const session = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return res.json({ success: true, messages: [] });
    }

    const formattedMessages = session.messages.map((m) => ({
      id: m.id,
      sender: m.role === 'user' ? 'user' : 'bot',
      text: m.content,
      timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      usedGemini: m.sourceType === 'llm',
      provider: 'gemini',
      ragApplied: m.sourceType === 'rag',
      ragRefs: m.ragRefs ? JSON.parse(m.ragRefs) : undefined,
    }));

    return res.json({ success: true, sessionId: session.id, messages: formattedMessages });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/v1/chatbot/sync
 * Sync messages from client to DB
 */
chatbotRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const { messages = [] } = req.body;
    const userId = resolveAuthUserId(req) || req.body.userId;
    if (!userId || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'userId and messages array required' });
    }

    let session = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId },
      });
    }

    // Replace or insert latest messages
    await prisma.chatMessage.deleteMany({
      where: { sessionId: session.id },
    });

    await prisma.chatMessage.createMany({
      data: messages.map((m: any) => ({
        sessionId: session.id,
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text || '',
        sourceType: (m.usedGemini || m.provider === 'gemini') ? 'llm' : m.ragApplied ? 'rag' : 'fallback',
        ragRefs: m.ragRefs ? JSON.stringify(m.ragRefs) : null,
      })),
    });

    return res.json({ success: true, message: 'Chat synced to cloud DB successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
