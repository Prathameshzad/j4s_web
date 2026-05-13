'use client';

import React from 'react';
import { Bell, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/component/ui/CustomUI';

const RecentNotices = ({ notices = [] }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden h-full flex flex-col max-h-[500px]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Bell size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Recent Notices</h3>
                    </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-none text-[9px] px-2 font-bold h-5 flex items-center">
                    {notices.length} New
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {notices && notices.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {notices.map((notice, idx) => (
                            <motion.div
                                key={notice.id || idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 hover:bg-slate-50 transition-all cursor-pointer group"
                            >
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[8px] px-1.5 py-0 font-bold uppercase text-slate-400 border-slate-200 rounded-md">
                                                    {notice.targetType || 'GENERAL'}
                                                </Badge>
                                                <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Clock size={9} className="opacity-50" />
                                                    {new Date(notice.scheduledAt || notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="text-slate-300 group-hover:text-primary transition-colors">
                                                <ArrowUpRight size={12} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                                {notice.title}
                                            </h4>
                                            <p className="text-[11px] font-medium text-slate-500 line-clamp-1 leading-relaxed">
                                                {notice.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
