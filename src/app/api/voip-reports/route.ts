import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/postgresql';
import { createVoipAnalysisReport, getVoipAnalysisReports, deleteVoipAnalysisReport, getVoipAnalysisReportById } from '@/lib/postgresql';

// GET - Retrieve all VoIP analysis reports for the user
export async function GET(request: NextRequest) {
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

    const reports = await getVoipAnalysisReports(session.user_id);
    
    return NextResponse.json({ 
      success: true, 
      reports 
    });

  } catch (error) {
    console.error('Error fetching VoIP reports:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reports' 
    }, { status: 500 });
  }
}

// POST - Save a new VoIP analysis report
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { report_name, analysis_data, uploaded_files, html_report } = body;

    if (!report_name || !analysis_data) {
      return NextResponse.json({ 
        error: 'Report name and analysis data are required' 
      }, { status: 400 });
    }

    // Extract summary data from analysis_data
    const reportData = {
      report_name,
      total_users: analysis_data.totalUsers || 0,
      total_connections: analysis_data.totalConnections || 0,
      suspicious_users: analysis_data.suspiciousUsers || 0,
      suspicious_connections: analysis_data.suspiciousConnections || 0,
      vpn_users: analysis_data.detectionRules?.find((rule: any) => rule.rule === 'VPN Detection')?.count || 0,
      blocked_country_users: analysis_data.detectionRules?.find((rule: any) => rule.rule === 'Blocked Countries')?.count || 0,
      analysis_data,
      uploaded_files,
      html_report
    };

    const savedReport = await createVoipAnalysisReport(session.user_id, reportData);
    
    return NextResponse.json({ 
      success: true, 
      report: savedReport 
    });

  } catch (error) {
    console.error('Error saving VoIP report:', error);
    return NextResponse.json({ 
      error: 'Failed to save report' 
    }, { status: 500 });
  }
}

// DELETE - Delete a VoIP analysis report
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');

    if (!reportId) {
      return NextResponse.json({ 
        error: 'Report ID is required' 
      }, { status: 400 });
    }

    const deleted = await deleteVoipAnalysisReport(parseInt(reportId), session.user_id);
    
    if (!deleted) {
      return NextResponse.json({ 
        error: 'Report not found or access denied' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Report deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting VoIP report:', error);
    return NextResponse.json({ 
      error: 'Failed to delete report' 
    }, { status: 500 });
  }
}
