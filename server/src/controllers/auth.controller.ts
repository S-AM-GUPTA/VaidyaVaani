import { Request, Response } from 'express';
import User from '../models/User';
import Session from '../models/Session';
import { generateOTP, sendOTPEmail, generateJWT } from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create a new session
    const session = await Session.create({
      userId: user._id,
      otp,
      otpExpiresAt
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ 
      message: 'OTP sent successfully',
      sessionId: session._id 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, otp } = req.body;

    if (!sessionId || !otp) {
      res.status(400).json({ error: 'Session ID and OTP are required' });
      return;
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      res.status(404).json({ error: 'Session not found or expired' });
      return;
    }

    if (session.isVerified) {
      res.status(400).json({ error: 'Session already verified' });
      return;
    }

    if (session.otp !== otp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    if (session.otpExpiresAt < new Date()) {
      res.status(400).json({ error: 'OTP has expired' });
      return;
    }

    // Mark as verified
    session.isVerified = true;
    await session.save();

    // Generate JWT
    const token = generateJWT(session.userId.toString());

    res.status(200).json({ 
      message: 'Verified successfully',
      token
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
