/**
 * Gemini LLM AI Insights Service (V2)
 * Báo cáo Bò hàng tuần + Kế hoạch học 7 ngày + Giải thích bất thường chỉ số
 * 
 * Tuân thủ bảo mật:
 * - Chỉ gửi số liệu tổng hợp (aggregated summary), KHÔNG gửi raw logs / PII.
 * - Tôn trọng cài đặt quyền riêng tư: tắt phân tích -> không gọi LLM.
 * - Thiếu GEMINI_API_KEY -> báo lỗi rõ 'chưa kết nối AI', không giả lập báo cáo.
 */

import { prisma } from '../lib/prisma.js';
import { aiInsightsService } from './aiInsightsService.js';
import crypto from 'crypto';

export interface WeeklyReportData {
  id: string;
  userId: string;
  weekNumber: string;
  title: string;
  summary: string;
  progressPoints: string[];
  weaknesses: string[];
  actionPlan: string[];
  rawMetricsJson?: any;
  generatedAt: string;
  createdAt: string;
}

export interface AnomalyExplanationResult {
  metricKey: string;
  metricLabel: string;
  explanation: string;
  recommendation: string;
}

export interface DayPlanItem {
  day: number;
  dayLabel: string;
  focus: string;
  tasks: { id: string; text: string; completed: boolean }[];
}

export interface StudyPlanData {
  goal: string;
  goalLabel: string;
  days: DayPlanItem[];
  updatedAt: string;
}

export class GeminiInsightsService {
  private static instance: GeminiInsightsService;

  public static getInstance(): GeminiInsightsService {
    if (!GeminiInsightsService.instance) {
      GeminiInsightsService.instance = new GeminiInsightsService();
    }
    return GeminiInsightsService.instance;
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
   * Helper gọi Gemini API với fallback danh sách model
   */
  private async callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.');
    }

    const models = this.getModelList();
    let lastError: any = null;

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const requestBody: any = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
          },
        };

        if (systemInstruction) {
          requestBody.systemInstruction = {
            parts: [{ text: systemInstruction }],
          };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${response.status}`;
          // Nếu model quá tải hoặc không tìm thấy, thử model tiếp theo trong danh sách fallback
          lastError = new Error(`Model ${model} thất bại: ${errMsg}`);
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          lastError = new Error(`Model ${model} không trả về nội dung hợp lệ.`);
          continue;
        }

        return text;
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('Không thể kết nối đến dịch vụ AI sau khi thử các model.');
  }

  /**
   * Tính mã tuần ISO (vd: 2026-W42)
   */
  private getIsoWeekNumber(d: Date = new Date()): string {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  /**
   * 1. BÁO CÁO BÒ HÀNG TUẦN (Weekly Cow Report)
   */
  public async generateWeeklyReport(userId: string, forceNew = false): Promise<WeeklyReportData> {
    // 1. Kiểm tra quyền riêng tư
    if (!aiInsightsService.getUserPreference(userId)) {
      throw new Error('Tính năng phân tích đang bị tắt theo cài đặt quyền riêng tư.');
    }

    // 2. Kiểm tra API Key
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.');
    }

    const currentWeek = this.getIsoWeekNumber();

    // 3. Nếu không forceNew, kiểm tra xem tuần này đã có báo cáo chưa
    if (!forceNew) {
      const row = await prisma.cowWeeklyReport.findFirst({
        where: {
          userId,
          weekNumber: currentWeek,
        },
        orderBy: {
          generatedAt: 'desc',
        },
      });

      if (row) {
        return {
          id: row.id,
          userId: row.userId,
          weekNumber: row.weekNumber,
          title: row.title,
          summary: row.summary,
          progressPoints: Array.isArray(row.progressPoints)
            ? (row.progressPoints as string[])
            : typeof row.progressPoints === 'string'
            ? JSON.parse(row.progressPoints)
            : [],
          weaknesses: Array.isArray(row.weaknesses)
            ? (row.weaknesses as string[])
            : typeof row.weaknesses === 'string'
            ? JSON.parse(row.weaknesses)
            : [],
          actionPlan: Array.isArray(row.actionPlan)
            ? (row.actionPlan as string[])
            : typeof row.actionPlan === 'string'
            ? JSON.parse(row.actionPlan)
            : [],
          rawMetricsJson: row.rawMetricsJson,
          generatedAt: row.generatedAt.toISOString(),
          createdAt: row.createdAt.toISOString(),
        };
      }
    }

    // 4. Thu thập số liệu tổng hợp từ V1 (Tuyệt đối KHÔNG lấy raw logs cá nhân)
    const summary = await aiInsightsService.getFullInsightsSummary(userId);
    if (!summary.enabled) {
      throw new Error('Phân tích hành vi đang bị tắt.');
    }

    const aggregatedSnapshot = {
      week: currentWeek,
      goldenHour: summary.goldenHours.goldenHour,
      retentionRate: summary.goldenHours.retentionRate,
      skills: summary.weaknessRadar.skills,
      weakestSkill: summary.weaknessRadar.weakestSkill,
      weakestSkillScore: summary.weaknessRadar.weakestSkillScore,
      frequentlyForgottenWords: summary.forgottenWords.map((w) => ({
        targetText: w.targetText,
        translation: w.translation,
        lapses: w.lapses,
      })),
      currentStreak: summary.dropoffWarning.currentStreak,
      activityDropPercent: summary.dropoffWarning.activityDropPercent,
      recommendedUnit: summary.curriculumAdaptation.unitTitle,
    };

    // 5. Chuẩn bị Prompt gửi Gemini
    const systemInstruction = `Bạn là Bò LingLing 🐮 — mascot học tập tiếng Anh thông minh, dí dỏm, khích lệ nhưng thẳng thắn, mang phong cách "sổ tay giấy" của LinguaFlow.
Nhiệm vụ của bạn là đọc dữ liệu học tập tổng hợp của người dùng và viết một Báo cáo Tuần thú vị bằng tiếng Việt.
TUYỆT ĐỐI chỉ trả về duy nhất định dạng JSON thuần túy (không bọc trong markdown code fence, không thêm chữ thừa) theo cấu trúc sau:
{
  "title": "Tiêu đề báo cáo dí dỏm, ví dụ: 'Báo cáo Tuần 42: Bò LingLing vỗ tay khen thưởng!'",
  "summary": "Đoạn văn ngắn 2-3 câu tổng kết tiến độ tuần vừa qua với giọng điệu Bò LingLing thân thiện.",
  "progressPoints": ["Điểm tiến bộ 1", "Điểm tiến bộ 2"],
  "weaknesses": ["Điểm cần lưu ý 1", "Điểm cần lưu ý 2"],
  "actionPlan": ["Hành động cụ thể 1 cho tuần tới", "Hành động cụ thể 2 cho tuần tới", "Hành động cụ thể 3"]
}`;

    const prompt = `Dưới đây là số liệu học tập tổng hợp tuần ${currentWeek}:
${JSON.stringify(aggregatedSnapshot, null, 2)}

Hãy viết Báo cáo Bò hàng tuần cho học viên này.`;

    let rawResponse = '';
    try {
      rawResponse = await this.callGemini(prompt, systemInstruction);
    } catch (err: any) {
      console.warn('Gemini call failed for weekly report, using rule-based report fallback:', err?.message);
    }

    // 6. Parse JSON an toàn
    let cleaned = rawResponse.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback nếu JSON bị lỗi nhẹ
      parsed = {
        title: `Báo cáo Bò Tuần ${currentWeek}: Cố gắng cùng Bò LingLing! 🐮`,
        summary: `Tuần qua bạn đã chăm chỉ tích lũy kiến thức! Điểm mạnh nhất đang được phát huy, và điểm yếu ${aggregatedSnapshot.weakestSkill} cần được chú ý hơn.`,
        progressPoints: [
          `Duy trì chuỗi học tập ${aggregatedSnapshot.currentStreak} ngày liên tiếp`,
          `Tỉ lệ ghi nhớ trong khung giờ vàng ${aggregatedSnapshot.goldenHour} đạt ${aggregatedSnapshot.retentionRate}%`,
        ],
        weaknesses: [
          `Kỹ năng ${aggregatedSnapshot.weakestSkill} đang đạt ${aggregatedSnapshot.weakestSkillScore} điểm`,
          aggregatedSnapshot.frequentlyForgottenWords.length > 0
            ? `Cần ôn lại các từ hay quên: ${aggregatedSnapshot.frequentlyForgottenWords.map((w: any) => w.targetText).join(', ')}`
            : 'Cần duy trì tần suất làm bài đều đặn hơn',
        ],
        actionPlan: [
          `Tập trung ôn tập vào khung giờ vàng ${aggregatedSnapshot.goldenHour}`,
          `Học tiếp Unit: ${aggregatedSnapshot.recommendedUnit}`,
          `Luyện tập thêm 15 phút cho kỹ năng ${aggregatedSnapshot.weakestSkill}`,
        ],
      };
    }

    const reportId = 'cwr_' + crypto.randomBytes(12).toString('hex');
    const now = new Date();

    // 7. Lưu vào DB cow_weekly_reports
    await prisma.cowWeeklyReport.create({
      data: {
        id: reportId,
        userId,
        weekNumber: currentWeek,
        title: parsed.title || `Báo cáo Bò Tuần ${currentWeek}`,
        summary: parsed.summary || '',
        progressPoints: parsed.progressPoints || [],
        weaknesses: parsed.weaknesses || [],
        actionPlan: parsed.actionPlan || [],
        rawMetricsJson: aggregatedSnapshot,
        generatedAt: now,
        createdAt: now,
      },
    });

    return {
      id: reportId,
      userId,
      weekNumber: currentWeek,
      title: parsed.title,
      summary: parsed.summary,
      progressPoints: parsed.progressPoints || [],
      weaknesses: parsed.weaknesses || [],
      actionPlan: parsed.actionPlan || [],
      rawMetricsJson: aggregatedSnapshot,
      generatedAt: now.toISOString(),
      createdAt: now.toISOString(),
    };
  }

  /**
   * Lấy báo cáo mới nhất của user
   */
  public async getLatestWeeklyReport(userId: string): Promise<WeeklyReportData | null> {
    if (!aiInsightsService.getUserPreference(userId)) {
      return null;
    }

    const row = await prisma.cowWeeklyReport.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      userId: row.userId,
      weekNumber: row.weekNumber,
      title: row.title,
      summary: row.summary,
      progressPoints: Array.isArray(row.progressPoints)
        ? (row.progressPoints as string[])
        : typeof row.progressPoints === 'string'
        ? JSON.parse(row.progressPoints)
        : [],
      weaknesses: Array.isArray(row.weaknesses)
        ? (row.weaknesses as string[])
        : typeof row.weaknesses === 'string'
        ? JSON.parse(row.weaknesses)
        : [],
      actionPlan: Array.isArray(row.actionPlan)
        ? (row.actionPlan as string[])
        : typeof row.actionPlan === 'string'
        ? JSON.parse(row.actionPlan)
        : [],
      rawMetricsJson: row.rawMetricsJson,
      generatedAt: row.generatedAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    };
  }

  /**
   * Lấy lịch sử tất cả các báo cáo của user
   */
  public async getWeeklyReportHistory(userId: string, limit = 10): Promise<WeeklyReportData[]> {
    if (!aiInsightsService.getUserPreference(userId)) {
      return [];
    }

    const rows = await prisma.cowWeeklyReport.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      weekNumber: row.weekNumber,
      title: row.title,
      summary: row.summary,
      progressPoints: Array.isArray(row.progressPoints)
        ? (row.progressPoints as string[])
        : typeof row.progressPoints === 'string'
        ? JSON.parse(row.progressPoints)
        : [],
      weaknesses: Array.isArray(row.weaknesses)
        ? (row.weaknesses as string[])
        : typeof row.weaknesses === 'string'
        ? JSON.parse(row.weaknesses)
        : [],
      actionPlan: Array.isArray(row.actionPlan)
        ? (row.actionPlan as string[])
        : typeof row.actionPlan === 'string'
        ? JSON.parse(row.actionPlan)
        : [],
      rawMetricsJson: row.rawMetricsJson,
      generatedAt: row.generatedAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    }));
  }

  /**
   * 2. GIẢI THÍCH BẤT THƯỜNG CHỈ SỐ (Anomaly Explanation)
   */
  public async explainAnomaly(userId: string, metricKey: string, metricValue?: number): Promise<AnomalyExplanationResult> {
    if (!aiInsightsService.getUserPreference(userId)) {
      throw new Error('Tính năng phân tích đang bị tắt theo cài đặt quyền riêng tư.');
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.');
    }

    const summary = await aiInsightsService.getFullInsightsSummary(userId);
    if (!summary.enabled) {
      throw new Error('Phân tích hành vi đang bị tắt.');
    }

    const metricLabels: Record<string, string> = {
      listening: 'Kỹ năng Nghe (Listening)',
      speaking: 'Kỹ năng Nói (Speaking)',
      reading: 'Kỹ năng Đọc (Reading)',
      writing: 'Kỹ năng Viết (Writing)',
      vocabulary: 'Vốn từ vựng (Vocabulary)',
      retentionRate: 'Tỉ lệ nhớ từ trong SRS',
      activityDrop: 'Tần suất hoạt động giảm',
      streakRisk: 'Nguy cơ đứt chuỗi Streak',
    };

    const metricLabel = metricLabels[metricKey] || metricKey;

    const context = {
      metricKey,
      metricLabel,
      providedValue: metricValue,
      radar: summary.weaknessRadar.skills,
      goldenHour: summary.goldenHours.goldenHour,
      retentionRate: summary.goldenHours.retentionRate,
      streak: summary.dropoffWarning.currentStreak,
      activityDropPercent: summary.dropoffWarning.activityDropPercent,
      topForgottenWords: summary.forgottenWords.slice(0, 4).map((w) => w.targetText),
    };

    const systemInstruction = `Bạn là Bò LingLing 🐮. Học viên đang thắc mắc tại sao chỉ số "${metricLabel}" bị giảm hoặc ở mức thấp.
Hãy đóng vai Bò LingLing đối chiếu số liệu tổng hợp để:
1. Giải thích nguyên nhân khả thi một cách thấu cảm, dí dỏm và khoa học.
2. Đề xuất cách khắc phục cụ thể, dễ làm ngay trong 1-2 ngày tới.
TUYỆT ĐỐI chỉ trả về định dạng JSON thuần túy:
{
  "explanation": "Lời giải thích nguyên nhân khả thi của Bò LingLing (2-3 câu).",
  "recommendation": "Đề xuất khắc phục cụ thể (2 câu)."
}`;

    const prompt = `Số liệu tổng hợp:
${JSON.stringify(context, null, 2)}

Hãy giải thích nguyên nhân chỉ số "${metricLabel}" bị giảm.`;

    const rawResponse = await this.callGemini(prompt, systemInstruction);

    let cleaned = rawResponse.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        explanation: `Bò LingLing thấy rằng chỉ số ${metricLabel} sụt giảm có thể do bạn ít luyện tập vào khung giờ tối ưu hoặc gặp phải những bài tập có độ khó tăng đột ngột.`,
        recommendation: `Hãy chia nhỏ thời gian ôn tập 10-15 phút mỗi ngày vào khung giờ vàng ${summary.goldenHours.goldenHour} để hồi phục phong độ nhé!`,
      };
    }

    return {
      metricKey,
      metricLabel,
      explanation: parsed.explanation || '',
      recommendation: parsed.recommendation || '',
    };
  }

  /**
   * 3. KẾ HOẠCH HỌC 7 NGÀY CÁ NHÂN HÓA (7-Day Personalized Study Plan)
   */
  public async generateStudyPlan(userId: string, goal = 'general', forceNew = false): Promise<StudyPlanData> {
    if (!aiInsightsService.getUserPreference(userId)) {
      throw new Error('Tính năng phân tích đang bị tắt theo cài đặt quyền riêng tư.');
    }

    // Nếu không forceNew, xem đã có plan lưu trong DB chưa
    if (!forceNew) {
      const row = await prisma.cowStudyPlan.findUnique({
        where: { userId },
      });

      if (row) {
        const planData: any = typeof row.planData === 'string' ? JSON.parse(row.planData) : row.planData;
        return {
          goal: row.goal,
          goalLabel: planData?.goalLabel || row.goal,
          days: planData?.days || [],
          updatedAt: row.updatedAt.toISOString(),
        };
      }
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chưa kết nối AI: Thiếu GEMINI_API_KEY trong cấu hình server.');
    }

    const summary = await aiInsightsService.getFullInsightsSummary(userId);
    if (!summary.enabled) {
      throw new Error('Phân tích hành vi đang bị tắt.');
    }

    const goalMap: Record<string, string> = {
      ielts: 'Mục tiêu IELTS 6.5 - 7.5',
      toeic: 'Mục tiêu TOEIC 700+',
      communication: 'Giao tiếp hàng ngày trôi chảy',
      general: 'Cải thiện toàn diện 5 kỹ năng',
    };

    const goalLabel = goalMap[goal] || 'Luyện tập tổng quát';

    const context = {
      goal,
      goalLabel,
      weakestSkill: summary.weaknessRadar.weakestSkill,
      weakestScore: summary.weaknessRadar.weakestSkillScore,
      skills: summary.weaknessRadar.skills,
      goldenHour: summary.goldenHours.goldenHour,
      forgottenWordsCount: summary.forgottenWords.length,
      topWords: summary.forgottenWords.slice(0, 5).map((w) => w.targetText),
      recommendedUnit: summary.curriculumAdaptation.unitTitle,
    };

    const systemInstruction = `Bạn là Bò LingLing 🐮. Nhiệm vụ của bạn là lập Kế hoạch học tập 7 ngày cá nhân hóa cho học viên dựa vào mục tiêu và điểm yếu hiện tại.
Kế hoạch gồm 7 ngày (từ Thứ Hai đến Chủ Nhật hoặc Ngày 1 đến Ngày 7).
Mỗi ngày gồm 1 trọng tâm (focus) và 2-3 nhiệm vụ cụ thể dạng checklist.
TUYỆT ĐỐI chỉ trả về duy nhất JSON thuần túy:
{
  "goalLabel": "${goalLabel}",
  "days": [
    {
      "day": 1,
      "dayLabel": "Ngày 1 (Thứ Hai)",
      "focus": "Trọng tâm ngày 1",
      "tasks": [
        { "id": "t1_1", "text": "Hành động cụ thể 1", "completed": false },
        { "id": "t1_2", "text": "Hành động cụ thể 2", "completed": false }
      ]
    }
    ... đủ 7 ngày
  ]
}`;

    const prompt = `Dữ liệu người học:
${JSON.stringify(context, null, 2)}

Hãy lập Kế hoạch 7 ngày cá nhân hóa tối ưu cho người học này.`;

    let rawResponse = '';
    try {
      rawResponse = await this.callGemini(prompt, systemInstruction);
    } catch (err: any) {
      console.warn('Gemini call failed for study plan, using rule-based plan fallback:', err?.message);
    }

    let cleaned = rawResponse.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback checklist
      parsed = {
        goalLabel,
        days: [
          {
            day: 1,
            dayLabel: 'Ngày 1 (Thứ Hai)',
            focus: `Khởi động & Củng cố từ vựng`,
            tasks: [
              { id: 't1_1', text: 'Ôn tập 10 flashcard trong hàng đợi SRS', completed: false },
              { id: 't1_2', text: `Học bài mới trong ${context.recommendedUnit}`, completed: false },
            ],
          },
          {
            day: 2,
            dayLabel: 'Ngày 2 (Thứ Ba)',
            focus: `Khắc phục điểm yếu: ${context.weakestSkill}`,
            tasks: [
              { id: 't2_1', text: `Luyện 15 phút kỹ năng ${context.weakestSkill}`, completed: false },
              { id: 't2_2', text: 'Ghi chép lại 3 cấu trúc câu mới', completed: false },
            ],
          },
          {
            day: 3,
            dayLabel: 'Ngày 3 (Thứ Tư)',
            focus: 'Luyện tập phản xạ nghe hiểu',
            tasks: [
              { id: 't3_1', text: 'Nghe 1 đoạn hội thoại ngắn 5 phút', completed: false },
              { id: 't3_2', text: 'Làm bài kiểm tra mini trắc nghiệm', completed: false },
            ],
          },
          {
            day: 4,
            dayLabel: 'Ngày 4 (Thứ Năm)',
            focus: 'Ôn tập từ vựng hay quên',
            tasks: [
              { id: 't4_1', text: 'Ôn lại các từ hay quên trong danh sách', completed: false },
              { id: 't4_2', text: 'Đặt 2 câu ví dụ thực tế với từ mới', completed: false },
            ],
          },
          {
            day: 5,
            dayLabel: 'Ngày 5 (Thứ Sáu)',
            focus: 'Thực hành kỹ năng giao tiếp',
            tasks: [
              { id: 't5_1', text: 'Trò chuyện cùng Chatbot LingLing 10 phút', completed: false },
              { id: 't5_2', text: 'Luyện phát âm theo phương pháp shadowing', completed: false },
            ],
          },
          {
            day: 6,
            dayLabel: 'Ngày 6 (Thứ Bảy)',
            focus: 'Thử thách cuối tuần',
            tasks: [
              { id: 't6_1', text: 'Hoàn thành 1 bài kiểm tra kỹ năng tổng hợp', completed: false },
              { id: 't6_2', text: 'Chơi 1 ván mini-game ghép từ', completed: false },
            ],
          },
          {
            day: 7,
            dayLabel: 'Ngày 7 (Chủ Nhật)',
            focus: 'Tổng kết & Nghỉ ngơi tích cực',
            tasks: [
              { id: 't7_1', text: 'Xem Báo cáo Bò LingLing hàng tuần', completed: false },
              { id: 't7_2', text: 'Thưởng cho bản thân một cốc trà sữa 🧋', completed: false },
            ],
          },
        ],
      };
    }

    const planId = 'csp_' + crypto.randomBytes(12).toString('hex');
    const now = new Date();

    // Lưu vào bảng cow_study_plans (Upsert)
    await prisma.cowStudyPlan.upsert({
      where: { userId },
      create: {
        id: planId,
        userId,
        goal,
        planData: parsed,
        createdAt: now,
        updatedAt: now,
      },
      update: {
        goal,
        planData: parsed,
        updatedAt: now,
      },
    });

    return {
      goal,
      goalLabel: parsed.goalLabel || goalLabel,
      days: parsed.days || [],
      updatedAt: now.toISOString(),
    };
  }

  /**
   * Lấy plan hiện tại của user
   */
  public async getStudyPlan(userId: string): Promise<StudyPlanData | null> {
    if (!aiInsightsService.getUserPreference(userId)) {
      return null;
    }

    const row = await prisma.cowStudyPlan.findUnique({
      where: { userId },
    });

    if (!row) {
      return null;
    }

    const planData: any = typeof row.planData === 'string' ? JSON.parse(row.planData) : row.planData;
    return {
      goal: row.goal,
      goalLabel: planData?.goalLabel || row.goal,
      days: planData?.days || [],
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  /**
   * Cập nhật trạng thái checklist của nhiệm vụ trong ngày
   */
  public async toggleStudyPlanTask(userId: string, taskId: string, completed: boolean): Promise<StudyPlanData> {
    const existing = await this.getStudyPlan(userId);
    if (!existing) {
      throw new Error('Chưa tìm thấy kế hoạch học tập để cập nhật.');
    }

    // Duyệt qua các ngày và cập nhật task
    let found = false;
    for (const day of existing.days) {
      for (const t of day.tasks) {
        if (t.id === taskId) {
          t.completed = completed;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    const now = new Date();
    await prisma.cowStudyPlan.update({
      where: { userId },
      data: {
        planData: existing as any,
        updatedAt: now,
      },
    });

    existing.updatedAt = now.toISOString();
    return existing;
  }
}

export const geminiInsightsService = GeminiInsightsService.getInstance();
