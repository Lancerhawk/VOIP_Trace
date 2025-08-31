'use client';

import { useState } from 'react';
import { Download, Database, FileText, Users, Phone, Clock, MapPin } from 'lucide-react';

interface DatasetConfig {
    numUsers: number;
    timeRange: number;
    numSuspiciousUsers: number;
    enableVPNDetection: boolean;
}

export default function DatasetCreator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedDataset, setGeneratedDataset] = useState<any>(null);
    const [config, setConfig] = useState<DatasetConfig>({
        numUsers: 100,
        timeRange: 30,
        numSuspiciousUsers: 15,
        enableVPNDetection: true
    });

    const generateDataset = async () => {
        setIsGenerating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const dataset = createMockDataset(config);
            setGeneratedDataset(dataset);
        } catch (error) {
            console.error('Error generating dataset:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const createMockDataset = (config: DatasetConfig) => {
        const users = [];
        const connections = [];

        // IMPORTANT: This function creates a dataset where:
        // - First N users (numSuspiciousUsers) will break ALL detection rules
        // - All other users will follow ALL rules perfectly (completely clean)
        // - Suspicious users get enough connections to break the >100 calls rule
        // - Normal users get remaining connections and are guaranteed clean
        // - Each suspicious user gets at least 150 calls to ensure rule breaking

        // Generate users with truly random distribution and complete metadata
        const normalCountries = ['US', 'UK', 'DE', 'FR', 'JP', 'CA', 'AU', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH', 'AT', 'BE'];
        const blockedCountries = ['RU', 'CN', 'KP', 'IR', 'SY', 'VE', 'CU', 'MM', 'BY', 'UZ'];
        const allCountries = [...normalCountries, ...blockedCountries];
        const timezones = ['UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'];
        const locations = ['New York', 'London', 'Berlin', 'Paris', 'Tokyo', 'Toronto', 'Sydney', 'Amsterdam', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Zurich', 'Vienna', 'Brussels', 'Moscow', 'Beijing', 'Pyongyang', 'Tehran', 'Damascus', 'Caracas', 'Havana', 'Yangon', 'Minsk', 'Tashkent'];
        
        for (let i = 1; i <= config.numUsers; i++) {
            // For suspicious users, assign blocked countries (always enabled)
            let country, location;
            if (i <= config.numSuspiciousUsers) {
                // Assign blocked countries to suspicious users only
                country = blockedCountries[Math.floor(Math.random() * blockedCountries.length)];
                const blockedLocations = ['Moscow', 'Beijing', 'Pyongyang', 'Tehran', 'Damascus', 'Caracas', 'Havana', 'Yangon', 'Minsk', 'Tashkent'];
                location = blockedLocations[Math.floor(Math.random() * blockedLocations.length)];
                console.log(`🚨 Suspicious user ${i} assigned to blocked country: ${country}`);
            } else {
                // Normal users get normal countries
                country = normalCountries[Math.floor(Math.random() * normalCountries.length)];
                const normalLocations = ['New York', 'London', 'Berlin', 'Paris', 'Tokyo', 'Toronto', 'Sydney', 'Amsterdam', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Zurich', 'Vienna', 'Brussels'];
                location = normalLocations[Math.floor(Math.random() * normalLocations.length)];
            }
            const timezone = timezones[Math.floor(Math.random() * timezones.length)];
            
            users.push({
                id: i,
                username: `user_${i.toString().padStart(3, '0')}`,
                email: `user${i}@${country.toLowerCase()}.com`,
                phone: `+${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                location: location,
                country: country,
                timezone: timezone,
                ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                registration_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                status: Math.random() > 0.15 ? 'active' : 'suspended'
            });
        }

        // Separate users into suspicious and normal groups
        const suspiciousUsers = users.slice(0, config.numSuspiciousUsers);
        const normalUsers = users.slice(config.numSuspiciousUsers);

        // PRECISE CONNECTION CALCULATION - Only what's needed, no excess
        // Each suspicious user gets exactly 150 connections (guaranteed to break >100 rule)
        const suspiciousConnections = 150 * config.numSuspiciousUsers;

        // Each normal user gets exactly 5 connections (guaranteed NOT to break any rules)
        const normalConnections = 5 * normalUsers.length;

        // Total connections - no buffer, no excess
        const totalConnections = suspiciousConnections + normalConnections;

        console.log('Precise Connection Calculation:');
        console.log(`Users: ${config.numUsers}, Suspicious: ${config.numSuspiciousUsers}`);
        console.log(`Suspicious connections: ${suspiciousConnections} (150 per user)`);
        console.log(`Normal connections: ${normalConnections} (5 per user)`);
        console.log(`Total connections: ${totalConnections}`);

        // Generate NORMAL connections for non-suspicious users (following ALL rules perfectly)
        // CRITICAL: Each normal user gets exactly 5 connections, no more, no less
        for (let userIndex = 0; userIndex < normalUsers.length; userIndex++) {
            const user = normalUsers[userIndex];

            // Each normal user gets exactly 5 connections - guaranteed clean
            for (let i = 0; i < 5; i++) {
                // Generate ONLY normal call patterns (NO suspicious activity at all)
                // CRITICAL: Normal users must NEVER trigger any suspicious patterns

                // Duration: Always 30+ seconds (never short calls that could be suspicious)
                let duration;
                const durationType = Math.random();
                if (durationType < 0.3) {
                    // 30% medium calls (30 seconds to 5 minutes) - completely safe
                    duration = Math.floor(Math.random() * 270) + 30; // 30 seconds to 5 minutes
                } else if (durationType < 0.8) {
                    // 50% normal calls (5-15 minutes) - completely safe
                    duration = Math.floor(Math.random() * 600) + 300; // 5-15 minutes
                } else {
                    // 20% long calls (15-30 minutes) - completely safe
                    duration = Math.floor(Math.random() * 900) + 900; // 15-30 minutes
                }

                // Call Time: ALWAYS business hours only (9 AM - 6 PM) - NO odd hours at all
                const callTime = new Date();
                const timeOffset = Math.random() * config.timeRange * 24 * 60 * 60 * 1000;
                callTime.setTime(callTime.getTime() - timeOffset);

                // CRITICAL: Force business hours only (9 AM - 6 PM)
                callTime.setHours(9 + Math.floor(Math.random() * 9)); // 9 AM to 6 PM ONLY

                const destination = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
                const destinationIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                const packetBytes = Math.floor(Math.random() * 1000000) + 50000; // 50KB to 1MB

                connections.push({
                    id: connections.length + 1,
                    user_id: user.id,
                    username: user.username,
                    source_ip: user.ip_address, // Each normal user has unique IP
                    destination: destination,
                    destination_ip: destinationIP,
                    packet_bytes: packetBytes,
                    duration: duration,
                    call_time: callTime.toISOString(),
                    call_type: Math.random() > 0.7 ? 'video' : 'audio',
                    status: 'completed', // Normal users NEVER have failed connections
                    country: 'US', // Consistent country for normal users
                    sip_user_agent: 'SIP/2.0', // Standard SIP headers
                    sip_via: `SIP/2.0/UDP ${user.ip_address}:5060`, // Consistent with IP
                    latency_ms: Math.floor(Math.random() * 30) + 10 // Low, consistent latency 10-40ms
                });
            }
        }

        // Generate SUSPICIOUS connections ONLY for the specified suspicious users
        // Make them break ALL the detection rules systematically
        // Ensure each suspicious user gets exactly the right number of connections
        const connectionsPerSuspiciousUser = Math.floor(suspiciousConnections / config.numSuspiciousUsers);
        const extraConnections = suspiciousConnections % config.numSuspiciousUsers;

        for (let userIndex = 0; userIndex < config.numSuspiciousUsers; userIndex++) {
            const suspiciousUser = suspiciousUsers[userIndex];
            const userConnections = connectionsPerSuspiciousUser + (userIndex < extraConnections ? 1 : 0);

            for (let i = 0; i < userConnections; i++) {
                // Systematically break SPECIFIC detection rules for suspicious users
                // Each suspicious user breaks ONE rule consistently, not all rules randomly
                const ruleToBreak = userIndex % 5; // Each user breaks one specific rule
                let duration: number = 60, callTime: Date = new Date(), status: string = 'completed';

                switch (ruleToBreak) {
                    case 0: // Break Rule 1: High Call Frequency (>100 calls)
                        // This user gets 150+ calls (already handled by connection count)
                        duration = Math.floor(Math.random() * 300) + 60; // 1-6 minutes
                        callTime = new Date(Date.now() - Math.random() * config.timeRange * 24 * 60 * 60 * 1000);
                        callTime.setHours(9 + Math.floor(Math.random() * 8)); // Business hours
                        status = 'completed';
                        break;

                    case 1: // Break Rule 2: Very Short Calls (1-3 seconds)
                        duration = Math.floor(Math.random() * 3) + 1; // 1-3 seconds exactly
                        callTime = new Date(Date.now() - Math.random() * config.timeRange * 24 * 60 * 60 * 1000);
                        callTime.setHours(9 + Math.floor(Math.random() * 8)); // Business hours
                        status = 'completed';
                        break;

                    case 2: // Break Rule 3: Odd Hour Activity (1-4 AM)
                        duration = Math.floor(Math.random() * 300) + 60; // 1-6 minutes
                        callTime = new Date(Date.now() - Math.random() * config.timeRange * 24 * 60 * 60 * 1000);
                        callTime.setHours(1 + Math.floor(Math.random() * 4)); // 1-4 AM exactly
                        status = 'completed';
                        break;

                    case 3: // Break Rule 4: Failed Connections
                        duration = Math.floor(Math.random() * 300) + 60; // 1-6 minutes
                        callTime = new Date(Date.now() - Math.random() * config.timeRange * 24 * 60 * 60 * 1000);
                        callTime.setHours(9 + Math.floor(Math.random() * 8)); // Business hours
                        status = 'failed'; // Always failed for this rule
                        break;

                    case 4: // Break Rule 5: Unusual IP Patterns (5+ users from same IP)
                        // Use a shared IP for multiple suspicious users
                        duration = Math.floor(Math.random() * 300) + 60; // 1-6 minutes
                        callTime = new Date(Date.now() - Math.random() * config.timeRange * 24 * 60 * 60 * 1000);
                        callTime.setHours(9 + Math.floor(Math.random() * 8)); // Business hours
                        status = 'completed';
                        break;
                }

                // Add VPN-specific patterns for suspicious users if enabled
                let sourceIP = ruleToBreak === 4 ? '192.168.1.100' : suspiciousUser.ip_address;
                let country = suspiciousUser.country; // Use the user's assigned country (blocked for suspicious users)
                let sipUserAgent = 'SIP/2.0';
                let sipVia = 'SIP/2.0/UDP 192.168.1.100:5060';
                let latency = Math.floor(Math.random() * 50) + 10; // Normal latency 10-60ms

                if (config.enableVPNDetection) {
                    // VPN Pattern 1: Multiple countries for same user
                    if (ruleToBreak === 0) { // High frequency user
                        const countries = ['US', 'UK', 'DE', 'FR', 'JP', 'CA', 'AU'];
                        country = countries[Math.floor(Math.random() * countries.length)];
                        sourceIP = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                        latency = Math.floor(Math.random() * 200) + 100; // High latency 100-300ms (VPN)
                    }

                    // VPN Pattern 2: Shared IP with multiple users
                    if (ruleToBreak === 4) { // Unusual IP patterns
                        sourceIP = '203.0.113.100'; // Shared VPN IP
                        country = 'NL'; // Netherlands (common VPN location)
                        latency = Math.floor(Math.random() * 150) + 80; // Elevated latency
                    }

                    // VPN Pattern 3: SIP header mismatches
                    if (ruleToBreak === 1 || ruleToBreak === 2) { // Short calls or odd hours
                        sipUserAgent = 'SIP/2.0 (VPN_Client)';
                        sipVia = 'SIP/2.0/UDP 10.0.0.1:5060;branch=z9hG4bK-vpn';
                        latency = Math.floor(Math.random() * 300) + 150; // Very high latency
                    }
                }

                const destination = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
                const destinationIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                const packetBytes = Math.floor(Math.random() * 2000000) + 100000; // 100KB to 2MB for suspicious users

                connections.push({
                    id: normalConnections + connections.length + 1,
                    user_id: suspiciousUser.id,
                    username: suspiciousUser.username,
                    source_ip: sourceIP,
                    destination: destination,
                    destination_ip: destinationIP,
                    packet_bytes: packetBytes,
                    duration: duration,
                    call_time: callTime.toISOString(),
                    call_type: Math.random() > 0.8 ? 'video' : 'audio',
                    status: status,
                    country: country,
                    sip_user_agent: sipUserAgent,
                    sip_via: sipVia,
                    latency_ms: latency
                });
            }
        }

        // Debug: Verify connection distribution
        const suspiciousUserCallCounts = new Map<string, number>();
        connections.forEach(conn => {
            if (conn.user_id <= config.numSuspiciousUsers) {
                suspiciousUserCallCounts.set(conn.username, (suspiciousUserCallCounts.get(conn.username) || 0) + 1);
            }
        });

        console.log('Connection Distribution Debug:');
        console.log(`Total connections: ${connections.length}`);
        console.log(`Suspicious connections: ${suspiciousConnections}`);
        console.log(`Normal connections: ${normalConnections}`);
        console.log(`Connections per suspicious user: ${connectionsPerSuspiciousUser}`);
        console.log('Suspicious user call counts:', Object.fromEntries(suspiciousUserCallCounts));

        return {
            users,
            connections,
            metadata: {
                generated_at: new Date().toISOString(),
                total_users: users.length,
                total_connections: totalConnections,
                time_range_days: config.timeRange,
                suspicious_users: config.numSuspiciousUsers,
                vpn_detection_enabled: config.enableVPNDetection,
                blocked_countries_enabled: true,
                debug_info: {
                    suspicious_connections: suspiciousConnections,
                    normal_connections: normalConnections,
                    connections_per_suspicious_user: Math.floor(suspiciousConnections / config.numSuspiciousUsers),
                    auto_calculated: true
                }
            }
        };
    };

    const downloadDataset = () => {
        if (!generatedDataset) return;

        const usersCSV = convertToCSV(generatedDataset.users, 'users');
        const connectionsCSV = convertToCSV(generatedDataset.connections, 'connections');

        downloadCSV(usersCSV, 'voip_users_dataset.csv');
        downloadCSV(connectionsCSV, 'voip_connections_dataset.csv');
    };

    const convertToCSV = (data: any[], type: string) => {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        return csvContent;
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-8xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dataset Creator</h1>
                        <p className="text-gray-600">Generate synthetic VOIP call datasets for analysis and testing</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dataset Configuration</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Users
                                </label>
                                <input
                                    type="number"
                                    min="10"
                                    max="10000"
                                    value={config.numUsers}
                                    onChange={(e) => {
                                        const newNumUsers = parseInt(e.target.value) || 100;
                                        setConfig({
                                            ...config,
                                            numUsers: newNumUsers,
                                            numSuspiciousUsers: Math.min(config.numSuspiciousUsers, newNumUsers)
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Database className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">Automatic Connection Calculation</span>
                                </div>
                                <div className="text-xs text-blue-700 space-y-1">
                                    <p>• Each suspicious user gets exactly 150 connections (breaks &gt;100 calls rule)</p>
                                    <p>• Each normal user gets exactly 5 connections (guaranteed clean)</p>
                                    <p>• Normal users: NO odd hours, NO short calls, NO failed connections</p>
                                    {config.enableVPNDetection && (
                                        <p>• VPN patterns: Multiple countries, shared IPs, SIP mismatches, timing anomalies</p>
                                    )}
                                    <p>• Total connections: {150 * config.numSuspiciousUsers + 5 * (config.numUsers - config.numSuspiciousUsers)}</p>
                                </div>
                            </div>

                            {/* <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Users className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">Enhanced User Metadata</span>
                                </div>
                                <div className="text-xs text-green-700 space-y-1">
                                    <p>• Complete user profiles with email, phone, location, country, timezone</p>
                                    <p>• Realistic registration dates and geographic distribution</p>
                                    <p>• All metadata will be available in VOIP Monitor analysis</p>
                                    <p>• CSV files include: username, email, phone, location, country, timezone, ip_address, registration_date, status</p>
                                </div>
                            </div> */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Time Range (Days)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={config.timeRange}
                                    onChange={(e) => setConfig({ ...config, timeRange: parseInt(e.target.value) || 30 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Suspicious Users
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={config.numUsers}
                                    value={config.numSuspiciousUsers}
                                    onChange={(e) => setConfig({ ...config, numSuspiciousUsers: parseInt(e.target.value) || 15 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Maximum: {config.numUsers} users • These users will have suspicious calling patterns
                                </p>
                            </div>

                            <div className="flex-column items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <input
                                    type="checkbox"
                                    id="vpn-detection"
                                    checked={config.enableVPNDetection}
                                    onChange={(e) => setConfig({ ...config, enableVPNDetection: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="vpn-detection" className="text-sm font-medium text-blue-800">
                                    Enable VPN Detection Patterns
                                </label>
                                <div className="flex-1 ml-3">
                                    <p className="text-xs text-blue-700">
                                        Suspicious users will also exhibit VPN-related patterns: multiple countries, shared IPs, SIP header mismatches, and timing anomalies
                                    </p>
                                </div>
                            </div>

                            <div className="flex-column items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                    <label className="text-sm font-medium text-red-800">
                                        Blocked Countries Detection (Always Enabled)
                                    </label>
                                </div>
                                <div className="flex-1 ml-3">
                                    <p className="text-xs text-red-700">
                                        Suspicious users are automatically assigned according to the provided government database to blocked countries (RU, CN, KP, IR, SY, VE, CU, MM, BY, UZ) for geographic-based threat detection
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={generateDataset}
                                disabled={isGenerating}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isGenerating ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Generating Dataset...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Database className="w-5 h-5" />
                                        <span>Generate Dataset</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {!generatedDataset ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Dataset Generated</h3>
                            <p className="text-gray-500 mb-6">
                                Configure your dataset parameters and click "Generate Dataset" to create a new dataset.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500 justify-center text-center">
                                <div className="flex items-center justify-center space-x-2">
                                    <Users className="w-4 h-4" />
                                    <span>Users</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>Connections</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Time Range</span>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Dataset Summary</h3>
                                    <button
                                        onClick={downloadDataset}
                                        className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                                    >
                                        <Download className="w-4 h-4 inline mr-2" />
                                        Download Dataset
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{generatedDataset.metadata.total_users}</div>
                                        <div className="text-sm text-blue-600">Total Users</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{generatedDataset.metadata.total_connections}</div>
                                        <div className="text-sm text-green-600">All Connections</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">{generatedDataset.metadata.time_range_days}</div>
                                        <div className="text-sm text-purple-600">Days</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{generatedDataset.metadata.suspicious_users}</div>
                                        <div className="text-sm text-red-600">Suspicious Users</div>
                                    </div>
                                    {generatedDataset.metadata.vpn_detection_enabled && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <div className="text-2xl font-bold text-blue-600">VPN</div>
                                            <div className="text-sm text-blue-600">Detection Enabled</div>
                                        </div>
                                    )}
                                    {generatedDataset.metadata.blocked_countries_enabled && (
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <div className="text-2xl font-bold text-red-600">BLOCKED</div>
                                            <div className="text-sm text-red-600">Countries Enabled</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dataset Preview</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Users Sample (First 5)</h4>
                                        <div className="overflow-x-auto">
                                                                                    <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {generatedDataset.users.slice(0, 5).map((user: any) => (
                                                    <tr key={user.id}>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{user.location}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{user.country}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Connections Sample (First 5)</h4>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dest IP</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packet Bytes</th>
                                                        {config.enableVPNDetection && (
                                                            <>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latency</th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {generatedDataset.connections.slice(0, 5).map((conn: any) => (
                                                        <tr key={conn.id}>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{conn.username}</td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{conn.destination}</td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{conn.destination_ip}</td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{conn.duration}s</td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${conn.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    {conn.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{(conn.packet_bytes / 1024).toFixed(1)}KB</td>
                                                            {config.enableVPNDetection && (
                                                                <>
                                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{conn.country}</td>
                                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{conn.latency_ms}ms</td>
                                                                </>
                                                            )}
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
            </div>
        </div>
    );
}