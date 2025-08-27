import { NextRequest, NextResponse } from 'next/server';
import { signUpAction } from '@/lib/actions/auth_actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await signUpAction(formData);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}