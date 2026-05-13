import React from 'react';
import DashboardHeader from '../dashboard/DashboardHeader';
import StatsGrid from '../dashboard/StatsGrid';
import DashboardCharts from '../dashboard/DashboardCharts';
import RecentNotices from '../dashboard/RecentNotices';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowUpRight, Sparkles, Bell, Layout } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../ui/CustomUI';
import { useRouter } from 'next/navigation';

const StudentDashboard = ({ stats = {}, role }) => {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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

            {/* Launch Timetable Banner */}
            <motion.div variants={itemVariants}>
                <Card className="bg-slate-900 dark:bg-primary/10 text-white shadow-xl relative overflow-hidden group border-none rounded-xl">
                    <CardContent className="p-8 sm:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-primary rounded-xl text-white flex items-center justify-center shadow-2xl shadow-primary/40 transform group-hover:rotate-6 transition-transform duration-500 shrink-0">
                                <Sparkles size={28} />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter leading-none text-white">
                                    Master Your Academic Schedule
                                </h3>
                                <p className="text-slate-400 text-sm font-medium">
                                    Your personalized journey starts with a perfect plan. Check your timetable now.
                                </p>
                            </div>
                        </div>

                        <Button 
                            onClick={() => router.push('/dashboard/timetable')}
                            className="w-full md:w-auto h-14 px-8 bg-primary text-white rounded-xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 border-none group/btn shrink-0"
                        >
                            <Layout size={18} />
                            Launch Timetable
                            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </CardContent>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-1000"></div>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-10">
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/5">
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                        Academic Pulse
                                    </h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Performance Analysis</p>
                                </div>
                            </div>
                        </div>
                        <StatsGrid stats={stats.stats || stats.overview} role={role} />
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full rounded-xl bg-white dark:bg-slate-900">
                            <CardContent className="p-0">
                                <DashboardCharts data={stats} role={role} />
                            </CardContent>
                        </Card>
                    </motion.section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <motion.section variants={itemVariants} className="h-full space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Bell className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">Latest Notices</h3>
                            </div>
                            <Badge variant="outline" className="text-[9px] border-slate-100">Live</Badge>
                        </div>
                        <RecentNotices notices={stats.recentNotices} />
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
