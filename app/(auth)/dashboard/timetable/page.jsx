'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
    ArrowLeft,
    User,
    MapPin,
    GraduationCap,
    Calendar,
    Clock,
    ChevronRight,
    Shield,
    Layers,
    Zap,
    ArrowUpRight,
    MoreVertical,
    Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    CardDescription
} from '@/component/ui/CustomUI';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const ACCENT_COLORS = [
    { bg: 'bg-primary/5', border: 'border-primary/20', text: 'text-primary' },
    { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
    { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' },
    { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
    { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600' },
];

const formatTime = (time) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) return time ?? '';
    const lo = time.toLowerCase();
    const isPM = lo.includes('pm'), isAM = lo.includes('am');
    const parts = time.replace(/[ap]m/gi, '').trim().split(':');
    let h = parseInt(parts[0]), m = parseInt(parts[1]);
    if (isNaN(h) || isNaN(m)) return time;
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const timeToMinutes = (time) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) return 0;
    const lo = time.toLowerCase();
    const isPM = lo.includes('pm'), isAM = lo.includes('am');
    const parts = time.replace(/[ap]m/gi, '').trim().split(':');
    let h = parseInt(parts[0]), m = parseInt(parts[1] ?? 0);
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
    return h * 60 + m;
};

const getColorForSubject = (subjectId) => {
    if (!subjectId) return ACCENT_COLORS[0];
    return ACCENT_COLORS[
        subjectId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % ACCENT_COLORS.length
    ];
};

const currentDayName = (() => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[new Date().getDay()];
})();

export default function TimetablePage() {
    const router = useRouter();
    const { token, selectedRole, selectedUserId, user, displayName, selectedChild } = useAuth();
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(
        DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
    );

    useEffect(() => { fetchTimetable(); }, [token, selectedRole, selectedChild, selectedUserId]);

    const fetchTimetable = async () => {
        if (!token || !selectedRole) { setLoading(false); return; }
        setLoading(true);
        try {
            let base = process.env.NEXT_PUBLIC_API_URL;
            // Use the new unified endpoint for all roles
            const ep = '/timetable/my-timetable';

            const res = await fetch(`${base}${ep}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId ?? '',
                },
            });
            const json = await res.json();
            setTimetable(json.success ? json.data : []);
        } catch (e) {
            console.error('Timetable fetch failed', e);
            setTimetable([]);
        } finally {
            setLoading(false);
        }
    };

    const groupedTimetable = useMemo(() =>
        timetable.reduce((acc, e) => {
            if (!acc[e.day]) acc[e.day] = [];
            acc[e.day].push(e);
            return acc;
        }, {}),
        [timetable]);

    const visibleDays = useMemo(() => {
        const base = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
        if (timetable.some(t => t.day === 'SATURDAY')) base.push('SATURDAY');
        if (timetable.some(t => t.day === 'SUNDAY')) base.push('SUNDAY');
        return base;
    }, [timetable]);

    const intervals = useMemo(() => {
        if (!timetable.length) return [];
        const times = new Set();
        timetable.forEach(t => { times.add(t.startTime); times.add(t.endTime); });
        const sorted = [...times].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
        return sorted.slice(0, -1).map((s, i) => ({ start: s, end: sorted[i + 1] }));
    }, [timetable]);

    const renderGridCell = (day, interval) => {
        const entry = (groupedTimetable[day] ?? []).find(e =>
            timeToMinutes(e.startTime) <= timeToMinutes(interval.start) &&
            timeToMinutes(e.endTime) >= timeToMinutes(interval.end)
        );
        if (!entry) return (
            <div className="h-full w-full border-r border-b border-slate-100 min-h-[90px] flex items-center justify-center bg-slate-50/30">
                <div className="w-1 h-1 rounded-full bg-slate-200" />
            </div>
        );
        const s = getColorForSubject(entry.subjectId);
        const isFirst = entry.startTime === interval.start;
        return (
            <div className="h-full w-full border-r border-b border-slate-100 p-1.5 min-h-[90px] bg-white">
                <div className={`h-full w-full rounded-md ${s.bg} border ${s.border} p-3 group/cell hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative`}>
                    {isFirst ? (
                        <div className="relative z-10">
                            <h4 className={`text-[10px] font-black uppercase tracking-tight ${s.text} leading-tight mb-1 truncate`}>
                                {entry.subject?.name}
                            </h4>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                                    {selectedRole === 'STAFF'
                                        ? <><Layers size={10} className="opacity-50" /><span>{entry.class?.standard?.name}-{entry.class?.division?.name}</span></>
                                        : <><User size={10} className="opacity-50" /><span>{entry.staff?.user?.name}</span></>}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1 italic">
                                    <MapPin size={10} className="opacity-40" /><span>{entry.room || 'N/A'}</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <div className={`w-1 h-1 rounded-full ${s.text.replace('text-', 'bg-')} opacity-20`} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center animate-pulse border border-slate-100">
                <Clock className="text-primary" size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Timetable...</p>
        </div>
    );

    const dayEntries = (groupedTimetable[selectedDay] || [])
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase font-header">Time Table</h1>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                            {selectedRole === 'STAFF' && `${displayName} · Teaching Node Operations`}
                            {selectedRole === 'STUDENT' && (timetable[0]?.class ? `${timetable[0].class.standard?.name} - ${timetable[0].class.division?.name}` : "Student Schedule")}
                            {selectedRole === 'PARENT' && `${selectedChild?.name ?? "Student Schedule"}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 rounded-md px-6 text-[10px] font-bold uppercase tracking-wider border-slate-200">
                        <Download className="mr-2 h-4 w-4 opacity-50" /> Download Time Table
                    </Button>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-hidden rounded-md border border-slate-200 shadow-sm bg-white">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-6 text-left border-r border-b border-slate-100 w-40">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Time Slot</span>
                                </th>
                                {visibleDays.map(day => (
                                    <th key={day} className={`p-6 text-center border-r border-b border-slate-100 min-w-[180px] transition-all ${day === currentDayName ? 'bg-primary/5' : ''}`}>
                                        <p className={`text-[11px] font-black uppercase tracking-widest ${day === currentDayName ? 'text-primary' : 'text-slate-900'}`}>
                                            {day}
                                        </p>
                                        {day === currentDayName && (
                                            <div className="mt-1 flex justify-center">
                                                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {intervals.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleDays.length + 1} className="p-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100">
                                                <Layers size={32} />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No classes scheduled</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : intervals.map((iv, idx) => (
                                <tr key={idx} className="group/row">
                                    <td className="p-6 border-r border-b border-slate-100 align-top bg-slate-50/30 group-hover/row:bg-slate-50 transition-colors">
                                        <span className="text-lg font-black text-slate-900 tracking-tight block uppercase leading-none font-header">{formatTime(iv.start).split(' ')[0]}</span>
                                        <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase tracking-widest">{formatTime(iv.start).split(' ')[1]}</span>
                                    </td>
                                    {visibleDays.map(day => (
                                        <td key={`${day}-${idx}`} className="p-0">{renderGridCell(day, iv)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`flex-shrink-0 px-6 py-3 rounded-md font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ${selectedDay === day
                                ? 'bg-primary text-white shadow-md shadow-primary/10'
                                : 'bg-white text-slate-500 border border-slate-200'
                                }`}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {dayEntries.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-slate-50 rounded-md border-2 border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm">
                                <Calendar size={32} />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No Classes Today</p>
                        </div>
                    )}

                    {dayEntries.map((entry, idx) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="overflow-hidden group border-slate-200 shadow-sm">
                                <div className="flex min-h-[100px]">
                                    <div className="w-24 bg-slate-50 p-6 flex flex-col justify-center items-center border-r border-slate-100 group-hover:bg-primary/5 transition-colors">
                                        <p className="text-lg font-black text-slate-900 tracking-tight leading-none font-header">{formatTime(entry.startTime).split(' ')[0]}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{formatTime(entry.startTime).split(' ')[1]}</p>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-center space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="primary" className="h-5 px-2 text-[8px] uppercase tracking-widest font-bold">
                                                {entry.subject?.name}
                                            </Badge>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-tight group-hover:text-primary transition-colors font-header">
                                            {entry.subject?.name}
                                        </h3>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[9px] uppercase tracking-widest">
                                                <User size={10} className="opacity-50" />
                                                <span>{selectedRole === 'STAFF' ? `${entry.class?.standard?.name}-${entry.class?.division?.name}` : entry.staff?.user?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-widest italic opacity-60">
                                                <MapPin size={10} className="opacity-40" />
                                                <span>{entry.room || 'Node 102'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Status Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {selectedRole === 'STUDENT' && (
                    <>
                        <Card className="bg-slate-900 text-white border-none shadow-lg p-8 relative overflow-hidden group">
                            <Shield className="absolute top-6 right-6 h-12 w-12 text-primary opacity-10 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-primary">Academic Growth</h4>
                            <p className="text-slate-400 font-semibold text-[11px] leading-relaxed">
                                Your journey to excellence starts with a single step. Keep learning and growing!
                            </p>
                        </Card>
                        <Card className="bg-primary text-white border-none shadow-xl p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-orange-600 opacity-90" />
                            <Zap className="absolute top-6 right-6 h-12 w-12 text-white opacity-20 group-hover:scale-110 transition-transform relative z-10" />
                            <div className="relative z-10">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/90">Skill Mastery</h4>
                                <p className="text-white font-semibold text-[11px] leading-relaxed">
                                    Every class is an opportunity to sharpen your mind and build your bright future.
                                </p>
                            </div>
                        </Card>
                        <Card className="p-8 relative overflow-hidden group border-slate-200">
                            <Layers className="absolute top-6 right-6 h-12 w-12 text-slate-200 opacity-20 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Weekly Progress</h4>
                            <p className="text-slate-500 font-semibold text-[11px] leading-relaxed">
                                {timetable.length} active sessions scheduled this week. Consistency is the key!
                            </p>
                        </Card>
                    </>
                )}
                {selectedRole === 'STAFF' && (
                    <>
                        <Card className="bg-slate-900 text-white border-none shadow-lg p-8 relative overflow-hidden group">
                            <Shield className="absolute top-6 right-6 h-12 w-12 text-primary opacity-10 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-primary">Teaching Impact</h4>
                            <p className="text-slate-400 font-semibold text-[11px] leading-relaxed">
                                You aren't just teaching a class; you're shaping the future leaders of tomorrow.
                            </p>
                        </Card>
                        <Card className="bg-primary text-white border-none shadow-xl p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-orange-600 opacity-90" />
                            <Zap className="absolute top-6 right-6 h-12 w-12 text-white opacity-20 group-hover:scale-110 transition-transform relative z-10" />
                            <div className="relative z-10">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/90">Class Harmony</h4>
                                <p className="text-white font-semibold text-[11px] leading-relaxed">
                                    Your guidance is the compass that leads students to their fullest potential.
                                </p>
                            </div>
                        </Card>
                        <Card className="p-8 relative overflow-hidden group border-slate-200">
                            <Layers className="absolute top-6 right-6 h-12 w-12 text-slate-200 opacity-20 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Node Load</h4>
                            <p className="text-slate-500 font-semibold text-[11px] leading-relaxed">
                                Managing {timetable.length} active teaching sessions across institutional cycles.
                            </p>
                        </Card>
                    </>
                )}
                {selectedRole === 'PARENT' && (
                    <>
                        <Card className="bg-slate-900 text-white border-none shadow-lg p-8 relative overflow-hidden group">
                            <Shield className="absolute top-6 right-6 h-12 w-12 text-primary opacity-10 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-primary">Growth Tracking</h4>
                            <p className="text-slate-400 font-semibold text-[11px] leading-relaxed">
                                Stay connected with your child's academic journey and celebrate every milestone.
                            </p>
                        </Card>
                        <Card className="bg-primary text-white border-none shadow-xl p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-orange-600 opacity-90" />
                            <Zap className="absolute top-6 right-6 h-12 w-12 text-white opacity-20 group-hover:scale-110 transition-transform relative z-10" />
                            <div className="relative z-10">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/90">Future Ready</h4>
                                <p className="text-white font-semibold text-[11px] leading-relaxed">
                                    Consistent learning today builds the foundation for a successful tomorrow.
                                </p>
                            </div>
                        </Card>
                        <Card className="p-8 relative overflow-hidden group border-slate-200">
                            <Layers className="absolute top-6 right-6 h-12 w-12 text-slate-200 opacity-20 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Learning Support</h4>
                            <p className="text-slate-500 font-semibold text-[11px] leading-relaxed">
                                Supporting {timetable.length} core subject sessions for balanced academic development.
                            </p>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
