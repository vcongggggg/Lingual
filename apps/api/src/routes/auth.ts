import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { RegisterSchema, LoginSchema } from '../../../../packages/contracts/src/index.js';
import { getFormattedDateInTimezone } from '../../../../packages/domain/src/index.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'linguaflow_super_secret_jwt_key_2026';

export const MOCK_USERS: any[] = [];
export const MOCK_ATTEMPTS: any[] = [];
export const MOCK_WORD_STATES: any[] = [];
export const MOCK_LESSON_PROGRESS: any[] = [];
export const MOCK_GAME_SESSIONS: any[] = [];

(async () => {
  const hashedPassword = await argon2.hash('123456');
  const seedUser = {
    id: 'demo-user-id-001',
    email: 'demo@linguaflow.com',
    passwordHash: hashedPassword,
    displayName: 'Học Viên LinguaFlow',
    role: 'LEARNER',
    interfaceLocale: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dailyGoalMinutes: 15,
    totalXP: 150,
    currentStreak: 3,
    streakFreezes: 1,
    lastActiveDate: getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh'),
  };
  MOCK_USERS.push(seedUser);
})();

authRouter.post('/register', async (req, res) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password, displayName, interfaceLocale, timezone } = parseResult.data;

    const existing = MOCK_USERS.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được sử dụng.' });
    }

    const passwordHash = await argon2.hash(password);
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      passwordHash,
      displayName,
      role: 'LEARNER',
      interfaceLocale,
      timezone,
      dailyGoalMinutes: 15,
      totalXP: 0,
      currentStreak: 1,
      streakFreezes: 1,
      lastActiveDate: getFormattedDateInTimezone(new Date(), timezone),
    };

    MOCK_USERS.push(newUser);

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi server khi đăng ký' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password } = parseResult.data;
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
});

authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = MOCK_USERS.find((u) => u.id === payload.userId);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
});
