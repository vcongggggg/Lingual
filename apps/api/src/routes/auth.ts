import 'dotenv/config';
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

import { authLimiter } from '../middleware/rateLimiter.js';

export const FAILED_LOGIN_ATTEMPTS: Record<string, { count: number; lockedUntil?: number }> = {};

authRouter.post('/register', authLimiter, async (req, res) => {
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
      role: 'STUDENT',
      interfaceLocale,
      timezone,
      dailyGoalMinutes: 15,
      totalXP: 0,
      currentStreak: 1,
      streakFreezes: 1,
      lastActiveDate: getFormattedDateInTimezone(new Date(), timezone),
    };

    MOCK_USERS.push(newUser);

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '15m' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi server khi đăng ký' });
  }
});

authRouter.post('/login', authLimiter, async (req, res) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password } = parseResult.data;
    const attemptRecord = FAILED_LOGIN_ATTEMPTS[email] || { count: 0 };

    // OWASP A07: Account Lockout Check
    if (attemptRecord.lockedUntil && Date.now() < attemptRecord.lockedUntil) {
      const remainingMins = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 60000);
      return res.status(423).json({
        error: `Tài khoản đã bị tạm khóa do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau ${remainingMins} phút (OWASP Account Lockout).`,
      });
    }

    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      attemptRecord.count = (attemptRecord.count || 0) + 1;
      if (attemptRecord.count >= 5) {
        attemptRecord.lockedUntil = Date.now() + 15 * 60 * 1000; // Khóa 15 phút
      }
      FAILED_LOGIN_ATTEMPTS[email] = attemptRecord;

      return res.status(401).json({
        error: `Email hoặc mật khẩu không chính xác. (Lần thử ${attemptRecord.count}/5)`,
      });
    }

    // Login successful: reset failed attempt record
    delete FAILED_LOGIN_ATTEMPTS[email];

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  return res.json({ message: 'Đăng xuất thành công, session đã bị hủy.' });
});

// ============================================================================
// GOOGLE OAUTH 2.0 ENDPOINTS
// ============================================================================

const getGoogleConfig = () => ({
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
});

// 1. Get Google OAuth URL or Configuration Status
authRouter.get('/google/url', (req, res) => {
  const { clientId, callbackUrl } = getGoogleConfig();
  const locale = (req.query.locale as string) || 'vi';

  if (!clientId) {
    return res.json({
      isConfigured: false,
      message: 'Google OAuth chưa được cấu hình Client ID.',
    });
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: callbackUrl,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'select_account',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ].join(' '),
    state: JSON.stringify({ locale }),
  };

  const qs = new URLSearchParams(options);
  return res.json({
    isConfigured: true,
    url: `${rootUrl}?${qs.toString()}`,
  });
});

// 2. Google OAuth Callback (Receives auth code from Google)
authRouter.get('/google/callback', async (req, res) => {
  const { clientId, clientSecret, callbackUrl, frontendUrl } = getGoogleConfig();
  const code = req.query.code as string;
  const stateStr = req.query.state as string;
  let locale = 'vi';
  try {
    if (stateStr) {
      const parsed = JSON.parse(stateStr);
      if (parsed.locale) locale = parsed.locale;
    }
  } catch {}

  if (!code) {
    return res.redirect(`${frontendUrl}/${locale}/login?error=GoogleAuthFailed`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenResponse.json()) as any;
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return res.redirect(`${frontendUrl}/${locale}/login?error=TokenExchangeFailed`);
    }

    // Fetch user profile from Google
    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleProfile = (await userinfoRes.json()) as any;

    if (!googleProfile.email) {
      return res.redirect(`${frontendUrl}/${locale}/login?error=NoEmailFromGoogle`);
    }

    // Find or create user
    let user = MOCK_USERS.find(
      (u) => u.email === googleProfile.email || (u.googleId && u.googleId === googleProfile.sub)
    );

    if (!user) {
      user = {
        id: `google-user-${Date.now()}`,
        email: googleProfile.email,
        googleId: googleProfile.sub,
        avatarUrl: googleProfile.picture || null,
        authProvider: 'google',
        displayName: googleProfile.name || googleProfile.email.split('@')[0],
        role: 'STUDENT',
        interfaceLocale: locale,
        timezone: 'Asia/Ho_Chi_Minh',
        dailyGoalMinutes: 15,
        totalXP: 0,
        currentStreak: 1,
        streakFreezes: 1,
        lastActiveDate: getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh'),
      };
      MOCK_USERS.push(user);
    } else {
      // Update Google profile info
      user.googleId = googleProfile.sub;
      if (googleProfile.picture) user.avatarUrl = googleProfile.picture;
      if (!user.displayName || user.displayName === 'Học Viên') {
        user.displayName = googleProfile.name;
      }
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userPayload = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      totalXP: user.totalXP,
      currentStreak: user.currentStreak,
    };

    return res.redirect(
      `${frontendUrl}/${locale}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userPayload)
      )}`
    );
  } catch (err: any) {
    console.error('Error during Google callback:', err);
    return res.redirect(`${frontendUrl}/${locale}/login?error=ServerError`);
  }
});

// 3. Mock Google Login / Simulator (For local development & instant testing)
authRouter.post('/google/mock-login', async (req, res) => {
  try {
    const { email, name, avatarUrl, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email là bắt buộc' });
    }

    const normalizedEmail = email.toLowerCase();
    let user = MOCK_USERS.find((u) => u.email === normalizedEmail);

    if (!user) {
      user = {
        id: `google-mock-${Date.now()}`,
        email: normalizedEmail,
        googleId: googleId || `gid-${Date.now()}`,
        avatarUrl:
          avatarUrl ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        authProvider: 'google',
        displayName: name || normalizedEmail.split('@')[0],
        role: 'STUDENT',
        interfaceLocale: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        dailyGoalMinutes: 15,
        totalXP: 25, // Starting bonus XP
        currentStreak: 1,
        streakFreezes: 1,
        lastActiveDate: getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh'),
      };
      MOCK_USERS.push(user);
    } else {
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (name && (!user.displayName || user.displayName === 'Học Viên')) user.displayName = name;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập bằng Google Simulator' });
  }
});

// 4. Verify Google ID Token (From Google Identity Services / One-Tap SDK)
authRouter.post('/google/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID Token là bắt buộc' });
    }

    // Verify token with Google
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const tokenInfo = (await googleRes.json()) as any;

    if (!googleRes.ok || !tokenInfo.email) {
      return res.status(401).json({ error: 'Token Google không hợp lệ hoặc đã hết hạn' });
    }

    let user = MOCK_USERS.find((u) => u.email === tokenInfo.email);
    if (!user) {
      user = {
        id: `google-user-${Date.now()}`,
        email: tokenInfo.email,
        googleId: tokenInfo.sub,
        avatarUrl: tokenInfo.picture || null,
        authProvider: 'google',
        displayName: tokenInfo.name || tokenInfo.email.split('@')[0],
        role: 'STUDENT',
        interfaceLocale: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        dailyGoalMinutes: 15,
        totalXP: 0,
        currentStreak: 1,
        streakFreezes: 1,
        lastActiveDate: getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh'),
      };
      MOCK_USERS.push(user);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err) {
    return res.status(500).json({ error: 'Lỗi xác thực Google ID Token' });
  }
});

authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token;
  const token = authHeader ? authHeader.split(' ')[1] : cookieToken;

  if (!token) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = MOCK_USERS.find((u) => u.id === payload.userId);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
});
