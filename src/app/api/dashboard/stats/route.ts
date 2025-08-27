import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgresql';

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0]?.count || '0');

    // Get total connections count (using call_logs table)
    const connectionsResult = await pool.query('SELECT COUNT(*) as count FROM call_logs');
    const totalConnections = parseInt(connectionsResult.rows[0]?.count || '0');

    // Get suspicious activity count
    const suspiciousResult = await pool.query('SELECT COUNT(*) as count FROM suspicious_activities');
    const suspiciousActivity = parseInt(suspiciousResult.rows[0]?.count || '0');

    // Get recent scans (call logs in last 7 days)
    const recentScansResult = await pool.query(`
      SELECT COUNT(*) as count FROM call_logs 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    const recentScans = parseInt(recentScansResult.rows[0]?.count || '0');

    // Get active alerts (suspicious activities in last 24 hours)
    const activeAlertsResult = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as count FROM suspicious_activities 
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
    `);
    const activeAlerts = parseInt(activeAlertsResult.rows[0]?.count || '0');

    // Calculate detection rate (mock for now, can be enhanced with ML model accuracy)
    const detectionRate = totalConnections > 0 ? Math.round((suspiciousActivity / totalConnections) * 100) : 0;

    const stats = {
      totalUsers,
      totalConnections,
      suspiciousActivity,
      detectionRate,
      recentScans,
      activeAlerts
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Return mock data if database query fails
    return NextResponse.json({
      totalUsers: 0,
      totalConnections: 0,
      suspiciousActivity: 0,
      detectionRate: 0,
      recentScans: 0,
      activeAlerts: 0
    });
  }
}
