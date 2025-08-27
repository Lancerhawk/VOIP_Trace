'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Monitor, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Shield, 
  Users, 
  Phone,
  ArrowRight,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalConnections: number;
  suspiciousActivity: number;
  detectionRate: number;
  recentScans: number;
  activeAlerts: number;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalConnections: 0,
    suspiciousActivity: 0,
    detectionRate: 0,
    recentScans: 0,
    activeAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [recentActivity] = useState([
    { type: 'Dataset Generated', description: 'Created dataset with 150 users and 2,500 connections', time: '2 hours ago', status: 'success' },
    { type: 'Analysis Complete', description: 'Detected 12 suspicious users in uploaded dataset', time: '4 hours ago', status: 'warning' },
    { type: 'System Update', description: 'Updated detection rules for better accuracy', time: '1 day ago', status: 'info' }
  ]);

  // Check if user is in guest mode
  useEffect(() => {
    const guestMode = document.cookie.includes('guest_mode=true');
    setIsGuestMode(guestMode);
  }, []);

  // Get real-time data from localStorage if available
  const getRealTimeStats = () => {
    try {
      // Check if we have analysis results from VOIP Monitor
      const analysisData = localStorage.getItem('voip_analysis_results');
      if (analysisData) {
        const parsed = JSON.parse(analysisData);
        return {
          totalUsers: parsed.totalUsers || 0,
          totalConnections: parsed.totalConnections || 0,
          suspiciousActivity: parsed.suspiciousUsers || 0,
          detectionRate: parsed.detectionRate || 0,
          recentScans: parsed.recentScans || 1,
          activeAlerts: parsed.suspiciousUsers > 0 ? parsed.suspiciousUsers : 0
        };
      }
      
      // Check if we have dataset creation data
      const datasetData = localStorage.getItem('dataset_creation_data');
      if (datasetData) {
        const parsed = JSON.parse(datasetData);
        return {
          totalUsers: parsed.numUsers || 0,
          totalConnections: parsed.numConnections || 0,
          suspiciousActivity: 0,
          detectionRate: 0,
          recentScans: 1,
          activeAlerts: 0
        };
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
    }
    
    return {
      totalUsers: 0,
      totalConnections: 0,
      suspiciousActivity: 0,
      detectionRate: 0,
      recentScans: 0,
      activeAlerts: 0
    };
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Refresh stats every 30 seconds to keep them current
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Get real-time stats from localStorage
      const realTimeStats = getRealTimeStats();
      setStats(realTimeStats);
      
      // Try to fetch from API as well (for future use)
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const apiData = await response.json();
          // Merge API data with real-time data
          setStats(prev => ({
            ...prev,
            ...apiData
          }));
        }
      } catch (apiError) {
        // API not available, continue with real-time data
        console.log('API not available, using real-time data');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default values on error
      setStats({
        totalUsers: 0,
        totalConnections: 0,
        suspiciousActivity: 0,
        detectionRate: 0,
        recentScans: 0,
        activeAlerts: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Dataset',
      description: 'Generate synthetic VOIP call data for testing',
      icon: Database,
      href: '/dashboard/dataset_creator',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Upload & Analyze',
      description: 'Upload CSV dataset and detect suspicious activity',
      icon: Monitor,
      href: '/dashboard/voip_monitor',
      color: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    },
    {
      title: 'View Analytics',
      description: 'Comprehensive insights and reporting of the Datasets used',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'Settings',
      description: 'Configure system preferences and account',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
    }
  ];

  const statsCards = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Registered users in system'
    },
    { 
      label: 'Total Connections', 
      value: stats.totalConnections.toLocaleString(), 
      icon: Phone, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Call connections analyzed'
    },
    { 
      label: 'Suspicious Activity', 
      value: stats.suspiciousActivity.toLocaleString(), 
      icon: Shield, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Detected suspicious patterns'
    },
    { 
      label: 'Detection Rate', 
      value: `${stats.detectionRate}%`, 
      icon: TrendingUp, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'AI detection accuracy'
    }
  ];

  const systemStatusCards = [
    {
      label: 'Recent Scans',
      value: stats.recentScans,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'active'
    },
    {
      label: 'Active Alerts',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      status: stats.activeAlerts > 0 ? 'warning' : 'success'
    }
  ];

  return (
    <div className="p-8 max-w-8xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to VOIP Trace</h1>
          <p className="text-lg text-gray-600">Your comprehensive VOIP monitoring and analysis platform</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <div className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}>
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
          <span>{isLoading ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Guest Mode Notice */}
      {isGuestMode && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Guest Mode Active
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You're using a guest account. Some features are limited. <Link href="/authpage/sign_up" className="font-medium underline hover:text-yellow-600">Sign up now</Link> to unlock all features and save your data permanently.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : 
                     stat.value === '0' ? 'Coming Soon' : 
                     stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.value === '0' ? 'Upload data to see real stats' : stat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isRestricted = isGuestMode && (action.title === 'View Analytics' || action.title === 'Settings');
            
            if (isRestricted) {
              return (
                <div key={index} className="bg-gray-300 text-gray-500 p-6 rounded-xl cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div>
                      <Icon className="w-8 h-8 mb-3" />
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-gray-400 text-sm">Requires verified account</p>
                    </div>
                    <div className="w-5 h-5 opacity-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <Link key={index} href={action.href}>
                <div className={`${action.color} text-white p-6 rounded-xl transition-all duration-200 hover:shadow-xl group transform hover:scale-105`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Icon className="w-8 h-8 mb-3" />
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-blue-100 text-sm">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Show real activity if available, otherwise show Coming Soon */}
            {stats.recentScans > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">Real-time activity tracking will be available after your first analysis</p>
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span>Upload data to see live activity</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-4">
            {/* Show real stats if available, otherwise show Coming Soon */}
            {stats.recentScans > 0 ? (
              <>
                {systemStatusCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`${stat.bgColor} p-4 rounded-lg border border-gray-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Icon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{stat.label}</span>
                            <p className="text-sm text-gray-600">{stat.value}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          stat.status === 'success' ? 'bg-green-200 text-green-800' :
                          stat.status === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {stat.status === 'success' ? 'Operational' : 
                           stat.status === 'warning' ? 'Attention' : 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-green-900">System Status</span>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold bg-green-200 text-green-800 rounded-full">
                      Operational
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">System monitoring and alerts will be available after your first analysis</p>
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Upload data to enable monitoring</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
            <p>Use the <strong>Dataset Creator</strong> to generate synthetic VOIP call data for testing and development</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
            <p>Upload your CSV datasets to the <strong>VOIP Monitor</strong> for suspicious activity analysis</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
            <p>View detailed <strong>Analytics</strong> and reports to understand call patterns and threats</p>
          </div>
        </div>
      </div>
    </div>
  );
}
