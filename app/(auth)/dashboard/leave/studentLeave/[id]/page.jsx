'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader, 
    CardTitle, 
    Button, 
    Badge, 
    Separator,
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from '@/component/ui/CustomUI';
import { Calendar, User, MessageSquare, CheckCircle, XCircle, ArrowLeft, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeaveDetailPage() {
    const { token, selectedRole, selectedUserId } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchLeaveDetail = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                // Note: The backend endpoint for single leave needs to be implemented or we fetch all and filter
                // For now, I'll fetch the list and find the ID, but a dedicated GET /leave/:id is better.
                // Assuming GET /api/web/leave/:id exists based on common patterns
                const response = await fetch(`${baseUrl}/leave`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'x-selected-role': selectedRole,
                        'x-selected-user-id': selectedUserId || ''
                    }
                });
                const result = await response.json();
                
                if (result.success) {
                    const foundLeave = result.data.find(l => l.id === id);
                    setLeave(foundLeave);
                }
            } catch (error) {
                console.error('Error fetching leave details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchLeaveDetail();
        }
    }, [token, id, selectedRole, selectedUserId]);

    const handleAction = async (status) => {
        setActionLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/leave/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                },
                body: JSON.stringify({ status })
            });
            const result = await response.json();
            
            if (result.success) {
                toast.success(`Leave ${status.toLowerCase()} successfully`);
                setLeave(prev => ({ ...prev, status }));
            } else {
                toast.error(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating leave status:', error);
            toast.error('Something went wrong');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading leave details...</div>;
    if (!leave) return <div className="p-8 text-center text-red-500">Leave request not found</div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-500 py-1 px-3">Approved</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive" className="py-1 px-3">Rejected</Badge>;
            default:
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50 py-1 px-3">Pending</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/leave/studentLeave">Student Leaves</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Request Details</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
            </div>

            <Card className="shadow-lg border-none">
                <CardHeader className="bg-slate-50 border-b rounded-t-xl py-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-slate-800">
                                Leave Request Details
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Submitted on {new Date(leave.createdAt).toLocaleString()}
                            </div>
                        </div>
                        {getStatusBadge(leave.status)}
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                    {/* Student & Sender Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Student Information</h3>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{leave.student?.user?.name}</p>
                                    <p className="text-sm text-muted-foreground">Class: {leave.classId}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Submitted By</h3>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{leave.sender?.name}</p>
                                    <Badge variant="outline" className="capitalize mt-1">{leave.sender?.role?.toLowerCase()}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Date Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Leave Duration</h3>
                        <div className="flex items-center gap-6 text-lg font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                            </div>
                            <Separator orientation="vertical" className="h-6" />
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span>{new Date(leave.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Reason */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Reason for Leave
                        </h3>
                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 italic text-slate-700 leading-relaxed">
                            "{leave.reason}"
                        </div>
                    </div>
                </CardContent>

                {leave.status === 'PENDING' && (
                    <CardFooter className="bg-slate-50 border-t rounded-b-xl p-6 flex justify-end gap-4">
                        <Button 
                            variant="destructive" 
                            className="px-8 font-bold" 
                            onClick={() => handleAction('REJECTED')}
                            disabled={actionLoading}
                        >
                            <XCircle className="h-4 w-4 mr-2" /> Reject
                        </Button>
                        <Button 
                            className="bg-green-600 hover:bg-green-700 px-8 font-bold" 
                            onClick={() => handleAction('APPROVED')}
                            disabled={actionLoading}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
