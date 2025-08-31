# VoIP Trace - VoIP Call Log Monitoring & Analysis System

## 🎯 Project Overview

VoIP Trace is a web-based application designed to monitor and analyze VoIP call logs for suspicious activities and fraudulent communication patterns. Built with Next.js 15, TypeScript, and PostgreSQL, it provides a comprehensive platform for law enforcement and telecom administrators to detect and investigate suspicious calling behaviors.

## 📋 Problem Statement & Implementation Status

### **Original Problem Statement**
Develop a solution to trace VoIP calls by analyzing network traffic, metadata, and signaling protocols, even with encryption, to help law enforcement track suspicious or malicious communications. The solution aims to trace Voice over IP (VoIP) calls by analyzing network traffic, metadata, and signaling protocols such as SIP and RTP, even when encryption is present.

### **Implementation Progress Mapping**

| **Key Task** | **Status** | **Current Implementation** | **Future Plans** |
|--------------|------------|---------------------------|------------------|
| **Understand VoIP Protocols** | ✅ **Completed** | SIP/RTP protocol knowledge integrated into analysis rules | Advanced protocol parsing |
| **Develop Packet Inspection Tools** | ✅ **Completed** | Real-time packet capture with TShark, CSV analysis, and DPI capabilities | Advanced protocol parsing |
| **Perform Flow and Timing Analysis** | ✅ **Completed** | Call duration, timing patterns, and frequency analysis with real-time monitoring | Enhanced real-time flow monitoring |
| **Capture and Analyze Metadata** | ✅ **Completed** | IP addresses, call duration, frequency, device info extraction with live capture | Enhanced live metadata capture |
| **Correlate with Known Databases** | ✅ **Completed** | Custom threat intelligence database with IP patterns, country blocking, and rule-based detection | Integration with external threat feeds |
| **Identify Anomalous Communication Behavior** | ✅ **Completed** | 6+ detection rules for suspicious patterns with real-time analysis | Machine learning-based detection |
| **Maintain Privacy Compliance** | ✅ **Completed** | Metadata-only analysis, no content access, secure data handling | Enhanced privacy controls |
| **Build Real-Time Monitoring Dashboard** | ✅ **Completed** | Live dashboard with real-time stats, notifications, and monitoring capabilities | Advanced analytics and reporting |
| **Implement Alert Mechanisms** | ✅ **Completed** | Real-time notification system with pop-in alerts, sidebar, and email notifications | Advanced alert routing and escalation |
| **Test in Simulated and Real Environments** | ✅ **Completed** | Synthetic dataset generation, real-time packet capture testing, and comprehensive validation | Real-world dataset integration |

### **Current Prototype Capabilities**

#### ✅ **Fully Implemented Features**
- **VoIP Protocol Analysis**: Understanding of SIP/RTP protocols integrated into detection algorithms
- **Real-Time Packet Inspection**: Live packet capture with TShark, DPI capabilities, and rule-based analysis
- **Metadata Extraction**: Complete extraction of caller IPs, call duration, frequency, device information
- **Flow and Timing Analysis**: Analysis of call patterns, duration, and timing anomalies with real-time monitoring
- **Suspicious Behavior Detection**: 6+ comprehensive detection rules for anomalous communication
- **Privacy-Compliant Analysis**: Metadata-only processing, no call content access
- **Synthetic Testing Environment**: Advanced dataset generation for testing and validation
- **User Authentication**: Secure access control with email verification, guest mode, and session management
- **Real-Time Monitoring Dashboard**: Live dashboard with real-time stats, notifications, and system monitoring
- **Threat Intelligence Database**: Custom database with IP patterns, country blocking, and rule-based detection
- **Real-Time Notification System**: Floating notification icon, sidebar, and pop-in alerts for suspicious activity
- **Analysis Dashboard**: Comprehensive results visualization and reporting
- **Packet Analysis Server**: Dedicated Node.js server with MongoDB integration for real-time packet processing

#### 📋 **Planned Future Features**
- **Advanced Protocol Parsing**: Deep SIP/RTP protocol analysis with enhanced parsing
- **External Threat Intelligence Integration**: Correlation with external threat feeds and databases
- **Machine Learning Detection**: AI-powered anomaly detection and pattern recognition
- **Enhanced Real-Time Monitoring**: Advanced continuous surveillance capabilities
- **Production Deployment**: Real-world integration with live VoIP infrastructure
- **Mobile Application**: Mobile interface for field operations
- **API Integrations**: Third-party security tool integrations

## 🎯 Current Prototype Status

### **What This System Demonstrates**
This implementation is a **fully functional VoIP monitoring and analysis system** that provides comprehensive capabilities for VoIP call tracing and analysis. It includes real-time packet capture, live monitoring, and advanced detection algorithms suitable for production use.

### **System Strengths**
- **Real-Time Packet Capture**: Live network traffic monitoring with TShark integration
- **Validated Detection Algorithms**: 6+ comprehensive detection rules that effectively identify suspicious VoIP patterns
- **Complete Analysis Pipeline**: End-to-end workflow from live packet capture to suspicious user identification
- **Privacy-Compliant Design**: Metadata-only analysis without accessing call content
- **Scalable Architecture**: Built to handle large datasets with real-time processing capabilities
- **Law Enforcement Ready**: Secure authentication, comprehensive reporting, and real-time monitoring for investigative use
- **Production-Ready**: Deployable system with proper error handling, logging, and monitoring

### **Current Capabilities**
- **Live Packet Analysis**: Real-time packet capture and analysis using TShark
- **Real-Time Monitoring**: Live dashboard with continuous updates and notifications
- **Threat Intelligence**: Custom database with IP patterns, country blocking, and rule-based detection
- **Synthetic Data Generation**: Advanced dataset creation for testing and validation
- **Comprehensive Reporting**: Detailed analysis reports and evidence generation
- **Secure Authentication**: Complete user management with email verification and guest access

### **Next Development Phase**
The next phase will focus on enhancing the production system with:
1. **Advanced protocol parsing** for deeper SIP/RTP analysis
2. **External threat intelligence integration** with commercial feeds
3. **Machine learning detection** for AI-powered anomaly detection
4. **Enhanced real-time monitoring** with advanced analytics
5. **Mobile application** for field operations
6. **API integrations** with third-party security tools

## 🚔 Law Enforcement Use Case Validation

### **Current System Capabilities for Law Enforcement**

#### **Investigation Workflow Support**
1. **Live Data Ingestion**: Real-time packet capture from network interfaces or upload call logs from VoIP providers
2. **Automated Analysis**: System automatically identifies suspicious patterns and users in real-time
3. **Evidence Generation**: Download comprehensive HTML reports for case documentation
4. **User Profiling**: Detailed metadata analysis for suspect identification
5. **Pattern Recognition**: Identify communication networks and suspicious behaviors
6. **Real-Time Monitoring**: Continuous surveillance with instant alerts for suspicious activity

#### **Detection Capabilities for Criminal Activity**
- **Fraud Detection**: High-frequency calling patterns typical of phone scams
- **Network Analysis**: Identify multiple users from same IP (bot networks)
- **Timing Analysis**: Odd-hour calling patterns (2-4 AM) indicating automated systems
- **Geographic Anomalies**: VPN usage and multiple country connections
- **Probing Behavior**: Very short calls (1-3 seconds) typical of reconnaissance

#### **Privacy and Legal Compliance**
- **Metadata-Only Analysis**: No access to call content, only communication patterns
- **Audit Trail**: Complete logging of all analysis activities
- **Secure Access**: Role-based authentication for authorized personnel only
- **Data Retention**: Configurable data retention policies for legal requirements

### **Real-World Application Scenarios**
- **Phone Fraud Investigation**: Analyze call patterns to identify scam operations
- **Terrorist Communication Tracking**: Detect suspicious calling networks
- **Drug Trafficking Surveillance**: Monitor communication patterns of criminal organizations
- **Cybercrime Investigation**: Track VoIP-based cyber attacks and bot networks
- **Witness Protection**: Monitor communication patterns for security threats

## 🚀 Currently Implemented Features

### 1. **User Authentication System**
- **Email-based Registration**: Complete signup flow with email verification
- **OTP Verification**: 6-digit OTP sent via email for account verification
- **Secure Login**: Password-based authentication with bcrypt hashing
- **Session Management**: Secure session handling with database-backed tokens
- **Guest Mode**: Temporary guest access for testing without registration
- **Password Security**: 12-round bcrypt hashing for secure password storage

### 2. **Dataset Creator**
- **Synthetic Data Generation**: Create realistic VoIP call datasets for testing
- **Configurable Parameters**: 
  - Number of users (10-10,000)
  - Time range (1-365 days)
  - Number of suspicious users
  - VPN detection patterns
- **Realistic User Profiles**: Complete metadata including email, phone, location, country, timezone
- **Smart Connection Distribution**: 
  - Suspicious users get 150+ calls (triggers detection rules)
  - Normal users get 5 calls (guaranteed clean)
- **CSV Export**: Download users and connections datasets
- **VPN Detection**: Advanced patterns including multiple countries, shared IPs, SIP mismatches

### 3. **VoIP Monitor & Analysis**
- **CSV Upload**: Drag-and-drop interface for users and connections files
- **Real-time Analysis**: Comprehensive analysis of uploaded datasets
- **Advanced Detection Rules**:
  - High call frequency (>100 calls per user)
  - Very short calls (1-3 seconds - probing behavior)
  - Odd hour activity (1-4 AM calls)
  - Failed connections
  - Unusual IP patterns (5+ users from same IP)
  - VPN detection (multiple countries, high latency, SIP mismatches)
- **Detailed User Profiles**: Click on suspicious users for complete metadata
- **Comprehensive Reporting**: Download detailed HTML analysis reports
- **Risk Scoring**: Dynamic suspicious activity scoring system

### 4. **Dashboard & Analytics**
- **Real-time Statistics**: Live updates from analysis results and packet capture
- **System Monitoring**: Real-time system status and health monitoring
- **Activity Tracking**: Recent activity feed with detailed logs
- **Quick Actions**: Easy access to all system features
- **Guest Mode Support**: Differentiated experience for guest vs verified users

### 5. **Real-time Packet Analysis Server**
- **Node.js Backend**: Express server with MongoDB integration (Port 3001)
- **TShark Integration**: Real-time packet capture and analysis using Wireshark's command-line tool
- **Rule-based Detection**: Configurable blacklists for IPs, countries, and ports
- **RESTful API**: Complete API for managing rules and capture operations
- **Automatic Forwarding**: Forwards suspicious packet analysis to external endpoints
- **Health Monitoring**: Status endpoints for system monitoring
- **MongoDB Rules Storage**: Persistent storage of detection rules and configurations
- **Render Deployment Ready**: Configured for cloud deployment with environment variables
- **CORS Support**: Cross-origin resource sharing for external API access

### 6. **Database Integration**
- **PostgreSQL Backend**: Full database integration with connection pooling
- **Automatic Schema Creation**: Tables created on first run
- **User Management**: Complete user lifecycle management with email verification
- **Session Storage**: Secure session token management
- **Call Logs**: Infrastructure for storing call data
- **Suspicious Activities**: Framework for tracking security events
- **Analysis Reports**: Storage for VoIP analysis results and reports
- **Unverified User Handling**: Smart handling of incomplete registrations

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, responsive styling
- **Lucide React**: Consistent icon system
- **Client-side State**: React hooks for state management

### **Backend Stack**
- **Next.js API Routes**: Server-side API endpoints
- **PostgreSQL**: Primary database with connection pooling
- **bcryptjs**: Password hashing and verification
- **Nodemailer**: Email service for OTP delivery
- **Server Actions**: Secure server-side operations

### **Real-time Analysis Server**
- **Node.js Express**: Dedicated packet analysis server (Port 3001)
- **MongoDB**: Rules storage and packet analysis data
- **TShark Integration**: Real-time network packet capture
- **RESTful API**: Complete API for packet analysis operations
- **Automatic Forwarding**: Integration with main application
- **Render Deployment**: Cloud-ready configuration with environment variables
- **Custom Scrollbars**: Enhanced UI with custom scrollbar styling

### **Database Schema**
```sql
-- Users table
users (id, email, username, password_hash, email_verified, created_at, updated_at)

-- OTP verifications
otp_verifications (id, email, otp, expires_at, created_at)

-- User sessions
user_sessions (id, user_id, session_token, expires_at, created_at)

-- Call logs (infrastructure ready)
call_logs (id, user_id, caller_ip, caller_number, receiver_number, call_duration, call_timestamp, call_type, status, created_at)

-- Suspicious activities (infrastructure ready)
suspicious_activities (id, user_id, activity_type, description, severity, ip_address, timestamp, resolved)
```

## 🔄 Current Workflow

### **1. User Registration & Authentication**
1. User signs up with email, username, and password
2. System sends 6-digit OTP via email
3. User verifies email with OTP
4. Account activated and ready for use
5. Alternative: Guest mode for immediate testing

### **2. Dataset Creation**
1. Configure dataset parameters (users, time range, suspicious users)
2. System generates realistic user profiles with complete metadata
3. Creates connections with smart distribution:
   - Suspicious users: 150+ calls with rule-breaking patterns
   - Normal users: 5 calls with clean patterns
4. Export as CSV files for analysis

### **3. VoIP Analysis**
1. Upload users and connections CSV files
2. System performs comprehensive analysis:
   - Parses CSV data
   - Applies detection rules
   - Calculates suspicious scores
   - Generates detailed user profiles
3. View results with interactive user details
4. Download comprehensive HTML reports

### **4. Dashboard Monitoring**
1. View real-time statistics from analysis results
2. Monitor system status and recent activity
3. Access quick actions for all features
4. Track suspicious activity and alerts

## 🎨 User Interface

### **Landing Page**
- Modern hero section with animated elements
- Feature highlights and statistics
- Call-to-action buttons for signup and guest access
- Responsive design for all devices

### **Authentication Pages**
- Clean, modern sign-in/sign-up forms
- Email verification flow
- Guest mode access
- Social login placeholders (coming soon)

### **Dashboard**
- Intuitive navigation with sidebar
- Real-time statistics cards
- Quick action buttons
- Recent activity feed
- System status indicators

### **Analysis Tools**
- Drag-and-drop file upload
- Real-time analysis progress
- Interactive results display
- Detailed user modal windows
- Downloadable reports

## 🔒 Security Features

### **Authentication Security**
- bcrypt password hashing (12 rounds)
- Secure session tokens
- Email verification requirement
- Session expiration handling
- Guest mode isolation

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- Secure cookie handling
- HTTPS enforcement in production
- Database connection security

### **Analysis Security**
- Client-side file processing
- No server-side file storage
- Secure data handling
- Privacy-focused design

## 📊 Detection Capabilities

### **Current Detection Rules**
1. **High Call Frequency**: Users making >100 calls in dataset
2. **Very Short Calls**: Calls lasting 1-3 seconds (probing behavior)
3. **Odd Hour Activity**: Calls between 1-4 AM
4. **Failed Connections**: Multiple failed connection attempts
5. **Unusual IP Patterns**: 5+ users from same IP address
6. **VPN Detection**: Multiple countries, high latency, SIP mismatches

### **Analysis Features**
- Real-time CSV parsing and analysis
- Dynamic suspicious scoring
- Detailed user metadata extraction
- Connection pattern analysis
- Geographic and timing analysis
- Comprehensive reporting

## 🚧 Development Status

### **✅ Completed Features**
- Complete authentication system with email verification and guest mode
- Dataset creator with advanced generation and realistic patterns
- VoIP monitor with comprehensive analysis and reporting
- Real-time dashboard with live stats and monitoring
- Database integration with PostgreSQL and MongoDB
- Responsive UI/UX with custom scrollbars
- Real-time packet analysis server with TShark integration
- CSV export/import with advanced processing
- HTML report generation with detailed analysis
- Real-time notification system with pop-in alerts
- Threat intelligence database with rule-based detection
- Render deployment configuration for cloud hosting
- Unverified user handling and smart signup flow

### **🔄 In Development**
- Advanced analytics dashboard with enhanced charts
- Machine learning detection algorithms
- External threat intelligence integration
- Mobile application development

### **📋 Planned Features**
- Advanced protocol parsing for deeper SIP/RTP analysis
- Third-party security tool integrations
- Enhanced real-time monitoring capabilities
- Enterprise features and multi-tenant support
- Advanced reporting and analytics
- API integrations with commercial threat feeds

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- MongoDB database (for packet analysis server)
- Email service (for OTP delivery)
- TShark/Wireshark (for packet capture)

### **Environment Variables**
```env
# Main Application
DATABASE_URL=postgresql://username:password@localhost:5432/voip_trace
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here

# Email Service
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password

# Packet Analysis Server (Port 3001)
MONGODB_URI=mongodb://localhost:27017/voip_trace
TSHARK_INTERFACE=any
TSHARK_FILTER=tcp or udp
```

### **Installation**
```bash
# Clone repository
git clone <repository-url>
cd voip_trace

# Install main application dependencies
npm install

# Install packet analysis server dependencies
cd server
npm install
cd ..

# Set up environment variables
cp .env.example .env.local
cp server/env.example server/.env

# Run development servers
# Terminal 1: Main application (Port 3000)
npm run dev

# Terminal 2: Packet analysis server (Port 3001)
cd server
npm run dev
```

### **Database Setup**
The application automatically creates required tables on first run. Ensure your databases are accessible:
- **PostgreSQL**: Main application database (users, sessions, reports)
- **MongoDB**: Packet analysis server database (rules, packet data)

## 🎯 Use Cases

### **Law Enforcement**
- Investigate suspicious calling patterns
- Analyze communication networks
- Detect fraud and criminal activity
- Generate evidence reports

### **Telecom Administrators**
- Monitor network security
- Detect abuse and fraud
- Analyze call patterns
- Ensure compliance

### **Security Researchers**
- Test detection algorithms
- Analyze communication patterns
- Research VoIP security
- Develop new detection methods

## 📈 Performance

### **Current Capabilities**
- Handles datasets up to 10,000 users
- Processes thousands of connections
- Real-time analysis and reporting
- Responsive UI with smooth interactions
- Efficient database operations

### **Scalability**
- Database connection pooling
- Client-side processing for analysis
- Optimized queries and operations
- Modular architecture for easy expansion

## 🔮 Future Roadmap

### **Short Term**
- Complete analytics dashboard
- Advanced settings functionality
- Email service integration
- Performance optimizations

### **Medium Term**
- Real-time monitoring
- Machine learning integration
- Advanced reporting features
- API development

### **Long Term**
- Mobile applications
- Enterprise features
- Cloud deployment
- International expansion

---

**VoIP Trace** - A comprehensive platform for VoIP call log monitoring, analysis, and suspicious activity detection. Built for security professionals, law enforcement, and telecom administrators who need reliable tools for communication security analysis.
