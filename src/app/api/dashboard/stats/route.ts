import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/postgresql';
import { getVoipAnalysisReports } from '@/lib/postgresql';

// GET - Retrieve aggregated statistics from all VoIP analysis reports
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
    
    // Static list of blocked countries
    const staticBlockedCountries = [
      'North Korea', 'Iran', 'Syria', 'Cuba', 'Myanmar', 
      'Afghanistan', 'Somalia', 'Sudan', 'Libya', 'Iraq'
    ];

    // Aggregate statistics from all reports
    const aggregatedStats = {
      totalScans: reports.length,
      totalUsers: 0,
      totalConnections: 0,
      totalSuspiciousUsers: 0,
      totalSuspiciousConnections: 0,
      totalVpnUsers: 0,
      totalBlockedCountryUsers: 0,
      blockedCountries: staticBlockedCountries,
      recentScans: reports.length,
      activeAlerts: 0
    };

    // Process each report to aggregate data
    reports.forEach(report => {
      aggregatedStats.totalUsers += report.total_users || 0;
      aggregatedStats.totalConnections += report.total_connections || 0;
      aggregatedStats.totalSuspiciousUsers += report.suspicious_users || 0;
      aggregatedStats.totalSuspiciousConnections += report.suspicious_connections || 0;
      aggregatedStats.totalVpnUsers += report.vpn_users || 0;
      aggregatedStats.totalBlockedCountryUsers += report.blocked_country_users || 0;
      
      // Count active alerts (reports with suspicious activity)
      if ((report.suspicious_users || 0) > 0) {
        aggregatedStats.activeAlerts++;
      }
    });

    // Calculate detection rate
    const detectionRate = aggregatedStats.totalUsers > 0 
      ? Math.round((aggregatedStats.totalSuspiciousUsers / aggregatedStats.totalUsers) * 100)
      : 0;

    return NextResponse.json({ 
      success: true, 
      stats: {
        totalUsers: aggregatedStats.totalUsers,
        totalConnections: aggregatedStats.totalConnections,
        suspiciousActivity: aggregatedStats.totalSuspiciousUsers,
        detectionRate: detectionRate,
        recentScans: aggregatedStats.recentScans,
        activeAlerts: aggregatedStats.activeAlerts,
        totalVpnUsers: aggregatedStats.totalVpnUsers,
        totalBlockedCountryUsers: aggregatedStats.totalBlockedCountryUsers,
        blockedCountriesCount: aggregatedStats.blockedCountries.length,
        blockedCountries: aggregatedStats.blockedCountries
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard statistics' 
    }, { status: 500 });
  }
}