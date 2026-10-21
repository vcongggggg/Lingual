import 'dotenv/config';
import fs from 'fs';
import path from 'path';
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
import { stampRouter } from './routes/stamp.js';
import { contentRouter } from './routes/content.js';
import { insightsRouter } from './routes/insights.js';
import { notificationsRouter } from './routes/notifications.js';
import { pushRouter } from './routes/push.js';
import { notificationTriggerEngine } from './services/notificationTriggerEngine.js';
import { checkDatabaseConnection, isDatabaseConnected, isDatabaseAvailable } from './lib/prisma.js';

// Load .env robustly from multiple possible execution directories
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

validateEnvironment();

// Initialize Persistent Database Connection on startup
checkDatabaseConnection().then((connected) => {
  if (connected) {
    console.log('✅ PostgreSQL Database connected successfully (Persistent Mode)');
  } else {
    console.warn('⚠️ PostgreSQL not reachable, running in resilient Mock/In-Memory Mode');
  }
});

const app = express();
const PORT = process.env.PORT || 4000;

// OWASP A05: Helmet Security Headers & Disable X-Powered-By
app.use(helmet({ contentSecurityPolicy: false }));
app.disable('x-powered-by');

// Cookie Parser for HTTP-Only JWT tokens
app.use(cookieParser());

// OWASP A01: Strict Dynamic CORS Whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.trycloudflare.com') || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    credentials: true,
  })
);

// OWASP A04: Request Payload Size Limiting (Prevent Payload Flooding DoS)
app.use(express.json({ limit: '10kb' }));

// OWASP A04: Global API Rate Limiter
app.use('/api/', globalApiLimiter);

// API Health Check
let apiVersion = '1.0.0';
try {
  const pkgPath = typeof __dirname !== 'undefined'
    ? path.resolve(__dirname, '../package.json')
    : path.resolve(process.cwd(), 'apps/api/package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.version) apiVersion = pkg.version;
  }
} catch {}

const healthHandler = async (req: express.Request, res: express.Response) => {
  const isDbLive = await isDatabaseAvailable();
  res.json({
    status: 'ok',
    version: apiVersion,
    database: isDbLive ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    service: 'Lingual Backend API',
    timestamp: new Date().toISOString(),
  });
};
app.get('/api/v1/health', healthHandler);
app.get('/health', healthHandler);

app.use('/api/v1/auth', authRouter);
app.use('/api/auth', authRouter);
app.use('/auth', authRouter);
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
app.use('/api/v1/stamps', stampRouter);
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/stories', (req, res, next) => {
  req.url = '/stories' + req.url;
  contentRouter(req, res, next);
});
app.use('/api/v1/dialogues', (req, res, next) => {
  req.url = '/dialogues' + req.url;
  contentRouter(req, res, next);
});
app.use('/api/v1/sentences', (req, res, next) => {
  req.url = '/sentences' + req.url;
  contentRouter(req, res, next);
});
app.use('/api/v1/sentence-bank', (req, res, next) => {
  req.url = '/sentence-bank' + req.url;
  contentRouter(req, res, next);
});
app.use('/api/v1/word-sentence-links', (req, res, next) => {
  req.url = '/word-sentence-links' + req.url;
  contentRouter(req, res, next);
});
app.use('/api/v1/articles', (req, res, next) => {
  req.url = '/articles' + req.url;
  contentRouter(req, res, next);
});
app.use('/api/v1/insights', insightsRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/push', pushRouter);

// OWASP A05: Catch-all 404 handler for API routes (NEVER return HTML for API requests)
app.use('/api', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    status: 404,
  });
});


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
  try {
    notificationTriggerEngine.initNotificationCronJobs();
  } catch (err) {
    console.error('Không thể khởi chạy Notification Trigger Engine:', err);
  }
});

export default app;
