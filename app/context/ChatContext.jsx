'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user, token, selectedRole, selectedUserId } = useAuth();
    const [socket, setSocket] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [messages, setMessages] = useState({}); // { [roomId]: [msg1, msg2] }
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (token && user) {
            // Determine backend URL dynamically
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            if (typeof window !== 'undefined' && backendUrl.includes('localhost') && !window.location.hostname.includes('localhost')) {
                backendUrl = backendUrl.replace('localhost', window.location.hostname);
            }
            
            // Remove /api/web for socket connection (it should be to the root of the server)
            const socketUrl = backendUrl.split('/api/web')[0];
            
            console.log('🔌 Chat: Connecting to', socketUrl);
            const newSocket = io(socketUrl, {
                transports: ['websocket'],
                reconnection: true
            });

            newSocket.on('connect', () => {
                console.log('✅ Chat: Connected to Socket.io');
                setConnected(true);
                // Authenticate with the correct ID
                const authId = selectedUserId || user.id;
                newSocket.emit('authenticate', authId);
            });

            newSocket.on('disconnect', () => {
                console.log('❌ Chat: Disconnected');
                setConnected(false);
            });

            newSocket.on('new_message', (message) => {
                setMessages(prev => ({
                    ...prev,
                    [message.roomId]: [...(prev[message.roomId] || []), message]
                }));
            });

            newSocket.on('message_edited', (message) => {
                setMessages(prev => ({
                    ...prev,
                    [message.roomId]: (prev[message.roomId] || []).map(m => m.id === message.id ? message : m)
                }));
            });

            newSocket.on('authenticated', (data) => {
                console.log('👤 Chat: Authenticated as', selectedUserId || user.id);
            });

            setSocket(newSocket);

            // Fetch rooms initially via REST
            const cleanBaseUrl = backendUrl.endsWith('/api/web') ? backendUrl.replace('/api/web', '') : backendUrl;
            const roomsUrl = `${cleanBaseUrl}/api/web/chat/rooms`;
            
            axios.get(roomsUrl, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole || '',
                    'x-selected-user-id': selectedUserId || ''
                }
            })
            .then(res => {
                if (res.data.success) setRooms(res.data.data);
            })
            .catch(err => console.error('Error fetching chat rooms:', err));

            return () => {
                newSocket.close();
                setSocket(null);
            };
        }
    }, [token, user, selectedRole, selectedUserId]);

    useEffect(() => {
        if (activeRoomId && token) {
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            if (typeof window !== 'undefined' && backendUrl.includes('localhost') && !window.location.hostname.includes('localhost')) {
                backendUrl = backendUrl.replace('localhost', window.location.hostname);
            }
            const cleanBaseUrl = backendUrl.endsWith('/api/web') ? backendUrl.replace('/api/web', '') : backendUrl;
            const msgsUrl = `${cleanBaseUrl}/api/web/chat/rooms/${activeRoomId}/messages`;

            axios.get(msgsUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (res.data.success) {
                    setMessages(prev => ({
                        ...prev,
                        [activeRoomId]: res.data.data
                    }));
                }
            })
            .catch(err => console.error('Error fetching messages:', err));
        }
    }, [activeRoomId, token]);

    const sendMessage = useCallback((roomId, content, replyToId = null) => {
        if (socket && connected) {
            const authId = selectedUserId || user.id;
            socket.emit('send_message', {
                roomId,
                senderId: authId,
                content,
                replyToId
            });
        } else {
            console.warn('⚠️ Chat: Cannot send message, socket not connected');
        }
    }, [socket, connected, user, selectedUserId]);

    const editMessage = useCallback((messageId, content) => {
        if (socket && connected) {
            const authId = selectedUserId || user.id;
            socket.emit('edit_message', {
                messageId,
                senderId: authId,
                content
            });
        }
    }, [socket, connected, user, selectedUserId]);

    return (
        <ChatContext.Provider value={{ 
            socket, 
            rooms, 
            messages, 
            activeRoomId, 
            setActiveRoomId, 
            sendMessage,
            editMessage,
            connected
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
