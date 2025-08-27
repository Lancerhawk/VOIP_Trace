import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Track if database has been initialized
let isDatabaseInitialized = false;

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create users table
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

    // Create otp_verifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create call_logs table
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

    // Create suspicious_activities table
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

    // Create user_sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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

// Ensure database is initialized before any operation
const ensureDatabaseInitialized = async () => {
  if (!isDatabaseInitialized) {
    await initializeDatabase();
  }
};

// Test database connection
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

// User operations
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

// OTP operations
export const createOTP = async (email: string, otp: string, expiresAt: Date) => {
  await ensureDatabaseInitialized();
  try {
    // Delete existing OTP for this email
    await pool.query('DELETE FROM otp_verifications WHERE email = $1', [email]);
    
    // Create new OTP
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
      // Delete the used OTP
      await pool.query('DELETE FROM otp_verifications WHERE email = $1 AND otp = $2', [email, otp]);
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

// Session operations
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

// User operations
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

// Call log operations
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

// Suspicious activity operations
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

export default pool;
