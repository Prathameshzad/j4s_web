'use client';

import { useEffect, useState } from 'react';

export const useSSE = (token, selectedUserId, selectedRole, onNotification) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      console.log('🔌 SSE: No token provided, skipping connection');
      return;
    }

    // Determine the base URL dynamically if possible
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
    
    // If we are on a network IP, try to use the same host for the backend if baseUrl is default
    if (typeof window !== 'undefined' && baseUrl.includes('localhost') && !window.location.hostname.includes('localhost')) {
      baseUrl = baseUrl.replace('localhost', window.location.hostname);
    }

    // Fix: Remove duplicate /api/web if baseUrl already includes it
    const cleanBaseUrl = baseUrl.endsWith('/api/web') ? baseUrl.replace('/api/web', '') : baseUrl;
    const url = `${cleanBaseUrl}/api/web/notification/subscribe?token=${token}${selectedUserId ? `&userId=${selectedUserId}` : ''}${selectedRole ? `&role=${selectedRole}` : ''}`;
    
    console.log('🔌 SSE: Attempting connection to:', url);
    
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setConnected(true);
      console.log('✅ SSE: Connected successfully');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 SSE: Received message:', data);
        if (data.connected) return;
        if (onNotification) onNotification(data);
      } catch (err) {
        console.error('❌ SSE: JSON parse error:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE: Connection error', error);
      setConnected(false);
      eventSource.close();
    };

    return () => {
      console.log('🔌 SSE: Closing connection');
      eventSource.close();
      setConnected(false);
    };
  }, [token, selectedUserId, selectedRole, onNotification]);

  return { connected };
};
