'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Textarea, Label } from '@/component/ui/CustomUI';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const LeaveForm = () => {
    const { user, selectedRole, selectedUserId, token, selectedChild, selectedProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        approverId: '',
        studentId: '',
        classId: '',
        instituteId: '',
    });

    React.useEffect(() => {
        if (selectedRole === 'STUDENT' && selectedProfile) {
            setFormData(prev => ({
                ...prev,
                studentId: selectedProfile.id || '',
                classId: selectedProfile.classId || '',
                instituteId: selectedProfile.instituteId || '',
            }));
        } else if (selectedRole === 'PARENT' && selectedChild) {
            setFormData(prev => ({
                ...prev,
                studentId: selectedChild.id,
                classId: selectedChild.classId,
                instituteId: selectedProfile?.instituteId || '',
            }));
        } else if (selectedRole === 'STAFF' && selectedProfile) {
            setFormData(prev => ({
                ...prev,
                instituteId: selectedProfile.instituteId || '',
            }));
        }
    }, [selectedProfile, selectedRole, selectedChild]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation check for students/parents
        if (selectedRole !== 'STAFF') {
            const missing = [];
            if (!formData.studentId) missing.push('Student Identity');
            if (!formData.classId) missing.push('Class Assignment');
            if (!formData.instituteId) missing.push('Institute Context');
            
            if (missing.length > 0) {
                toast.error(`Missing: ${missing.join(', ')}. Please select a student via the switcher in the header.`);
                return;
            }
        }

        setLoading(true);

        try {
            const isStaff = selectedRole === 'STAFF';
            const endpoint = isStaff ? '/leave/staff' : '/leave';
            
            // Note: In a real app, we'd fetch the base URL from env or a utility
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId || ''
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Leave application submitted successfully');
                router.push('/dashboard/leave');
            } else {
                toast.error(result.message || 'Failed to submit leave');
            }
        } catch (error) {
            console.error('Error submitting leave:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-t-primary">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Apply for Leave</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* The student selection is now handled globally in the header for Parents */}
                    {selectedRole === 'PARENT' && selectedChild && (
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {selectedChild.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applying for</p>
                                    <h3 className="text-sm font-black text-slate-900 uppercase">{selectedChild.name}</h3>
                                </div>
                            </div>
                            <Badge variant="outline" className="h-6 border-primary/20 text-primary text-[9px] uppercase font-bold">
                                {selectedChild.className}
                            </Badge>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input 
                                id="startDate"
                                name="startDate"
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input 
                                id="endDate"
                                name="endDate"
                                type="date"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Leave</Label>
                        <Textarea 
                            id="reason"
                            name="reason"
                            placeholder="Please provide a clear reason for your leave..."
                            required
                            rows={4}
                            value={formData.reason}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full py-6 text-lg font-semibold transition-all hover:scale-[1.01]" 
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Leave Application'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
