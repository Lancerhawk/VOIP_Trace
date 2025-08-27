import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signOutAction } from '@/lib/actions/auth_actions';

export async function POST(request: NextRequest) {
  try {
    const result = await signOutAction();
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Signed out successfully' });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({ success: false, error: 'Failed to sign out' }, { status: 500 });
  }
}
