'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import TeacherDashboard from '../../../component/layout/TeacherDashboard';
import StudentDashboard from '../../../component/layout/StudentDashboard';
import ParentDashboard from '../../../component/layout/ParentDashboard';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import StatsGrid from '../../../component/dashboard/StatsGrid';
import RecentNotices from '../../../component/dashboard/RecentNotices';
import DashboardCharts from '../../../component/dashboard/DashboardCharts';

const DashboardPage = () => {
    const { token, selectedProfile } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token || !selectedProfile) return;
            
            setLoading(true);
            try {
                const role = selectedProfile.role.toLowerCase();
                // Map frontend roles to backend endpoint types
                const endpointType = role === 'teacher' ? 'staff' : role;
                const idParam = role === 'teacher' ? 'staffId' : `${role}Id`;
                
                const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/${endpointType}`);
                url.searchParams.append('instituteId', selectedProfile.instituteId);
                url.searchParams.append(idParam, selectedProfile.profileId || selectedProfile.userId);

                const res = await fetch(url.toString(), {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, selectedProfile]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
                    <p className="text-xs font-black uppercase tracking-[4px] text-slate-500 animate-pulse">
                        Synchronizing...
                    </p>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const renderDashboard = () => {
        const role = selectedProfile?.role?.toLowerCase();
        switch (role) {
            case 'teacher':
                return <TeacherDashboard stats={stats} role={selectedProfile.role} />;
            case 'student':
                return <StudentDashboard stats={stats} role={selectedProfile.role} />;
            case 'parent':
                return <ParentDashboard stats={stats} role={selectedProfile.role} />;
            default:
                return (
                    <div className="space-y-8">
                        <DashboardHeader />
                        <StatsGrid stats={stats.stats || stats.overview} role={selectedProfile?.role} />
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2">
                                <DashboardCharts data={stats} role={selectedProfile?.role} />
                            </div>
                            <div className="xl:col-span-1">
                                <RecentNotices notices={stats.recentNotices} />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                key={selectedProfile?.profileId || 'dashboard'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
                {renderDashboard()}
            </motion.div>
        </AnimatePresence>
    );
};

export default DashboardPage;
