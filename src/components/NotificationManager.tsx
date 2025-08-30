'use client';

import React, { useState, useEffect } from 'react';
import NotificationIcon from './NotificationIcon';
import NotificationSidebar from './NotificationSidebar';
import PopInNotification from './PopInNotification';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationManager: React.FC = () => {
  const { notifications } = useNotifications();
  const [popInNotifications, setPopInNotifications] = useState<string[]>([]);
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(new Set());

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
        
        return (
          <PopInNotification
            key={notificationId}
            notification={notification}
            onClose={handlePopInClose}
          />
        );
      })}
    </>
  );
};

export default NotificationManager;
