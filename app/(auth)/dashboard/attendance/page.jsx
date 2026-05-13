'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { ClipboardCheck, UserCircle2, ChevronRight, Baby } from 'lucide-react';
import { toast } from "react-hot-toast"
import { Button } from "@/component/ui/CustomUI";
import StaffAttendanceView from '@/component/dashboard/attendance/StaffAttendanceView';
import StudentAttendanceView from '@/component/dashboard/attendance/StudentAttendanceView';

const AttendancePage = () => {
    const { selectedRole, token, user, selectedUserId, selectedChild } = useAuth();
    const [loading, setLoading] = useState(false);
    const [markingContext, setMarkingContext] = useState(null);
    const [selectedItem, setSelectedItem] = useState('');
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({ 
        report: [], 
        stats: { total: 0, present: 0, absent: 0, late: 0, percentage: 0 } 
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (selectedRole === 'STAFF') {
            fetchMarkingContext();
        } else if (selectedRole === 'STUDENT' && selectedUserId) {
            fetchStudentReport(selectedUserId);
        } else if (selectedRole === 'PARENT' && selectedChild?.id) {
            fetchStudentReport(selectedChild.id);
        }
    }, [selectedRole, token, selectedUserId, selectedChild]);

    const fetchMarkingContext = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/marking-context`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                }
            });
            const data = await res.json();
            if (data.success) {
                setMarkingContext(data.data);
                if (data.data.context && data.data.context.length > 0) {
                    const first = data.data.context[0];
                    const itemId = first.type === 'DAY_WISE' ? first.id : `${first.classId}|${first.subjectId}`;
                    setSelectedItem(itemId);
                }
            }
        } catch (error) {
            console.error('Context fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentList = async () => {
        if (!selectedItem || !markingContext || !token) return;
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/attendance/mark-list?date=${date}`;
            if (markingContext.attendanceType === 'DAY_WISE') {
                url += `&classId=${selectedItem}`;
            } else {
                const [classId, subjectId] = selectedItem.split('|');
                url += `&classId=${classId}&subjectId=${subjectId}`;
            }

            const res = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                }
            });
            const data = await res.json();
            if (data.success) {
                setStudents(data.data.map(s => ({
                    ...s,
                    status: s.attendance?.status || 'PRESENT',
                    remark: s.attendance?.remark || ''
                })));
            }
        } catch (error) {
            console.error('List fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentReport = async (studentId) => {
        if (!token || !studentId) return;
        setLoading(true);
        try {
            const end = new Date().toISOString().split('T')[0];
            const start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const url = `${baseUrl}/attendance/student-report?startDate=${start}&endDate=${end}&studentId=${studentId}`;

            const res = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                }
            });
            const data = await res.json();
            
            if (data.success && data.data) {
                setAttendanceData(data.data);
            } else {
                toast.error(data.message || "Failed to retrieve records");
            }
        } catch (error) {
            console.error('Report fetch error:', error);
            toast.error("Failed to sync attendance report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRole === 'STAFF' && selectedItem) {
            fetchStudentList();
        }
    }, [selectedItem, date, selectedRole]);

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const handleSave = async () => {
        if (!selectedItem || students.length === 0) return;
        setIsSaving(true);
        try {
            let payload = {
                date,
                records: students.map(s => ({ studentId: s.id, status: s.status, remark: s.remark }))
            };

            if (markingContext.attendanceType === 'DAY_WISE') {
                payload.classId = selectedItem;
            } else {
                const [classId, subjectId] = selectedItem.split('|');
                payload.classId = classId;
                payload.subjectId = subjectId;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/bulk-mark`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Attendance verified and synchronized");
                fetchStudentList();
            } else {
                toast.error(data.message || "Synchronization failed");
            }
        } catch (error) {
            toast.error("Network communication error");
        } finally {
            setIsSaving(false);
        }
    };

    const isDateWithinRange = useMemo(() => {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return selectedDate <= today && selectedDate >= oneWeekAgo;
    }, [date]);

    if (loading && !markingContext && attendanceData.report.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 font-jakarta">
                <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center animate-pulse border border-slate-100">
                    <ClipboardCheck className="text-primary" size={32} />
                </div>
                <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Synchronizing Records...</p>
            </div>
        );
    }

    if (selectedRole === 'STAFF') {
        return (
            <StaffAttendanceView 
                markingContext={markingContext}
                date={date}
                setDate={setDate}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                students={students}
                handleStatusChange={handleStatusChange}
                handleSave={handleSave}
                isSaving={isSaving}
                isDateWithinRange={isDateWithinRange}
                loading={loading}
            />
        );
    }

    return (
        <div className="space-y-6">
            <StudentAttendanceView 
                report={attendanceData.report}
                stats={attendanceData.stats}
                loading={loading}
            />
        </div>
    );
};

export default AttendancePage;
