import rateLimit from 'express-rate-limit';

/**
 * OWASP A01 & A04: Rate Limiting Middlewares for Anti-Brute Force & DoS Prevention
 */

// 1. Auth Rate Limiter: Tối đa 5 lượt gọi /login hoặc /register mỗi 15 phút per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: process.env.NODE_ENV === 'test' ? 1000 : 5, // Tối đa 5 requests (1000 khi chạy test)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Tài khoản hoặc IP của bạn đã thử quá 5 lần. Vui lòng thử lại sau 15 phút (OWASP Rate Limit Anti-Brute Force).',
  },
  statusCode: 429,
});

// 2. Global API Rate Limiter: Tối đa 100 requests mỗi 1 phút per IP
export const globalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Hệ thống phát hiện quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau ít phút (429 Too Many Requests).',
  },
  statusCode: 429,
});

// 3. AI Chatbot Rate Limiter: Tối đa 10 requests / 1 phút per User/IP
export const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Bạn đã đạt giới hạn 10 câu hỏi AI Chatbot trong 1 phút. Vui lòng đợi trong giây lát.',
  },
  statusCode: 429,
});
