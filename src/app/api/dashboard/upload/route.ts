import { NextRequest, NextResponse } from 'next/server';
import { uploadCallLogsAction } from '@/lib/actions/general_actions';

export async function POST(request: NextRequest) {
  try {
    // For now, using a mock user ID. In production, this would come from authentication
    const userId = 1; // This should be extracted from the authenticated session
    
    const formData = await request.formData();
    const result = await uploadCallLogsAction(userId, formData);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
