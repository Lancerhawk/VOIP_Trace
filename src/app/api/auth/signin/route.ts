import { NextRequest, NextResponse } from 'next/server';
import { signInAction } from '@/lib/actions/auth_actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await signInAction(formData);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error('Signin API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
