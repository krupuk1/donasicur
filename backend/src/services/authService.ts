import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/User';
import { emailService } from './emailService';
import { createError } from '../middleware/errorHandler';
import { User } from '../types';

export class AuthService {
  static async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }): Promise<{ user: Omit<User, 'password'>; message: string }> {
    try {
      const { username, email, password, full_name, phone } = userData;

      // Check if user already exists
      const existingUserByEmail = await UserModel.findByEmail(email);
      if (existingUserByEmail) {
        throw createError('Email already registered', 400);
      }

      const existingUserByUsername = await UserModel.findByUsername(username);
      if (existingUserByUsername) {
        throw createError('Username already taken', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create user
      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        full_name,
        phone,
        verification_token: verificationToken
      });

      // Send verification email
      await emailService.sendVerificationEmail(email, full_name, verificationToken);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return {
        user: userWithoutPassword,
        message: 'Registration successful. Please check your email to verify your account.'
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: Omit<User, 'password'>; token: string; refreshToken: string }> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw createError('Invalid email or password', 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password!);
      if (!isPasswordValid) {
        throw createError('Invalid email or password', 401);
      }

      // Check if email is verified
      if (!user.is_verified) {
        throw createError('Please verify your email address before logging in', 401);
      }

      // Generate tokens
      const token = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      // Find user by verification token
      const user = await UserModel.findByVerificationToken(token);
      if (!user) {
        throw createError('Invalid or expired verification token', 400);
      }

      // Verify email
      await UserModel.verifyEmail(user.id);

      return {
        message: 'Email verified successfully. You can now log in.'
      };
    } catch (error) {
      throw error;
    }
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw createError('No account found with that email address', 404);
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

      // Save reset token
      await UserModel.setResetToken(user.id, resetToken, resetTokenExpires);

      // Send reset email
      await emailService.sendPasswordResetEmail(email, user.full_name, resetToken);

      return {
        message: 'Password reset email sent. Please check your inbox.'
      };
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      // Find user by reset token
      const user = await UserModel.findByResetToken(token);
      if (!user) {
        throw createError('Invalid or expired reset token', 400);
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));

      // Update password and clear reset token
      await UserModel.updatePassword(user.id, hashedPassword);

      return {
        message: 'Password reset successfully. You can now log in with your new password.'
      };
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

      // Find user
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw createError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        token: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  }

  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      // Find user
      const user = await UserModel.findById(userId);
      if (!user) {
        throw createError('User not found', 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password!);
      if (!isCurrentPasswordValid) {
        throw createError('Current password is incorrect', 400);
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));

      // Update password
      await UserModel.updatePassword(userId, hashedPassword);

      return {
        message: 'Password changed successfully.'
      };
    } catch (error) {
      throw error;
    }
  }

  private static generateAccessToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );
  }

  private static generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
      }
    );
  }

  static async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw createError('No account found with that email address', 404);
      }

      if (user.is_verified) {
        throw createError('Email is already verified', 400);
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Update verification token
      await UserModel.update(user.id, { verification_token: verificationToken });

      // Send verification email
      await emailService.sendVerificationEmail(email, user.full_name, verificationToken);

      return {
        message: 'Verification email sent. Please check your inbox.'
      };
    } catch (error) {
      throw error;
    }
  }
}