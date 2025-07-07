import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    full_name: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return next(createError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Get user from database
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT id, username, email, role, full_name, is_verified FROM users WHERE id = ?',
        [decoded.id]
      );

      if (rows.length === 0) {
        return next(createError('No user found with this token', 401));
      }

      const user = rows[0];

      // Check if user is verified
      if (!user.is_verified) {
        return next(createError('Please verify your email address', 401));
      }

      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      };

      next();
    } catch (error) {
      return next(createError('Not authorized to access this route', 401));
    }
  } catch (error) {
    return next(createError('Server error during authentication', 500));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        createError('User role not authorized to access this route', 403)
      );
    }

    next();
  };
};