'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
    Plus, 
    FileText, 
    Calendar, 
    Clock, 
    ChevronRight, 
    Filter,
    ClipboardList,
    AlertCircle
} from 'lucide-react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription,
    Badge, 
    Button,
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from '@/component/ui/CustomUI';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/component/ui/Table/BaseTable';

export default function LeavesPage() {
    const { token, selectedRole, selectedUserId } = useAuth();
    const router = useRouter();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const endpoint = selectedRole === 'STAFF' ? '/leave/staff' : '/leave';
                
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-selected-role': selectedRole,
                        'x-selected-user-id': selectedUserId || ''
                    }
                });
                const result = await response.json();
                
                if (result.success) {
                    if (selectedRole === 'STAFF' && result.data.myLeaves) {
                        setLeaves(result.data.myLeaves);
                    } else {
                        setLeaves(result.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching leaves:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchLeaves();
        }
    }, [token, selectedRole, selectedUserId]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <Badge variant="success" className="h-6 text-[9px]">Approved</Badge>;
            case 'REJECTED':
                return <Badge variant="error" className="h-6 text-[9px]">Rejected</Badge>;
            default:
                return <Badge variant="outline" className="h-6 text-[9px] text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-300" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-[10px] font-bold uppercase tracking-wider text-slate-900">My Leaves</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase font-header">Leave Management</h1>
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Application tracking & History</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 rounded-md text-xs font-bold border-slate-200">
                        <Filter size={16} className="mr-2 opacity-50" />
                        Filter Data
                    </Button>
                    <Button onClick={() => router.push('/dashboard/leave/add')} className="h-11 rounded-md px-6 text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/10 transition-all active:scale-95">
                        <Plus size={16} className="mr-2" />
                        Apply for Leave
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/30">
                    <div>
                        <CardTitle className="text-sm">Application History</CardTitle>
                        <CardDescription>Comprehensive log of all requests</CardDescription>
                    </div>
                    <Badge variant="outline" className="h-6 text-[9px] border-slate-200 text-slate-500">Live Sync</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="w-full border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">Leave Duration</TableHead>
                                    <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">Reason / Context</TableHead>
                                    <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">Application Status</TableHead>
                                    <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 text-right">Applied On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Retrieving Records...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : leaves.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                    <AlertCircle size={32} strokeWidth={1.5} />
                                                </div>
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">No leave applications found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leaves.map((leave) => (
                                        <TableRow key={leave.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-0 group">
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-md bg-slate-100 flex flex-col items-center justify-center border border-slate-200 group-hover:bg-white group-hover:border-primary/20 transition-all">
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase">From</span>
                                                        <span className="text-xs font-black text-slate-900 font-header">{new Date(leave.startDate).getDate()}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 tracking-tight">
                                                            {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">To</span>
                                                            <span className="text-[10px] font-bold text-slate-500">
                                                                {new Date(leave.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-semibold text-slate-600 leading-snug line-clamp-2 italic">
                                                        "{leave.reason}"
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                {getStatusBadge(leave.status)}
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {new Date(leave.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Submission Date</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
