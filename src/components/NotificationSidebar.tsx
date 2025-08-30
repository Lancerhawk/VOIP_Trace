'use client';

import React from 'react';
import { X, AlertTriangle, Shield, Globe, User, Clock, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationSidebar: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    isSidebarOpen, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications, 
    closeSidebar 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'suspicious_user':
        return <User className="w-5 h-5 text-red-600" />;
      case 'blocked_country':
        return <Globe className="w-5 h-5 text-orange-600" />;
      case 'vpn_detected':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'high_risk':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'suspicious_user':
        return 'border-l-red-500 bg-red-50';
      case 'blocked_country':
        return 'border-l-orange-500 bg-orange-50';
      case 'vpn_detected':
        return 'border-l-blue-500 bg-blue-50';
      case 'high_risk':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 " style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Security Alerts</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Mark all as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={clearNotifications}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeSidebar}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <AlertTriangle className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">Security alerts will appear here</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      notification.read ? 'opacity-75' : ''
                    } ${getNotificationColor(notification.type)}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        
                        {/* User Data for suspicious users */}
                        {notification.userData && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-600">User Details</span>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                notification.userData.suspiciousScore >= 8 ? 'bg-red-100 text-red-800' :
                                notification.userData.suspiciousScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                Score: {notification.userData.suspiciousScore}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Username:</span>
                                <span className="font-medium">{notification.userData.username}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Country:</span>
                                <span className="font-medium">{notification.userData.country}</span>
                              </div>
                              <div className="mt-2">
                                <span className="text-gray-500">Reasons:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {notification.userData.reasons.map((reason, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                      {reason}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Security alerts are generated automatically when suspicious activity is detected
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;
