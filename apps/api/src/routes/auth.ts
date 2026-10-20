import 'dotenv/config';
import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { RegisterSchema, LoginSchema } from '../../../../packages/contracts/src/index.js';
import { userRepository } from '../repositories/user.repository.js';
import { JWT_SECRET } from '../middleware/rbac.js';
import { authLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

import { FAILED_LOGIN_ATTEMPTS, lockoutStore } from '../lib/lockoutStore.js';
export { FAILED_LOGIN_ATTEMPTS, lockoutStore };

authRouter.post('/register', authLimiter, async (req, res) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password, displayName, interfaceLocale, timezone } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được sử dụng.' });
    }

    const passwordHash = await argon2.hash(password);
    const newUser = await userRepository.createUser({
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      passwordHash,
      displayName,
      role: 'STUDENT' as any,
      interfaceLocale,
      timezone,
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/',
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
    const normalizedEmail = email.toLowerCase();
    const attemptRecord = FAILED_LOGIN_ATTEMPTS[normalizedEmail] || { count: 0 };

    // OWASP A07: Account Lockout Check
    if (attemptRecord.lockedUntil && Date.now() < attemptRecord.lockedUntil) {
      const remainingMins = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 60000);
      return res.status(423).json({
        error: `Tài khoản đã bị tạm khóa do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau ${remainingMins} phút (OWASP Account Lockout).`,
      });
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      attemptRecord.count = (attemptRecord.count || 0) + 1;
      if (attemptRecord.count >= 5) {
        attemptRecord.lockedUntil = Date.now() + 15 * 60 * 1000; // Khóa 15 phút
      }
      FAILED_LOGIN_ATTEMPTS[normalizedEmail] = attemptRecord;

      return res.status(401).json({
        error: `Email hoặc mật khẩu không chính xác. (Lần thử ${attemptRecord.count}/5)`,
      });
    }

    // Login successful: reset failed attempt record
    delete FAILED_LOGIN_ATTEMPTS[normalizedEmail];

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
});

authRouter.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  });
  return res.json({ message: 'Đăng xuất thành công, session đã bị hủy.' });
});

// ============================================================================
// GOOGLE OAUTH 2.0 ENDPOINTS
// ============================================================================

const getGoogleConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    process.env.GOOGLE_CALLBACK_URL ||
    'http://localhost:4000/api/v1/auth/google/callback';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const isConfigured = Boolean(clientId && clientSecret);

  return {
    clientId,
    clientSecret,
    redirectUri,
    frontendUrl,
    isConfigured,
  };
};

// 0. Check Google OAuth Configuration Status
authRouter.get('/google/status', (req, res) => {
  const { isConfigured, clientId, redirectUri } = getGoogleConfig();
  return res.json({
    configured: isConfigured,
    isConfigured,
    clientId: isConfigured ? clientId : null,
    redirectUri,
    message: isConfigured
      ? 'Google OAuth 2.0 đã được cấu hình sẵn sàng.'
      : 'Google OAuth chưa được cấu hình (thiếu GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong env).',
  });
});

// 1. Direct initiate route: Redirects user straight to Google Consent Screen
authRouter.get('/google', (req, res) => {
  const { isConfigured, clientId, redirectUri, frontendUrl } = getGoogleConfig();
  const locale = (req.query.locale as string) || 'vi';

  if (!isConfigured) {
    if (req.accepts('html') && !req.accepts('json')) {
      return res.redirect(`${frontendUrl}/login?error=GoogleAuthConfigMissing`);
    }
    return res.status(503).json({
      configured: false,
      isConfigured: false,
      error: 'Google OAuth chưa được cấu hình (thiếu GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong env).',
    });
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
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
  return res.redirect(`${rootUrl}?${qs.toString()}`);
});

// 2. Get Google OAuth URL or Configuration Status
authRouter.get('/google/url', (req, res) => {
  const { isConfigured, clientId, redirectUri } = getGoogleConfig();
  const locale = (req.query.locale as string) || 'vi';

  if (!isConfigured) {
    return res.status(503).json({
      configured: false,
      isConfigured: false,
      error: 'Google OAuth chưa được cấu hình (thiếu GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong env).',
    });
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
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
    configured: true,
    isConfigured: true,
    url: `${rootUrl}?${qs.toString()}`,
    redirectUri,
  });
});

// 3. Google OAuth Callback (Receives auth code from Google)
authRouter.get('/google/callback', async (req, res) => {
  const { isConfigured, clientId, clientSecret, redirectUri, frontendUrl } = getGoogleConfig();
  const code = req.query.code as string;
  const stateStr = req.query.state as string;
  let locale = 'vi';
  try {
    if (stateStr) {
      const parsed = JSON.parse(stateStr);
      if (parsed.locale) locale = parsed.locale;
    }
  } catch {}

  if (!isConfigured) {
    return res.redirect(`${frontendUrl}/login?error=GoogleAuthConfigMissing`);
  }

  if (req.query.error) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(req.query.error as string)}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=GoogleAuthFailed`);
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenResponse.json()) as any;
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return res.redirect(`${frontendUrl}/login?error=TokenExchangeFailed`);
    }

    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleProfile = (await userinfoRes.json()) as any;

    if (!googleProfile.email) {
      return res.redirect(`${frontendUrl}/login?error=NoEmailFromGoogle`);
    }

    const normalizedEmail = googleProfile.email.toLowerCase();
    let user = await userRepository.findByEmail(normalizedEmail);

    if (user) {
      // Liên kết tài khoản nếu đã tồn tại bằng email (giữ nguyên passwordHash)
      if (!user.googleId || !user.avatarUrl) {
        await userRepository.linkGoogleAccount(
          user.id,
          user.googleId || googleProfile.sub,
          user.avatarUrl || googleProfile.picture || null
        );
      }
    } else {
      user = await userRepository.createUser({
        id: `google-user-${Date.now()}`,
        email: normalizedEmail,
        googleId: googleProfile.sub,
        avatarUrl: googleProfile.picture || null,
        authProvider: 'google',
        displayName: googleProfile.name || normalizedEmail.split('@')[0],
        role: 'STUDENT' as any,
        interfaceLocale: locale,
        timezone: 'Asia/Ho_Chi_Minh',
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
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
      `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userPayload)
      )}`
    );
  } catch (err: any) {
    console.error('Error during Google callback:', err);
    return res.redirect(`${frontendUrl}/login?error=ServerError`);
  }
});

// 4. Dev Google Login / Simulator (Blocked in Production)
authRouter.post('/google/dev-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Endpoint không tồn tại' });
  }

  try {
    const { email, name, avatarUrl, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email là bắt buộc' });
    }

    const normalizedEmail = email.toLowerCase();
    let user = await userRepository.findByEmail(normalizedEmail);

    if (user) {
      if (!user.googleId || !user.avatarUrl) {
        await userRepository.linkGoogleAccount(
          user.id,
          user.googleId || googleId || `gid-${Date.now()}`,
          user.avatarUrl || avatarUrl || null
        );
      }
    } else {
      user = await userRepository.createUser({
        id: `google-dev-${Date.now()}`,
        email: normalizedEmail,
        googleId: googleId || `gid-${Date.now()}`,
        avatarUrl:
          avatarUrl ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        authProvider: 'google',
        displayName: name || normalizedEmail.split('@')[0],
        role: 'STUDENT' as any,
        interfaceLocale: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập bằng Google Simulator' });
  }
});

// 5. Verify Google ID Token (Client-side One-tap or Google SDK)
authRouter.post('/google/verify-token', async (req, res) => {
  const { isConfigured, clientId } = getGoogleConfig();
  if (!isConfigured) {
    return res.status(503).json({
      configured: false,
      isConfigured: false,
      error: 'Google OAuth chưa được cấu hình trên máy chủ (thiếu GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET).',
    });
  }

  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID Token là bắt buộc' });
    }

    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const tokenInfo = (await googleRes.json()) as any;

    if (!googleRes.ok || !tokenInfo.email) {
      return res.status(401).json({ error: 'Token Google không hợp lệ hoặc đã hết hạn' });
    }

    // Audience verification
    if (tokenInfo.aud && clientId && tokenInfo.aud !== clientId) {
      return res.status(401).json({ error: 'Token Google không khớp với Client ID của ứng dụng' });
    }

    const normalizedEmail = tokenInfo.email.toLowerCase();
    let user = await userRepository.findByEmail(normalizedEmail);
    if (user) {
      if (!user.googleId || !user.avatarUrl) {
        await userRepository.linkGoogleAccount(
          user.id,
          user.googleId || tokenInfo.sub,
          user.avatarUrl || tokenInfo.picture || null
        );
      }
    } else {
      user = await userRepository.createUser({
        id: `google-user-${Date.now()}`,
        email: normalizedEmail,
        googleId: tokenInfo.sub,
        avatarUrl: tokenInfo.picture || null,
        authProvider: 'google',
        displayName: tokenInfo.name || normalizedEmail.split('@')[0],
        role: 'STUDENT' as any,
        interfaceLocale: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, accessToken: token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi xác thực Google ID Token: ' + (err.message || 'Unknown') });
  }
});

authRouter.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token;
  const token = authHeader ? authHeader.split(' ')[1] : cookieToken;

  if (!token) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await userRepository.findById(payload.userId);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
});
