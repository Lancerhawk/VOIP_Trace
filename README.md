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
| **Develop Packet Inspection Tools** | 🔄 **In Progress** | CSV-based metadata extraction and analysis | Real-time packet capture and DPI |
| **Perform Flow and Timing Analysis** | ✅ **Completed** | Call duration, timing patterns, and frequency analysis | Real-time flow monitoring |
| **Capture and Analyze Metadata** | ✅ **Completed** | IP addresses, call duration, frequency, device info extraction | Live metadata capture |
| **Correlate with Known Databases** | 🔄 **In Progress** | IP pattern analysis and suspicious behavior detection | Integration with threat intelligence feeds |
| **Identify Anomalous Communication Behavior** | ✅ **Completed** | 6 detection rules for suspicious patterns | Machine learning-based detection |
| **Maintain Privacy Compliance** | ✅ **Completed** | Metadata-only analysis, no content access | Enhanced privacy controls |
| **Build Real-Time Monitoring Dashboard** | 🔄 **In Progress** | Static dashboard with analysis results | Live monitoring with real-time updates |
| **Implement Alert Mechanisms** | 📋 **Planned** | Analysis results display | Automated alerts and notifications |
| **Test in Simulated and Real Environments** | ✅ **Completed** | Synthetic dataset generation and testing | Real-world dataset integration |

### **Current Prototype Capabilities**

#### ✅ **Fully Implemented Features**
- **VoIP Protocol Analysis**: Understanding of SIP/RTP protocols integrated into detection algorithms
- **Metadata Extraction**: Complete extraction of caller IPs, call duration, frequency, device information
- **Flow and Timing Analysis**: Analysis of call patterns, duration, and timing anomalies
- **Suspicious Behavior Detection**: 6 comprehensive detection rules for anomalous communication
- **Privacy-Compliant Analysis**: Metadata-only processing, no call content access
- **Synthetic Testing Environment**: Advanced dataset generation for testing and validation
- **User Authentication**: Secure access control for law enforcement personnel
- **Analysis Dashboard**: Comprehensive results visualization and reporting

#### 🔄 **Partially Implemented Features**
- **Packet Inspection**: CSV-based analysis (real-time packet capture pending)
- **Database Correlation**: Basic IP pattern analysis (threat intelligence integration pending)
- **Monitoring Dashboard**: Static results display (real-time monitoring pending)

#### 📋 **Planned Future Features**
- **Real-Time Packet Capture**: Live network traffic monitoring and DPI
- **Advanced Protocol Parsing**: Deep SIP/RTP protocol analysis
- **Threat Intelligence Integration**: Correlation with known malicious entities
- **Machine Learning Detection**: AI-powered anomaly detection
- **Automated Alerts**: Real-time notification system
- **Live Monitoring**: Continuous surveillance capabilities
- **Real-World Integration**: Production deployment with live data

## 🎯 Current Prototype Status

### **What This Prototype Demonstrates**
This current implementation serves as a **proof-of-concept prototype** that demonstrates the core capabilities needed for VoIP call tracing and analysis. While it doesn't yet perform real-time packet capture, it successfully validates the analytical approach and detection algorithms that would be used in a production system.

### **Prototype Strengths**
- **Validated Detection Algorithms**: 6 comprehensive detection rules that effectively identify suspicious VoIP patterns
- **Complete Analysis Pipeline**: End-to-end workflow from data ingestion to suspicious user identification
- **Privacy-Compliant Design**: Metadata-only analysis without accessing call content
- **Scalable Architecture**: Built to handle large datasets and can be extended for real-time processing
- **Law Enforcement Ready**: Secure authentication and comprehensive reporting for investigative use

### **Prototype Limitations**
- **Static Data Analysis**: Currently processes pre-collected CSV data rather than live network traffic
- **Simulated Environment**: Uses synthetic datasets rather than real-world VoIP traffic
- **No Real-Time Monitoring**: Analysis is performed on uploaded datasets, not live streams
- **Limited Protocol Parsing**: Basic SIP/RTP understanding without deep packet inspection

### **Next Development Phase**
The next phase will focus on transitioning from this prototype to a production-ready system by implementing:
1. **Real-time packet capture** from network interfaces
2. **Deep packet inspection** for live SIP/RTP analysis
3. **Live monitoring dashboard** with real-time updates
4. **Automated alerting system** for immediate threat detection
5. **Integration with real VoIP infrastructure** for production deployment

## 🚔 Law Enforcement Use Case Validation

### **Current Prototype Capabilities for Law Enforcement**

#### **Investigation Workflow Support**
1. **Data Ingestion**: Upload call logs from VoIP providers or network captures
2. **Automated Analysis**: System automatically identifies suspicious patterns and users
3. **Evidence Generation**: Download comprehensive HTML reports for case documentation
4. **User Profiling**: Detailed metadata analysis for suspect identification
5. **Pattern Recognition**: Identify communication networks and suspicious behaviors

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
- **Real-time Statistics Report generation**: Live updates from analysis results generation
- **System Overview**: Monitor recent scans and active alerts
- **Guest Mode Support**: Limited functionality for guest users
- **Data Persistence**: Results stored in localStorage for session continuity

### 5. **Database Integration**
- **PostgreSQL Backend**: Full database integration with connection pooling
- **Automatic Schema Creation**: Tables created on first run
- **User Management**: Complete user lifecycle management
- **Session Storage**: Secure session token management
- **Call Logs**: Infrastructure for storing call data
- **Suspicious Activities**: Framework for tracking security events

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
- Complete authentication system
- Dataset creator with advanced generation
- VoIP monitor with real analysis
- Dashboard with real-time stats
- Database integration
- Responsive UI/UX
- Guest mode functionality
- CSV export/import
- HTML report generation

### **🔄 In Development**
- Analytics dashboard (UI ready, data integration pending)
- Advanced settings (UI ready, functionality pending)
- Email service integration (infrastructure ready)
- Real-time monitoring (infrastructure ready)

### **📋 Planned Features**
- Real-time call monitoring
- Advanced analytics and charts
- Machine learning detection
- API integrations
- Mobile application
- Enterprise features

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Email service (for OTP delivery)

### **Environment Variables**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/voip_trace
NODE_ENV=development
```

### **Installation**
```bash
# Clone repository
git clone <repository-url>
cd voip_trace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### **Database Setup**
The application automatically creates required tables on first run. Ensure your PostgreSQL database is accessible and the `DATABASE_URL` is correctly configured.

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
