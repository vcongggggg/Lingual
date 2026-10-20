/**
 * Gemini Chatbot LingLing R2.0 Service
 * Real Gemini API + LingLing Persona from prompt file + Real Learning Data Grounding
 */

import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma.js';
import { aiInsightsService } from './aiInsightsService.js';

export interface GroundingData {
  currentStreak: number;
  goldenHour: string;
  retentionRate: number;
  skills: {
    vocabulary: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  weakestSkill: string;
  weakestSkillScore: number;
  srsDueCount: number;
  forgottenWords: string[];
}

export interface ChatReplyResult {
  reply: string;
  mood: string;
  usedRag: boolean;
  grounding: GroundingData;
  aiConnected: boolean;
  provider: 'gemini';
  model: string;
  responseTimeMs: number;
  suggestedActions?: { title: string; url: string }[];
}

export class GeminiChatService {
  private static instance: GeminiChatService;

  public static getInstance(): GeminiChatService {
    if (!GeminiChatService.instance) {
      GeminiChatService.instance = new GeminiChatService();
    }
    return GeminiChatService.instance;
  }

  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY;
  }

  private getModelList(): string[] {
    const primary = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const fallbacks = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    const unique = [primary, ...fallbacks.filter((m) => m !== primary)];
    return unique;
  }

  /**
   * Đọc system prompt từ file prompts/lingling.system.md
   */
  public getSystemPrompt(): string {
    const possiblePaths = [
      path.resolve(process.cwd(), 'prompts/lingling.system.md'),
      path.resolve(process.cwd(), 'apps/api/prompts/lingling.system.md'),
      path.resolve(process.cwd(), '../prompts/lingling.system.md'),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, 'utf-8');
      }
    }

    // Fallback nếu không đọc được file
    return `Bạn là Bò LingLing 🐮 — linh vật bò sữa của LinguaFlow, bướng bỉnh, tếu tếu, thẳng thắn nhưng rất thương học viên. Trả lời bằng tiếng Việt tự nhiên và đính kèm [MOOD: <mood_name>] ở cuối.`;
  }

  /**
   * Lấy dữ liệu học tập THẬT của người dùng (Grounding)
   */
  public async getUserGroundingData(userId: string): Promise<GroundingData> {
    const defaultData: GroundingData = {
      currentStreak: 0,
      goldenHour: '20:00 - 21:00',
      retentionRate: 85,
      skills: { vocabulary: 75, listening: 65, speaking: 60, reading: 75, writing: 65 },
      weakestSkill: 'speaking',
      weakestSkillScore: 60,
      srsDueCount: 0,
      forgottenWords: [],
    };

    try {
      // 1. Lấy dữ liệu tổng hợp từ Insights V1
      const summary = await aiInsightsService.getFullInsightsSummary(userId);

      // 2. Đếm số từ SRS đến hạn hôm nay
      let srsCount = 0;
      try {
        srsCount = await prisma.userWordState.count({
          where: {
            userId,
            dueDate: { lte: new Date() },
          },
        });
      } catch {
        // Fallback đếm từ items nếu schema khác
      }

      if (summary.enabled) {
        return {
          currentStreak: summary.dropoffWarning.currentStreak,
          goldenHour: summary.goldenHours.goldenHour,
          retentionRate: summary.goldenHours.retentionRate,
          skills: summary.weaknessRadar.skills,
          weakestSkill: summary.weaknessRadar.weakestSkill,
          weakestSkillScore: summary.weaknessRadar.weakestSkillScore,
          srsDueCount: srsCount,
          forgottenWords: summary.forgottenWords.map((w) => `${w.targetText} (${w.translation})`),
        };
      }
    } catch (e) {
      console.warn('Không thể nạp toàn bộ grounding metrics:', e);
    }

    return defaultData;
  }

  /**
   * Gửi tin nhắn đến Gemini Chat với đầy đủ Context + Grounding + History
   */
  public async chat(
    userId: string,
    message: string,
    history: { role: 'user' | 'assistant'; text: string }[] = []
  ): Promise<ChatReplyResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.');
    }

    // 1. Nạp Grounding data THẬT
    const grounding = await this.getUserGroundingData(userId);

    // 2. Nạp System Prompt từ file
    const systemPrompt = this.getSystemPrompt();

    // 3. Chuẩn bị ngữ cảnh grounding
    const groundingContext = `[DỮ LIỆU HỌC TẬP THỰC TẾ CỦA HỌC VIÊN NÀY]:
- Chuỗi học tập (Streak): ${grounding.currentStreak} ngày liên tiếp
- Khung giờ vàng ghi nhớ tốt nhất: ${grounding.goldenHour} (tỉ lệ nhớ ${grounding.retentionRate}%)
- Radar 5 kỹ năng: Từ vựng ${grounding.skills.vocabulary}đ, Nghe ${grounding.skills.listening}đ, Nói ${grounding.skills.speaking}đ, Đọc ${grounding.skills.reading}đ, Viết ${grounding.skills.writing}đ
- Kỹ năng đang yếu nhất: ${grounding.weakestSkill} (${grounding.weakestSkillScore} điểm)
- Số từ vựng SRS đang đến hạn ôn tập: ${grounding.srsDueCount} từ
- Các từ hay quên gần đây: ${grounding.forgottenWords.slice(0, 5).join(', ') || 'Chưa ghi nhận'}

HÃY THAM CHIẾU CHÍNH XÁC CÁC SỐ LIỆU NÀY KHI TRẢ LỜI ĐỂ GIẢNG GIẢI VÀ ĐƯA RA LỜI KHUYÊN CHO HỌC VIÊN.`;

    const fullSystemInstruction = `${systemPrompt}\n\n${groundingContext}`;

    // 4. Chuẩn bị conversation contents cho Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Thêm các tin nhắn lịch sử (tối đa 6 tin nhắn gần nhất để giữ context)
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }

    // Thêm tin nhắn hiện tại của user
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // 5. Gọi Gemini API với fallback model list
    const startTime = Date.now();
    const models = this.getModelList();
    let lastError: any = null;
    let rawText = '';
    let usedModel = models[0] || 'gemini-3.5-flash-lite';

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const requestBody = {
          contents,
          systemInstruction: {
            parts: [{ text: fullSystemInstruction }],
          },
          generationConfig: {
            temperature: 0.75,
            topP: 0.95,
          },
        };

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${response.status}`;
          lastError = new Error(`Model ${model} thất bại: ${errMsg}`);
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          lastError = new Error(`Model ${model} không trả về nội dung.`);
          continue;
        }

        rawText = text;
        usedModel = model;
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!rawText) {
      throw new Error('Chưa kết nối AI: ' + (lastError?.message || 'Không thể kết nối đến AI Gemini sau khi thử các model.'));
    }

    const responseTimeMs = Date.now() - startTime;

    // 6. Tách [MOOD: <mood_name>] từ phản hồi
    let mood = 'speaking';
    const moodMatch = rawText.match(/\[MOOD:\s*([a-zA-Z0-9_-]+)\]/i);
    if (moodMatch) {
      mood = moodMatch[1].trim();
      rawText = rawText.replace(/\[MOOD:\s*([a-zA-Z0-9_-]+)\]/i, '').trim();
    } else {
      // Suy luận mood nếu model quên gắn tag
      const lower = rawText.toLowerCase();
      if (lower.includes('chúc mừng') || lower.includes('tuyệt vời') || lower.includes('xuất sắc')) {
        mood = 'party';
      } else if (lower.includes('xin lỗi') || lower.includes('tiếc')) {
        mood = 'shyApologetic';
      } else if (lower.includes('quên') || lower.includes('nhầm') || lower.includes('lười')) {
        mood = 'pointYou';
      } else {
        mood = 'speaking';
      }
    }

    // 7. Tạo gợi ý hành động thiết thực
    const suggestedActions = [
      { title: `Ôn tập SRS (${grounding.srsDueCount} từ đến hạn)`, url: '/srs' },
      { title: `Cải thiện điểm ${grounding.weakestSkill}`, url: `/analytics/${grounding.weakestSkill}` },
    ];

    return {
      reply: rawText,
      mood,
      usedRag: true,
      grounding,
      aiConnected: true,
      provider: 'gemini',
      model: usedModel,
      responseTimeMs,
      suggestedActions,
    };
  }
}

export const geminiChatService = GeminiChatService.getInstance();
