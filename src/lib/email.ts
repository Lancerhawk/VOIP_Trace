import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'VoIP Trace - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background-color: #3b82f6; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">VT</span>
              </div>
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">Email Verification</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">Please verify your email address to complete your account setup</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <p style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Your verification code is:</p>
              <div style="background-color: #3b82f6; color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 8px; letter-spacing: 5px; font-family: monospace;">
                ${otp}
              </div>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">This code will expire in 10 minutes.</p>
              <p style="margin: 10px 0 0 0;">If you didn't request this code, please ignore this email.</p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 VoIP Trace. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, username: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to VoIP Trace!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">✓</span>
              </div>
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">Welcome to VoIP Trace!</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">Your account has been successfully created</p>
            </div>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">Hello ${username}!</h2>
              <p style="color: #166534; margin: 0; line-height: 1.6;">
                Thank you for joining VoIP Trace! Your account is now active and ready to use. 
                You can start monitoring your VoIP communications and detecting suspicious activities.
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 VoIP Trace. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<boolean> => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'VoIP Trace - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background-color: #ef4444; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">🔒</span>
              </div>
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">Password Reset Request</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">We received a request to reset your password</p>
            </div>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="color: #991b1b; margin: 0; line-height: 1.6;">
                If you requested a password reset, click the button below to create a new password. 
                This link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${resetUrl}" 
                 style="background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">If you didn't request a password reset, please ignore this email.</p>
              <p style="margin: 10px 0 0 0;">Your password will remain unchanged.</p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 VoIP Trace. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${email}:`, error);
    return false;
  }
};

export default transporter;
