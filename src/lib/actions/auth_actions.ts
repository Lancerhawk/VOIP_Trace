'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { createUser, getUserByEmail, updateEmailVerification, createOTP, verifyOTP, createSession, deleteSession, getSessionByToken, getUserById } from '../postgresql';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../email';

// Sign up action
export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!email || !username || !password) {
      return { success: false, error: 'All fields are required' };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    // Create user
    const user = await createUser(email, username, passwordHash);

    // Generate and send OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await createOTP(email, otp, expiresAt);
    await sendOTPEmail(email, otp);

    return { 
      success: true, 
      message: 'Account created successfully. Please check your email for verification code.',
      userId: user.id 
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}

// Send OTP action
export async function sendOTPAction(email: string) {
  try {
    // Generate and send OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await createOTP(email, otp, expiresAt);
    await sendOTPEmail(email, otp);

    return { 
      success: true, 
      message: 'OTP sent successfully. Please check your email.' 
    };
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, error: 'Failed to send OTP. Please try again.' };
  }
}

// Verify OTP action
export async function verifyOTPAction(email: string, otp: string) {
  try {
    const isValid = await verifyOTP(email, otp);
    
    if (isValid) {
      // Update user email verification status
      const user = await getUserByEmail(email);
      if (user) {
        await updateEmailVerification(user.id);
      }
      
      return { 
        success: true, 
        message: 'Email verified successfully.' 
      };
    } else {
      return { 
        success: false, 
        error: 'Invalid or expired OTP. Please try again.' 
      };
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, error: 'Failed to verify OTP. Please try again.' };
  }
}

// Sign in action
export async function signInAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check if email is verified
    if (!user.email_verified) {
      return { success: false, error: 'Please verify your email before signing in' };
    }

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await createSession(user.id, sessionToken, expiresAt);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
    });

    return { 
      success: true, 
      message: 'Signed in successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'Failed to sign in. Please try again.' };
  }
}

// Sign out action
export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;
    
    if (sessionToken) {
      await deleteSession(sessionToken);
      cookieStore.delete('session_token');
    }

    return { success: true, message: 'Signed out successfully' };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}

// Complete sign up action (after OTP verification)
export async function completeSignUpAction(userId: number) {
  try {
    // Send welcome email
    const user = await getUserByEmail(userId.toString()); // This needs to be fixed
    if (user) {
      await sendWelcomeEmail(user.email, user.username);
    }

    return { 
      success: true, 
      message: 'Account setup completed successfully!' 
    };
  } catch (error) {
    console.error('Complete sign up error:', error);
    return { success: false, error: 'Failed to complete account setup' };
  }
}

// Generate session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get current user action
export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;
    
    if (!sessionToken) {
      return null;
    }

    // Get session and user info from database
    const session = await getSessionByToken(sessionToken);
    if (!session || new Date() > session.expires_at) {
      // Session expired, delete it
      if (session) {
        await deleteSession(sessionToken);
      }
      return null;
    }

    // Get user info
    const user = await getUserById(session.user_id);
    if (!user) {
      // User not found, delete session
      await deleteSession(sessionToken);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      email_verified: user.email_verified,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
