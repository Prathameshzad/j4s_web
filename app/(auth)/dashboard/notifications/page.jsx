'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';
import { Card, CardContent, Button } from '@/component/ui/CustomUI';
import { Bell, MessageSquare, FileText, Calendar, CheckCircle, Info, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow, subDays, isAfter } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
    const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
    const router = useRouter();

    const getIcon = (type) => {
        switch (type) {
            case 'CHAT': return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case 'HOMEWORK': return <FileText className="h-5 w-5 text-orange-500" />;
            case 'LEAVE': return <Calendar className="h-5 w-5 text-purple-500" />;
            case 'NOTICE': return <Bell className="h-5 w-5 text-primary" />;
            case 'ATTENDANCE': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            default: return <Info className="h-5 w-5 text-slate-400" />;
        }
    };

    const handleNotificationClick = (n) => {
        markAsRead(n.id);
        
        // Route based on type
        if (n.type === 'CHAT' || n.type === 'MESSAGE') {
            const roomId = n.data?.roomId || n.metadata?.roomId;
            if (roomId) {
                router.push(`/dashboard/chat?roomId=${roomId}`);
            } else {
                router.push('/dashboard/chat');
            }
        } else if (n.type === 'HOMEWORK') {
            const homeworkId = n.data?.homeworkId || n.metadata?.homeworkId;
            if (homeworkId) {
                router.push(`/dashboard/homework/${homeworkId}`);
            } else {
                router.push('/dashboard/homework');
            }
        } else if (n.type === 'NOTICE') {
            router.push('/dashboard/notice');
        } else if (n.type === 'LEAVE') {
            router.push('/dashboard/leave');
        } else if (n.type === 'ATTENDANCE') {
            router.push('/dashboard/attendance');
        } else if (n.type === 'TIMETABLE') {
            router.push('/dashboard/timetable');
        }
    };

    const filteredNotifications = useMemo(() => {
        if (!notifications) return [];
        const thirtyDaysAgo = subDays(new Date(), 30);
        return notifications.filter(n => isAfter(new Date(n.createdAt), thirtyDaysAgo));
    }, [notifications]);

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20 px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Bell size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notification History</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">
                        Showing notifications from the last 30 days.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        onClick={markAllAsRead}
                        className="h-11 rounded-xl px-6 font-bold text-sm bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none shadow-none flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {filteredNotifications.length === 0 ? (
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
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No recent notifications</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                        You are all caught up! Check back later for new updates.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        filteredNotifications.map((n, index) => (
                            <motion.div
                                key={n.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
                            >
                                <Card 
                                    onClick={() => handleNotificationClick(n)}
                                    className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${!n.isRead ? 'bg-primary/5 border-primary/20 shadow-md shadow-primary/5' : 'bg-white border-slate-200 hover:shadow-lg hover:border-slate-300'}`}
                                >
                                    <div className="p-5 flex items-start gap-4 sm:gap-6">
                                        <div className={`p-3 rounded-xl shadow-sm shrink-0 ${!n.isRead ? 'bg-white' : 'bg-slate-50 group-hover:bg-white transition-colors'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                                                <h3 className={`text-base font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {n.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <Clock size={12} className={!n.isRead ? 'text-primary' : 'text-slate-400'} />
                                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${!n.isRead ? 'text-primary' : 'text-slate-400'}`}>
                                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${!n.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                                {n.body}
                                            </p>
                                        </div>
                                        <div className="shrink-0 flex items-center justify-center self-center sm:self-start h-full sm:pt-2">
                                            {!n.isRead ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
