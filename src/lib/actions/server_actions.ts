'use server';

import { testConnection } from '../postgresql';

// Test database connection
export async function testDatabaseConnectionAction() {
  try {
    const success = await testConnection();
    if (success) {
      return { success: true, message: 'Database connection successful' };
    } else {
      return { success: false, error: 'Database connection failed' };
    }
  } catch (error) {
    console.error('Database connection test error:', error);
    return { success: false, error: 'Database connection test failed' };
  }
}

// Health check action
export async function healthCheckAction() {
  try {
    const dbConnection = await testConnection();
    
    return {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbConnection ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
    };
  } catch (error) {
    console.error('Health check error:', error);
    return {
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    };
  }
}
