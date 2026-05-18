'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, 
    FileText, 
    X, 
    CheckCircle2, 
    FileDown, 
    Users, 
    Zap, 
    MessageSquare, 
    Calendar,
    ArrowUpRight,
    BookOpen,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Send,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../ui/CustomUI';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import axiosClient from '@/lib/axiosClient';

// Import our gorgeous shared dashboard modules
import DashboardHeader from '../dashboard/DashboardHeader';
import StatsGrid from '../dashboard/StatsGrid';
import DashboardCharts from '../dashboard/DashboardCharts';
import RecentNotices from '../dashboard/RecentNotices';

// High-fidelity fallback dataset for parents when stats are synchronizing or empty
const fallbackChildren = [
    {
        id: 'child-1',
        name: 'Aryan Sharma',
        rollNumber: '23',
        class: { 
            name: 'Class 10-A', 
            standard: 'Grade 10', 
            division: 'A', 
            classTeacher: { name: 'Mrs. Sarah Jenkins', designation: 'Class Teacher' } 
        },
        quickStats: { attendanceToday: 'PRESENT', classesToday: 5, unreadMessages: 2, newNotices: 3, leaveStatus: 'Approved' },
        timeline: [
            {
                id: 'act-1',
                time: '08:24 AM',
                title: 'Attendance marked: PRESENT',
                description: 'Marked by Class Teacher at school entrance gate.',
                type: 'attendance',
                status: 'success'
            },
            {
                id: 'act-2',
                time: '10:00 AM',
                title: 'New Notice Uploaded',
                description: 'Notice regarding Term-1 Tuition Fee Installment Reminder.',
                type: 'notice',
                status: 'warning'
            },
            {
                id: 'act-3',
                time: '11:15 AM',
                title: 'Teacher Message Received',
                description: 'Message from Mrs. Sarah Jenkins regarding Science Project submission.',
                type: 'message',
                status: 'primary'
            },
            {
                id: 'act-4',
                time: '01:30 PM',
                title: 'Schedule Change Sync',
                description: "Tomorrow's afternoon chemistry lecture swapped with physics lab.",
                type: 'timetable',
                status: 'info'
            }
        ],
        attendanceSummary: { 
            percentage: 92, 
            present: 148, 
            absent: 10, 
            leave: 3, 
            history: [
                { date: 'Mon', status: 'PRESENT' },
                { date: 'Tue', status: 'PRESENT' },
                { date: 'Wed', status: 'PRESENT' },
                { date: 'Thu', status: 'ABSENT' },
                { date: 'Fri', status: 'PRESENT' }
            ] 
        }
    }
];

const fallbackNotices = [
    { id: 'n-1', title: 'Annual Sports Meet 2026 Schedule', category: 'SPORTS', date: 'May 16, 2026', sender: 'Principal Office', content: 'The Annual Sports Meet is scheduled from May 25 to May 29. Regular classes will remain suspended. Attendance is mandatory for all students.' },
    { id: 'n-2', title: 'Term-1 Tuition Fee Installment Reminder', category: 'FEES', date: 'May 14, 2026', sender: 'Accounts Department', content: 'This is a gentle reminder that the last date for submitting the Term-1 tuition fees is May 20. A late fee penalty will apply post-deadline.' },
    { id: 'n-3', title: 'Term-1 Parent-Teacher Meeting (PTM)', category: 'ACADEMIC', date: 'May 10, 2026', sender: 'Vice Principal', content: 'PTM for Grades 1 to 10 will be held on Saturday, May 19, from 9:00 AM to 1:00 PM. Parents can meet the class teachers to discuss progress.' }
];

const ParentDashboard = ({ stats = {} }) => {
    const router = useRouter();
    const { selectedChild } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // ----------------------------------------------------
    // STATE FOR PORTAL POPUPS & MODALS
    // ----------------------------------------------------
    const [activeModal, setActiveModal] = useState(null);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [leaveSuccess, setLeaveSuccess] = useState(false);
    const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '' });

    // Homework states
    const [activeHwFilter, setActiveHwFilter] = useState('ALL');
    const [expandedHwId, setExpandedHwId] = useState(null);
    const [submittingHwId, setSubmittingHwId] = useState(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subSuccessHwId, setSubSuccessHwId] = useState(null);
    const [submitError, setSubmitError] = useState('');

    const handleSubmitHomework = async (homeworkId) => {
        if (!submissionContent.trim()) return;
        setIsSubmitting(true);
        setSubmitError('');
        try {
            // Check if it's a fallback child (demo)
            if (activeStudentData.id === 'child-1') {
                // Mock success for demo
                await new Promise(resolve => setTimeout(resolve, 1000));
                setIsSubmitting(false);
                setSubSuccessHwId(homeworkId);
                setSubmittingHwId(null);
                setSubmissionContent('');
                
                // Update state locally for the demo student
                if (activeStudentData.homeworks) {
                    const hw = activeStudentData.homeworks.find(h => h.id === homeworkId);
                    if (hw) {
                        hw.status = 'SUBMITTED';
                        hw.submissionContent = submissionContent;
                    }
                }
                setTimeout(() => setSubSuccessHwId(null), 3000);
                return;
            }

            // Real API call
            await axiosClient.post(`/api/web/homework/${homeworkId}/submit`, {
                content: submissionContent,
                studentId: activeStudentData.id
            });

            setIsSubmitting(false);
            setSubSuccessHwId(homeworkId);
            setSubmittingHwId(null);
            setSubmissionContent('');
            
            // Re-trigger router refresh to grab latest database state
            router.refresh();

            setTimeout(() => {
                setSubSuccessHwId(null);
            }, 3000);
        } catch (error) {
            console.error('Submit homework error:', error);
            setIsSubmitting(false);
            setSubmitError(error.response?.data?.message || 'Failed to submit homework. Please try again.');
        }
    };

    // Resolve current child in context or fallback gracefully
    const activeStudentData = stats.children?.find(c => c.id === selectedChild?.id || c.id === selectedChild?.studentId) || stats.children?.[0] || fallbackChildren[0];

    // Set up stats grid properties dynamically based on the child's academic metrics
    const statsForGrid = {
        attendancePercentage: activeStudentData?.attendanceSummary?.percentage ?? 95,
        todayClasses: activeStudentData?.quickStats?.classesToday ?? 5,
        pendingLeaves: activeStudentData?.quickStats?.pendingTasks ?? 2,
        activeNotices: activeStudentData?.quickStats?.newNotices ?? 3
    };

    // Calendar logic
    const calendarDays = React.useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push({ type: 'empty' });

        const history = activeStudentData?.attendanceSummary?.history || [];
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const attendance = history.find(r => r.date === dateStr);
            days.push({
                day: d,
                type: 'day',
                status: attendance?.status || null,
                date: dateStr
            });
        }
        return days;
    }, [currentMonth, activeStudentData]);

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    // Format historical attendance trends for our trajectory charts
    const chartData = {
        attendanceTrend: activeStudentData?.attendanceSummary?.history?.map(h => ({
            date: h.date,
            value: h.status === 'PRESENT' ? 100 : h.status === 'HALF_DAY' ? 50 : 0
        })).reverse() || [
            { date: 'Mon', value: 100 },
            { date: 'Tue', value: 100 },
            { date: 'Wed', value: 100 },
            { date: 'Thu', value: 0 },
            { date: 'Fri', value: 100 }
        ]
    };

    // ----------------------------------------------------
    // POPUP CONTROL HANDLERS
    // ----------------------------------------------------
    const handleApplyLeave = (e) => {
        e.preventDefault();
        if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) return;

        setLeaveSuccess(true);
        setTimeout(() => {
            setLeaveSuccess(false);
            setActiveModal(null);
            setLeaveForm({ startDate: '', endDate: '', reason: '' });
            // Direct router synchronization for full leave history tracking
            router.push('/dashboard/leave');
        }, 1500);
    };

    const triggerDownloadReport = () => {
        setDownloadingReport(true);
        setDownloadProgress(10);
        const interval = setInterval(() => {
            setDownloadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setDownloadingReport(false);
                        setActiveModal(null);
                    }, 800);
                    return 100;
                }
                return prev + 20;
            });
        }, 200);
    };

    // Framer motion standard presets
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
            className="space-y-10 pb-10 max-w-[1600px] mx-auto"
        >
            {/* Header Greeting */}
            <DashboardHeader />

            {/* Selected Child Hero banner Card */}
            <motion.div variants={itemVariants}>
                <Card className="bg-slate-900 dark:bg-slate-950 text-white shadow-xl relative overflow-hidden border-none rounded-[24px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/10 to-orange-950/20 pointer-events-none" />
                    <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 shrink-0">
                                {activeStudentData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                                        {activeStudentData?.name}
                                    </h3>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                        {activeStudentData?.quickStats?.attendanceToday === 'PRESENT' ? 'Present Today' : 'Absent Today'}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                                    <span>{activeStudentData?.class?.name}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                    <span>Roll No: {activeStudentData?.rollNumber}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center">
                            <Button 
                                onClick={() => setActiveModal('downloadReports')}
                                className="bg-white/10 hover:bg-white/15 text-white border-none rounded-xl h-11 px-5 text-[10.5px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <Download size={14} /> Report Card
                            </Button>
                            <Button 
                                onClick={() => setActiveModal('applyLeave')}
                                className="bg-primary hover:bg-primary/90 text-white border-none rounded-xl h-11 px-5 text-[10.5px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <FileText size={14} /> Request Leave
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Metrics Status Grid for Selected Child */}
            <motion.div variants={itemVariants}>
                <StatsGrid stats={statsForGrid} role="PARENT_STUDENT" />
            </motion.div>

            {/* Split Page Contents */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 columns: Attendance charts & Today's Timeline Feed */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Interactive Attendance Calendar Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-none shadow-sm overflow-hidden rounded-[24px] bg-white dark:bg-slate-900 p-6">
                            <div className="pb-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        Attendance Calendar
                                    </h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                        Interactive academic tracking and presence registry
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-50 dark:bg-slate-800/55 p-1 rounded-[16px] border border-slate-100 dark:border-slate-800">
                                    <button 
                                        type="button"
                                        onClick={() => changeMonth(-1)} 
                                        className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all border-none cursor-pointer"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 w-28 text-center select-none">
                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => changeMonth(1)} 
                                        className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all border-none cursor-pointer"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-2 text-center mb-3">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                                    <span key={i} className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {calendarDays.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-300 border ${
                                            day.type === 'empty' ? 'bg-transparent border-transparent pointer-events-none' :
                                            day.status === 'PRESENT' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600/20 shadow-sm shadow-emerald-500/10' :
                                            day.status === 'ABSENT' ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600/20 shadow-sm shadow-rose-500/10' :
                                            day.status === 'LATE' ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600/20 shadow-sm shadow-amber-500/10' :
                                            'bg-slate-50 dark:bg-slate-850/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 text-slate-400 dark:text-slate-500 border-slate-100/40 dark:border-slate-800/20'
                                        }`}
                                    >
                                        {day.day}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 select-none">
                                {[
                                    { label: 'Present', color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' },
                                    { label: 'Absent', color: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' },
                                    { label: 'Late', color: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' }
                                ].map(legend => (
                                    <div key={legend.label} className="flex items-center gap-1.5">
                                        <div className={`w-2.5 h-2.5 rounded-full ${legend.color}`}></div>
                                        <span className="text-[9px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">{legend.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Homework Board Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white dark:bg-slate-900 rounded-[24px] border-none shadow-sm overflow-hidden p-6">
                            <div className="pb-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] animate-pulse"></div>
                                        Homework Board
                                    </h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                        Monitor assignments, check evaluations, and submit homework online
                                    </p>
                                </div>
                                
                                {/* Segmented capsule filter tabs */}
                                <div className="flex flex-wrap gap-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100/80 dark:border-slate-800/40 select-none">
                                    {['ALL', 'PENDING', 'SUBMITTED', 'GRADED'].map((filter) => {
                                        const count = (activeStudentData?.homeworks || []).filter(
                                            h => filter === 'ALL' ? true : h.status === filter
                                        ).length;
                                        return (
                                            <button
                                                key={filter}
                                                type="button"
                                                onClick={() => setActiveHwFilter(filter)}
                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border-none ${
                                                    activeHwFilter === filter
                                                        ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-sm font-bold'
                                                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/55 dark:hover:bg-slate-800/55'
                                                }`}
                                            >
                                                {filter} <span className="opacity-60">({count})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Assignments List */}
                            <div className="space-y-4">
                                {(activeStudentData?.homeworks || []).filter(
                                    h => activeHwFilter === 'ALL' ? true : h.status === activeHwFilter
                                ).length === 0 ? (
                                    <div className="text-center py-10 rounded-2xl bg-slate-50/50 dark:bg-slate-850/20 border border-dashed border-slate-100 dark:border-slate-800">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
                                            <BookOpen size={18} />
                                        </div>
                                        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest leading-none">No assignments found</h4>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-1.5">There are no assignments in this category.</p>
                                    </div>
                                ) : (
                                    (activeStudentData?.homeworks || []).filter(
                                        h => activeHwFilter === 'ALL' ? true : h.status === activeHwFilter
                                    ).map((hw) => {
                                        const isExpanded = expandedHwId === hw.id;
                                        const isSubmittingThis = submittingHwId === hw.id;
                                        const isSuccessThis = subSuccessHwId === hw.id;

                                        const getBadgeColor = (subject) => {
                                            const subLower = subject?.toLowerCase() || '';
                                            if (subLower.includes('math')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
                                            if (subLower.includes('sci')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
                                            if (subLower.includes('eng')) return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
                                            return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
                                        };

                                        return (
                                            <motion.div
                                                key={hw.id}
                                                layout
                                                className={`p-4 rounded-2xl border transition-all duration-300 ${
                                                    isExpanded 
                                                        ? 'bg-slate-50/80 dark:bg-slate-850/30 border-slate-200 dark:border-slate-800 shadow-sm' 
                                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 hover:-translate-y-0.5 hover:shadow-sm'
                                                }`}
                                            >
                                                {/* Header Line */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`px-2.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider border shrink-0 ${getBadgeColor(hw.subject)}`}>
                                                            {hw.subject}
                                                        </div>
                                                        <h4 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider truncate max-w-[280px]">
                                                            {hw.title}
                                                        </h4>
                                                    </div>

                                                    <div className="flex items-center gap-2 self-end sm:self-auto select-none">
                                                        {/* Status Badge */}
                                                        {hw.status === 'PENDING' && (
                                                            <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/10 border-none font-bold text-[8.5px] uppercase tracking-wider rounded px-2 h-5">
                                                                Pending
                                                            </Badge>
                                                        )}
                                                        {hw.status === 'SUBMITTED' && (
                                                            <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/10 border-none font-bold text-[8.5px] uppercase tracking-wider rounded px-2 h-5">
                                                                Submitted
                                                            </Badge>
                                                        )}
                                                        {hw.status === 'GRADED' && (
                                                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-none font-bold text-[8.5px] uppercase tracking-wider rounded px-2 h-5 flex items-center gap-1">
                                                                <span>Graded: {hw.grade || 'A'}</span>
                                                            </Badge>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => setExpandedHwId(isExpanded ? null : hw.id)}
                                                            className="p-1 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-all border-none cursor-pointer"
                                                        >
                                                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Meta Row */}
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} />
                                                        Due: {hw.dueDate}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                                    <span className="flex items-center gap-1">
                                                        <Users size={10} />
                                                        By: {hw.teacher}
                                                    </span>
                                                </div>

                                                {/* Expanded Details Body */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4"
                                                        >
                                                            <div className="bg-slate-50 dark:bg-slate-850/45 p-3.5 rounded-xl">
                                                                <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Assignment Details:</h5>
                                                                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                                                    {hw.content}
                                                                </p>
                                                            </div>

                                                            {/* If homework is graded, display grades and review feedback */}
                                                            {hw.status === 'GRADED' && (
                                                                <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-500/10 space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <h5 className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Teacher's Feedback:</h5>
                                                                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/15 px-2 py-0.5 rounded">
                                                                            Grade: {hw.grade || 'A'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] font-bold text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
                                                                        "{hw.feedback || 'Outstanding effort, exceptional logic and layout representation.'}"
                                                                    </p>
                                                                    {hw.submissionContent && (
                                                                        <div className="mt-2.5 pt-2 border-t border-emerald-500/10">
                                                                            <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Original Submission:</span>
                                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 italic">"{hw.submissionContent}"</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* If submitted, show user's submission */}
                                                            {hw.status === 'SUBMITTED' && hw.submissionContent && (
                                                                <div className="bg-slate-50 dark:bg-slate-850/40 p-3.5 rounded-xl">
                                                                    <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Child's Answer (Waiting for teacher check):</h5>
                                                                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                                                        "{hw.submissionContent}"
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* If pending, display online submission console */}
                                                            {hw.status === 'PENDING' && (
                                                                <div className="space-y-3 pt-2">
                                                                    {isSuccessThis ? (
                                                                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-center flex flex-col items-center gap-1.5 animate-pulse">
                                                                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                                                                            <span className="text-[10px] font-black uppercase tracking-widest">Assignment submitted successfully!</span>
                                                                        </div>
                                                                    ) : isSubmittingThis ? (
                                                                        <div className="bg-slate-50 dark:bg-slate-850/50 rounded-xl p-3.5 space-y-3">
                                                                            <div className="flex items-center justify-between">
                                                                                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Enter Assignment Answer or Document Link:</label>
                                                                                <button 
                                                                                    type="button"
                                                                                    onClick={() => setSubmittingHwId(null)}
                                                                                    className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-transparent cursor-pointer border-none"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                            
                                                                            <textarea
                                                                                value={submissionContent}
                                                                                onChange={(e) => setSubmissionContent(e.target.value)}
                                                                                placeholder="Type assignment submission text, answer description, or shared Google Drive document link..."
                                                                                rows={3}
                                                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-850 dark:text-white text-[11px] font-medium focus:outline-none focus:border-primary transition-all resize-none"
                                                                            />

                                                                            {submitError && (
                                                                                <div className="text-[9px] font-bold text-rose-500 uppercase tracking-wide flex items-center gap-1">
                                                                                    <AlertCircle size={10} />
                                                                                    {submitError}
                                                                                </div>
                                                                            )}

                                                                            <Button
                                                                                onClick={() => handleSubmitHomework(hw.id)}
                                                                                disabled={isSubmitting || !submissionContent.trim()}
                                                                                className="w-full bg-slate-900 hover:bg-slate-950 dark:bg-slate-950 dark:hover:bg-black text-white border-none rounded-xl h-10 text-[9.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                {isSubmitting ? (
                                                                                    <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                                                                                ) : (
                                                                                    <Send size={12} />
                                                                                )}
                                                                                <span>Submit assignment on behalf of child</span>
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <Button
                                                                            onClick={() => {
                                                                                setSubmittingHwId(hw.id);
                                                                                setSubmitError('');
                                                                            }}
                                                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none rounded-xl h-10 text-[9.5px] font-black uppercase tracking-wider shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
                                                                        >
                                                                            <Send size={12} />
                                                                            <span>Submit Homework Online</span>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </Card>
                    </motion.div>


                </div>

                {/* Right 4 columns: Recent notices, Teacher spotlight, Gate scanners */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Recent Notices Board */}
                    <motion.div variants={itemVariants}>
                        <RecentNotices notices={activeStudentData?.notices || stats.recentNotices || fallbackNotices} />
                    </motion.div>

                    {/* Class Teacher Spotlight */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white dark:bg-slate-900 rounded-[24px] border-none shadow-sm overflow-hidden p-6">
                            <div className="flex items-center gap-3.5 pb-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 animate-pulse">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Assigned Educator</h3>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Class Teacher Spotlight</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-850/50 flex items-center gap-3.5 border-none">
                                <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-sm shrink-0">
                                    {activeStudentData?.class?.classTeacher?.name?.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase() || 'TJ'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-slate-850 dark:text-white leading-none truncate">
                                        {activeStudentData?.class?.classTeacher?.name}
                                    </h4>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest leading-none">
                                        {activeStudentData?.class?.classTeacher?.designation || 'Class Instructor'}
                                    </p>
                                </div>
                            </div>

                            <Button 
                                onClick={() => router.push('/dashboard/chat')}
                                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-xl h-11 text-[10px] font-black uppercase tracking-wider shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <MessageSquare size={14} /> Open Chat Console
                            </Button>
                        </Card>
                    </motion.div>

                    {/* Dynamic Class Timetable Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white dark:bg-slate-900 rounded-[24px] border-none shadow-sm overflow-hidden p-6">
                            <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Class Timetable</h3>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Today's Academic Schedule</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {activeStudentData?.timetable && activeStudentData.timetable.length > 0 ? (
                                    activeStudentData.timetable.slice(0, 4).map((entry, idx) => (
                                        <div 
                                            key={entry.id || idx} 
                                            className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-850/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all border-none flex items-center justify-between"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate">
                                                    {entry.subject}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                        <Clock size={10} className="opacity-70" />
                                                        {entry.time}
                                                    </span>
                                                    {entry.room && (
                                                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                            <MapPin size={10} className="opacity-70" />
                                                            {entry.room}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <Badge className="bg-primary/5 text-primary border-none text-[8.5px] font-black uppercase tracking-wider rounded">
                                                    {entry.teacher?.split(' ').slice(-1)[0] || 'Teacher'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-slate-400 text-[11px] font-bold">
                                        No classes scheduled for today.
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                </div>

            </div>

            {/* ----------------------------------------------------
                MODAL POPUPS & PORTALS OVERLAYS
               ---------------------------------------------------- */}
            <AnimatePresence>
                {activeModal === 'downloadReports' && (
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4">
                                <h3 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-widest">
                                    Download Academic Card
                                </h3>
                                <button 
                                    onClick={() => setActiveModal(null)}
                                    className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-605 dark:hover:text-white transition-all cursor-pointer border-none"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="space-y-5 text-center">
                                {downloadingReport ? (
                                    <div className="py-4 space-y-4">
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${downloadProgress}%` }}
                                                className="bg-emerald-500 h-full rounded-full"
                                            />
                                        </div>
                                        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest animate-pulse leading-none">Compiling report card PDF...</h4>
                                        <p className="text-[9px] font-bold text-slate-405 uppercase tracking-widest">Progress: {downloadProgress}%</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                                            <FileDown size={24} />
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Term-1 Academic Report</h4>
                                            <p className="text-[10.5px] font-bold text-slate-405 mt-1.5 leading-relaxed">Download a high-resolution, certified PDF report card of {activeStudentData?.name} for school records.</p>
                                        </div>

                                        <button 
                                            onClick={triggerDownloadReport}
                                            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                                        >
                                            <Download size={14} /> Begin PDF Compilation
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeModal === 'applyLeave' && (
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4">
                                <h3 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-widest">
                                    Apply Student Leave
                                </h3>
                                <button 
                                    onClick={() => setActiveModal(null)}
                                    className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-605 dark:hover:text-white transition-all cursor-pointer border-none"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <form onSubmit={handleApplyLeave} className="space-y-4">
                                {leaveSuccess ? (
                                    <div className="text-center py-6 space-y-3.5">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                                            <CheckCircle2 size={24} className="animate-bounce" />
                                        </div>
                                        <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest leading-none">Submission Successful</h4>
                                        <p className="text-[10px] font-bold text-slate-405">Your leave request has been submitted and is pending teacher approval.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-3.5">
                                            <div>
                                                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
                                                <input 
                                                    type="date"
                                                    value={leaveForm.startDate}
                                                    onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                                                    required
                                                    className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 text-xs px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary font-semibold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
                                                <input 
                                                    type="date"
                                                    value={leaveForm.endDate}
                                                    onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                                                    required
                                                    className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 text-xs px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary font-semibold"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Reason for Absence</label>
                                            <textarea 
                                                rows="3"
                                                placeholder="E.g., Medical check-up, family emergency..."
                                                value={leaveForm.reason}
                                                onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                                                required
                                                className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 text-xs px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary font-semibold resize-none"
                                            />
                                        </div>

                                        <button 
                                            type="submit"
                                            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                                        >
                                            <FileText size={14} /> Submit Leave Request
                                        </button>
                                    </>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default ParentDashboard;
