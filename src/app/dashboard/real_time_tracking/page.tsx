'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Globe, 
  Wifi,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Trash2,
  ExternalLink,
  Zap,
  X,
  Info,
  Clock,
  MapPin,
  Network,
  FileText
} from 'lucide-react';

interface PacketData {
  srcIP: string;
  destIP: string;
  protocol: string;
  srcPort: number;
  destPort: number;
  packetLength: number;
  timestamp: string;
  suspicionLevel: number;
  reason: string;
  rawData?: any;
  destinationIP?: string;
  packetBytes?: number;
}

interface ServerStatus {
  status: string;
  timestamp: string;
  packetCapture: {
    isRunning: boolean;
  };
  rules: {
    blacklistedCountries: string[];
    blacklistedIPs: string[];
    suspiciousPorts: number[];
  };
}

interface CaptureSettings {
  interface: string;
  filter: string;
}

export default function RealTimeTrackingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [captureSettings, setCaptureSettings] = useState<CaptureSettings>({
    interface: '\\Device\\NPF_{C8C3870C-2FD7-4C82-AB79-88ED7CDC9148}',
    filter: 'tcp or udp'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filteredPackets, setFilteredPackets] = useState<PacketData[]>([]);
  const [suspicionFilter, setSuspicionFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [trafficUrl, setTrafficUrl] = useState<string>('https://httpbin.org/get');
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null);
  const [showPacketModal, setShowPacketModal] = useState(false);
  const packetsEndRef = useRef<HTMLDivElement>(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

  // Auto-scroll to bottom when new packets arrive
  useEffect(() => {
    if (autoScroll && packetsEndRef.current) {
      packetsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [packets, autoScroll]);

  // Filter packets based on selected filters
  useEffect(() => {
    let filtered = packets;

    // Filter by suspicion level
    if (suspicionFilter !== 'all') {
      const levelMap = { high: 2, medium: 1, low: 0 };
      filtered = filtered.filter(p => p.suspicionLevel === levelMap[suspicionFilter]);
    }

    // Filter by protocol
    if (protocolFilter !== 'all') {
      filtered = filtered.filter(p => p.protocol.toLowerCase() === protocolFilter.toLowerCase());
    }

    setFilteredPackets(filtered);
  }, [packets, suspicionFilter, protocolFilter]);

  // Check server connection
  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/status`);
      if (response.ok) {
        const data = await response.json();
        setServerStatus(data);
        setIsConnected(true);
        return true;
      }
    } catch (error) {
      console.error('Server connection failed:', error);
    }
    setIsConnected(false);
    return false;
  };

  // Start packet capture
  const startCapture = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/capture/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(captureSettings),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsCapturing(true);
          // Immediately fetch and display all existing packets
          fetchAndDisplayPackets();
          // Start polling for new packets
          startPacketPolling();
        }
      }
    } catch (error) {
      console.error('Failed to start capture:', error);
    }
  };

  // Stop packet capture
  const stopCapture = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/capture/stop`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsCapturing(false);
      }
    } catch (error) {
      console.error('Failed to stop capture:', error);
    }
  };

  // Fetch real packets from database
  const startPacketPolling = () => {
    const interval = setInterval(async () => {
      if (!isCapturing) {
        clearInterval(interval);
        return;
      }

      try {
        const response = await fetch(`${SERVER_URL}/api/packets?limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            const newPackets = data.data.map((p: any) => ({
              srcIP: p.srcIP,
              destIP: p.destIP,
              protocol: p.protocol,
              srcPort: p.srcPort,
              destPort: p.destPort,
              packetLength: p.packetLength,
              timestamp: p.timestamp,
              suspicionLevel: p.suspicionLevel,
              reason: p.reason,
              rawData: p.rawData,
              destinationIP: p.destinationIP || p.destIP,
              packetBytes: p.packetBytes || p.packetLength
            }));
            
            setPackets(prev => {
              const combined = [...prev, ...newPackets];
              return combined.slice(-100); // Keep last 100 packets
            });
          }
        }
      } catch (error) {
        console.error('Error fetching packets:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  // Generate traffic packets
  const generateTraffic = async () => {
    if (!isCapturing) {
      alert('Please start packet capture first!');
      return;
    }
    
    // Open the URL link first
    window.open(trafficUrl, '_blank');
    
    try {
      const response = await fetch(`${SERVER_URL}/api/capture/generate-traffic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Traffic packets generated successfully');
          // Immediately fetch and display new packets
          fetchAndDisplayPackets();
        }
      }
    } catch (error) {
      console.error('Failed to generate traffic:', error);
    }
  };

  // Fetch and display all packets from database
  const fetchAndDisplayPackets = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/packets?limit=100`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const allPackets = data.data.map((p: any) => ({
            srcIP: p.srcIP,
            destIP: p.destIP,
            protocol: p.protocol,
            srcPort: p.srcPort,
            destPort: p.destPort,
            packetLength: p.packetLength,
            timestamp: p.timestamp,
            suspicionLevel: p.suspicionLevel,
            reason: p.reason,
            rawData: p.rawData,
            destinationIP: p.destinationIP || p.destIP,
            packetBytes: p.packetBytes || p.packetLength
          }));
          
          setPackets(allPackets);
        }
      }
    } catch (error) {
      console.error('Error fetching packets:', error);
    }
  };

  // Load rules from server
  const loadRules = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/rules`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setServerStatus(prev => prev ? { ...prev, rules: data.data } : null);
        }
      }
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
  };

  // Clear all packets
  const clearPackets = () => {
    setPackets([]);
    setFilteredPackets([]);
  };

  // Open packet details modal
  const openPacketModal = (packet: PacketData) => {
    setSelectedPacket(packet);
    setShowPacketModal(true);
  };

  // Close packet details modal
  const closePacketModal = () => {
    setSelectedPacket(null);
    setShowPacketModal(false);
  };



  // Export packets to CSV
  const exportPackets = () => {
    const csvContent = [
      'Timestamp,Source IP,Destination IP,Protocol,Source Port,Destination Port,Packet Length,Suspicion Level,Reason',
      ...filteredPackets.map(p => 
        `${p.timestamp},${p.srcIP},${p.destIP},${p.protocol},${p.srcPort},${p.destPort},${p.packetLength},${p.suspicionLevel},${p.reason}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packet-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Initialize connection check
  useEffect(() => {
    checkServerConnection();
    loadRules();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSuspicionColor = (level: number) => {
    switch (level) {
      case 2: return 'text-red-600 bg-red-50 border-red-200';
      case 1: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getSuspicionText = (level: number) => {
    switch (level) {
      case 2: return 'HIGH';
      case 1: return 'MEDIUM';
      default: return 'LOW';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Real-Time Packet Analysis</h1>
              <p className="text-gray-600">Live network monitoring and suspicious activity detection</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-2 rounded-lg ${
                isConnected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Server Status Card */}
        {serverStatus && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Server Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Capture Status</p>
                  <p className={`font-semibold ${isCapturing ? 'text-green-600' : 'text-gray-600'}`}>
                    {isCapturing ? 'Running' : 'Stopped'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blacklisted IPs</p>
                  <p className="font-semibold text-gray-900">{serverStatus.rules.blacklistedIPs.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blacklisted Countries</p>
                  <p className="font-semibold text-gray-900">{serverStatus.rules.blacklistedCountries.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={isCapturing ? stopCapture : startCapture}
                disabled={!isConnected}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all ${
                  isCapturing
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isCapturing ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Capture
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Capture
                  </>
                )}
              </button>
              
              <button
                onClick={checkServerConnection}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>

              <button
                onClick={fetchAndDisplayPackets}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Activity className="w-4 h-4 mr-2" />
                Load All Packets
              </button>

              <button
                onClick={generateTraffic}
                disabled={!isCapturing}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all ${
                  isCapturing
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Traffic
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={exportPackets}
                disabled={filteredPackets.length === 0}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              
              <button
                onClick={clearPackets}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Capture Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Network Interface</label>
                <input
                  type="text"
                  value={captureSettings.interface}
                  onChange={(e) => setCaptureSettings(prev => ({ ...prev, interface: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
                <input
                  type="text"
                  value={captureSettings.filter}
                  onChange={(e) => setCaptureSettings(prev => ({ ...prev, filter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tcp or udp"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Traffic Generation URL</label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={trafficUrl}
                  onChange={(e) => setTrafficUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://httpbin.org/get"
                />
                <button
                  onClick={() => window.open(trafficUrl, '_blank')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  title="Open URL in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This URL will be opened to generate network traffic for packet capture
              </p>
              
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick URLs:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'HTTP Test', url: 'https://httpbin.org/get' },
                    { name: 'JSON API', url: 'https://jsonplaceholder.typicode.com/posts/1' },
                    { name: 'Weather API', url: 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=demo' },
                    { name: 'GitHub API', url: 'https://api.github.com/users/octocat' }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setTrafficUrl(preset.url)}
                      className="px-3 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Suspicion Level:</label>
              <select
                value={suspicionFilter}
                onChange={(e) => setSuspicionFilter(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Protocol:</label>
              <select
                value={protocolFilter}
                onChange={(e) => setProtocolFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
                <option value="icmp">ICMP</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">-
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
                  autoScroll ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {autoScroll ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                Auto-scroll
              </button>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredPackets.length} of {packets.length} packets
            </div>
          </div>
        </div>

        {/* Packet List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Live Packet Analysis</h2>
            <p className="text-gray-600 mt-1">Real-time network traffic monitoring and threat detection</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredPackets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Wifi className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No packets captured yet. Start capture to begin monitoring.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPackets.map((packet, index) => (
                  <div 
                    key={index} 
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openPacketModal(packet)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSuspicionColor(packet.suspicionLevel)}`}>
                          {getSuspicionText(packet.suspicionLevel)}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="font-mono">{packet.srcIP}</span>
                          <span>→</span>
                          <span className="font-mono">{packet.destIP}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {packet.protocol}:{packet.srcPort} → {packet.destPort}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{packet.packetLength} bytes</span>
                        <span>{new Date(packet.timestamp).toLocaleTimeString()}</span>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    {packet.suspicionLevel > 0 && (
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {packet.reason}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={packetsEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showPacketModal && selectedPacket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Packet Details</h2>
                  <p className="text-sm text-gray-600">Complete metadata and analysis</p>
                </div>
              </div>
              <button
                onClick={closePacketModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Protocol:</span>
                        <span className="text-sm text-gray-900 font-mono">{selectedPacket.protocol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Packet Length:</span>
                        <span className="text-sm text-gray-900">{selectedPacket.packetLength} bytes</span>
                      </div>
                      {selectedPacket.packetBytes && selectedPacket.packetBytes !== selectedPacket.packetLength && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Packet Bytes:</span>
                          <span className="text-sm text-gray-900">{(selectedPacket.packetBytes / 1024).toFixed(1)} KB</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Timestamp:</span>
                        <span className="text-sm text-gray-900">{new Date(selectedPacket.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Suspicion Level:</span>
                        <span className={`text-sm font-semibold ${getSuspicionColor(selectedPacket.suspicionLevel)}`}>
                          {getSuspicionText(selectedPacket.suspicionLevel)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Network Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-600" />
                      Network Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Source IP:</span>
                        <div className="text-sm text-gray-900 font-mono bg-white p-2 rounded border mt-1">
                          {selectedPacket.srcIP}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Destination IP:</span>
                        <div className="text-sm text-gray-900 font-mono bg-white p-2 rounded border mt-1">
                          {selectedPacket.destIP}
                        </div>
                      </div>
                      {selectedPacket.destinationIP && selectedPacket.destinationIP !== selectedPacket.destIP && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Additional Dest IP:</span>
                          <div className="text-sm text-gray-900 font-mono bg-white p-2 rounded border mt-1">
                            {selectedPacket.destinationIP}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Source Port:</span>
                        <span className="text-sm text-gray-900 font-mono">{selectedPacket.srcPort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Destination Port:</span>
                        <span className="text-sm text-gray-900 font-mono">{selectedPacket.destPort}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis & Security */}
                <div className="space-y-6">
                  {/* Security Analysis */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-red-600" />
                      Security Analysis
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Detection Reason:</span>
                        <div className="text-sm text-gray-900 bg-white p-2 rounded border mt-1">
                          {selectedPacket.reason}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Risk Level:</span>
                        <span className={`text-sm font-semibold ${getSuspicionColor(selectedPacket.suspicionLevel)}`}>
                          {selectedPacket.suspicionLevel === 2 ? 'HIGH RISK' : 
                           selectedPacket.suspicionLevel === 1 ? 'MEDIUM RISK' : 'LOW RISK'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Threat Category:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPacket.reason.includes('IP') ? 'IP-based Threat' :
                           selectedPacket.reason.includes('port') ? 'Port-based Threat' :
                           selectedPacket.reason.includes('country') ? 'Geographic Threat' : 'Normal Traffic'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Protocol Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-600" />
                      Protocol Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Protocol Type:</span>
                        <span className="text-sm text-gray-900">{selectedPacket.protocol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Service:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPacket.destPort === 80 ? 'HTTP' :
                           selectedPacket.destPort === 443 ? 'HTTPS' :
                           selectedPacket.destPort === 53 ? 'DNS' :
                           selectedPacket.destPort === 22 ? 'SSH' :
                           selectedPacket.destPort === 23 ? 'Telnet' :
                           selectedPacket.destPort === 21 ? 'FTP' :
                           selectedPacket.destPort === 25 ? 'SMTP' :
                           selectedPacket.destPort === 110 ? 'POP3' :
                           selectedPacket.destPort === 143 ? 'IMAP' :
                           'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Connection Type:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPacket.protocol === 'TCP' ? 'Connection-oriented' :
                           selectedPacket.protocol === 'UDP' ? 'Connectionless' :
                           'Other'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Geographic Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                      Geographic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Source Country:</span>
                        <span className="text-sm text-gray-900">Unknown</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Destination Country:</span>
                        <span className="text-sm text-gray-900">Unknown</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Network Type:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPacket.srcIP.startsWith('192.168.') || selectedPacket.srcIP.startsWith('10.') || selectedPacket.srcIP.startsWith('172.') ? 'Private Network' : 'Public Network'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Data Section */}
              {selectedPacket.rawData && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-600" />
                    Raw Packet Data
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(selectedPacket.rawData, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closePacketModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Copy packet details to clipboard
                  navigator.clipboard.writeText(JSON.stringify(selectedPacket, null, 2));
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Copy Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}