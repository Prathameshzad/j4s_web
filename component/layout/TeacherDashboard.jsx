import React from 'react';
import DashboardHeader from '../dashboard/DashboardHeader';
import StatsGrid from '../dashboard/StatsGrid';
import DashboardCharts from '../dashboard/DashboardCharts';
import RecentNotices from '../dashboard/RecentNotices';
import { motion } from 'framer-motion';
import { Zap, ArrowUpRight, CheckCircle2, Bell, BookOpen, Calendar, ShieldCheck, Users, Clock, AlertCircle, FileText, Check, X, ChevronRight, BarChart3, MessageSquare, Activity } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../ui/CustomUI';
import { useRouter } from 'next/navigation';

const TeacherDashboard = ({ stats = {}, role }) => {
    const router = useRouter();
    const isClassTeacher = stats?.isClassTeacher || false;
    const classDetails = stats?.classDetails || {};
    const dashboardStats = stats?.stats || {};
    const timeline = stats?.timeline || [];
    const todaysLectures = stats?.todaysLectures || [];
    const recentNotices = stats?.recentNotices || [];
    const analytics = stats?.analytics || {};

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Class Teacher Overview Component
    const ClassTeacherOverview = () => (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-gradient-to-br bg-primary text-white border-none shadow-xl overflow-hidden relative rounded-[2rem]">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 blur-2xl rounded-full pointer-events-none"></div>
                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row justify-between h-full gap-8 relative z-10">
                    <div className="space-y-6 flex-1">
                        <div>
                            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-3 px-3 py-1 font-bold text-[10px] uppercase tracking-widest rounded-lg">
                                Class Teacher
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Class {classDetails.name || 'Not Assigned'}</h2>
                            <p className="text-indigo-100 font-medium text-sm mt-2">Manage your dedicated class efficiently.</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 pt-4">
                            <Button variant="outline" onClick={() => router.push('/dashboard/attendance')} className="!bg-white !text-primary hover:!bg-orange-50 border-none font-black rounded-xl px-5 py-5 shadow-lg shadow-black/10 transition-all flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                Take Attendance
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/dashboard/leaves')} className="bg-white/10 text-white hover:bg-white/20 border-white/20 font-bold rounded-xl px-5 py-5 transition-all flex items-center gap-2">
                                <FileText size={18} />
                                Approve Leaves
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                            <Users className="text-indigo-200 mb-2" size={24} />
                            <p className="text-3xl font-black">{classDetails.totalStudents || 0}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-200 mt-1">Total Students</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                            <CheckCircle2 className="text-emerald-300 mb-2" size={24} />
                            <p className="text-3xl font-black">{classDetails.presentCount || 0}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-200 mt-1">Present Today</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                            <X className="text-rose-300 mb-2" size={24} />
                            <p className="text-3xl font-black">{classDetails.absentCount || 0}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-rose-200 mt-1">Absent Today</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                            <AlertCircle className="text-amber-300 mb-2" size={24} />
                            <p className="text-3xl font-black">{classDetails.pendingLeaves || 0}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-amber-200 mt-1">Pending Leaves</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] flex flex-col justify-center relative overflow-hidden">
                <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Pending Actions</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">You have administrative tasks requiring attention.</p>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Unread Messages</span>
                            <Badge variant="warning" className="rounded-full px-3 py-1 text-[11px] font-black">{dashboardStats.unreadMessages || 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Homework to Grade</span>
                            <Badge variant="info" className="rounded-full px-3 py-1 text-[11px] font-black">{dashboardStats.pendingHomeworks || 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Leave Approvals</span>
                            <Badge variant="error" className="rounded-full px-3 py-1 text-[11px] font-black">{classDetails.pendingLeaves || 0}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    // Subject Teacher Overview Component
    const SubjectTeacherOverview = () => (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br bg-primary text-white border-none shadow-xl rounded-[2rem] relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 blur-3xl rounded-full pointer-events-none transform translate-x-1/4 translate-y-1/4"></div>
                <CardContent className="p-8 md:p-10 flex flex-col justify-center h-full relative z-10">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-none w-fit mb-4 px-3 py-1 font-bold text-[10px] uppercase tracking-widest rounded-lg">
                        Subject Teacher
                    </Badge>
                    <h2 className="text-3xl font-black tracking-tight mb-2">Today's Teaching Summary</h2>
                    <p className="text-orange-100 font-medium text-sm max-w-sm mb-8">Manage your multi-class lecture schedule and pending grading tasks.</p>
                    
                    <div className="flex flex-wrap gap-4 mt-auto">
                        <Button variant="outline" onClick={() => router.push('/dashboard/timetable')} className="!bg-white !text-primary hover:!bg-orange-50 border-none font-black rounded-xl px-6 py-5 shadow-lg shadow-black/10 transition-all flex items-center gap-2">
                            <Calendar size={18} />
                            Open Timetable
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/dashboard/homework/add')} className="bg-white/10 text-white hover:bg-white/20 border-white/20 font-bold rounded-xl px-6 py-5 transition-all flex items-center gap-2">
                            <BookOpen size={18} />
                            Upload Homework
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-2 grid grid-cols-2 gap-6">
                <Card className="border-none shadow-sm rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 flex flex-col justify-center">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-emerald-700 dark:text-emerald-400">{dashboardStats.todayLecturesCount || 0}</h3>
                        <p className="text-[10px] font-bold text-emerald-600/80 dark:text-emerald-500 uppercase tracking-widest">Total Lectures Today</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-3xl bg-purple-50 dark:bg-purple-500/10 flex flex-col justify-center">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-2">
                            <Users size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-purple-700 dark:text-purple-400">{dashboardStats.classesTaughtToday || 0}</h3>
                        <p className="text-[10px] font-bold text-purple-600/80 dark:text-purple-500 uppercase tracking-widest">Classes Assigned</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-3xl bg-amber-50 dark:bg-amber-500/10 flex flex-col justify-center">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-2">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-amber-700 dark:text-amber-400">{dashboardStats.pendingHomeworks || 0}</h3>
                        <p className="text-[10px] font-bold text-amber-600/80 dark:text-amber-500 uppercase tracking-widest">Homework Pending</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-3xl bg-blue-50 dark:bg-blue-500/10 flex flex-col justify-center">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-primary dark:text-blue-400 mx-auto flex items-center justify-center mb-2">
                            <MessageSquare size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-blue-700 dark:text-blue-400">{dashboardStats.unreadMessages || 0}</h3>
                        <p className="text-[10px] font-bold text-primary/80 dark:text-blue-500 uppercase tracking-widest">Unread Messages</p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );

    // Shared Components
    const TimelineRow = () => (
        <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] bg-white dark:bg-slate-900">
                <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-primary rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Today's Workflow Timeline</h3>
                            <p className="text-xs text-slate-500 font-medium">Your scheduled lectures and pending administrative tasks.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                        {timeline.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 font-bold">No lectures scheduled today.</div>
                        ) : (
                            timeline.map((event, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-orange-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                                        <Zap size={14} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className={`${event.status === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-primary'} border-none px-2 py-0.5 text-[9px] uppercase tracking-widest font-black`}>
                                                {event.time}
                                            </Badge>
                                        </div>
                                        <h4 className="font-black text-slate-800 dark:text-white text-sm tracking-tight mb-1">{event.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{event.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="xl:col-span-1 space-y-6">
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden">
                    <CardContent className="p-8">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                            <Calendar className="text-primary" size={20} />
                            Today's Timetable
                        </h3>
                        <div className="space-y-4">
                            {todaysLectures.length === 0 ? (
                                <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-400 font-bold text-sm">No lectures today</div>
                            ) : (
                                todaysLectures.map((lec, idx) => (
                                    <div key={idx} className="flex flex-col p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-primary/30 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {lec.time}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <AlertCircle size={12} /> {lec.room}
                                            </span>
                                        </div>
                                        <h4 className="font-black text-slate-800 dark:text-white text-sm mb-1">{lec.subject}</h4>
                                        <p className="text-xs font-bold text-slate-500">Class {lec.class}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <Button variant="outline" className="w-full mt-6 rounded-xl font-bold border-slate-200 dark:border-slate-700" onClick={() => router.push('/dashboard/timetable')}>
                            View Full Schedule
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-10 max-w-[1600px] mx-auto"
        >
            <DashboardHeader />
            
            {/* Conditional Top Section based on Teacher Role */}
            {isClassTeacher ? <ClassTeacherOverview /> : <SubjectTeacherOverview />}

            {/* Quick Actions Component */}
            <motion.section variants={itemVariants}>
                <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="p-2 bg-slate-900 text-white rounded-lg"><Zap size={16} /></div>
                    <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { icon: CheckCircle2, label: 'Attendance', path: '/dashboard/attendance', bg: 'bg-emerald-50 text-emerald-600' },
                        { icon: FileText, label: 'Leaves', path: '/dashboard/leaves', bg: 'bg-amber-50 text-amber-600' },
                        { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages', bg: 'bg-blue-50 text-primary' },
                        { icon: BookOpen, label: 'Homework', path: '/dashboard/homework', bg: 'bg-orange-50 text-primary' },
                        { icon: Bell, label: 'Notices', path: '/dashboard/notice', bg: 'bg-rose-50 text-rose-600' },
                        { icon: Calendar, label: 'Timetable', path: '/dashboard/timetable', bg: 'bg-purple-50 text-purple-600' },
                    ].map((act, i) => (
                        <Card key={i} onClick={() => router.push(act.path)} className="cursor-pointer border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-white dark:bg-slate-900 rounded-2xl group">
                            <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                                <div className={`w-12 h-12 rounded-full ${act.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <act.icon size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{act.label}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.section>

            {/* Third & Fourth Row Equivalent: Timeline and Timetable */}
            <TimelineRow />

            {/* Fifth Row: Analytics and Notices */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {isClassTeacher ? (
                    <>
                        <div className="xl:col-span-2">
                            <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full rounded-[2rem] bg-white dark:bg-slate-900">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Class Attendance Trend</h3>
                                            <p className="text-xs text-slate-500 font-medium">Weekly trajectory overview</p>
                                        </div>
                                    </div>
                                    <DashboardCharts data={analytics} role={role} />
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="xl:col-span-1">
                            <RecentNotices notices={recentNotices} />
                        </div>
                    </>
                ) : (
                    <div className="xl:col-span-3">
                        <RecentNotices notices={recentNotices} />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default TeacherDashboard;
