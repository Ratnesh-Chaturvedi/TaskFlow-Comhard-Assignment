import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendPasswordResetEmail } from './email.service.js';

export const signToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_jwt_key_taskflow_production_ready_12345',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash
  });

  const token = signToken(user._id);
  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id);
  return { user, token };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  // Generic response to prevent user enumeration
  if (!user) {
    return { success: true };
  }

  // Generate unhashed reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token to store in database
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  user.passwordResetTokenHash = resetTokenHash;
  user.passwordResetExpires = tokenExpires;
  await user.save();

  const baseUrl = process.env.PASSWORD_RESET_URL || 'http://localhost:5173/reset-password';
  const resetUrl = `${baseUrl}/${resetToken}`;

  try {
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  } catch (err) {
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();
    throw new Error('There was an error sending the password reset email. Please try again later.');
  }

  return { success: true };
};

export const resetPassword = async ({ token, password }) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetTokenHash: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    const error = new Error('Reset link is invalid or has expired');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(password, salt);
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
  await user.save();

  const newToken = signToken(user._id);
  return { user, token: newToken };
};
