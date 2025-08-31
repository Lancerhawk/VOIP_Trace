'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NotificationIcon from './NotificationIcon';
import NotificationSidebar from './NotificationSidebar';
import PopInNotification from './PopInNotification';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationManager: React.FC = () => {
  const { notifications } = useNotifications();
  const [popInNotifications, setPopInNotifications] = useState<string[]>([]);
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  // Check if we're on auth pages or landing pages where notifications shouldn't show
  const isAuthPage = pathname?.startsWith('/authpage') || 
                    pathname?.startsWith('/home') || 
                    pathname?.startsWith('/about') || 
                    pathname?.startsWith('/contact') || 
                    pathname?.startsWith('/services') ||
                    pathname === '/';

  // Handle new notifications for pop-in display
  useEffect(() => {
    const latestNotification = notifications[0];
    // Only show pop-in notifications for specific types (exclude 'success' and 'error')
    const popInTypes = ['suspicious_user', 'blocked_country', 'vpn_detected', 'high_risk'];
    
    if (latestNotification && 
        popInTypes.includes(latestNotification.type) &&
        !latestNotification.read && 
        !popInNotifications.includes(latestNotification.id) &&
        !shownNotifications.has(latestNotification.id)) {
      setPopInNotifications(prev => [latestNotification.id, ...prev].slice(0, 3)); // Show max 3 pop-ins
      setShownNotifications(prev => new Set([...prev, latestNotification.id]));
    }
  }, [notifications, popInNotifications, shownNotifications]);

  const handlePopInClose = (id: string) => {
    setPopInNotifications(prev => prev.filter(notificationId => notificationId !== id));
  };

  // Don't render notifications on auth pages or landing pages
  if (isAuthPage) {
    return null;
  }

  return (
    <>
      <NotificationIcon />
      <NotificationSidebar />
      
      {/* Pop-in notifications */}
      {popInNotifications.map((notificationId) => {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return null;
        
        // Only render pop-in notifications for supported types
        const popInTypes = ['suspicious_user', 'blocked_country', 'vpn_detected', 'high_risk'];
        if (!popInTypes.includes(notification.type)) return null;
        
        // Type assertion to ensure compatibility with PopInNotification
        const popInNotification = notification as {
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
        
        return (
          <PopInNotification
            key={notificationId}
            notification={popInNotification}
            onClose={handlePopInClose}
          />
        );
      })}
    </>
  );
};

export default NotificationManager;
