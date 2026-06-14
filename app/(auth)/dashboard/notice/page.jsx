'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
    Button,
    Card,
    CardContent,
    Badge,
    Spinner,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/component/ui/CustomUI';
import {
    Plus,
    Bell,
    Calendar,
    Edit2,
    Trash2,
    User,
    ChevronRight,
    ArrowUpRight,
    Info,
    Layout,
    Clock,
    Search,
    Filter,
    Paperclip,
    Megaphone,
    FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getMediaUrl } from '@/utils/media';
import { motion, AnimatePresence } from 'framer-motion';

export default function NoticePage() {
    const router = useRouter();
    const { token, selectedRole, user, displayName, selectedUserId } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, [token, selectedRole, selectedUserId]);

    const fetchNotices = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUrl}/notice`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                }
            });
            const result = await response.json();
            if (result.success) {
                setNotices(result.data);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
            toast.error('Failed to load notices');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUrl}/notice/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                }
            });
            const result = await response.json();
            if (result.success) {
                toast.success('Notice deleted successfully');
                fetchNotices();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to delete notice');
        }
    };

    const isEditable = (scheduledAt) => {
        const scheduledDate = new Date(scheduledAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return scheduledDate >= today;
    };

    const filteredNotices = notices.filter(notice =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
                    <Bell className="text-primary animate-bounce" size={32} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
                </div>
            </div>
            <p className="text-slate-500 font-medium text-sm">Getting latest notices...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Bell size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notices</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-sm max-w-md">
                        {selectedRole === 'STAFF'
                            ? "Manage and publish important announcements for the institution."
                            : `Stay updated with the latest news and announcements.`}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    {selectedRole === 'STAFF' && (
                        <Button
                            onClick={() => router.push('/dashboard/notice/add')}
                            className="w-full sm:w-auto h-11 rounded-xl px-6 font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Notice
                        </Button>
                    )}
                </div>
            </div>

            {/* Notices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredNotices.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full"
                        >
                            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl overflow-hidden">
                                <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm mb-6">
                                        <Bell size={40} className="opacity-20" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No notices found</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                        {searchQuery ? "We couldn't find any notices matching your search." : "There are currently no announcements to display."}
                                    </p>
                                    {searchQuery && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setSearchQuery('')}
                                            className="mt-6 text-primary font-bold hover:bg-primary/5"
                                        >
                                            Clear Search
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        filteredNotices.map((notice, index) => (
                            <motion.div
                                key={notice.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card 
                                    onClick={() => setSelectedNotice(notice)}
                                    className="group h-full flex flex-col bg-white border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 rounded-3xl overflow-hidden relative cursor-pointer"
                                >
                                    {/* Decorative Gradient Top */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex flex-wrap gap-2">
                                                {notice.senderId === selectedUserId && (
                                                    <>
                                                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                            {notice.targetType}
                                                        </Badge>
                                                        {notice.classes && notice.classes.length > 0 && notice.classes.map(cls => (
                                                            <Badge key={cls.id} variant="outline" className="text-slate-500 border-slate-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                                {cls.standard?.name} - {cls.division?.name}
                                                            </Badge>
                                                        ))}
                                                    </>
                                                )}
                                            </div>

                                            {selectedRole === 'STAFF' && notice.senderId === selectedUserId && isEditable(notice.scheduledAt) && (
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/dashboard/notice/${notice.id}`);
                                                        }}
                                                    >
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(notice.id);
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 mb-6 flex-1">
                                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                                {notice.title}
                                            </h2>
                                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 font-medium whitespace-pre-wrap">
                                                {notice.content}
                                            </p>
                                            
                                            {notice.attachments && notice.attachments.length > 0 && (
                                                <div className="pt-2 flex flex-wrap gap-2">
                                                    {notice.attachments.map((file) => (
                                                        <a
                                                            key={file.id}
                                                            href={getMediaUrl(file.url)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 text-xs font-bold rounded-lg transition-colors border border-slate-200 hover:border-primary/20"
                                                        >
                                                            <Paperclip size={12} />
                                                            <span className="truncate max-w-[120px]">{file.originalName || file.fileName || 'Attachment'}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[10px] border border-white shadow-sm ring-2 ring-slate-50">
                                                    {notice.sender?.name?.[0] || 'T'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">By</span>
                                                    <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{notice.sender?.name}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Date</span>
                                                <div className="flex items-center gap-1.5 text-slate-800">
                                                    <Clock size={12} className="text-slate-400" />
                                                    <span className="text-xs font-bold whitespace-nowrap">
                                                        {new Date(notice.scheduledAt).toLocaleDateString(undefined, {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Status Footer - Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Info size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Official Updates</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Get verified news directly from your school administration and teachers.</p>
                    </div>
                </div>

                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Layout size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Targeted News</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Notices are filtered based on your class, role, and department.</p>
                    </div>
                </div>

                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 sm:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Clock size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Real-time Delivery</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Instant synchronization ensures you never miss a critical update.</p>
                    </div>
                </div>
            </div>

            {/* Notice Details Dialog */}
            <Dialog open={!!selectedNotice} onOpenChange={(open) => !open && setSelectedNotice(null)}>
                {selectedNotice && (
                    <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="p-8 pb-6 bg-slate-50 border-b border-slate-100 relative">
                            <div className="absolute top-4 right-4 cursor-pointer p-2 rounded-full hover:bg-slate-200 transition-colors" onClick={() => setSelectedNotice(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-primary/10 rounded-2xl">
                                    <Megaphone className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="outline" className="whitespace-nowrap text-[10px] px-2.5 py-1 font-bold uppercase tracking-widest text-primary border-primary/20 bg-primary/5 rounded-md">
                                            {selectedNotice.category || selectedNotice.targetType || 'GENERAL NOTICE'}
                                        </Badge>
                                        {selectedNotice.classes && selectedNotice.classes.length > 0 && selectedNotice.classes.map(cls => (
                                            <Badge key={cls.id} variant="outline" className="whitespace-nowrap text-[10px] px-2.5 py-1 font-bold uppercase tracking-widest text-slate-500 border-slate-200 bg-white rounded-md">
                                                {cls.standard?.name} - {cls.division?.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <DialogTitle className="text-2xl font-black text-slate-800 leading-tight">
                                        {selectedNotice.title}
                                    </DialogTitle>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">
                                        {new Date(selectedNotice.scheduledAt || selectedNotice.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                {selectedNotice.sender && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-600">
                                            {selectedNotice.sender.name || 'Admin'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </DialogHeader>

                        <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar bg-white">
                            <div className="space-y-6">
                                <div className="text-[15px] font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedNotice.content}
                                </div>

                                {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                                    <div className="pt-6 mt-6 border-t border-slate-100">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Attachments</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedNotice.attachments.map(file => (
                                                <a 
                                                    key={file.id} 
                                                    href={getMediaUrl(file.url)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-primary/5 hover:border-primary/20 transition-all border border-slate-100 group"
                                                >
                                                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 truncate pr-2 group-hover:text-primary transition-colors">
                                                        {file.originalName || file.fileName || 'Document'}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
