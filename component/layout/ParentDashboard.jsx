import React from 'react';
import DashboardHeader from '../dashboard/DashboardHeader';
import StatsGrid from '../dashboard/StatsGrid';
import DashboardCharts from '../dashboard/DashboardCharts';
import RecentNotices from '../dashboard/RecentNotices';
import { motion } from 'framer-motion';
import { CreditCard, MessageSquare, Calendar, ArrowUpRight, Activity, Bell, PieChart } from 'lucide-react';
import { Card, CardContent, Badge } from '../ui/CustomUI';
import { useRouter } from 'next/navigation';

const ParentDashboard = ({ stats = {}, role }) => {
    const router = useRouter();

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

    const quickActions = [
        { title: 'Fees & Dues', desc: 'Manage school payments', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50', path: '/dashboard/fees' },
        { title: 'Help Desk', desc: 'Connect with teachers', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50', path: '/dashboard/support' },
        { title: 'Presence', desc: 'Track daily attendance', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50', path: '/dashboard/attendance' }
    ];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 pb-10"
        >
            <DashboardHeader />

            <motion.section variants={itemVariants}>
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                    Student Journey
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Comprehensive academic monitoring</p>
                            </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 h-6 text-[10px] font-bold uppercase tracking-widest">In Sync</Badge>
                    </div>
                    <div className="relative z-10">
                        <StatsGrid stats={stats.stats || stats.overview} role={role} />
                    </div>
                </Card>
            </motion.section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <motion.section variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Bell className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">Latest Updates</h3>
                        </div>
                    </div>
                    <RecentNotices notices={stats.recentNotices} />
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <PieChart className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">Performance Map</h3>
                        </div>
                    </div>
                    <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full rounded-2xl bg-white dark:bg-slate-900">
                        <CardContent className="p-0">
                            <DashboardCharts data={stats} role={role} />
                        </CardContent>
                    </Card>
                </motion.section>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {quickActions.map((item, idx) => (
                    <motion.div
                        key={item.title}
                        variants={itemVariants}
                        whileHover={{ y: -6 }}
                    >
                        <Card 
                            onClick={() => router.push(item.path)}
                            className="group cursor-pointer border-slate-100 dark:border-slate-800 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative rounded-2xl bg-white dark:bg-slate-900"
                        >
                            <CardContent className="p-7">
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3.5 rounded-xl ${item.bg} ${item.color} transition-all duration-300 group-hover:scale-105 shadow-sm`}>
                                            <item.icon size={24} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">{item.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">{item.desc}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default ParentDashboard;
