'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/app/context/ChatContext';
import { useAuth } from '@/app/context/AuthContext';
import { 
    Send, 
    MessageCircle, 
    Search, 
    MoreVertical, 
    Smile,
    Paperclip,
    User,
    ChevronLeft,
    Share2
} from 'lucide-react';
import { Button, Input, Avatar, AvatarFallback, AvatarImage, ScrollArea, Badge, Separator } from "@/component/ui/CustomUI"

const ChatPage = () => {
    const { rooms, messages, sendMessage, socket } = useChat();
    const { user, token, selectedUserId } = useAuth();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [input, setInput] = useState('');
    const [localMessages, setLocalMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef();

    // Fetch history when room selected
    useEffect(() => {
        if (selectedRoom) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms/${selectedRoom.id}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLocalMessages(data.data);
                }
            });
        }
    }, [selectedRoom, token]);

    // Update messages from context
    useEffect(() => {
        if (selectedRoom && messages[selectedRoom.id]) {
            const historyIds = new Set(localMessages.map(m => m.id));
            const newMsgs = messages[selectedRoom.id].filter(m => !historyIds.has(m.id));
            if (newMsgs.length > 0) {
                setLocalMessages(prev => [...prev, ...newMsgs]);
            }
        }
    }, [messages, selectedRoom, localMessages]);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [localMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedRoom) return;
        sendMessage(selectedRoom.id, input);
        setInput('');
    };

    const getLatestMessageTime = (room) => {
        const contextMsgs = messages[room.id] || [];
        const latestContextMsg = contextMsgs[contextMsgs.length - 1];
        const apiMsg = room.messages?.[0];
        
        const contextTime = latestContextMsg ? new Date(latestContextMsg.createdAt).getTime() : 0;
        const apiTime = apiMsg ? new Date(apiMsg.createdAt).getTime() : 0;
        
        return Math.max(contextTime, apiTime);
    };

    const sortedRooms = [...rooms].sort((a, b) => getLatestMessageTime(b) - getLatestMessageTime(a));

    const filteredRooms = sortedRooms.filter(room => 
        (room.displayName || room.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Sidebar: Chat List */}
            <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 ${selectedRoom ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Messages
                        </h1>
                        <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-none font-bold px-3">
                            {rooms.length} Active
                        </Badge>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..." 
                            className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" 
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 min-h-0 pb-4">
                    <div className="space-y-2">
                        {filteredRooms.map(room => (
                            <button
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                    selectedRoom?.id === room.id 
                                    ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' 
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                                }`}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${room.id}&backgroundColor=f8fafc,f1f5f9`} />
                                        <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">
                                            {room.name?.charAt(0) || 'G'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-green-500"></div>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold truncate text-sm text-slate-900 dark:text-slate-100">{room.displayName || room.name || 'Group Chat'}</span>
                                        <span className="text-[10px] text-slate-500">
                                            {getLatestMessageTime(room) > 0 
                                                ? new Date(getLatestMessageTime(room)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                                : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-500 truncate">
                                            {(() => {
                                                const contextMsgs = messages[room.id] || [];
                                                const lastMsg = contextMsgs[contextMsgs.length - 1] || room.messages?.[0];
                                                return lastMsg ? lastMsg.content : 'No messages yet';
                                            })()}
                                        </p>
                                        {selectedRoom?.id !== room.id && <div className="h-2 w-2 rounded-full bg-orange-500/20"></div>}
                                    </div>
                                </div>
                            </button>
                        ))}
                        {filteredRooms.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                                <MessageCircle className="h-8 w-8 mb-3 opacity-20" />
                                <p className="text-sm font-medium">No Chats Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main: Chat Window */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-slate-950 ${!selectedRoom ? 'hidden md:flex' : 'flex'}`}>
                {selectedRoom ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="md:hidden" 
                                    onClick={() => setSelectedRoom(null)}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-800">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${selectedRoom.id}&backgroundColor=f8fafc`} />
                                        <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">
                                            {selectedRoom.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-950"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900 dark:text-white">{selectedRoom.displayName || selectedRoom.name}</span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Active Now
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="text-slate-500">
                                    <Search className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-500">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-500">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50 dark:bg-slate-950/50">
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-xs font-normal text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        Today
                                    </Badge>
                                </div>
                                {localMessages.map((msg, idx) => {
                                    const currentId = selectedUserId || user?.id;
                                    const isMe = msg.senderId === currentId || msg.sender?.id === currentId;
                                    return (
                                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${idx * 50}ms` }}>
                                            <Avatar className="h-8 w-8 self-end mb-4">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} />
                                                <AvatarFallback className="text-xs bg-slate-200">{msg.sender?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                <span className={`text-xs font-semibold mb-0.5 ${isMe ? 'mr-1 text-slate-500' : 'ml-1 text-slate-700 dark:text-slate-300'}`}>
                                                    {isMe ? 'You' : (msg.sender?.name || 'Unknown User')}
                                                </span>
                                                <div className={`px-4 py-2.5 rounded-2xl ${
                                                    isMe 
                                                    ? 'bg-orange-500 text-white rounded-br-sm' 
                                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                                                }`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                                <span className="text-[10px] text-slate-400 px-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} className="h-px"></div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
                                <Button type="button" variant="ghost" size="icon" className="text-slate-500 shrink-0">
                                    <Smile className="h-5 w-5" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" className="text-slate-500 shrink-0">
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                                <Input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..." 
                                    className="flex-1 bg-slate-100 dark:bg-slate-900 border-transparent focus-visible:ring-1 focus-visible:ring-slate-300 rounded-full px-4"
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="flex-shrink-0 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 w-12 h-12 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    <Send className="h-5 w-5" strokeWidth={2.5} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900">
                        <div className="h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6">
                            <MessageCircle className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Select a Conversation
                        </h3>
                        <p className="text-slate-500 max-w-sm text-sm">
                            Choose a chat from the sidebar to start messaging with your class or faculty members.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
