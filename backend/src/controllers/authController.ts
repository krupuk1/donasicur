import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class AuthController {
  // Validation rules
  static registerValidation = [
    body('username')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('full_name')
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Full name can only contain letters and spaces'),
    body('phone')
      .optional()
      .isMobilePhone('id-ID')
      .withMessage('Please enter a valid Indonesian phone number')
  ];

  static loginValidation = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];

  static forgotPasswordValidation = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email address')
  ];

  static resetPasswordValidation = [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  ];

  static changePasswordValidation = [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
  ];

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError('Validation failed: ' + errors.array().map(err => err.msg).join(', '), 400));
      }

      const { username, email, password, full_name, phone } = req.body;

      const result = await AuthService.register({
        username,
        email,
        password,
        full_name,
        phone
      });

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result.user
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError('Validation failed: ' + errors.array().map(err => err.msg).join(', '), 400));
      }

      const { email, password } = req.body;

      const result = await AuthService.login({ email, password });

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return next(createError('Verification token is required', 400));
      }

      const result = await AuthService.verifyEmail(token);

      const response: ApiResponse = {
        success: true,
        message: result.message
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError('Validation failed: ' + errors.array().map(err => err.msg).join(', '), 400));
      }

      const { email } = req.body;

      const result = await AuthService.forgotPassword(email);

      const response: ApiResponse = {
        success: true,
        message: result.message
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError('Validation failed: ' + errors.array().map(err => err.msg).join(', '), 400));
      }

      const { token, password } = req.body;

      const result = await AuthService.resetPassword(token, password);

      const response: ApiResponse = {
        success: true,
        message: result.message
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return next(createError('Refresh token is required', 400));
      }

      const result = await AuthService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        message: 'Token refreshed successfully',
        data: result
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError('Validation failed: ' + errors.array().map(err => err.msg).join(', '), 400));
      }

      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return next(createError('User not authenticated', 401));
      }

      const result = await AuthService.changePassword(userId, currentPassword, newPassword);

      const response: ApiResponse = {
        success: true,
        message: result.message
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        return next(createError('Email is required', 400));
      }

      const result = await AuthService.resendVerificationEmail(email);

      const response: ApiResponse = {
        success: true,
        message: result.message
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a stateless JWT system, logout is typically handled on the client side
      // by removing the token from storage. However, you could implement 
      // a token blacklist if needed for enhanced security.

      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user) {
        return next(createError('User not authenticated', 401));
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}