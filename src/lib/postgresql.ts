import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

let isDatabaseInitialized = false;

const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS call_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        caller_ip VARCHAR(45),
        caller_number VARCHAR(50),
        receiver_number VARCHAR(50),
        call_duration INTEGER,
        call_timestamp TIMESTAMP,
        call_type VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS suspicious_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        activity_type VARCHAR(100),
        description TEXT,
        severity VARCHAR(20),
        ip_address VARCHAR(45),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved BOOLEAN DEFAULT FALSE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS voip_analysis_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        report_name VARCHAR(255) NOT NULL,
        total_users INTEGER NOT NULL,
        total_connections INTEGER NOT NULL,
        suspicious_users INTEGER NOT NULL,
        suspicious_connections INTEGER NOT NULL,
        vpn_users INTEGER DEFAULT 0,
        blocked_country_users INTEGER DEFAULT 0,
        analysis_data JSONB NOT NULL,
        uploaded_files JSONB,
        html_report TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      ALTER TABLE voip_analysis_reports 
      ADD COLUMN IF NOT EXISTS uploaded_files JSONB;
    `);

    await client.query(`
      ALTER TABLE voip_analysis_reports 
      ADD COLUMN IF NOT EXISTS html_report TEXT;
    `);

    client.release();
    console.log('✅ Database tables initialized successfully');
    isDatabaseInitialized = true;
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};

const ensureDatabaseInitialized = async () => {
  if (!isDatabaseInitialized) {
    await initializeDatabase();
  }
};

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export const createUser = async (email: string, username: string, passwordHash: string) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
      [email, username, passwordHash]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getUserByUsername = async (username: string) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteUnverifiedUser = async (email: string) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE email = $1 AND email_verified = FALSE RETURNING id',
      [email]
    );
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

export const updateEmailVerification = async (userId: number) => {
  await ensureDatabaseInitialized();
  try {
    await pool.query(
      'UPDATE users SET email_verified = TRUE WHERE id = $1',
      [userId]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

export const createOTP = async (email: string, otp: string, expiresAt: Date) => {
  await ensureDatabaseInitialized();
  try {
    await pool.query('DELETE FROM otp_verifications WHERE email = $1', [email]);
    
    const result = await pool.query(
      'INSERT INTO otp_verifications (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING id',
      [email, otp, expiresAt]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM otp_verifications WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
      [email, otp]
    );
    
    if (result.rows.length > 0) {
      await pool.query('DELETE FROM otp_verifications WHERE email = $1 AND otp = $2', [email, otp]);
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

export const createSession = async (userId: number, sessionToken: string, expiresAt: Date) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3) RETURNING id',
      [userId, sessionToken, expiresAt]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getSession = async (sessionToken: string) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM user_sessions WHERE session_token = $1 AND expires_at > NOW()',
      [sessionToken]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getSessionByToken = async (sessionToken: string) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM user_sessions WHERE session_token = $1',
      [sessionToken]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteSession = async (sessionToken: string) => {
  await ensureDatabaseInitialized();
  try {
    await pool.query('DELETE FROM user_sessions WHERE session_token = $1', [sessionToken]);
    return true;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: number) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT id, email, username, email_verified, created_at FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const createCallLog = async (userId: number, callData: any) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      `INSERT INTO call_logs (user_id, caller_ip, caller_number, receiver_number, call_duration, call_timestamp, call_type, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId, callData.caller_ip, callData.caller_number, callData.receiver_number, callData.call_duration, callData.call_timestamp, callData.call_type, callData.status]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getCallLogs = async (userId: number, limit: number = 100) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM call_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const createSuspiciousActivity = async (userId: number, activityData: any) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      `INSERT INTO suspicious_activities (user_id, activity_type, description, severity, ip_address) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, activityData.activity_type, activityData.description, activityData.severity, activityData.ip_address]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getSuspiciousActivities = async (userId: number, limit: number = 50) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM suspicious_activities WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const createVoipAnalysisReport = async (userId: number, reportData: any) => {
  await ensureDatabaseInitialized();
  try {
    let result;
    try {
      result = await pool.query(
        `INSERT INTO voip_analysis_reports (user_id, report_name, total_users, total_connections, suspicious_users, suspicious_connections, vpn_users, blocked_country_users, analysis_data, uploaded_files, html_report) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, created_at`,
        [
          userId, 
          reportData.report_name, 
          reportData.total_users, 
          reportData.total_connections, 
          reportData.suspicious_users, 
          reportData.suspicious_connections,
          reportData.vpn_users || 0,
          reportData.blocked_country_users || 0,
          JSON.stringify(reportData.analysis_data),
          reportData.uploaded_files ? JSON.stringify(reportData.uploaded_files) : null,
          reportData.html_report || null
        ]
      );
    } catch (columnError) {
      console.log('Some columns not found, using fallback insert');
      result = await pool.query(
        `INSERT INTO voip_analysis_reports (user_id, report_name, total_users, total_connections, suspicious_users, suspicious_connections, vpn_users, blocked_country_users, analysis_data) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at`,
        [
          userId, 
          reportData.report_name, 
          reportData.total_users, 
          reportData.total_connections, 
          reportData.suspicious_users, 
          reportData.suspicious_connections,
          reportData.vpn_users || 0,
          reportData.blocked_country_users || 0,
          JSON.stringify(reportData.analysis_data)
        ]
      );
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error in createVoipAnalysisReport:', error);
    throw error;
  }
};

export const getVoipAnalysisReports = async (userId: number, limit: number = 50) => {
  await ensureDatabaseInitialized();
  try {
    let result;
    try {
      result = await pool.query(
        'SELECT id, report_name, total_users, total_connections, suspicious_users, suspicious_connections, vpn_users, blocked_country_users, uploaded_files, created_at FROM voip_analysis_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );
    } catch (columnError) {
      console.log('uploaded_files column not found, using fallback query');
      result = await pool.query(
        'SELECT id, report_name, total_users, total_connections, suspicious_users, suspicious_connections, vpn_users, blocked_country_users, created_at FROM voip_analysis_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );
    }
    
    const reports = result.rows.map(report => {
      if (report.uploaded_files && typeof report.uploaded_files === 'string') {
        try {
          report.uploaded_files = JSON.parse(report.uploaded_files);
        } catch (parseError) {
          console.log('Error parsing uploaded_files JSON:', parseError);
          report.uploaded_files = null;
        }
      }
      return report;
    });
    
    return reports;
  } catch (error) {
    console.error('Error in getVoipAnalysisReports:', error);
    throw error;
  }
};

export const getVoipAnalysisReportById = async (reportId: number, userId: number) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'SELECT * FROM voip_analysis_reports WHERE id = $1 AND user_id = $2',
      [reportId, userId]
    );
    if (result.rows.length > 0) {
      const report = result.rows[0];
      
      if (typeof report.analysis_data === 'string') {
        try {
          report.analysis_data = JSON.parse(report.analysis_data);
        } catch (parseError) {
          console.log('Error parsing analysis_data JSON:', parseError);
        }
      }
      
      if (report.uploaded_files && typeof report.uploaded_files === 'string') {
        try {
          report.uploaded_files = JSON.parse(report.uploaded_files);
        } catch (parseError) {
          console.log('Error parsing uploaded_files JSON:', parseError);
          report.uploaded_files = null;
        }
      }
      
      return report;
    }
    return null;
  } catch (error) {
    console.error('Error in getVoipAnalysisReportById:', error);
    throw error;
  }
};

export const deleteVoipAnalysisReport = async (reportId: number, userId: number) => {
  await ensureDatabaseInitialized();
  try {
    const result = await pool.query(
      'DELETE FROM voip_analysis_reports WHERE id = $1 AND user_id = $2 RETURNING id',
      [reportId, userId]
    );
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

export default pool;