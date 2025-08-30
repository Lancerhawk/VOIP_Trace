'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, User, Globe, Shield } from 'lucide-react';

interface PopInNotificationProps {
  notification: {
    id: string;
    type: 'suspicious_user' | 'blocked_country' | 'vpn_detected' | 'high_risk';
    title: string;
    message: string;
    userData?: {
      username: string;
      suspiciousScore: number;
      country: string;
      reasons: string[];
    };
  };
  onClose: (id: string) => void;
}

const PopInNotification: React.FC<PopInNotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

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
        return 'bg-red-50 border-red-200';
      case 'blocked_country':
        return 'bg-orange-50 border-orange-200';
      case 'vpn_detected':
        return 'bg-blue-50 border-blue-200';
      case 'high_risk':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      className={`fixed top-4 left-80 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : isLeaving 
            ? '-translate-x-full opacity-0' 
            : '-translate-x-full opacity-0'
      }`}
    >
      <div className={`border-l-4 border-l-red-500 rounded-lg shadow-lg ${getNotificationColor(notification.type)}`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h3>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                {notification.message}
              </p>
              
              {/* User Data for suspicious users */}
              {notification.userData && (
                <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {notification.userData.username}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      notification.userData.suspiciousScore >= 8 ? 'bg-red-100 text-red-800' :
                      notification.userData.suspiciousScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Score: {notification.userData.suspiciousScore}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {notification.userData.country} • {notification.userData.reasons[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopInNotification;
