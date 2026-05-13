'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import NoticeForm from '@/component/form/NoticeForm';
import { Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/component/ui/CustomUI';
import { Edit3, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditNoticePage() {
    const { id } = useParams();
    const router = useRouter();
    const { token, selectedRole, selectedUserId } = useAuth();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedRole && selectedRole !== 'STAFF') {
            router.push('/dashboard/notice');
        }
    }, [selectedRole, router]);

    useEffect(() => {
        fetchNotice();
    }, [id, token]);

    const fetchNotice = async () => {
        if (!token) return;
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/notice/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId
                }
            });
            const result = await response.json();
            if (result.success) {
                // Check if user is the sender
                if (result.data.senderId !== selectedUserId) {
                    toast.error('You are not authorized to edit this notice');
                    router.push('/dashboard/notice');
                    return;
                }
                setNotice(result.data);
            }
        } catch (error) {
            console.error('Error fetching notice:', error);
        } finally {
            setLoading(false);
        }
    };

    if (selectedRole !== 'STAFF') return null;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Spinner size="lg" />
            <p className="text-slate-500 font-medium animate-pulse">Loading notice details...</p>
        </div>
    );
    
    if (!notice) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="p-4 bg-red-50 rounded-full text-red-500">
                <Bell className="w-12 h-12" />
            </div>
            <p className="text-xl font-bold text-slate-800">Notice not found</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/notice">Notices</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Edit Notice</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                
                <div className="flex items-center gap-4 mt-2">
                    <div className="p-4 bg-primary/10 rounded-3xl">
                        <Edit3 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Notice</h1>
                        <p className="text-slate-500 font-medium">Update announcement details for your students and parents.</p>
                    </div>
                </div>
            </div>

            <NoticeForm initialData={notice} isEdit={true} />
        </div>
    );
}
