import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    if (adminAuth) {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      return next();
    }
  } catch (error) {
    // In development, fallback to extracting user claims from Firebase JWT payload if adminAuth lacks service account
    if (process.env.NODE_ENV !== 'production' && token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload && (payload.user_id || payload.sub)) {
            req.user = {
              uid: payload.user_id || payload.sub,
              email: payload.email || '',
              ...payload,
            } as unknown as DecodedIdToken;
            return next();
          }
        }
      } catch (devParseErr) {
        console.warn('Development JWT payload parse failed:', devParseErr);
      }
    }
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
