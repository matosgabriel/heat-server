import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../../../../../shared/errors/AppError';

import authConfig from '../../../../../config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

function ensureAuthenticated(request: Request, _: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Missing token.', 401);
  }
  
  const token = authHeader?.split(' ')[1];

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    request.user_id = sub;

    return next();
  } catch {
    throw new AppError('Invalid token.', 401);
  }
}

export { ensureAuthenticated }