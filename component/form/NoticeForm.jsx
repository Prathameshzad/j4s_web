'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
    Button, 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    Input, 
    Label, 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue,
    Spinner
} from '@/component/ui/CustomUI';
import { Save, X, Calendar, Users, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NoticeForm({ initialData, isEdit = false }) {
    const router = useRouter();
    const { token, selectedRole, user, selectedUserId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingClasses, setFetchingClasses] = useState(true);
    const [fetchingRecipients, setFetchingRecipients] = useState(false);
    
    const [classes, setClasses] = useState([]);
    const [recipients, setRecipients] = useState([]);
    
    const [formData, setFormData] = useState({
        classIds: initialData?.classId ? [initialData.classId] : [],
        targetType: initialData?.targetType || ['STUDENTS'],
        recipientId: initialData?.recipientId || initialData?.recipient?.id || 'ALL',
        title: initialData?.title || '',
        content: initialData?.content || '',
        scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchClasses();
    }, [token, selectedRole, selectedUserId]);

    useEffect(() => {
        if (formData.classIds.length === 1 && formData.targetType.length === 1) {
            fetchRecipients();
        } else {
            setRecipients([]);
        }
    }, [JSON.stringify(formData.classIds), JSON.stringify(formData.targetType)]);

    const fetchClasses = async () => {
        if (!token) return;
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/staff/teacher-classes`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId
                }
            });
            const result = await response.json();
            if (result.success) {
                // Numeric sort
                const sorted = result.data.sort((a, b) => {
                    const aStd = String(a.standard?.name || '');
                    const bStd = String(b.standard?.name || '');
                    return aStd.localeCompare(bStd, undefined, { numeric: true });
                });
                setClasses(sorted);
            } else {
                toast.error('Failed to load classes');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error('Connection error while loading classes');
        } finally {
            setFetchingClasses(false);
        }
    };

    const fetchRecipients = async () => {
        if (!token || formData.classIds.length !== 1 || formData.targetType.length !== 1) return;
        setFetchingRecipients(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const queryParams = new URLSearchParams({ 
                classId: formData.classIds[0],
                targetType: formData.targetType[0]
            });
            
            const response = await fetch(`${baseUrl}/notice/recipients?${queryParams.toString()}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId
                }
            });
            const result = await response.json();
            if (result.success) {
                setRecipients(result.data);
            }
        } catch (error) {
            console.error('Error fetching recipients:', error);
        } finally {
            setFetchingRecipients(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.content) {
            toast.error('Please fill in title and content');
            return;
        }

        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const payload = {
                ...formData,
                recipientIds: formData.recipientId === 'ALL' || formData.classIds.length !== 1 || formData.targetType.length !== 1
                    ? [] 
                    : [formData.recipientId]
            };

            const url = isEdit ? `${baseUrl}/notice/${initialData.id}` : `${baseUrl}/notice`;
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                toast.success(`Notice ${isEdit ? 'updated' : 'created'} successfully!`);
                router.push('/dashboard/notice');
                router.refresh();
            } else {
                toast.error(result.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error('Failed to save notice');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingClasses) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-slate-100 p-8">
                    <CardTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <Send className="w-6 h-6 text-primary" />
                        {isEdit ? 'Edit Notice' : 'Create New Notice'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* 1. Target Audience (Multi-select) */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 ml-1">Target Audience</Label>
                            <div className="flex flex-wrap gap-2">
                                {['STUDENTS', 'PARENTS', 'TEACHERS'].map((type) => {
                                    const isSelected = formData.targetType.includes(type);
                                    return (
                                        <Button
                                            key={type}
                                            type="button"
                                            variant={isSelected ? 'default' : 'outline'}
                                            className={`h-12 flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                isSelected 
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                                    : 'bg-slate-50/50 border-slate-200 text-slate-400 hover:bg-slate-100'
                                            }`}
                                            onClick={() => {
                                                let newTargets = isSelected 
                                                    ? formData.targetType.filter(t => t !== type)
                                                    : [...formData.targetType, type];
                                                if (newTargets.length > 0) {
                                                    setFormData({ ...formData, targetType: newTargets, recipientId: 'ALL' });
                                                }
                                            }}
                                        >
                                            {isSelected && <CheckCircle2 className="w-3 h-3 mr-2" />}
                                            {type === 'STUDENTS' ? 'Student' : type === 'PARENTS' ? 'Parent' : 'Staff'}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Target Classes (Multi-select) */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 ml-1">Target Classes</Label>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                                <Button
                                    type="button"
                                    variant={formData.classIds.length === 0 ? 'primary' : 'outline'}
                                    className={`h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                        formData.classIds.length === 0 
                                            ? 'shadow-lg shadow-primary/20' 
                                            : 'bg-slate-50/50 border-slate-200 text-slate-400 hover:bg-slate-100'
                                    }`}
                                    onClick={() => setFormData({ ...formData, classIds: [], recipientId: 'ALL' })}
                                >
                                    {formData.classIds.length === 0 && <CheckCircle2 className="w-3 h-3 mr-2" />}
                                    All Classes
                                </Button>
                                {classes.map((c) => {
                                    const isSelected = formData.classIds.includes(c.id);
                                    return (
                                        <Button
                                            key={c.id}
                                            type="button"
                                            variant={isSelected ? 'primary' : 'outline'}
                                            className={`h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                isSelected 
                                                    ? 'shadow-lg shadow-primary/20' 
                                                    : 'bg-slate-50/50 border-slate-200 text-slate-400 hover:bg-slate-100'
                                            }`}
                                            onClick={() => {
                                                let newClasses = [...formData.classIds];
                                                if (isSelected) {
                                                    newClasses = newClasses.filter(id => id !== c.id);
                                                } else {
                                                    newClasses.push(c.id);
                                                }
                                                setFormData({ ...formData, classIds: newClasses, recipientId: 'ALL' });
                                            }}
                                        >
                                            {isSelected && <CheckCircle2 className="w-3 h-3 mr-2" />}
                                            {c.standard?.name} - {c.division?.name}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Shared To (Only if single audience & single class) */}
                        {formData.classIds.length === 1 && formData.targetType.length === 1 && (
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 ml-1">Shared To</Label>
                                <Select 
                                    value={formData.recipientId} 
                                    onValueChange={(val) => setFormData({...formData, recipientId: val})}
                                    disabled={fetchingRecipients}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-primary/20 transition-all">
                                        {fetchingRecipients ? <Spinner size="sm" /> : <SelectValue placeholder="All" />}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Recipients</SelectItem>
                                        {recipients.map(r => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* 4. Date */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 ml-1">Scheduled Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input 
                                    type="date" 
                                    min={new Date().toISOString().split('T')[0]}
                                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-primary/20 transition-all"
                                    value={formData.scheduledAt}
                                    onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. Title */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-600 ml-1">Notice Title</Label>
                        <Input 
                            placeholder="e.g. Annual Sports Day Announcement"
                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-primary/20 transition-all font-bold"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* 6. Details */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-600 ml-1">Details</Label>
                        <textarea 
                            rows={6}
                            placeholder="Type the notice details here..."
                            className="w-full p-6 rounded-[2rem] border-slate-200 bg-slate-50/50 focus:ring-primary/20 transition-all resize-none outline-none focus:border-primary/50 text-slate-700 font-medium"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button 
                            type="submit" 
                            className="flex-1 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-orange-200 transition-all hover:scale-[1.02] active:scale-95"
                            disabled={loading}
                        >
                            {loading ? <Spinner className="mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                            {isEdit ? 'Update Notice' : 'Post Notice'}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="h-16 px-8 rounded-2xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
