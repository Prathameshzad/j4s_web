'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HomeworkForm from '@/component/form/HomeworkForm';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Spinner } from '@/component/ui/CustomUI';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function AddHomeworkPage() {
    const searchParams = useSearchParams();
    const homeworkId = searchParams.get('id');
    const { token, selectedRole, selectedUserId } = useAuth();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(!!homeworkId);

    useEffect(() => {
        if (homeworkId && token) {
            fetchHomework();
        }
    }, [homeworkId, token]);

    const fetchHomework = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            const response = await fetch(`${baseUrl}/homework/${homeworkId}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId
                }
            });
            const result = await response.json();
            if (result.success) {
                setInitialData(result.data);
            }
        } catch (error) {
            console.error('Error fetching homework details:', error);
        } finally {
            setLoading(false);
        }
    };

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
                            <BreadcrumbLink href="/dashboard/homework">Homework</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{homeworkId ? 'Edit Assignment' : 'New Assignment'}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                
                <div className="flex items-center gap-4 mt-2">
                    <div className="p-4 bg-indigo-600/10 rounded-3xl">
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                            {homeworkId ? 'Edit Assignment' : 'Create Assignment'}
                        </h1>
                        <p className="text-slate-500 font-medium">Assign tasks and study material to your students.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Spinner /></div>
            ) : (
                <HomeworkForm initialData={initialData} isEdit={!!homeworkId} />
            )}
        </div>
    );
}
