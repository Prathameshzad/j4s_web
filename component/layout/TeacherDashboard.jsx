import React from 'react';
import DashboardHeader from '../dashboard/DashboardHeader';
import StatsGrid from '../dashboard/StatsGrid';
import DashboardCharts from '../dashboard/DashboardCharts';
import RecentNotices from '../dashboard/RecentNotices';
import { motion } from 'framer-motion';
import { Zap, ArrowUpRight, CheckCircle2, Bell, BookOpen, Calendar, ShieldCheck } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../ui/CustomUI';
import { useRouter } from 'next/navigation';

const TeacherDashboard = ({ stats = {}, role }) => {
    const router = useRouter();

    const quickActions = [
        { label: 'Mark Attendance', icon: CheckCircle2, path: '/dashboard/attendance', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Create Notice', icon: Bell, path: '/dashboard/notice/add', color: 'text-primary', bg: 'bg-primary/5' },
        { label: 'Create Assignment', icon: BookOpen, path: '/dashboard/homework/add', color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Academic Schedule', icon: Calendar, path: '/dashboard/timetable', color: 'text-purple-500', bg: 'bg-purple-50' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 pb-10"
        >
            <DashboardHeader />
            
            <motion.section variants={itemVariants} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/5">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                Performance Overview
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Classroom metrics and analytics</p>
                        </div>
                    </div>
                </div>
                <StatsGrid stats={stats.stats || stats.overview} role={role} />
            </motion.section>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="xl:col-span-2">
                    <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full rounded-xl bg-white dark:bg-slate-900">
                        <CardContent className="p-0">
                            <DashboardCharts data={stats} role={role} />
                        </CardContent>
                    </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} className="xl:col-span-1">
                    <RecentNotices notices={stats.recentNotices} />
                </motion.div>
            </div>

            {/* Quick Actions Panel */}
            <motion.section variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-2.5 bg-slate-900 dark:bg-primary/10 rounded-xl text-white dark:text-primary">
                        <Zap size={18} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Management Center</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Execute rapid administrative tasks</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, idx) => (
                        <motion.div
                            key={action.label}
                            whileHover={{ y: -6 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card 
                                onClick={() => router.push(action.path)}
                                className="group cursor-pointer border-slate-100 dark:border-slate-800 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative rounded-2xl bg-white dark:bg-slate-900"
                            >
                                <CardContent className="p-7">
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center justify-between">
                                            <div className={`p-3.5 rounded-xl ${action.bg} ${action.color} transition-all duration-300 group-hover:scale-105 shadow-sm`}>
                                                <action.icon size={24} />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-md font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">{action.label}</h4>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </motion.div>
    );
};

export default TeacherDashboard;
