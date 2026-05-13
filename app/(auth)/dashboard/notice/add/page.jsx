'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import NoticeForm from '@/component/form/NoticeForm';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/component/ui/CustomUI';
import { Bell } from 'lucide-react';

export default function AddNoticePage() {
    const { selectedRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (selectedRole && selectedRole !== 'STAFF') {
            router.push('/dashboard/notice');
        }
    }, [selectedRole, router]);

    if (selectedRole !== 'STAFF') return null;

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
                            <BreadcrumbPage>New Notice</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                
                <div className="flex items-center gap-4 mt-2">
                    <div className="p-4 bg-primary/10 rounded-3xl">
                        <Bell className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Notice</h1>
                        <p className="text-slate-500 font-medium">Publish important information for students and parents.</p>
                    </div>
                </div>
            </div>

            <NoticeForm />
        </div>
    );
}
