'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
    Button, 
    Card, 
    CardContent, 
    Badge,
    Spinner,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/component/ui/CustomUI';
import { 
    Plus, 
    BookOpen, 
    Calendar, 
    Edit2, 
    Trash2, 
    Users, 
    ChevronRight, 
    Book, 
    Clock,
    Zap,
    Shield,
    Layers,
    ArrowUpRight,
    Trophy,
    History,
    FileText,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeworkPage() {
    const router = useRouter();
    const { token, selectedRole, displayName, selectedUserId } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);

    const isStaff = selectedRole === 'STAFF' || selectedRole === 'TEACHER';

    useEffect(() => {
        fetchHomeworks();
    }, [token, selectedRole, selectedUserId]);

    const fetchHomeworks = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUrl}/homework`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                }
            });
            const result = await response.json();
            if (result.success) {
                setHomeworks(result.data);
            }
        } catch (error) {
            console.error('Error fetching homeworks:', error);
            toast.error('Failed to load academic registry');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this assignment?')) return;
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUrl}/homework/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                }
            });
            const result = await response.json();
            if (result.success) {
                toast.success('Assignment purged from registry');
                fetchHomeworks();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Purge operation failed');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center animate-pulse border border-slate-100">
                <BookOpen className="text-primary" size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Indexing Academic Paradigms...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase font-header">Assignment Matrix</h1>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Strategic management of academic deliverables</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isStaff && (
                        <Button 
                            onClick={() => router.push('/dashboard/homework/add')}
                            className="h-11 rounded-md px-8 font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Deploy Task
                        </Button>
                    )}
                    <Button variant="outline" className="h-11 rounded-md px-6 text-[10px] font-bold uppercase tracking-wider border-slate-200">
                        <History className="mr-2 h-4 w-4 opacity-50" /> History
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {homeworks.length === 0 ? (
                        <div className="col-span-full">
                            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30">
                                <CardContent className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm">
                                        <FileText size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Registry Void</p>
                                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">No active academic paradigms currently registered.</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={fetchHomeworks} className="mt-4 uppercase text-[9px] font-bold tracking-widest border-slate-200">
                                        Refresh Registry
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        homeworks.map((hw, index) => (
                            <motion.div
                                key={hw.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card 
                                    onClick={() => router.push(`/dashboard/homework/${hw.id}`)}
                                    className="group cursor-pointer border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden"
                                >
                                    <CardContent className="p-8 space-y-6 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="primary" className="h-6 px-3 text-[9px] uppercase tracking-wider font-bold">
                                                {hw.type || "ASSIGNMENT"}
                                            </Badge>
                                            {isStaff && (
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 rounded-md bg-slate-50 hover:bg-primary hover:text-white transition-all border border-slate-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/dashboard/homework/add?id=${hw.id}`);
                                                        }}
                                                    >
                                                        <Edit2 size={12} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 rounded-md bg-slate-50 hover:bg-rose-500 hover:text-white transition-all border border-slate-100"
                                                        onClick={(e) => handleDelete(e, hw.id)}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase font-header group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {hw.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                <Book size={14} className="text-primary/60" />
                                                <span>{hw.subject?.name}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Node</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                                    {hw.class?.standard?.name}-{hw.class?.division?.name}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isStaff ? 'Engagement' : 'Execution'}</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                                    {isStaff ? `${hw._count?.submissions || 0} Submits` : (hw.submissions?.length > 0 ? 'Verified' : 'Pending')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-md bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                                                    <Clock size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Due Date</span>
                                                    <span className="text-[11px] font-black uppercase text-slate-900 tracking-tight">
                                                        {new Date(hw.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-9 h-9 rounded-md bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-slate-100 group-hover:border-primary/20">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <Card className="bg-slate-900 text-white border-none shadow-lg p-8 relative overflow-hidden group">
                    <Shield className="absolute top-6 right-6 h-12 w-12 text-primary opacity-10 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-primary">Security Protocol</h4>
                    <p className="text-slate-400 font-semibold text-[11px] leading-relaxed">
                        All assignment submissions are verified and timestamped in the academic ledger.
                    </p>
                </Card>
                <Card className="bg-primary text-white border-none shadow-lg p-8 relative overflow-hidden group">
                    <Trophy className="absolute top-6 right-6 h-12 w-12 text-white opacity-10 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3">Performance Node</h4>
                    <p className="text-white/80 font-semibold text-[11px] leading-relaxed">
                        Academic engagement metrics integrated with core grading architecture.
                    </p>
                </Card>
                <Card className="p-8 relative overflow-hidden group border-slate-200">
                    <Zap className="absolute top-6 right-6 h-12 w-12 text-slate-200 opacity-20 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Deployment Efficiency</h4>
                    <p className="text-slate-500 font-semibold text-[11px] leading-relaxed">
                        {homeworks.length} active paradigms deployed in current operational cycle.
                    </p>
                </Card>
            </div>
        </div>
    );
}
