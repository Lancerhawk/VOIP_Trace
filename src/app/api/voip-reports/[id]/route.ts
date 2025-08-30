import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/postgresql';
import { getVoipAnalysisReportById } from '@/lib/postgresql';

// GET - Retrieve a specific VoIP analysis report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const resolvedParams = await params;
    const reportId = parseInt(resolvedParams.id);
    if (isNaN(reportId)) {
      return NextResponse.json({ 
        error: 'Invalid report ID' 
      }, { status: 400 });
    }

    const report = await getVoipAnalysisReportById(reportId, session.user_id);
    
    if (!report) {
      return NextResponse.json({ 
        error: 'Report not found or access denied' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      report 
    });

  } catch (error) {
    console.error('Error fetching VoIP report:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch report' 
    }, { status: 500 });
  }
}
