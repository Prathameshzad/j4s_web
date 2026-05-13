'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSSE } from '../hooks/useSSE';
import axios from 'axios';
import { useAuth } from '../app/context/AuthContext';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token, selectedUserId, selectedRole } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      if (!token) return;

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
      // Ensure we don't have duplicate /api/web
      const endpoint = baseUrl.endsWith('/api/web') ? `${baseUrl}/notification` : `${baseUrl}/api/web/notification`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-selected-user-id': selectedUserId,
          'x-selected-role': selectedRole
        }
      });

      if (response.data.success || response.data.notifications) {
        const notifs = response.data.notifications || response.data.data;
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [token, selectedUserId, selectedRole]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show a toast
    toast.success(
      <div>
        <p className="font-bold">{notification.title}</p>
        <p className="text-xs">{notification.body}</p>
      </div>,
      { duration: 5000, icon: '🔔' }
    );

    // Optional: Show a browser notification
    if (Notification.permission === 'granted') {
        new Notification(notification.title, {
            body: notification.body,
        });
    }
  }, []);

  const { connected } = useSSE(token, selectedUserId, selectedRole, handleNewNotification);

  const markAsRead = async (id) => {
    try {
      if (!token) return;
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
      const cleanBaseUrl = baseUrl.endsWith('/api/web') ? baseUrl.replace('/api/web', '') : baseUrl;
      
      await axios.patch(`${cleanBaseUrl}/api/web/notification/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-selected-user-id': selectedUserId,
          'x-selected-role': selectedRole
        }
      });

      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!token) return;

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
      const cleanBaseUrl = baseUrl.endsWith('/api/web') ? baseUrl.replace('/api/web', '') : baseUrl;

      await axios.patch(`${cleanBaseUrl}/api/web/notification/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-selected-user-id': selectedUserId,
          'x-selected-role': selectedRole
        }
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        connected 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
