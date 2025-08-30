'use client';

import React from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationIcon: React.FC = () => {
  const { unreadCount, toggleSidebar } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleSidebar}
        className="relative bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
        
        {/* Pulse effect for new notifications */}
        {unreadCount > 0 && (
          <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-75"></div>
        )}
      </button>
    </div>
  );
};

export default NotificationIcon;
