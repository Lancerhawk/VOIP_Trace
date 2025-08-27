import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentUserAction } from '@/lib/actions/auth_actions';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserAction();
    
    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          email_verified: user.email_verified,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        user: null
      });
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({
      success: false,
      user: null
    });
  }
}
