'use client';

import React, { useState, useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    Filter,
    AlertCircle,
    ShieldCheck,
    Download,
    ClipboardCheck,
    Layers,
    Search,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    LayoutDashboard
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge
} from "@/component/ui/CustomUI"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/component/ui/Table/BaseTable';
import { motion, AnimatePresence } from 'framer-motion';

const StaffAttendanceView = ({
    markingContext,
    date,
    setDate,
    selectedItem,
    setSelectedItem,
    students,
    handleStatusChange,
    handleSave,
    isSaving,
    isDateWithinRange,
    loading
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const stats = useMemo(() => {
        const total = students.length;
        const present = students.filter(s => s.status === 'PRESENT').length;
        const absent = students.filter(s => s.status === 'ABSENT').length;
        const late = students.filter(s => s.status === 'LATE').length;
        const progress = total > 0 ? Math.round(((present + absent + late) / total) * 100) : 0;
        return { total, present, absent, late, progress };
    }, [students]);

    const filteredStudents = useMemo(() => {
        let list = students.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.rollNumber && String(s.rollNumber).toLowerCase().includes(searchQuery.toLowerCase()))
        );

        return list.sort((a, b) => {
            const rollA = parseInt(a.rollNumber) || 0;
            const rollB = parseInt(b.rollNumber) || 0;
            if (rollA !== rollB) return rollA - rollB;
            return a.name.localeCompare(b.name);
        });
    }, [students, searchQuery]);

    const AttendanceButtons = ({ student, compact = false }) => (
        <div className={`flex items-center gap-1 sm:gap-2 ${compact ? 'justify-end' : 'justify-end'}`}>
            {[
                { label: 'P', full: 'Present', val: 'PRESENT', color: 'emerald' },
                { label: 'A', full: 'Absent', val: 'ABSENT', color: 'rose' },
                { label: 'L', full: 'Late', val: 'LATE', color: 'amber' }
            ].map((btn) => (
                <button
                    key={btn.val}
                    onClick={() => handleStatusChange(student.id, btn.val)}
                    className={`rounded-md font-black tracking-tight transition-all border shadow-sm shrink-0 flex items-center justify-center ${compact ? 'w-8 h-8 text-[10px]' : 'h-9 px-3 sm:px-5 text-[10px]'
                        } ${student.status === btn.val
                            ? (btn.val === 'PRESENT' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : btn.val === 'ABSENT' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-amber-500 text-white border-amber-500 shadow-sm')
                            : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                        }`}
                >
                    <span className={compact ? 'inline' : 'hidden sm:inline'}>{btn.full}</span>
                    <span className={compact ? 'hidden' : 'sm:hidden'}>{btn.label}</span>
                    {compact && btn.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="w-full space-y-6 sm:space-y-8 max-w-full mx-auto pb-10 px-4 sm:px-6 font-jakarta overflow-hidden">
            {/* Standardized Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                        <ClipboardCheck size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Mark Attendance</h1>
                        <p className="text-lg font-semibold text-slate-500 tracking-tight mt-0.5 font-caveat">Select class and record student presence</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {!isDateWithinRange && (
                        <Badge variant="outline" className="h-10 px-4 bg-rose-50 border-rose-100 text-rose-600 font-black text-[10px] flex items-center gap-2">
                            <AlertCircle size={14} /> WINDOW EXPIRED
                        </Badge>
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || students.length === 0 || !isDateWithinRange}
                            className="flex-1 sm:flex-none h-10 rounded-md px-6 font-bold text-xs shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSaving ? "Synchronizing..." : <><ShieldCheck size={16} /> Submit Registry</>}
                        </Button>
                        <Button variant="outline" className="flex-1 sm:flex-none h-10 rounded-md px-4 text-[10px] font-black border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50">
                            <Download size={14} className="opacity-50" /> Export PDF
                        </Button>
                    </div>
                </div>
            </div>

            {/* Standardized Metrics Grid (Same as Student View) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden group">
                    <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full min-h-[140px] relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-primary/80 uppercase tracking-widest mb-1">Marking Progress</p>
                            <h2 className="text-4xl font-black tracking-tight">{stats.progress}%</h2>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.progress}%` }}
                                className="bg-primary h-full shadow-[0_0_15px_rgba(249,115,22,0.6)]"
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </CardContent>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000"></div>
                </Card>

                {[
                    { label: 'Total Students', value: stats.total, icon: User, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
                    { label: 'Marked Present', value: stats.present, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Marked Absent', value: stats.absent, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }
                ].map((stat, idx) => (
                    <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-md ${stat.bg} ${stat.color} flex items-center justify-center border ${stat.border} shrink-0 shadow-sm`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">
                                    {stat.value} <span className="text-[10px] text-slate-400 font-bold lowercase">count</span>
                                </h2>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filter Section */}
            <Card className="border-slate-200 shadow-sm overflow-hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                <CardContent className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Marking Date</label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-md px-3 font-black text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                />
                                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="sm:col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Class Selection</label>
                            {markingContext?.context?.length === 0 ? (
                                <div className="h-10 rounded-md bg-rose-50 text-rose-600 font-bold text-[10px] tracking-wider border border-rose-100 flex items-center gap-2 px-3">
                                    <AlertCircle size={14} /> No classes assigned
                                </div>
                            ) : markingContext?.attendanceType === 'DAY_WISE' ? (
                                <div className="h-10 rounded-md bg-slate-50 border border-slate-200 px-3 flex items-center gap-2 border-dashed">
                                    <Layers size={14} className="text-primary opacity-50 shrink-0" />
                                    <span className="text-xs font-black text-slate-700 truncate uppercase tracking-tight">
                                        {markingContext.context[0]?.name || "Primary Class Node"}
                                    </span>
                                </div>
                            ) : (
                                <Select value={selectedItem} onValueChange={setSelectedItem}>
                                    <SelectTrigger className="h-10 rounded-md bg-slate-50 text-xs font-black border-slate-200">
                                        <SelectValue placeholder="Select class for marking" />
                                    </SelectTrigger>
                                    <SelectContent className="border-slate-200 font-jakarta">
                                        {markingContext?.context?.map((item, idx) => (
                                            <SelectItem
                                                key={idx}
                                                value={item.type === 'DAY_WISE' ? item.id : `${item.classId}|${item.subjectId}`}
                                                className="text-xs font-black uppercase tracking-tight"
                                            >
                                                {item.name || `${item.className} - ${item.subjectName}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Registry */}
            <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="shrink-0">
                            <CardTitle className="text-sm font-black text-slate-900">Attendance Registry</CardTitle>
                            <CardDescription className="text-base font-semibold text-slate-400 font-caveat">Enrollment synchronization list</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-72 shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or roll no..."
                                className="pl-9 h-10 w-full bg-white border border-slate-200 rounded-md text-xs font-bold tracking-tight outline-none focus:border-primary transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop View */}
                    <div className="hidden sm:block w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                        <Table className="w-full border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-white">
                                    <TableHead className="w-24 px-5 py-4 text-[10px] font-black text-slate-500 border-b border-slate-100 uppercase tracking-widest text-center">Roll No.</TableHead>
                                    <TableHead className="px-5 py-4 text-[10px] font-black text-slate-500 border-b border-slate-100 uppercase tracking-widest">Student Name</TableHead>
                                    <TableHead className="w-64 px-5 py-4 text-[10px] font-black text-slate-500 border-b border-slate-100 uppercase tracking-widest text-right">Marking Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 group">
                                            <TableCell className="px-5 py-4 font-black text-slate-700 text-xs text-center">
                                                {student.rollNumber || '-'}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 text-sm tracking-tight group-hover:text-primary transition-colors block uppercase">
                                                        {student.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wider uppercase">Active Enrollment</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-right">
                                                <AttendanceButtons student={student} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="sm:hidden space-y-2 p-3 bg-slate-50/50">
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm active:scale-[0.98] transition-all">
                                <div className="shrink-0 w-9 h-9 flex items-center justify-center bg-slate-50 rounded-lg text-[11px] font-black text-slate-500 border border-slate-100 shadow-inner">
                                    {student.rollNumber || '-'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{student.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Status: {student.status}</p>
                                </div>
                                <div className="shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        {[
                                            { label: 'P', val: 'PRESENT', color: 'emerald' },
                                            { label: 'A', val: 'ABSENT', color: 'rose' },
                                            { label: 'L', val: 'LATE', color: 'amber' }
                                        ].map((btn) => (
                                            <button
                                                key={btn.val}
                                                onClick={() => handleStatusChange(student.id, btn.val)}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-black transition-all border shadow-sm ${student.status === btn.val
                                                    ? (btn.val === 'PRESENT' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : btn.val === 'ABSENT' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-amber-500 text-white border-amber-500 shadow-md')
                                                    : 'bg-slate-50 text-slate-400 border-slate-100 active:bg-slate-200'
                                                    }`}
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredStudents.length === 0 && !loading && (
                        <div className="h-64 flex flex-col items-center justify-center space-y-4 p-8 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                                <Search size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black tracking-widest text-slate-900 uppercase">Registry Exhausted</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">No students match your filter criteria</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffAttendanceView;
