'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    GraduationCap, 
    School, 
    CreditCard, 
    Calendar, 
    Bell, 
    FileText, 
    TrendingUp,
    Zap
} from 'lucide-react';
import { Badge } from '@/component/ui/CustomUI';

const StatsCard = ({ title, value, icon: Icon, colorClass, textColor, bgClass, index, status, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ 
            duration: 0.4, 
            delay: index * 0.05,
            ease: "easeOut" 
        }}
        className="h-full"
    >
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2.5 rounded-lg ${bgClass} ${textColor} group-hover:scale-105 transition-all duration-300 shadow-sm`}>
                    {Icon && <Icon size={18} />}
                </div>
                {status && (
                    <Badge className="bg-primary/5 text-primary border-none text-[8px] px-2 h-5 flex items-center font-bold tracking-wider uppercase rounded-md">
                        {status}
                    </Badge>
                )}
            </div>

            <div className="space-y-0.5 relative z-10">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                    {title}
                </p>
                <div className="flex items-baseline gap-1">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {value ?? '0'}
                    </h2>
                </div>
                {trend && (
                    <div className="pt-3 flex items-center gap-1.5 border-t border-slate-50 dark:border-slate-800/50 mt-3">
                        <TrendingUp size={10} className="text-emerald-500" />
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                            {trend}
                        </p>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

const StatsGrid = ({ stats = {}, role }) => {
    const getStatsByRole = () => {
        const r = role?.toUpperCase();
        switch (r) {
            case 'STUDENT':
                return [
                    { title: 'Attendance Record', value: stats.attendancePercentage ? `${stats.attendancePercentage}%` : '100%', icon: Calendar, colorClass: 'bg-orange-500', textColor: 'text-orange-600', bgClass: 'bg-orange-50', trend: 'Monthly Average', status: 'LIVE' },
                    { title: 'Today\'s Sessions', value: stats.todayClasses || '0', icon: GraduationCap, colorClass: 'bg-blue-600', textColor: 'text-blue-600', bgClass: 'bg-blue-50', trend: 'Academic Schedule', status: 'ACTIVE' },
                    { title: 'Pending Tasks', value: stats.pendingLeaves || '0', icon: FileText, colorClass: 'bg-purple-600', textColor: 'text-purple-600', bgClass: 'bg-purple-50', trend: 'Requires Action', status: 'URGENT' },
                    { title: 'Official Notices', value: stats.activeNotices || '0', icon: Bell, colorClass: 'bg-rose-600', textColor: 'text-rose-600', bgClass: 'bg-rose-50', trend: 'Latest Updates' },
                ];
            case 'TEACHER':
                return [
                    { title: 'Active Classes', value: stats.assignedClasses || '0', icon: School, colorClass: 'bg-indigo-600', textColor: 'text-indigo-600', bgClass: 'bg-indigo-50', status: 'STAFF' },
                    { title: 'Approval Queue', value: stats.pendingApprovals || '0', icon: FileText, colorClass: 'bg-orange-500', textColor: 'text-orange-600', bgClass: 'bg-orange-50', status: 'PENDING' },
                    { title: 'Leave Registry', value: stats.myPendingLeaves || '0', icon: Calendar, colorClass: 'bg-teal-600', textColor: 'text-teal-600', bgClass: 'bg-teal-50' },
                    { title: 'Department Signals', value: stats.totalNotices || '0', icon: Bell, colorClass: 'bg-rose-600', textColor: 'text-rose-600', bgClass: 'bg-rose-50' },
                ];
            case 'PARENT':
                return [
                    { title: 'Child Registry', value: stats.totalChildren || '0', icon: Users, colorClass: 'bg-blue-600', textColor: 'text-blue-600', bgClass: 'bg-blue-50', status: 'FAMILY' },
                    { title: 'Outstanding Fees', value: `₹${(stats.unpaidFees || 0).toLocaleString()}`, icon: CreditCard, colorClass: 'bg-orange-500', textColor: 'text-orange-600', bgClass: 'bg-orange-50', status: 'UNPAID' },
                    { title: 'Total Notices', value: stats.activeNotices || '0', icon: Bell, colorClass: 'bg-rose-600', textColor: 'text-rose-600', bgClass: 'bg-rose-50' },
                    { title: 'Support Tickets', value: stats.activeTickets || '0', icon: Zap, colorClass: 'bg-emerald-600', textColor: 'text-emerald-600', bgClass: 'bg-emerald-50' },
                ];
            default: // INSTITUTE
                return [
                    { title: 'Total Enrollment', value: stats.totalStudents || '0', icon: Users, colorClass: 'bg-orange-500', textColor: 'text-orange-600', bgClass: 'bg-orange-50' },
                    { title: 'Faculty Count', value: stats.totalTeachers || '0', icon: GraduationCap, colorClass: 'bg-blue-600', textColor: 'text-blue-600', bgClass: 'bg-blue-50' },
                    { title: 'Classroom Nodes', value: stats.totalClasses || '0', icon: School, colorClass: 'bg-purple-600', textColor: 'text-purple-600', bgClass: 'bg-purple-50' },
                    { title: 'System Revenue', value: `₹${(stats.pendingFees || 0).toLocaleString()}`, icon: CreditCard, colorClass: 'bg-emerald-600', textColor: 'text-emerald-600', bgClass: 'bg-emerald-50' },
                ];
        }
    };

    const displayStats = getStatsByRole();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {displayStats.map((stat, idx) => (
                <StatsCard key={idx} index={idx} {...stat} />
            ))}
        </div>
    );
};

export default StatsGrid;
