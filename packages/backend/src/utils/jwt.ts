import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

const JWT_EXPIRY = '7d';

export const generateToken = (userId: string, email: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload: JwtPayload = {
    userId,
    email
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRY
  });
};

