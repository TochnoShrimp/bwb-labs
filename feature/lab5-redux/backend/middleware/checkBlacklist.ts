import { Request, Response, NextFunction } from 'express';
import { BlacklistedToken } from '../models/index.js';

export const checkBlacklist = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const blacklisted = await BlacklistedToken.findOne({ where: { token } });
    if (blacklisted) {
      return res.status(401).json({ message: 'Токен недействителен (выполнен выход)' });
    }
    next();
  } catch (error) {
    next(error);
  }
};