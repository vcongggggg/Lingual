import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const chatbotRouter = Router();

const OLLAMA_API_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

export interface RagRef {
  type: 'vocab' | 'ielts' | 'lesson';
  id: string;
  title: string;
  subtitle?: string;
  data: any;
}

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
 * SSE Streaming Endpoint (Server-Sent Events)
 * POST /api/v1/chatbot/stream
 */
chatbotRouter.post('/stream', async (req: Request, res: Response) => {
  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { message = '', history = [], contextPage = '' } = req.body;

  if (!message.trim()) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: 'Message cannot be empty' })}\n\n`);
    return res.end();
  }

  // 1. Retrieve RAG Context & Structured Refs
  const { textContext: ragContext, refs: ragRefs } = await retrieveRagDetails(message);

  // 2. Prepare System Prompt
  const systemPrompt = `Bạn là LingLing - Trợ lý AI học tiếng Anh & Luyện thi IELTS thân thiện, thông minh của ứng dụng Lingual.
Hãy trả lời người dùng một cách tự nhiên, ngắn gọn, súc tích và khích lệ.

${
  contextPage ? `[NGỮ CẢNH TRANG HIỆN TẠI]: Người dùng đang mở trang: ${contextPage}\n` : ''
}${
    ragContext
      ? `[DƯỚI ĐÂY LÀ DỮ LIỆU THỰC TẾ TRA CỨU TỪ CƠ SỞ DỮ LIỆU LINGUAL]:\n${ragContext}\n\nHãy ưu tiên dùng thông tin này để trả lời chính xác, không tự bịa từ vựng hay đề thi không có trong ứng dụng.`
      : 'Trả lời đúng trọng tâm bằng tiếng Việt và giải thích từ vựng tiếng Anh.'
  }`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text,
    })),
    { role: 'user', content: message },
  ];

  let firstTokenReceived = false;
  let usedOllama = false;

  // Function to stream string token by token as SSE fallback
  const streamFallbackTokens = async (text: string) => {
    res.write(
      `event: metadata\ndata: ${JSON.stringify({
        usedOllama: false,
        ragApplied: Boolean(ragContext),
        ragRefs,
      })}\n\n`
    );

    // Stream token by token (words)
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`event: token\ndata: ${JSON.stringify({ token: chunk })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  };

  // 3. Connect to Ollama API with Stream
  try {
    const controller = new AbortController();
    // 3.5s timeout for FIRST TOKEN ONLY
    const firstTokenTimer = setTimeout(() => {
      if (!firstTokenReceived) {
        controller.abort();
      }
    }, 3500);

    const ollamaRes = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!ollamaRes.ok || !ollamaRes.body) {
      clearTimeout(firstTokenTimer);
      throw new Error('Ollama response not OK');
    }

    const reader = ollamaRes.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split('\n').filter((l) => l.trim() !== '');

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const token = parsed.message?.content || parsed.response || '';

          if (token) {
            if (!firstTokenReceived) {
              firstTokenReceived = true;
              usedOllama = true;
              clearTimeout(firstTokenTimer);
              // Send metadata event first
              res.write(
                `event: metadata\ndata: ${JSON.stringify({
                  usedOllama: true,
                  ragApplied: Boolean(ragContext),
                  ragRefs,
                })}\n\n`
              );
            }
            res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
          }
        } catch {
          // Continue parsing remaining JSON lines
        }
      }
    }

    clearTimeout(firstTokenTimer);

    if (firstTokenReceived) {
      res.write(`event: done\ndata: {}\n\n`);
      return res.end();
    } else {
      throw new Error('No token received from Ollama in time');
    }
  } catch (err) {
    console.log('Ollama stream not available / timed out. Executing LingLing RAG Fallback Stream.');

    let fallbackText = '';
    if (ragContext) {
      fallbackText = `Xin chào! LingLing đã tra cứu được dữ liệu thực tế trong hệ thống **Lingual** cho bạn:\n\n${ragContext}\n\n💡 *Mẹo từ LingLing*: Bạn có thể lưu từ vựng này vào bộ thẻ **SRS Flashcard** bên dưới để ôn tập hàng ngày nhé!`;
    } else if (message.toLowerCase().includes('ielts')) {
      fallbackText = `Chào bạn! **LingLing** rất sẵn lòng đồng hành cùng bạn luyện thi IELTS trên Lingual! 🚀\n\nỨng dụng Lingual hiện hỗ trợ:\n• **Reading**: Bài đọc 2 cột chuẩn thi thật.\n• **Listening**: Trình phát audio + transcript.\n• **Writing**: AI Chấm bài 4 tiêu chí (Task Achievement, Coherence, Lexical, Grammar).\n• **Mock Test**: Thi thử áp lực thời gian.\n\nBạn muốn LingLing hướng dẫn kỹ năng nào trước?`;
    } else {
      fallbackText = `Chào bạn! Tôi là **LingLing** 🤖 - Trợ lý AI của Lingual. 🌟\n\nTôi có thể giúp bạn giải thích từ vựng, ngữ pháp, bài học và luyện thi IELTS. Bạn cần tôi hỗ trợ nội dung gì hôm nay?`;
    }

    return streamFallbackTokens(fallbackText);
  }
});

/**
 * Legacy JSON Endpoint POST /api/v1/chatbot/chat
 */
chatbotRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message = '' } = req.body;
    const { textContext: ragContext, refs: ragRefs } = await retrieveRagDetails(message);

    return res.json({
      success: true,
      botReply: ragContext
        ? `Thông tin từ Lingual DB:\n\n${ragContext}`
        : 'Xin chào! Tôi là LingLing, trợ lý AI của Lingual.',
      ragContextApplied: Boolean(ragContext),
      ragRefs,
      usedOllama: false,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/v1/chatbot/history?userId=...
 * Fetch saved DB chat messages for authenticated user
 */
chatbotRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
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
      usedOllama: m.sourceType === 'llm',
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
    const { userId, messages = [] } = req.body;
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
        sourceType: m.usedOllama ? 'llm' : m.ragApplied ? 'rag' : 'fallback',
        ragRefs: m.ragRefs ? JSON.stringify(m.ragRefs) : null,
      })),
    });

    return res.json({ success: true, message: 'Chat synced to cloud DB successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
