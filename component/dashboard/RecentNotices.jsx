'use client';

import React from 'react';
import { Bell, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/component/ui/CustomUI';

const RecentNotices = ({ notices = [] }) => {
    // Group notices dynamically by relative week intervals
    const groups = {
        'This Week': [],
        'Last Week': [],
        'Earlier': []
    };

    notices.forEach(notice => {
        try {
            const dateVal = notice.createdAt || notice.scheduledAt;
            if (!dateVal) {
                groups['This Week'].push(notice);
                return;
            }
            const date = new Date(dateVal);
            if (isNaN(date.getTime())) {
                groups['This Week'].push(notice);
                return;
            }
            const diffInMs = new Date().getTime() - date.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            if (diffInDays < 7) {
                groups['This Week'].push(notice);
            } else if (diffInDays < 14) {
                groups['Last Week'].push(notice);
            } else {
                groups['Earlier'].push(notice);
            }
        } catch {
            groups['This Week'].push(notice);
        }
    });

    const hasAnyNotices = notices && notices.length > 0;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden h-full flex flex-col max-h-[500px]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Bell size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Notices</h3>
                    </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-none text-[9px] px-2 font-bold h-5 flex items-center">
                    {notices.length} New
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {hasAnyNotices ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {Object.entries(groups).map(([groupName, groupItems]) => {
                            if (groupItems.length === 0) return null;
                            return (
                                <div key={groupName} className="space-y-0.5">
                                    <div className="px-4 py-2 bg-slate-50/30 dark:bg-slate-900/10 text-[8.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-y border-slate-100/50 dark:border-slate-800/50 leading-none">
                                        {groupName}
                                    </div>
                                    <div className="divide-y divide-slate-100/60 dark:divide-slate-800/40">
                                        {groupItems.map((notice, idx) => {
                                            const timeStr = notice.date || (notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent');
                                            return (
                                                <motion.div
                                                    key={notice.id || idx}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="flex-1 space-y-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="text-[8px] px-1.5 py-0 font-bold uppercase text-slate-400 border-slate-200 dark:border-slate-800 rounded-md">
                                                                        {notice.category || notice.targetType || 'GENERAL'}
                                                                    </Badge>
                                                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                                        <Clock size={9} className="opacity-50" />
                                                                        {timeStr}
                                                                    </span>
                                                                </div>
                                                                <div className="text-slate-300 group-hover:text-primary transition-colors">
                                                                    <ArrowUpRight size={12} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[12px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                                                                    {notice.title}
                                                                </h4>
                                                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
                                                                    {notice.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 border border-slate-100 mb-4">
                            <Bell size={24} strokeWidth={1.5} className="opacity-20" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-900 font-bold text-[13px]">No notices yet</p>
                            <p className="text-[11px] text-slate-400 font-medium">All clear for now! Check back later.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentNotices;

