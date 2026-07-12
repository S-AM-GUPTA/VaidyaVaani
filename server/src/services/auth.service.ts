import jwt from 'jsonwebtoken';

export const generateOTP = (): string => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  // Mock sending email since we don't have SMTP credentials yet
  console.log(`\n\n========================================`);
  console.log(`MOCK EMAIL SENT TO: ${email}`);
  console.log(`YOUR LOGIN OTP IS: ${otp}`);
  console.log(`========================================\n\n`);
  
  return true;
};

export const generateJWT = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};
