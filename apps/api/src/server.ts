import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { validateEnvironment } from './middleware/envValidator.js';
import { globalApiLimiter } from './middleware/rateLimiter.js';
import { authRouter } from './routes/auth.js';
import { curriculumRouter } from './routes/curriculum.js';
import { srsRouter } from './routes/srs.js';
import { gamesRouter } from './routes/games.js';
import { userRouter } from './routes/user.js';
import { dictionaryRouter } from './routes/dictionary.js';
import { ieltsRouter } from './routes/ielts.js';
import { chatbotRouter } from './routes/chatbot.js';
import { adminRouter } from './routes/admin.js';
import { vocabularyRouter } from './routes/vocabulary.js';
import { writingRouter } from './routes/writing.js';
import { readingRouter } from './routes/reading.js';
import { examsRouter } from './routes/exams.js';
import { communityRouter } from './routes/community.js';
import { analyticsRouter } from './routes/analytics.js';
import { speakingRouter } from './routes/speaking.js';
import { tutorRouter } from './routes/tutor.js';

dotenv.config();
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 4000;

// OWASP A05: Helmet Security Headers & Disable X-Powered-By
app.use(helmet({ contentSecurityPolicy: false }));
app.disable('x-powered-by');

// Cookie Parser for HTTP-Only JWT tokens
app.use(cookieParser());

// OWASP A01: Strict CORS Whitelist
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

// OWASP A04: Request Payload Size Limiting (Prevent Payload Flooding DoS)
app.use(express.json({ limit: '10kb' }));

// OWASP A04: Global API Rate Limiter
app.use('/api/', globalApiLimiter);

// API Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lingual Security Hardened API (OWASP Top 10 Compliant)',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/curriculum', curriculumRouter);
app.use('/api/v1/srs', srsRouter);
app.use('/api/v1/games', gamesRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/dictionary', dictionaryRouter);
app.use('/api/v1/vocabulary', vocabularyRouter);
app.use('/api/v1/writing', writingRouter);
app.use('/api/v1/reading', readingRouter);
app.use('/api/v1/exams', examsRouter);
app.use('/api/v1/community', communityRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/speaking', speakingRouter);
app.use('/api/v1/tutor', tutorRouter);
app.use('/api/v1/ielts', ieltsRouter);
app.use('/api/v1/chatbot', chatbotRouter);
app.use('/api/v1/admin', adminRouter);

// OWASP A05: Generic Production Error Handler (Never leak stack traces)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Đã xảy ra lỗi hệ thống.' : err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Lingual Security Hardened API running on http://localhost:${PORT}`);
});

export default app;
