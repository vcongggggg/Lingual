import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { curriculumRouter } from './routes/curriculum.js';
import { srsRouter } from './routes/srs.js';
import { gamesRouter } from './routes/games.js';
import { userRouter } from './routes/user.js';
import { dictionaryRouter } from './routes/dictionary.js';
import { ieltsRouter } from './routes/ielts.js';
import { chatbotRouter } from './routes/chatbot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

app.use(express.json());

// API Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lingual API (v3 Production Ready)',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/curriculum', curriculumRouter);
app.use('/api/v1/srs', srsRouter);
app.use('/api/v1/games', gamesRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/dictionary', dictionaryRouter);
app.use('/api/v1/ielts', ieltsRouter);
app.use('/api/v1/chatbot', chatbotRouter);

app.listen(PORT, () => {
  console.log(`🚀 Lingual API v3 running on http://localhost:${PORT}`);
});

export default app;
