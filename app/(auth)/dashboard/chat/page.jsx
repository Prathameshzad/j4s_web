'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/app/context/ChatContext';
import { useAuth } from '@/app/context/AuthContext';
import { getMediaUrl } from '@/utils/media';
import Image from 'next/image';
import { 
    Send, 
    MessageCircle, 
    Search, 
    MoreVertical, 
    Smile,
    Paperclip,
    User,
    ChevronLeft,
    Share2,
    Volume2,
    FileText,
    Reply,
    Pencil,
    X,
    CheckCheck
} from 'lucide-react';
import { 
    Button, 
    Input, 
    Avatar, 
    AvatarFallback, 
    AvatarImage, 
    ScrollArea, 
    Badge, 
    Separator, 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/component/ui/CustomUI"

const ChatPage = () => {
    const { rooms, messages, sendMessage, editMessage, socket } = useChat();
    const { user, token, selectedUserId } = useAuth();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [input, setInput] = useState('');
    const [localMessages, setLocalMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef();

    // Advanced Chat State
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);

    // Image Viewer State
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');

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
            setLocalMessages(messages[selectedRoom.id]);
        }
    }, [messages, selectedRoom]);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [localMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedRoom) return;
        
        if (editingMessage) {
            editMessage(editingMessage.id, input);
            setEditingMessage(null);
        } else {
            sendMessage(selectedRoom.id, input, replyingTo?.id);
            setReplyingTo(null);
        }
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
                                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-4 duration-500 group`} style={{ animationDelay: `${idx * 50}ms` }}>
                                            <Avatar className="h-8 w-8 self-end mb-4">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} />
                                                <AvatarFallback className="text-xs bg-slate-200">{msg.sender?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2">
                                                    {!isMe && (
                                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                                            {msg.sender?.name || 'Unknown User'}
                                                        </span>
                                                    )}
                                                    
                                                    {/* Message Actions Dropdown */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600">
                                                                <MoreVertical size={14} />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align={isMe ? "end" : "start"}>
                                                            <DropdownMenuItem onClick={() => setReplyingTo(msg)}>
                                                                <Reply className="mr-2 h-4 w-4" /> Reply
                                                            </DropdownMenuItem>
                                                            {isMe && msg.type === 'TEXT' && (
                                                                <DropdownMenuItem onClick={() => {
                                                                    setEditingMessage(msg);
                                                                    setInput(msg.content);
                                                                }}>
                                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className={`relative px-4 py-2.5 rounded-2xl ${
                                                    isMe 
                                                    ? 'bg-orange-500 text-white rounded-br-sm' 
                                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                                                }`}>
                                                    {/* Reply Context */}
                                                    {msg.replyTo && (
                                                        <div className={`mb-2 p-2 rounded border-l-4 border-orange-600 ${isMe ? 'bg-orange-600/30' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                                                            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400">{msg.replyTo.sender?.name}</p>
                                                            <p className="text-[11px] truncate opacity-80">{msg.replyTo.content}</p>
                                                        </div>
                                                    )}

                                                    {msg.type === 'IMAGE' ? (
                                                        <div className="space-y-2">
                                                            <div 
                                                                className="cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                                                                onClick={() => {
                                                                    setSelectedImageUrl(getMediaUrl(msg.content));
                                                                    setViewerOpen(true);
                                                                }}
                                                            >
                                                                <img 
                                                                    src={getMediaUrl(msg.content)} 
                                                                    alt="Chat attachment" 
                                                                    className="max-w-full"
                                                                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : msg.type === 'VIDEO' ? (
                                                        <video 
                                                            src={getMediaUrl(msg.content)} 
                                                            controls 
                                                            className="max-w-full rounded-lg"
                                                            style={{ maxHeight: '300px' }}
                                                        />
                                                    ) : msg.type === 'FILE' || msg.type === 'AUDIO' ? (
                                                        <a 
                                                            href={getMediaUrl(msg.content)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 underline decoration-dotted"
                                                        >
                                                            {msg.type === 'AUDIO' ? <Volume2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                                            <span className="text-sm">Attachment ({msg.type})</span>
                                                        </a>
                                                    ) : (
                                                        <p className="text-sm">{msg.content}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5 px-1">
                                                    {msg.isEdited && <span className="text-[9px] text-slate-400 italic">Edited</span>}
                                                    <span className="text-[10px] text-slate-400">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && <CheckCheck size={12} className="text-orange-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} className="h-px"></div>
                            </div>
                        </div>

                        {/* Message Input Container */}
                        <div className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                            {/* Reply/Edit Preview */}
                            {(replyingTo || editingMessage) && (
                                <div className="px-6 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between animate-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-3">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                                                {editingMessage ? 'Editing Message' : `Replying to ${replyingTo.sender?.name}`}
                                            </span>
                                            <span className="text-xs text-slate-500 truncate max-w-md italic">
                                                {editingMessage ? editingMessage.content : replyingTo.content}
                                            </span>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full hover:bg-slate-200" 
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setEditingMessage(null);
                                            if (editingMessage) setInput('');
                                        }}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            )}

                            {/* Main Input Form */}
                            <div className="p-4">
                                <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto">
                                    <div className="flex items-center gap-1">
                                        <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-orange-500 transition-colors">
                                            <Smile size={22} />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-orange-500 transition-colors">
                                            <Paperclip size={22} />
                                        </Button>
                                    </div>
                                    <div className="flex-1 relative">
                                        <Input 
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
                                            className="w-full bg-slate-100 dark:bg-slate-900 border-transparent focus-visible:ring-1 focus-visible:ring-orange-200 rounded-2xl px-5 h-12 text-[15px]"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-orange-500 hover:bg-orange-600 w-12 h-12 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                    >
                                        {editingMessage ? <CheckCheck size={20} strokeWidth={2.5} /> : <Send size={20} strokeWidth={2.5} />}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900">
                        <div className="h-24 w-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 animate-bounce duration-2000">
                            <MessageCircle className="h-12 w-12" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                            Your Conversations
                        </h3>
                        <p className="text-slate-500 max-w-sm text-lg leading-relaxed">
                            Stay connected with your teachers and classmates. Select a group to start chatting.
                        </p>
                    </div>
                )}
            </div>

            {/* Image Viewer Dialog */}
            <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
                <DialogContent className="max-w-5xl bg-slate-950/95 border-slate-800 backdrop-blur-2xl p-0 overflow-hidden rounded-3xl">
                    <div className="relative h-[85vh] flex flex-col">
                        <div className="absolute top-4 right-4 z-50 flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="bg-white/10 text-white hover:bg-white/20 rounded-full"
                                onClick={() => setViewerOpen(false)}
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        <div className="flex-1 flex items-center justify-center p-4">
                            <img 
                                src={selectedImageUrl} 
                                alt="Full preview" 
                                className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                            />
                        </div>

                        <div className="p-6 bg-slate-900/50 backdrop-blur-md flex items-center justify-center gap-4">
                            <Button 
                                variant="outline" 
                                className="bg-white/5 text-white border-white/10 hover:bg-white/20 px-8 py-6 rounded-2xl font-bold transition-all"
                                onClick={() => window.open(selectedImageUrl, '_blank')}
                            >
                                <Share2 className="mr-2 h-5 w-5" /> Open Full Resolution
                            </Button>
                            <Button 
                                className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-6 rounded-2xl font-bold shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = selectedImageUrl;
                                    link.download = `j4s_media_${Date.now()}.jpg`;
                                    link.click();
                                }}
                            >
                                <FileText className="mr-2 h-5 w-5" /> Download Media
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChatPage;
