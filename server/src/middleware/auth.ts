import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const getSecret = (): string => process.env.JWT_SECRET || 'development-only-secret';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.header('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Authentication is required', errorCode: 'UNAUTHORIZED' });
    return;
  }

  try {
    const payload = jwt.verify(token, getSecret());
    if (typeof payload === 'string' || !payload.id || !payload.email) {
      throw new Error('Invalid token payload');
    }
    req.user = { ...payload, id: String(payload.id), email: String(payload.email) };
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Your session is invalid or has expired',
      errorCode: 'INVALID_TOKEN',
    });
  }
};
