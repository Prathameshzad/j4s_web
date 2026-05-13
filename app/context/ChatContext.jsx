'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user, token, selectedRole, selectedUserId } = useAuth();
    const [socket, setSocket] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [messages, setMessages] = useState({}); // { [roomId]: [msg1, msg2] }
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (token && user) {
            const newSocket = io('http://localhost:5000', {
                auth: { token }
            });

            newSocket.on('connect', () => {
                console.log('✅ Connected to Chat');
                newSocket.emit('authenticate', selectedUserId || user.id);
            });

            newSocket.on('new_message', (message) => {
                setMessages(prev => ({
                    ...prev,
                    [message.roomId]: [...(prev[message.roomId] || []), message]
                }));
            });

            // Fetch rooms initially via REST
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole || '',
                    'x-selected-user-id': selectedUserId || ''
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) setRooms(data.data);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [token, user, selectedRole, selectedUserId]);

    useEffect(() => {
        if (activeRoomId && token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms/${activeRoomId}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessages(prev => ({
                        ...prev,
                        [activeRoomId]: data.data
                    }));
                }
            });
        }
    }, [activeRoomId, token]);

    const sendMessage = (roomId, content) => {
        if (socket) {
            socket.emit('send_message', {
                roomId,
                senderId: user.id,
                content
            });
        }
    };

    return (
        <ChatContext.Provider value={{ 
            socket, 
            rooms, 
            messages, 
            activeRoomId, 
            setActiveRoomId, 
            sendMessage 
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
