'use client';

import React, { useState, useMemo } from 'react';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    BookOpen,
    TrendingUp,
    Download,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Search,
    ChevronFirst,
    ChevronLast,
    UserCircle2,
    Zap,
    LayoutGrid,
    CalendarDays
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Badge
} from "@/component/ui/CustomUI"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/component/ui/Table/BaseTable';
import { motion, AnimatePresence } from 'framer-motion';

const StudentAttendanceView = ({ report: incomingReport = [], stats: backendStats, loading }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Auto-resolve report and stats based on incoming data structure
    // Sometimes the parent passes the whole object, sometimes just the array
    const { report, stats: derivedStats } = useMemo(() => {
        let r = Array.isArray(incomingReport) ? incomingReport : [];
        let s = backendStats;

        // If incomingReport is actually the whole object { report, stats }
        if (!Array.isArray(incomingReport) && incomingReport?.report) {
            r = incomingReport.report;
            s = incomingReport.stats;
        }

        return { report: r, stats: s };
    }, [incomingReport, backendStats]);

    // Ensure safeReport is always an array
    const safeReport = Array.isArray(report) ? report : [];

    // Use backend stats if provided, otherwise fallback to local calculation
    const stats = useMemo(() => {
        if (derivedStats && typeof derivedStats.total === 'number' && derivedStats.total > 0) {
            return derivedStats;
        }

        if (safeReport.length === 0) {
            return { total: 0, present: 0, late: 0, absent: 0, percentage: 0 };
        }

        const total = safeReport.length;
        const present = safeReport.filter(r => r.status === 'PRESENT').length;
        const late = safeReport.filter(r => r.status === 'LATE').length;
        const absent = safeReport.filter(r => r.status === 'ABSENT').length;
        const percentage = Math.round((present / total) * 100);

        return { total, present, late, absent, percentage };
    }, [safeReport, backendStats]);

    // Calendar logic
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push({ type: 'empty' });

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const attendance = report.find(r => {
                const rDate = new Date(r.date).toISOString().split('T')[0];
                return rDate === dateStr;
            });
            days.push({
                day: d,
                type: 'day',
                status: attendance?.status || null,
                date: dateStr
            });
        }
        return days;
    }, [currentMonth, safeReport]);

    // Pagination logic
    const totalPages = Math.ceil(safeReport.length / itemsPerPage);
    const paginatedReport = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return safeReport.slice(start, start + itemsPerPage);
    }, [safeReport, currentPage]);

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    return (
        <div className="space-y-6 sm:space-y-8 max-w-full mx-auto pb-10 px-4 sm:px-6 font-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Attendance Summary</h1>
                        <p className="text-lg font-semibold text-slate-500 tracking-tight mt-0.5 font-caveat">Real-time engagement metrics</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10 rounded-md px-4 text-[10px] font-black border-slate-200 flex items-center gap-2 hover:bg-slate-50">
                        <Download size={14} className="opacity-50" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Standardized Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl group border border-white/5">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-primary/70 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <Zap size={12} />
                            Overall Percentage
                        </p>
                        <h2 className="text-5xl font-black text-primary tracking-tighter drop-shadow-sm">
                            {stats.percentage}<span className="text-2xl ml-1 opacity-50">%</span>
                        </h2>
                        
                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Target: 75%</span>
                                <span className="text-[10px] font-black text-white">{stats.percentage}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.percentage}%` }}
                                    className="bg-primary h-full shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all duration-1000"></div>
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]"></div>
                </div>

                {[
                    { label: 'Present', value: stats.present, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/50', border: 'border-emerald-100', glow: 'shadow-emerald-500/10' },
                    { label: 'Absent', value: stats.absent, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50/50', border: 'border-rose-100', glow: 'shadow-rose-500/10' },
                    { label: 'Late', value: stats.late, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-100', glow: 'shadow-amber-500/10' }
                ].map((stat, idx) => (
                    <Card key={idx} className={`border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm`}>
                        <CardContent className="p-7 flex items-center gap-5">
                            <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border ${stat.border} shrink-0 shadow-lg ${stat.glow} transition-transform group-hover:scale-110`}>
                                <stat.icon size={28} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h2 className="text-2xl font-black text-slate-900 leading-none flex items-baseline gap-1">
                                    {stat.value}
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Days</span>
                                </h2>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Attendance Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Calendar */}
                <Card className="lg:col-span-1 border-slate-200 shadow-sm">
                    <CardHeader className="p-5 border-b border-slate-100 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-black text-slate-900">Monthly Calendar</CardTitle>
                                <CardDescription className="text-base font-semibold text-slate-400 font-caveat">Day-wise status</CardDescription>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} className="h-8 w-8 rounded-md"><ChevronLeft size={16} /></Button>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 w-24 text-center">
                                    {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} className="h-8 w-8 rounded-md"><ChevronRight size={16} /></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        <div className="grid grid-cols-7 gap-2 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, idx) => (
                                <div
                                    key={idx}
                                    className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-black transition-all border ${day.type === 'empty' ? 'bg-transparent border-transparent' :
                                        day.status === 'PRESENT' ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200' :
                                            day.status === 'ABSENT' ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200' :
                                                day.status === 'LATE' ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200' :
                                                    'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                            {[
                                { label: 'Present', color: 'bg-emerald-500' },
                                { label: 'Absent', color: 'bg-rose-500' },
                                { label: 'Late', color: 'bg-amber-500' }
                            ].map(legend => (
                                <div key={legend.label} className="flex items-center gap-1.5">
                                    <div className={`w-2.5 h-2.5 rounded-full ${legend.color}`}></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{legend.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* History Table with Pagination */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-black text-slate-900">Detailed Logs</CardTitle>
                                <CardDescription className="text-base font-semibold text-slate-400 font-caveat">Recent history sessions</CardDescription>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-wider">Historical Data</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 min-h-[400px]">
                            <Table className="w-full border-separate border-spacing-0">
                                <TableHeader>
                                    <TableRow className="bg-white">
                                        <TableHead className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-100">Date</TableHead>
                                        <TableHead className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-100">Subject / Class</TableHead>
                                        <TableHead className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedReport.map((record, idx) => (
                                        <TableRow key={idx} className="hover:bg-slate-50/80 transition-all duration-300 border-b border-slate-50 last:border-0 group">
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px] font-black text-slate-900 tracking-tight leading-none mb-1">
                                                            {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                                                        {record.subject || "General"}
                                                    </span>
                                                    <span className="text-[13px] font-semibold text-slate-400 font-caveat">{record.class || "Unified Node"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm transition-all duration-300 ${
                                                    record.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                                                    record.status === 'ABSENT' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                                                    'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                                }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${
                                                        record.status === 'PRESENT' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                                                        record.status === 'ABSENT' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                                                        'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                                                    }`}></div>
                                                    {record.status}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {safeReport.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shrink-0">
                                                        <Search size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 uppercase">Registry Exhausted</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">No records found for this student</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Showing <span className="text-slate-900 font-black">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, safeReport.length)}</span> of {safeReport.length}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 rounded-md border-slate-200 disabled:opacity-30"
                                    >
                                        <ChevronFirst size={14} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 rounded-md border-slate-200 disabled:opacity-30"
                                    >
                                        <ChevronLeft size={14} />
                                    </Button>
                                    <div className="h-8 px-3 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-900 mx-1">
                                        {currentPage} / {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 rounded-md border-slate-200 disabled:opacity-30"
                                    >
                                        <ChevronRight size={14} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 rounded-md border-slate-200 disabled:opacity-30"
                                    >
                                        <ChevronLast size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentAttendanceView;
