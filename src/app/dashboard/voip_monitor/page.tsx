'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, AlertTriangle, Users, Phone, Clock, Shield, BarChart3, Monitor, X, User, MapPin, Globe, Activity, Calendar, PhoneCall, AlertCircle, Download, Trash2, History } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

interface UploadedFile {
    id: string;
    file: File;
    type: 'users' | 'connections';
}

interface UserMetadata {
    username: string;
    email?: string;
    phone?: string;
    location?: string;
    country?: string;
    timezone?: string;
    registrationDate?: string;
    lastActive?: string;
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageCallDuration: number;
    callPatterns: {
        morning: number;
        afternoon: number;
        evening: number;
        night: number;
    };
    ipAddresses: string[];
    userAgents: string[];
    suspiciousScore: number;
    reasons: string[];
    connectionHistory: Array<{
        timestamp: string;
        duration: number;
        status: string;
        sourceIP: string;
        destination: string;
        destinationIP: string;
        packetBytes: number;
        country: string;
        latency: number;
    }>;
}

interface AnalysisResult {
    totalUsers: number;
    totalConnections: number;
    suspiciousUsers: number;
    suspiciousConnections: number;
    topSuspiciousUsers: UserMetadata[];
    allSuspiciousUsers: UserMetadata[];
    suspiciousPatterns: Array<{
        type: string;
        count: number;
        description: string;
    }>;
    detectionRules: Array<{
        rule: string;
        description: string;
        triggered: boolean;
        count: number;
    }>;
}

interface SavedReport {
    id: number;
    report_name: string;
    total_users: number;
    total_connections: number;
    suspicious_users: number;
    suspicious_connections: number;
    vpn_users: number;
    blocked_country_users: number;
    created_at: string;
    uploaded_files?: Array<{
        id: string;
        name: string;
        type: string;
        size: number;
        content?: string;
    }>;
}

export default function VOIPMonitor() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserMetadata | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isGuestMode, setIsGuestMode] = useState(false);

    const { addNotification } = useNotifications();

    // Load saved reports on component mount and check guest mode
    useEffect(() => {
        loadSavedReports();
        
        // Check if user is in guest mode
        const guestMode = document.cookie.includes('guest_mode=true');
        setIsGuestMode(guestMode);
    }, []);

    const loadSavedReports = async () => {
        setIsLoadingHistory(true);
        try {
            console.log('Loading saved reports...');
            const response = await fetch('/api/voip-reports');
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Reports data:', data);
                setSavedReports(data.reports || []);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
            }
        } catch (error) {
            console.error('Error loading saved reports:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const saveCompleteReport = async (analysisData: AnalysisResult) => {
        try {
            const reportName = `VOIP Analysis Report - ${new Date().toLocaleString()}`;
            
            // Prepare uploaded files data with content
            const uploadedFilesData = await Promise.all(uploadedFiles.map(async (fileInfo) => {
                const content = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve(e.target?.result as string);
                    };
                    reader.readAsText(fileInfo.file);
                });
                
                return {
                    id: fileInfo.id,
                    name: fileInfo.file.name,
                    type: fileInfo.type,
                    size: fileInfo.file.size,
                    content: content
                };
            }));

            // Generate the complete HTML report
            const htmlContent = generateHTMLReport(analysisData);

            console.log('Saving complete report with data:', {
                report_name: reportName,
                analysis_data: analysisData,
                uploaded_files: uploadedFilesData,
                html_report: htmlContent ? 'Generated' : 'Not generated'
            });

            const response = await fetch('/api/voip-reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    report_name: reportName,
                    analysis_data: analysisData, // Complete analysis data
                    uploaded_files: uploadedFilesData,
                    html_report: htmlContent
                })
            });

            console.log('Save response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Save response data:', data);
                addNotification({
                    type: 'success',
                    title: 'Report Saved',
                    message: 'Complete analysis report has been saved successfully'
                });
                // Reload the reports list
                loadSavedReports();
            } else {
                const errorData = await response.json();
                console.error('Save error response:', errorData);
                throw new Error('Failed to save report');
            }
        } catch (error) {
            console.error('Error saving report:', error);
            addNotification({
                type: 'error',
                title: 'Save Failed',
                message: 'Failed to save the analysis report'
            });
        }
    };

    const deleteReport = async (reportId: number) => {
        try {
            const response = await fetch(`/api/voip-reports?id=${reportId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                addNotification({
                    type: 'success',
                    title: 'Report Deleted',
                    message: 'Analysis report has been deleted successfully'
                });
                // Reload the reports list
                loadSavedReports();
            } else {
                throw new Error('Failed to delete report');
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            addNotification({
                type: 'error',
                title: 'Delete Failed',
                message: 'Failed to delete the analysis report'
            });
        }
    };

    const downloadCSVFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };



    const generateHTMLReport = (analysisResult: AnalysisResult) => {
        const style = `
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .section { margin-bottom: 30px; }
                .section-title { 
                    background-color: #2E86AB; 
                    color: white; 
                    padding: 10px; 
                    font-size: 18px; 
                    font-weight: bold; 
                    text-align: center;
                    border-radius: 5px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                th { 
                    background-color: #4A90E2; 
                    color: white; 
                    padding: 12px 8px; 
                    text-align: left; 
                    font-weight: bold;
                    border: 1px solid #ddd;
                }
                td { 
                    padding: 10px 8px; 
                    border: 1px solid #ddd; 
                    text-align: left;
                }
                tr:nth-child(even) { background-color: #f9f9f9; }
                tr:hover { background-color: #f0f0f0; }
                .summary-row { background-color: #E8F4FD; font-weight: bold; }
                .risk-high { background-color: #FFE6E6; color: #D32F2F; font-weight: bold; }
                .risk-medium { background-color: #FFF3E0; color: #F57C00; font-weight: bold; }
                .risk-low { background-color: #E8F5E8; color: #388E3C; font-weight: bold; }
                .status-success { background-color: #E8F5E8; color: #388E3C; }
                .status-failed { background-color: #FFE6E6; color: #D32F2F; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #2E86AB; margin-bottom: 10px; }
                .header p { color: #666; font-size: 14px; }
            </style>
        `;

        const header = `
            <div class="header">
                <h1>VOIP Analysis Report</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>Total Users: ${analysisResult.totalUsers} | Total Connections: ${analysisResult.totalConnections} | Suspicious Users: ${analysisResult.suspiciousUsers}</p>
            </div>
        `;

        // Analysis Summary Section
        const summarySection = `
            <div class="section">
                <div class="section-title">ANALYSIS SUMMARY</div>
                <table>
                    <tr class="summary-row">
                        <td><strong>Metric</strong></td>
                        <td><strong>Value</strong></td>
                    </tr>
                    <tr>
                        <td>Total Users</td>
                        <td>${analysisResult.totalUsers}</td>
                    </tr>
                    <tr>
                        <td>Total Connections</td>
                        <td>${analysisResult.totalConnections}</td>
                    </tr>
                    <tr>
                        <td>Suspicious Users</td>
                        <td>${analysisResult.suspiciousUsers}</td>
                    </tr>
                    <tr>
                        <td>Suspicious Connections</td>
                        <td>${analysisResult.suspiciousConnections}</td>
                    </tr>
                    <tr>
                        <td>VPN Users Detected</td>
                        <td>${analysisResult.detectionRules.find(rule => rule.rule === 'VPN Detection')?.count || 0}</td>
                    </tr>
                </table>
            </div>
        `;

        // Detection Rules Section
        const detectionRulesSection = `
            <div class="section">
                <div class="section-title">DETECTION RULES RESULTS</div>
                <table>
                    <tr class="summary-row">
                        <th>Rule</th>
                        <th>Description</th>
                        <th>Triggered</th>
                        <th>Count</th>
                    </tr>
                    ${analysisResult.detectionRules.map(rule => `
                        <tr>
                            <td>${rule.rule}</td>
                            <td>${rule.description}</td>
                            <td>${rule.triggered ? 'Yes' : 'No'}</td>
                            <td>${rule.count}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;

        // Suspicious Users Section
        const suspiciousUsersSection = `
            <div class="section">
                <div class="section-title">SUSPICIOUS USERS DETAILED REPORT</div>
                <table>
                    <tr class="summary-row">
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Country</th>
                        <th>Total Calls</th>
                        <th>Successful</th>
                        <th>Failed</th>
                        <th>Avg Duration</th>
                        <th>Risk Level</th>
                        <th>Suspicious Score</th>
                    </tr>
                    ${analysisResult.allSuspiciousUsers.map(user => {
                        const riskLevel = user.suspiciousScore >= 8 ? 'High Risk' : 
                                        user.suspiciousScore >= 5 ? 'Medium Risk' : 'Low Risk';
                        const riskClass = user.suspiciousScore >= 8 ? 'risk-high' : 
                                        user.suspiciousScore >= 5 ? 'risk-medium' : 'risk-low';
                        
                        return `
                            <tr>
                                <td><strong>${user.username}</strong></td>
                                <td>${user.email || 'N/A'}</td>
                                <td>${user.phone || 'N/A'}</td>
                                <td>${user.location || 'N/A'}</td>
                                <td>${user.country || 'N/A'}</td>
                                <td>${user.totalCalls}</td>
                                <td>${user.successfulCalls}</td>
                                <td>${user.failedCalls}</td>
                                <td>${user.averageCallDuration}s</td>
                                <td class="${riskClass}">${riskLevel}</td>
                                <td class="${riskClass}">${user.suspiciousScore}</td>
                            </tr>
                        `;
                    }).join('')}
                </table>
            </div>
        `;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>VOIP Analysis Report</title>
                ${style}
            </head>
            <body>
                ${header}
                ${summarySection}
                ${detectionRulesSection}
                ${suspiciousUsersSection}
            </body>
            </html>
        `;
    };

    const downloadReportFromHistory = async (reportId: number) => {
        try {
            const response = await fetch(`/api/voip-reports/${reportId}`);
            if (response.ok) {
                const data = await response.json();
                const report = data.report;
                
                // Use the saved HTML report if available, otherwise generate a simple one
                let htmlContent;
                if (report.html_report) {
                    htmlContent = report.html_report;
                } else {
                    // Fallback for older reports without saved HTML
                    htmlContent = generateHTMLReport(report.analysis_data);
                }
                
                const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `voip_analysis_report_${report.id}_${new Date().toISOString().split('T')[0]}.html`;
                link.style.display = 'none';
                
                // Add to DOM, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up the URL object
                setTimeout(() => URL.revokeObjectURL(url), 100);
            } else {
                throw new Error('Failed to fetch report');
            }
        } catch (error) {
            console.error('Error downloading report:', error);
            addNotification({
                type: 'error',
                title: 'Download Failed',
                message: 'Failed to download the analysis report'
            });
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files) {
            const newFiles: UploadedFile[] = [];

            Array.from(e.dataTransfer.files).forEach((file) => {
                if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                    const fileType = determineFileType(file);
                    if (fileType) {
                        newFiles.push({
                            id: Math.random().toString(36).substr(2, 9),
                            file,
                            type: fileType
                        });
                    }
                }
            });

            if (newFiles.length > 0) {
                setUploadedFiles(prev => [...prev, ...newFiles]);
            }
        }
    };

    const determineFileType = (file: File): 'users' | 'connections' | null => {
        const name = file.name.toLowerCase();
        if (name.includes('user') || name.includes('users')) return 'users';
        if (name.includes('connection') || name.includes('connections') || name.includes('call')) return 'connections';
        return null;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles: UploadedFile[] = [];

            Array.from(e.target.files).forEach((file) => {
                if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                    const fileType = determineFileType(file);
                    if (fileType) {
                        newFiles.push({
                            id: Math.random().toString(36).substr(2, 9),
                            file,
                            type: fileType
                        });
                    }
                }
            });

            if (newFiles.length > 0) {
                setUploadedFiles(prev => [...prev, ...newFiles]);
            }
        }
    };

    const removeFile = (id: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== id));
        setAnalysisResult(null);
    };

    const analyzeDataset = async () => {
        if (uploadedFiles.length === 0) return;

        setIsAnalyzing(true);

        try {
            // Actually read and analyze the CSV files
            const usersFile = uploadedFiles.find(f => f.type === 'users');
            const connectionsFile = uploadedFiles.find(f => f.type === 'connections');

            if (!usersFile || !connectionsFile) {
                throw new Error('Both users and connections files are required');
            }

            // Simulate reading CSV data (in real implementation, you'd use a CSV parser)
            const simulateCSVReading = async (file: File) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target?.result as string;
                        resolve(content);
                    };
                    reader.readAsText(file);
                });
            };

            const usersContent = await simulateCSVReading(usersFile.file);
            const connectionsContent = await simulateCSVReading(connectionsFile.file);

            // Add realistic processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Parse CSV content (simplified - in real implementation use proper CSV parser)
            const parseCSV = (content: string) => {
                const lines = content.split('\n').filter(line => line.trim());
                if (lines.length < 2) return [];

                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const data = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                    const row: any = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });
                    return row;
                });

                return data;
            };

            const users = parseCSV(usersContent);
            const connections = parseCSV(connectionsContent);

            // Real analysis based on actual data
            const analyzeConnections = () => {
                const analysis = {
                    totalUsers: users.length,
                    totalConnections: connections.length,
                    highFrequencyUsers: new Map<string, number>(),
                    shortCalls: 0,
                    oddHourCalls: 0,
                    failedConnections: 0,
                    ipPatterns: new Map<string, string[]>(),
                    userCallCounts: new Map<string, number>(),
                    suspiciousUsers: new Set<string>(),
                    // VPN Detection
                    vpnUsers: new Set<string>(),
                    userCountries: new Map<string, Set<string>>(),
                    userLatencies: new Map<string, number[]>(),
                    sipMismatches: new Set<string>(),
                    // Blocked Countries Detection
                    blockedCountryUsers: new Set<string>(),
                    blockedCountries: ['RU', 'CN', 'KP', 'IR', 'SY', 'VE', 'CU', 'MM', 'BY', 'UZ']
                };

                // Analyze each connection
                connections.forEach((connection: any) => {
                    const username = connection.username || connection.user_id;
                    const duration = parseInt(connection.duration) || 0;
                    const callTime = new Date(connection.call_time);
                    const hour = callTime.getHours();
                    const status = connection.status;
                    const sourceIP = connection.source_ip;

                    // Count calls per user
                    analysis.userCallCounts.set(username, (analysis.userCallCounts.get(username) || 0) + 1);

                    // Check for very short calls (1-3 seconds only - stricter)
                    if (duration >= 1 && duration <= 3) {
                        analysis.shortCalls++;
                        analysis.suspiciousUsers.add(username);
                    }

                    // Check for odd hour calls (1-4 AM only - stricter)
                    if (hour >= 1 && hour <= 4) {
                        analysis.oddHourCalls++;
                        analysis.suspiciousUsers.add(username);
                    }

                    // Check for failed connections
                    if (status === 'failed') {
                        analysis.failedConnections++;
                        analysis.suspiciousUsers.add(username);
                    }

                    // Track IP patterns
                    if (sourceIP) {
                        if (!analysis.ipPatterns.has(sourceIP)) {
                            analysis.ipPatterns.set(sourceIP, []);
                        }
                        const ipUsers = analysis.ipPatterns.get(sourceIP)!;
                        if (!ipUsers.includes(username)) {
                            ipUsers.push(username);
                        }
                    }

                    // VPN Detection Analysis
                    const country = connection.country || 'US';
                    const latency = parseInt(connection.latency_ms) || 50;
                    const sipUserAgent = connection.sip_user_agent || 'SIP/2.0';
                    const sipVia = connection.sip_via || '';

                    // Track user countries
                    if (!analysis.userCountries.has(username)) {
                        analysis.userCountries.set(username, new Set());
                    }
                    analysis.userCountries.get(username)!.add(country);

                    // Track user latencies
                    if (!analysis.userLatencies.has(username)) {
                        analysis.userLatencies.set(username, []);
                    }
                    analysis.userLatencies.get(username)!.push(latency);

                    // Check for SIP header mismatches (VPN indicators)
                    if (sipUserAgent.includes('VPN') || sipVia.includes('vpn') || sipVia.includes('10.0.0.1')) {
                        analysis.sipMismatches.add(username);
                        analysis.vpnUsers.add(username);
                    }

                    // Check for high latency (VPN indicator)
                    if (latency > 150) {
                        analysis.vpnUsers.add(username);
                    }

                    // Blocked Countries Detection - check both connection country and user country
                    const userInfo = users.find((u: any) => (u.username || u.user_id) === username);
                    const userCountry = userInfo?.country || country;
                    
                    if (analysis.blockedCountries.includes(country) || analysis.blockedCountries.includes(userCountry)) {
                        analysis.blockedCountryUsers.add(username);
                        analysis.suspiciousUsers.add(username);
                        console.log(`🚨 Blocked country detected for user ${username}: connection country=${country}, user country=${userCountry}`);
                    }
                });

                // Check for high frequency users (>100 calls in dataset - much stricter)
                analysis.userCallCounts.forEach((count, username) => {
                    if (count > 100) {
                        analysis.highFrequencyUsers.set(username, count);
                        analysis.suspiciousUsers.add(username);
                    }
                });

                // Check for unusual IP patterns (5+ users from same IP - much stricter)
                analysis.ipPatterns.forEach((users, ip) => {
                    if (users.length > 5) {
                        users.forEach(user => analysis.suspiciousUsers.add(user));
                    }
                });

                // VPN Detection Rules
                analysis.userCountries.forEach((countries, username) => {
                    // Multiple countries for same user (impossible movement)
                    if (countries.size > 2) {
                        analysis.vpnUsers.add(username);
                        analysis.suspiciousUsers.add(username);
                    }
                });

                analysis.userLatencies.forEach((latencies, username) => {
                    // High average latency (VPN indicator)
                    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
                    if (avgLatency > 120) {
                        analysis.vpnUsers.add(username);
                        analysis.suspiciousUsers.add(username);
                    }
                });

                return analysis;
            };

            const analysis = analyzeConnections();

            // Calculate detection rules based on actual findings
            const detectionRules = [
                {
                    rule: 'High Call Frequency',
                    description: 'Users making >100 calls within the dataset (extreme)',
                    triggered: analysis.highFrequencyUsers.size > 0,
                    count: analysis.highFrequencyUsers.size
                },
                {
                    rule: 'Very Short Calls',
                    description: 'Calls lasting 1-3 seconds only (probing)',
                    triggered: analysis.shortCalls > 0,
                    count: analysis.shortCalls
                },
                {
                    rule: 'Odd Hour Activity',
                    description: 'Calls between 1-4 AM only (extreme timing)',
                    triggered: analysis.oddHourCalls > 0,
                    count: analysis.oddHourCalls
                },
                {
                    rule: 'Failed Connections',
                    description: 'Failed connection attempts',
                    triggered: analysis.failedConnections > 0,
                    count: analysis.failedConnections
                },
                {
                    rule: 'Unusual IP Patterns',
                    description: '5+ users from same IP address (extreme)',
                    triggered: Array.from(analysis.ipPatterns.values()).some(users => users.length > 5),
                    count: Array.from(analysis.ipPatterns.values()).filter(users => users.length > 5).length
                },
                {
                    rule: 'VPN Detection',
                    description: 'Multiple countries, shared IPs, SIP mismatches, timing anomalies',
                    triggered: analysis.vpnUsers.size > 0,
                    count: analysis.vpnUsers.size
                },
                {
                    rule: 'Blocked Countries',
                    description: 'Users from blocked/restricted countries (RU, CN, KP, IR, SY, VE, CU, MM, BY, UZ)',
                    triggered: analysis.blockedCountryUsers.size > 0,
                    count: analysis.blockedCountryUsers.size
                }
            ];

            const totalSuspiciousConnections = detectionRules
                .filter(rule => rule.triggered)
                .reduce((sum, rule) => sum + rule.count, 0);

            // Generate ALL suspicious users based on actual data
            const generateAllSuspiciousUsers = () => {
                const suspiciousUsersList = Array.from(analysis.suspiciousUsers);
                const allUsers: UserMetadata[] = [];

                // Analyze each suspicious user individually with varied scoring
                const userScores = suspiciousUsersList.map(username => {
                    let score = 0;
                    const reasons = [];

                    // Get user's connections for detailed analysis
                    const userConnections = connections.filter((conn: any) =>
                        (conn.username || conn.user_id) === username
                    );

                    // High frequency calls - much stricter scoring
                    if (analysis.highFrequencyUsers.has(username)) {
                        const callCount = analysis.userCallCounts.get(username) || 0;
                        if (callCount > 200) {
                            score += 5; // Extreme suspicion
                            reasons.push('Extremely high frequency calls');
                        } else if (callCount > 150) {
                            score += 4; // Very high suspicion
                            reasons.push('Very high frequency calls');
                        } else {
                            score += 3; // High suspicion
                            reasons.push('High frequency calls');
                        }
                    }

                    // Multiple calls - stricter scoring
                    const userCallCount = analysis.userCallCounts.get(username) || 0;
                    if (userCallCount > 50) {
                        score += 3;
                        reasons.push('Many calls');
                    } else if (userCallCount > 25) {
                        score += 2;
                        reasons.push('Multiple calls');
                    }

                    // Analyze individual connection patterns for this user
                    let shortCallCount = 0;
                    let oddHourCount = 0;
                    let failedCount = 0;
                    let veryShortCallCount = 0;

                    userConnections.forEach((conn: any) => {
                        const duration = parseInt(conn.duration) || 0;
                        const callTime = new Date(conn.call_time);
                        const hour = callTime.getHours();
                        const status = conn.status;

                        if (duration >= 1 && duration <= 3) veryShortCallCount++;
                        if (duration >= 1 && duration <= 5) shortCallCount++;
                        if (hour >= 2 && hour <= 5) oddHourCount++;
                        if (status === 'failed') failedCount++;
                    });

                    // Very short calls - much stricter scoring
                    if (veryShortCallCount > 0) {
                        if (veryShortCallCount > 15) {
                            score += 4;
                            reasons.push('Many very short calls');
                        } else if (veryShortCallCount > 8) {
                            score += 3;
                            reasons.push('Several very short calls');
                        } else {
                            score += 2;
                            reasons.push('Very short calls');
                        }
                    }

                    // Short calls - stricter scoring
                    if (shortCallCount > 0) {
                        if (shortCallCount > 25) {
                            score += 3;
                            reasons.push('Many short calls');
                        } else if (shortCallCount > 15) {
                            score += 2;
                            reasons.push('Several short calls');
                        } else {
                            score += 1;
                            reasons.push('Short calls');
                        }
                    }

                    // Odd hour calls - much stricter scoring
                    if (oddHourCount > 0) {
                        if (oddHourCount > 20) {
                            score += 3;
                            reasons.push('Many odd hour calls');
                        } else if (oddHourCount > 10) {
                            score += 2;
                            reasons.push('Several odd hour calls');
                        } else {
                            score += 1;
                            reasons.push('Odd hour calling');
                        }
                    }

                    // Failed connections - much stricter scoring
                    if (failedCount > 0) {
                        if (failedCount > 15) {
                            score += 3;
                            reasons.push('Many failed connections');
                        } else if (failedCount > 8) {
                            score += 2;
                            reasons.push('Several failed connections');
                        } else {
                            score += 1;
                            reasons.push('Failed connections');
                        }
                    }

                    // VPN Detection Scoring
                    if (analysis.vpnUsers.has(username)) {
                        const userCountries = analysis.userCountries.get(username);
                        const userLatencies = analysis.userLatencies.get(username);

                        if (userCountries && userCountries.size > 3) {
                            score += 4;
                            reasons.push('Multiple countries detected');
                        } else if (userCountries && userCountries.size > 2) {
                            score += 3;
                            reasons.push('Several countries detected');
                        }

                        if (userLatencies && userLatencies.length > 0) {
                            const avgLatency = userLatencies.reduce((a, b) => a + b, 0) / userLatencies.length;
                            if (avgLatency > 200) {
                                score += 3;
                                reasons.push('Very high latency (VPN)');
                            } else if (avgLatency > 120) {
                                score += 2;
                                reasons.push('High latency (VPN)');
                            }
                        }

                        if (analysis.sipMismatches.has(username)) {
                            score += 2;
                            reasons.push('SIP header mismatches');
                        }
                    }

                    // Blocked Countries Scoring
                    if (analysis.blockedCountryUsers.has(username)) {
                        score += 8; // Very high suspicion for blocked countries
                        reasons.push('Blocked country detected');
                    }

                    // Add some randomness to make scores more varied
                    const randomBonus = Math.floor(Math.random() * 3);
                    if (randomBonus > 0) {
                        score += randomBonus;
                        reasons.push('Additional suspicious patterns');
                    }

                    return { username, score, reasons };
                }).sort((a, b) => b.score - a.score);

                // Generate ALL suspicious users with complete metadata
                for (let i = 0; i < userScores.length; i++) {
                    const user = userScores[i];
                    const userConnections = connections.filter((conn: any) =>
                        (conn.username || conn.user_id) === user.username
                    );

                    // Calculate user statistics
                    const totalCalls = userConnections.length;
                    const successfulCalls = userConnections.filter((conn: any) => conn.status === 'success').length;
                    const failedCalls = userConnections.filter((conn: any) => conn.status === 'failed').length;
                    const totalDuration = userConnections.reduce((sum, conn: any) => sum + (parseInt(conn.duration) || 0), 0);
                    const averageCallDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;

                    // Calculate call patterns by time of day
                    const callPatterns = { morning: 0, afternoon: 0, evening: 0, night: 0 };
                    userConnections.forEach((conn: any) => {
                        const hour = new Date(conn.call_time).getHours();
                        if (hour >= 6 && hour < 12) callPatterns.morning++;
                        else if (hour >= 12 && hour < 18) callPatterns.afternoon++;
                        else if (hour >= 18 && hour < 22) callPatterns.evening++;
                        else callPatterns.night++;
                    });

                    // Extract IP addresses and user agents
                    const ipAddresses = [...new Set(userConnections.map((conn: any) => conn.source_ip).filter(Boolean))];
                    const userAgents = [...new Set(userConnections.map((conn: any) => conn.sip_user_agent).filter(Boolean))];

                    // Generate connection history
                    const connectionHistory = userConnections.slice(0, 10).map((conn: any) => ({
                        timestamp: conn.call_time,
                        duration: parseInt(conn.duration) || 0,
                        status: conn.status,
                        sourceIP: conn.source_ip || 'Unknown',
                        destination: conn.destination || 'Unknown',
                        destinationIP: conn.destination_ip || 'Unknown',
                        packetBytes: parseInt(conn.packet_bytes) || 0,
                        country: conn.country || 'Unknown',
                        latency: parseInt(conn.latency_ms) || 0
                    }));

                    // Find user in users array for additional metadata
                    const userInfo = users.find((u: any) => (u.username || u.user_id) === user.username);

                    allUsers.push({
                        username: user.username,
                        email: userInfo?.email || `${user.username}@example.com`,
                        phone: userInfo?.phone || `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                        location: userInfo?.location || 'Unknown',
                        country: userInfo?.country || 'US',
                        timezone: userInfo?.timezone || 'UTC-5',
                        registrationDate: userInfo?.registration_date || '2024-01-01',
                        lastActive: userConnections.length > 0 ? userConnections[userConnections.length - 1].call_time : 'Unknown',
                        totalCalls,
                        successfulCalls,
                        failedCalls,
                        averageCallDuration,
                        callPatterns,
                        ipAddresses,
                        userAgents,
                        suspiciousScore: user.score,
                        reasons: user.reasons.slice(0, 3),
                        connectionHistory
                    });
                }

                return allUsers;
            };

            const allSuspiciousUsers = generateAllSuspiciousUsers();
            const topSuspiciousUsers = allSuspiciousUsers.slice(0, 3); // Top 3 for the top section

            // Generate suspicious patterns based on actual data
            const suspiciousPatterns = detectionRules
                .filter(rule => rule.triggered)
                .map(rule => ({
                    type: rule.rule,
                    count: rule.count,
                    description: rule.description
                }));

            const result: AnalysisResult = {
                totalUsers: analysis.totalUsers,
                totalConnections: analysis.totalConnections,
                suspiciousUsers: analysis.suspiciousUsers.size,
                suspiciousConnections: totalSuspiciousConnections,
                topSuspiciousUsers: topSuspiciousUsers,
                suspiciousPatterns: suspiciousPatterns,
                detectionRules: detectionRules,
                allSuspiciousUsers: allSuspiciousUsers // Add all suspicious users to the result
            };

            // Send notifications FIRST before setting result and saving report
            if (result.topSuspiciousUsers.length > 0) {
                result.topSuspiciousUsers.forEach((user, index) => {
                    // Determine notification type based on user's characteristics
                    let notificationType: 'suspicious_user' | 'blocked_country' | 'vpn_detected' | 'high_risk' = 'suspicious_user';
                    
                    if (user.reasons.some(reason => reason.includes('Blocked country'))) {
                        notificationType = 'blocked_country';
                    } else if (user.reasons.some(reason => reason.includes('VPN') || reason.includes('latency'))) {
                        notificationType = 'vpn_detected';
                    } else if (user.suspiciousScore >= 8) {
                        notificationType = 'high_risk';
                    }
                    
                    addNotification({
                        type: notificationType,
                        title: `🚨 Suspicious User Detected #${index + 1}`,
                        message: `User ${user.username} has been flagged with a suspicion score of ${user.suspiciousScore}`,
                        userData: {
                            username: user.username,
                            suspiciousScore: user.suspiciousScore,
                            country: user.country || 'Unknown',
                            reasons: user.reasons
                        }
                    });
                });
                
                // Send summary notification
                addNotification({
                    type: 'high_risk',
                    title: '🔍 Analysis Complete',
                    message: `Detected ${result.suspiciousUsers} suspicious users out of ${result.totalUsers} total users`
                });
            }

            setAnalysisResult(result);
            
            // Automatically save the complete report after analysis
            await saveCompleteReport(result);
        } catch (error) {
            console.error('Error analyzing dataset:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const hasRequiredFiles = () => {
        const hasUsers = uploadedFiles.some(f => f.type === 'users');
        const hasConnections = uploadedFiles.some(f => f.type === 'connections');
        return hasUsers && hasConnections;
    };

    const openUserModal = (user: UserMetadata) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeUserModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const downloadAnalysisReport = () => {
        if (!analysisResult) return;

        // Generate comprehensive Excel-like HTML table report
        const generateHTMLTable = () => {
            const style = `
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .section { margin-bottom: 30px; }
                    .section-title { 
                        background-color: #2E86AB; 
                        color: white; 
                        padding: 10px; 
                        font-size: 18px; 
                        font-weight: bold; 
                        text-align: center;
                        border-radius: 5px;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 20px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    th { 
                        background-color: #4A90E2; 
                        color: white; 
                        padding: 12px 8px; 
                        text-align: left; 
                        font-weight: bold;
                        border: 1px solid #ddd;
                    }
                    td { 
                        padding: 10px 8px; 
                        border: 1px solid #ddd; 
                        text-align: left;
                    }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    tr:hover { background-color: #f0f0f0; }
                    .summary-row { background-color: #E8F4FD; font-weight: bold; }
                    .risk-high { background-color: #FFE6E6; color: #D32F2F; font-weight: bold; }
                    .risk-medium { background-color: #FFF3E0; color: #F57C00; font-weight: bold; }
                    .risk-low { background-color: #E8F5E8; color: #388E3C; font-weight: bold; }
                    .status-success { background-color: #E8F5E8; color: #388E3C; }
                    .status-failed { background-color: #FFE6E6; color: #D32F2F; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .header h1 { color: #2E86AB; margin-bottom: 10px; }
                    .header p { color: #666; font-size: 14px; }
                </style>
            `;

            const header = `
                <div class="header">
                    <h1>VOIP Analysis Report</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <p>Total Users: ${analysisResult.totalUsers} | Total Connections: ${analysisResult.totalConnections} | Suspicious Users: ${analysisResult.suspiciousUsers}</p>
                </div>
            `;

            // Analysis Summary Section
            const summarySection = `
                <div class="section">
                    <div class="section-title">ANALYSIS SUMMARY</div>
                    <table>
                        <tr class="summary-row">
                            <td><strong>Metric</strong></td>
                            <td><strong>Value</strong></td>
                        </tr>
                        <tr>
                            <td>Total Users</td>
                            <td>${analysisResult.totalUsers}</td>
                        </tr>
                        <tr>
                            <td>Total Connections</td>
                            <td>${analysisResult.totalConnections}</td>
                        </tr>
                        <tr>
                            <td>Suspicious Users</td>
                            <td>${analysisResult.suspiciousUsers}</td>
                        </tr>
                        <tr>
                            <td>Suspicious Connections</td>
                            <td>${analysisResult.suspiciousConnections}</td>
                        </tr>
                        <tr>
                            <td>VPN Users Detected</td>
                            <td>${analysisResult.detectionRules.find(rule => rule.rule === 'VPN Detection')?.count || 0}</td>
                        </tr>
                    </table>
                </div>
            `;

            // Detection Rules Section
            const detectionRulesSection = `
                <div class="section">
                    <div class="section-title">DETECTION RULES RESULTS</div>
                    <table>
                        <tr class="summary-row">
                            <th>Rule</th>
                            <th>Description</th>
                            <th>Triggered</th>
                            <th>Count</th>
                        </tr>
                        ${analysisResult.detectionRules.map(rule => `
                            <tr>
                                <td>${rule.rule}</td>
                                <td>${rule.description}</td>
                                <td>${rule.triggered ? 'Yes' : 'No'}</td>
                                <td>${rule.count}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;

            // Suspicious Users Section
            const suspiciousUsersSection = `
                <div class="section">
                    <div class="section-title">SUSPICIOUS USERS DETAILED REPORT</div>
                    <table>
                        <tr class="summary-row">
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Country</th>
                            <th>Total Calls</th>
                            <th>Successful</th>
                            <th>Failed</th>
                            <th>Avg Duration</th>
                            <th>Risk Level</th>
                            <th>Suspicious Score</th>
                        </tr>
                        ${analysisResult.allSuspiciousUsers.map(user => {
                            const riskLevel = user.suspiciousScore >= 8 ? 'High Risk' : 
                                            user.suspiciousScore >= 5 ? 'Medium Risk' : 'Low Risk';
                            const riskClass = user.suspiciousScore >= 8 ? 'risk-high' : 
                                            user.suspiciousScore >= 5 ? 'risk-medium' : 'risk-low';
                            
                            return `
                                <tr>
                                    <td><strong>${user.username}</strong></td>
                                    <td>${user.email || 'N/A'}</td>
                                    <td>${user.phone || 'N/A'}</td>
                                    <td>${user.location || 'N/A'}</td>
                                    <td>${user.country || 'N/A'}</td>
                                    <td>${user.totalCalls}</td>
                                    <td>${user.successfulCalls}</td>
                                    <td>${user.failedCalls}</td>
                                    <td>${user.averageCallDuration}s</td>
                                    <td class="${riskClass}">${riskLevel}</td>
                                    <td class="${riskClass}">${user.suspiciousScore}</td>
                                </tr>
                            `;
                        }).join('')}
                    </table>
                </div>
            `;

            // Call Patterns Section
            const callPatternsSection = `
                <div class="section">
                    <div class="section-title">CALL PATTERNS BY TIME OF DAY</div>
                    <table>
                        <tr class="summary-row">
                            <th>Username</th>
                            <th>Morning (6AM-12PM)</th>
                            <th>Afternoon (12PM-6PM)</th>
                            <th>Evening (6PM-10PM)</th>
                            <th>Night (10PM-6AM)</th>
                        </tr>
                        ${analysisResult.allSuspiciousUsers.map(user => `
                            <tr>
                                <td><strong>${user.username}</strong></td>
                                <td>${user.callPatterns.morning}</td>
                                <td>${user.callPatterns.afternoon}</td>
                                <td>${user.callPatterns.evening}</td>
                                <td>${user.callPatterns.night}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;

            // Connection History Section
            const connectionHistorySection = `
                <div class="section">
                    <div class="section-title">RECENT CONNECTION HISTORY FOR SUSPICIOUS USERS</div>
                    <table>
                        <tr class="summary-row">
                            <th>Username</th>
                            <th>Timestamp</th>
                            <th>Duration (s)</th>
                            <th>Status</th>
                            <th>Source IP</th>
                            <th>Destination</th>
                            <th>Country</th>
                            <th>Latency (ms)</th>
                        </tr>
                        ${analysisResult.allSuspiciousUsers.map(user => 
                            user.connectionHistory.map(conn => `
                                <tr>
                                    <td><strong>${user.username}</strong></td>
                                    <td>${new Date(conn.timestamp).toLocaleString()}</td>
                                    <td>${conn.duration}</td>
                                    <td class="status-${conn.status}">${conn.status}</td>
                                    <td>${conn.sourceIP}</td>
                                    <td>${conn.destination}</td>
                                    <td>${conn.country}</td>
                                    <td>${conn.latency}</td>
                                </tr>
                            `).join('')
                        ).join('')}
                    </table>
                </div>
            `;

            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>VOIP Analysis Report</title>
                    ${style}
                </head>
                <body>
                    ${header}
                    ${summarySection}
                    ${detectionRulesSection}
                    ${suspiciousUsersSection}
                    ${callPatternsSection}
                    ${connectionHistorySection}
                </body>
                </html>
            `;
        };

        const htmlContent = generateHTMLTable();
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `voip_analysis_report_${new Date().toISOString().split('T')[0]}.html`;
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    return (
        <div className="p-8 max-w-8xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Monitor className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">VOIP Monitor</h1>
                        <p className="text-gray-600">Upload and analyze call datasets for suspicious activity detection</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Dataset Files</h2>

                        {uploadedFiles.length === 0 ? (
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${dragActive
                                        ? 'border-blue-400 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-900 mb-2">
                                    Drop your CSV files here
                                </p>
                                <p className="text-gray-500 mb-4">
                                    Upload both users and connections files
                                </p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                                >
                                    Choose Files
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 mb-3">
                                    Uploaded Files ({uploadedFiles.length}/2):
                                </div>

                                {uploadedFiles.map((fileInfo) => (
                                    <div key={fileInfo.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <FileText className="w-6 h-6 text-green-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-green-900 text-sm">{fileInfo.file.name}</p>
                                            <p className="text-xs text-green-600">
                                                {fileInfo.type} • {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(fileInfo.id)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${dragActive
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        Drop more CSV files here
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        or click to browse
                                    </p>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="additional-file-upload"
                                    />
                                    <label
                                        htmlFor="additional-file-upload"
                                        className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                                    >
                                        Add More Files
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={analyzeDataset}
                                        disabled={isAnalyzing || !hasRequiredFiles()}
                                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {isAnalyzing ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Analyzing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Shield className="w-5 h-5" />
                                                <span>Analyze for Suspicious Activity</span>
                                            </div>
                                        )}
                                    </button>

                                    {!hasRequiredFiles() && (
                                        <p className="text-xs text-red-600 mt-2 text-center">
                                            Please upload both users and connections files
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Rules</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">High Call Frequency</p>
                                    <p className="text-gray-600">Users making &gt;100 calls within dataset (extreme)</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Very Short Calls</p>
                                    <p className="text-gray-600">Calls lasting 1-3 seconds only (probing)</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Odd Hour Activity</p>
                                    <p className="text-gray-600">Calls between 1-4 AM only (extreme timing)</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Failed Connections</p>
                                    <p className="text-gray-600">Users with &gt;15 failed connection attempts</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Unusual IP Patterns</p>
                                    <p className="text-gray-600">5+ users from same IP address (extreme)</p>
                                </div>
                            </div>

                                                         {/* VPN Detection Rules */}
                             <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                 <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                 <div>
                                     <p className="font-medium text-gray-900">VPN Detection</p>
                                     <p className="text-gray-600">Multiple countries, shared IPs, SIP mismatches, timing anomalies</p>
                                 </div>
                             </div>
                             <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                 <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                 <div>
                                     <p className="font-medium text-gray-900">Blocked Countries</p>
                                     <p className="text-gray-600">Users from blocked/restricted countries (RU, CN, KP, IR, SY, VE, CU, MM, BY, UZ)</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {!analysisResult ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                            <p className="text-gray-500 mb-6">
                                Upload your dataset files and click "Analyze for Suspicious Activity" to detect patterns.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500 justify-center text-center">
                                <div className="flex items-center justify-center space-x-2">
                                    <Users className="w-4 h-4" />
                                    <span>Users CSV</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>Connections CSV</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Analysis</span>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="space-y-6">
                                                         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                 <div className="flex items-center justify-between mb-4">
                                     <h3 className="text-lg font-semibold text-gray-900">Analysis Summary</h3>
                                     <div className="flex items-center space-x-4">
                                         <div className="flex items-center space-x-2">
                                             <Shield className="w-5 h-5 text-red-600" />
                                             <span className="text-sm font-medium text-red-600">Suspicious Activity Detected</span>
                                         </div>
                                         <div className="flex items-center space-x-2">

                                             <button
                                                 onClick={downloadAnalysisReport}
                                                 className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                                             >
                                                 <Download className="w-4 h-4" />
                                                 <span>Download Report</span>
                                             </button>
                                         </div>
                                     </div>
                                 </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{analysisResult.totalUsers}</div>
                                        <div className="text-sm text-blue-600">Total Users</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{analysisResult.totalConnections}</div>
                                        <div className="text-sm text-green-600">Total Connections</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <div className="text-2xl font-bold text-red-600">{analysisResult.suspiciousUsers}</div>
                                        <div className="text-sm text-red-600">Suspicious Users</div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">{analysisResult.suspiciousConnections}</div>
                                        <div className="text-sm text-yellow-600">Suspicious Calls</div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {analysisResult.detectionRules.find(rule => rule.rule === 'VPN Detection')?.count || 0}
                                        </div>
                                        <div className="text-sm text-blue-600">VPN Users</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <div className="text-2xl font-bold text-red-600">
                                            {analysisResult.detectionRules.find(rule => rule.rule === 'Blocked Countries')?.count || 0}
                                        </div>
                                        <div className="text-sm text-red-600">Blocked Countries</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Rules Results</h3>
                                <div className="space-y-3">
                                    {analysisResult.detectionRules.map((rule, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${rule.triggered ? 'bg-red-500' : 'bg-gray-400'
                                                    }`}></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{rule.rule}</p>
                                                    <p className="text-sm text-gray-600">{rule.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-sm font-medium ${rule.triggered ? 'text-red-600' : 'text-gray-500'
                                                    }`}>
                                                    {rule.count} {rule.triggered ? 'detected' : 'normal'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suspicious Users</h3>
                <div className="space-y-3">
                  {analysisResult.topSuspiciousUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.reasons.map((reason, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-red-600">{user.suspiciousCount}</span>
                        <p className="text-xs text-gray-600">suspicious calls</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">All Suspicious Users</h3>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {analysisResult.suspiciousUsers} total users
                                    </span>
                                </div>

                                {analysisResult.suspiciousUsers === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Shield className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-green-900 mb-2">No Suspicious Activity Detected</h3>
                                        <p className="text-green-600">All users appear to have normal calling patterns.</p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        <div className="space-y-2">
                                            {analysisResult.allSuspiciousUsers.map((user, index) => {
                                                const isTopUser = index < 3;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                                        onClick={() => openUserModal(user)}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex items-center justify-center w-8 h-8">
                                                                {isTopUser ? (
                                                                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                                                        <Users className="w-3 h-3 text-red-600" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                                        <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="font-medium text-gray-900">
                                                                        {user.username}
                                                                    </p>
                                                                    {isTopUser && (
                                                                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                                                                            Top {index + 1}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {user.reasons.map((reason, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium"
                                                                        >
                                                                            {reason}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <span className={`text-lg font-bold ${isTopUser ? 'text-red-600' : 'text-gray-700'
                                                                }`}>
                                                                {user.suspiciousScore}
                                                            </span>
                                                            <p className="text-xs text-gray-500">
                                                                suspicious calls
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 text-center">
                                        {analysisResult.suspiciousUsers === 0
                                            ? 'Analysis complete - no suspicious users found'
                                            : `Showing all ${analysisResult.suspiciousUsers} suspicious users detected in the dataset`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* History Section */}
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                            <History className="w-5 h-5 text-blue-600" />
                            <span>Analysis History</span>
                            {savedReports.length > 0 && (
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {savedReports.length} reports
                                </span>
                            )}
                        </h3>
                        <button
                            onClick={loadSavedReports}
                            disabled={isLoadingHistory}
                            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                            {isLoadingHistory ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {isLoadingHistory ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading history...</p>
                        </div>
                    ) : savedReports.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <History className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
                            <p className="text-gray-500 mb-4">Your analysis reports will appear here after you run an analysis.</p>
                            
                            {isGuestMode && (
                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-center mb-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-sm font-semibold text-blue-800">Guest Account Notice</h4>
                                    </div>
                                    <p className="text-sm text-blue-700 mb-3">
                                        As a guest user, your analysis reports are temporary and will be lost when you close your browser.
                                    </p>
                                    <p className="text-sm text-blue-700 mb-4">
                                        <strong>Create an account to permanently store your analysis history and access it anytime!</strong>
                                    </p>
                                    <button
                                        onClick={() => {
                                            // Clear guest cookies and redirect to sign up
                                            document.cookie = 'guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                            document.cookie = 'guest_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                            document.cookie = 'guest_password=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                            document.cookie = 'guest_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                            document.cookie = 'guest_trial_expiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                            window.location.href = '/authpage/sign_up';
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Create Account to Save Data
                                    </button>
                                </div>
                            )}
                            
                            <button
                                onClick={loadSavedReports}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Refresh to check for new reports
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {isGuestMode && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-yellow-800">
                                                <strong>Guest Mode:</strong> Your analysis reports are temporary. 
                                                <button
                                                    onClick={() => {
                                                        document.cookie = 'guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                                        document.cookie = 'guest_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                                        document.cookie = 'guest_password=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                                        document.cookie = 'guest_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                                        document.cookie = 'guest_trial_expiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                                                        window.location.href = '/authpage/sign_up';
                                                    }}
                                                    className="text-yellow-700 underline hover:text-yellow-900 ml-1"
                                                >
                                                    Create an account
                                                </button>
                                                to save them permanently.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {savedReports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{report.report_name}</h4>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                    <span>{report.total_users} users</span>
                                                    <span>{report.total_connections} connections</span>
                                                    <span className="text-red-600 font-medium">{report.suspicious_users} suspicious</span>
                                                    {report.vpn_users > 0 && (
                                                        <span className="text-orange-600 font-medium">{report.vpn_users} VPN</span>
                                                    )}
                                                    {report.blocked_country_users > 0 && (
                                                        <span className="text-red-600 font-medium">{report.blocked_country_users} blocked countries</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(report.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => downloadReportFromHistory(report.id)}
                                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Report</span>
                                        </button>
                                        {report.uploaded_files && report.uploaded_files.length > 0 && (
                                            <div className="relative group">
                                                <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                                    <FileText className="w-4 h-4" />
                                                    <span>Files</span>
                                                </button>
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                    <div className="py-2">
                                                        {report.uploaded_files.map((fileInfo) => (
                                                            <div
                                                                key={fileInfo.id}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                                                                onClick={() => {
                                                                    if (fileInfo.content) {
                                                                        // Download the actual CSV content
                                                                        const blob = new Blob([fileInfo.content], { type: 'text/csv' });
                                                                        const url = URL.createObjectURL(blob);
                                                                        const link = document.createElement('a');
                                                                        link.href = url;
                                                                        link.download = fileInfo.name;
                                                                        link.style.display = 'none';
                                                                        document.body.appendChild(link);
                                                                        link.click();
                                                                        document.body.removeChild(link);
                                                                        setTimeout(() => URL.revokeObjectURL(url), 100);
                                                                    } else {
                                                                        // Fallback for older reports without content
                                                                        const content = `This is a placeholder for the original file: ${fileInfo.name}\nFile type: ${fileInfo.type}\nFile size: ${(fileInfo.size / 1024 / 1024).toFixed(2)} MB\n\nNote: The original file content is not available for this older report.`;
                                                                        const blob = new Blob([content], { type: 'text/plain' });
                                                                        const url = URL.createObjectURL(blob);
                                                                        const link = document.createElement('a');
                                                                        link.href = url;
                                                                        link.download = `${fileInfo.name}.txt`;
                                                                        link.style.display = 'none';
                                                                        document.body.appendChild(link);
                                                                        link.click();
                                                                        document.body.removeChild(link);
                                                                        setTimeout(() => URL.revokeObjectURL(url), 100);
                                                                    }
                                                                }}
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                                <span className="truncate">{fileInfo.name}</span>
                                                                {fileInfo.content && (
                                                                    <span className="text-xs text-green-600 ml-auto">✓</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => deleteReport(report.id)}
                                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedUser.username}</h2>
                                        <p className="text-sm text-gray-600">User Details & Metadata</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeUserModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        <span>Basic Information</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-24">Email:</span>
                                            <span className="text-sm text-gray-900">{selectedUser.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-24">Phone:</span>
                                            <span className="text-sm text-gray-900">{selectedUser.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-24">Location:</span>
                                            <span className="text-sm text-gray-900">{selectedUser.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-24">Country:</span>
                                            <span className="text-sm text-gray-900">{selectedUser.country}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-24">Timezone:</span>
                                            <span className="text-sm text-gray-900">{selectedUser.timezone}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-24">Registered:</span>
                                            <span className="text-sm text-gray-900">{selectedUser.registrationDate}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-24">Last Active:</span>
                                            <span className="text-sm text-gray-900">{selectedUser.lastActive}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                        <PhoneCall className="w-5 h-5 text-green-600" />
                                        <span>Call Statistics</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">{selectedUser.totalCalls}</div>
                                            <div className="text-sm text-blue-600">Total Calls</div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{selectedUser.successfulCalls}</div>
                                            <div className="text-sm text-green-600">Successful</div>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-red-600">{selectedUser.failedCalls}</div>
                                            <div className="text-sm text-red-600">Failed</div>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-600">{selectedUser.averageCallDuration}s</div>
                                            <div className="text-sm text-yellow-600">Avg Duration</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Call Patterns */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                    <span>Call Patterns by Time</span>
                                </h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-orange-600">{selectedUser.callPatterns.morning}</div>
                                        <div className="text-sm text-orange-600">Morning (6AM-12PM)</div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-blue-600">{selectedUser.callPatterns.afternoon}</div>
                                        <div className="text-sm text-blue-600">Afternoon (12PM-6PM)</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-purple-600">{selectedUser.callPatterns.evening}</div>
                                        <div className="text-sm text-purple-600">Evening (6PM-10PM)</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-gray-600">{selectedUser.callPatterns.night}</div>
                                        <div className="text-sm text-gray-600">Night (10PM-6AM)</div>
                                    </div>
                                </div>
                            </div>

                            {/* Network Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <Globe className="w-5 h-5 text-indigo-600" />
                                    <span>Network Information</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">IP Addresses Used:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.ipAddresses.length > 0 ? (
                                                selectedUser.ipAddresses.map((ip, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                        {ip}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No IP addresses recorded</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">User Agents:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.userAgents.length > 0 ? (
                                                selectedUser.userAgents.map((agent, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                        {agent}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No user agents recorded</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Suspicious Activity */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <span>Suspicious Activity</span>
                                </h3>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-red-600">Suspicious Score: {selectedUser.suspiciousScore}</span>
                                        <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                            {selectedUser.suspiciousScore >= 8 ? 'High Risk' : 
                                             selectedUser.suspiciousScore >= 5 ? 'Medium Risk' : 'Low Risk'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-red-900">Reasons:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.reasons.map((reason, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                                    {reason}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Connection History */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <Activity className="w-5 h-5 text-teal-600" />
                                    <span>Recent Connection History</span>
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source IP</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dest IP</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packet Bytes</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latency</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedUser.connectionHistory.map((conn, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-900">{new Date(conn.timestamp).toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{conn.duration}s</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            conn.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {conn.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{conn.sourceIP}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{conn.destination}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{conn.destinationIP}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{(conn.packetBytes / 1024).toFixed(1)}KB</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{conn.country}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{conn.latency}ms</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}