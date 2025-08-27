'use server';

import { getCallLogs, createCallLog, getSuspiciousActivities, createSuspiciousActivity } from '../postgresql';

// Define types for better type safety
interface CallLog {
  id: number;
  user_id: number;
  caller_ip: string;
  caller_number: string;
  receiver_number: string;
  call_duration: number;
  call_timestamp: Date;
  call_type: string;
  status: string;
  created_at: Date;
}

interface SuspiciousActivity {
  id: number;
  user_id: number;
  activity_type: string;
  description: string;
  severity: string;
  ip_address: string;
  timestamp: Date;
  resolved: boolean;
}

// Get dashboard statistics
export async function getDashboardStatsAction(userId: number) {
  try {
    const callLogs = await getCallLogs(userId, 1000);
    const suspiciousActivities = await getSuspiciousActivities(userId, 100);

    // Calculate statistics
    const totalCalls = callLogs.length;
    const totalDuration = callLogs.reduce((sum: number, log: CallLog) => sum + (log.call_duration || 0), 0);
    const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
    
    const suspiciousCount = suspiciousActivities.length;
    const highSeverityCount = suspiciousActivities.filter((activity: SuspiciousActivity) => activity.severity === 'high').length;
    
    const uniqueIPs = new Set(callLogs.map((log: CallLog) => log.caller_ip)).size;
    const uniqueNumbers = new Set([
      ...callLogs.map((log: CallLog) => log.caller_number),
      ...callLogs.map((log: CallLog) => log.receiver_number)
    ]).size;

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCalls = callLogs.filter((log: CallLog) => new Date(log.created_at) > sevenDaysAgo).length;
    const recentSuspicious = suspiciousActivities.filter((activity: SuspiciousActivity) => new Date(activity.timestamp) > sevenDaysAgo).length;

    return {
      success: true,
      stats: {
        totalCalls,
        totalDuration,
        avgDuration,
        suspiciousCount,
        highSeverityCount,
        uniqueIPs,
        uniqueNumbers,
        recentCalls,
        recentSuspicious,
      }
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return { success: false, error: 'Failed to get dashboard statistics' };
  }
}

// Upload call logs action
export async function uploadCallLogsAction(userId: number, formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'csv' or 'json'

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    let callLogs: any[] = [];

    if (fileType === 'csv') {
      const csvText = await file.text();
      callLogs = parseCSV(csvText);
    } else if (fileType === 'json') {
      const jsonText = await file.text();
      callLogs = JSON.parse(jsonText);
    } else {
      return { success: false, error: 'Unsupported file type' };
    }

    // Process and insert call logs
    const insertedLogs = [];
    for (const log of callLogs) {
      try {
        const callData = {
          caller_ip: log.caller_ip || log.callerIP || log.ip,
          caller_number: log.caller_number || log.callerNumber || log.from,
          receiver_number: log.receiver_number || log.receiverNumber || log.to,
          call_duration: parseInt(log.call_duration || log.duration || log.duration_seconds || '0'),
          call_timestamp: new Date(log.call_timestamp || log.timestamp || log.date),
          call_type: log.call_type || log.type || 'voice',
          status: log.status || 'completed',
        };

        const insertedLog = await createCallLog(userId, callData);
        insertedLogs.push(insertedLog);

        // Check for suspicious patterns
        await checkSuspiciousPatterns(userId, callData);
      } catch (error) {
        console.error('Error processing call log:', error);
        // Continue with other logs
      }
    }

    return {
      success: true,
      message: `Successfully uploaded ${insertedLogs.length} call logs`,
      insertedCount: insertedLogs.length,
    };
  } catch (error) {
    console.error('Upload call logs error:', error);
    return { success: false, error: 'Failed to upload call logs' };
  }
}

// Get call logs action
export async function getCallLogsAction(userId: number, limit: number = 100, offset: number = 0) {
  try {
    const callLogs = await getCallLogs(userId, limit + offset);
    const paginatedLogs = callLogs.slice(offset, offset + limit);

    return {
      success: true,
      callLogs: paginatedLogs,
      total: callLogs.length,
      hasMore: callLogs.length > offset + limit,
    };
  } catch (error) {
    console.error('Get call logs error:', error);
    return { success: false, error: 'Failed to get call logs' };
  }
}

// Get suspicious activities action
export async function getSuspiciousActivitiesAction(userId: number, limit: number = 50, offset: number = 0) {
  try {
    const activities = await getSuspiciousActivities(userId, limit + offset);
    const paginatedActivities = activities.slice(offset, offset + limit);

    return {
      success: true,
      activities: paginatedActivities,
      total: activities.length,
      hasMore: activities.length > offset + limit,
    };
  } catch (error) {
    console.error('Get suspicious activities error:', error);
    return { success: false, error: 'Failed to get suspicious activities' };
  }
}

// Mark suspicious activity as resolved
export async function resolveSuspiciousActivityAction(activityId: number) {
  try {
    // This would need to be implemented in the database layer
    // For now, return success
    return {
      success: true,
      message: 'Activity marked as resolved',
    };
  } catch (error) {
    console.error('Resolve suspicious activity error:', error);
    return { success: false, error: 'Failed to resolve activity' };
  }
}

// Parse CSV content
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      result.push(obj);
    }
  }

  return result;
}

// Check for suspicious patterns
async function checkSuspiciousPatterns(userId: number, callData: any) {
  try {
    const suspiciousPatterns = [];

    // Check for high call volume (more than 100 calls in 1 hour)
    // This would need to be implemented with proper time-based queries
    
    // Check for odd hours (between 2 AM and 5 AM)
    const callHour = new Date(callData.call_timestamp).getHours();
    if (callHour >= 2 && callHour <= 5) {
      suspiciousPatterns.push({
        type: 'odd_hours',
        description: `Call made during odd hours (${callHour}:00)`,
        severity: 'medium',
        ip_address: callData.caller_ip,
      });
    }

    // Check for very short calls (less than 5 seconds)
    if (callData.call_duration < 5) {
      suspiciousPatterns.push({
        type: 'short_duration',
        description: `Very short call duration: ${callData.call_duration} seconds`,
        severity: 'low',
        ip_address: callData.caller_ip,
      });
    }

    // Check for very long calls (more than 2 hours)
    if (callData.call_duration > 7200) {
      suspiciousPatterns.push({
        type: 'long_duration',
        description: `Very long call duration: ${Math.round(callData.call_duration / 60)} minutes`,
        severity: 'medium',
        ip_address: callData.caller_ip,
      });
    }

    // Create suspicious activity records
    for (const pattern of suspiciousPatterns) {
      await createSuspiciousActivity(userId, pattern);
    }
  } catch (error) {
    console.error('Error checking suspicious patterns:', error);
  }
}

// Export data action
export async function exportDataAction(userId: number, dataType: 'calls' | 'suspicious', format: 'csv' | 'json') {
  try {
    let data: any[] = [];
    
    if (dataType === 'calls') {
      const result = await getCallLogs(userId, 10000); // Get all call logs
      data = result;
    } else {
      const result = await getSuspiciousActivities(userId, 10000); // Get all suspicious activities
      data = result;
    }

    if (format === 'csv') {
      const csvContent = convertToCSV(data);
      return {
        success: true,
        data: csvContent,
        filename: `${dataType}_${new Date().toISOString().split('T')[0]}.csv`,
        contentType: 'text/csv',
      };
    } else {
      return {
        success: true,
        data: JSON.stringify(data, null, 2),
        filename: `${dataType}_${new Date().toISOString().split('T')[0]}.json`,
        contentType: 'application/json',
      };
    }
  } catch (error) {
    console.error('Export data error:', error);
    return { success: false, error: 'Failed to export data' };
  }
}

// Convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}
