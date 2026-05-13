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
import { Save, X, Calendar, Book, Send, Clock, BookOpen, Type } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HomeworkForm({ initialData, isEdit = false }) {
    const router = useRouter();
    const { token, selectedRole, selectedUserId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    const [formData, setFormData] = useState({
        classId: initialData?.classId || '',
        subjectId: initialData?.subjectId || '',
        type: initialData?.type || 'HOMEWORK',
        title: initialData?.title || '',
        content: initialData?.content || '',
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchAllData();
    }, [token, selectedRole, selectedUserId]);

    const fetchAllData = async () => {
        if (!token) return;
        setFetchingData(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            
            // Fetch Classes and Subjects in parallel
            const [classesRes, subjectsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/staff/teacher-classes`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'x-selected-role': selectedRole, 'x-selected-user-id': selectedUserId }
                }),
                fetch(`${baseUrl}/homework/meta/subjects`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'x-selected-role': selectedRole, 'x-selected-user-id': selectedUserId }
                })
            ]);

            const classesData = await classesRes.json();
            const subjectsData = await subjectsRes.json();

            if (classesData.success) setClasses(classesData.data);
            if (subjectsData.success) setSubjects(subjectsData.data);

        } catch (error) {
            console.error('Error fetching form data:', error);
            toast.error('Failed to load classes or subjects');
        } finally {
            setFetchingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.content || !formData.classId || !formData.subjectId) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            const payload = {
                ...formData,
                dueDate: new Date(formData.dueDate).toISOString()
            };

            const url = isEdit ? `${baseUrl}/homework/${initialData.id}` : `${baseUrl}/homework`;
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
                toast.success(`Homework ${isEdit ? 'updated' : 'created'} successfully!`);
                router.push('/dashboard/homework');
                router.refresh();
            } else {
                toast.error(result.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error('Failed to save homework');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-gradient-to-r from-indigo-600/10 to-transparent border-b border-slate-100 p-8">
                    <CardTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        {isEdit ? 'Edit Assignment' : 'Create New Assignment'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 1. Target Class */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 ml-1">Target Class</Label>
                            <Select 
                                value={formData.classId} 
                                onValueChange={(val) => setFormData({...formData, classId: val})}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-indigo-600/20 transition-all">
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.standard?.name} - {c.division?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 2. Subject */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 ml-1">Subject</Label>
                            <Select 
                                value={formData.subjectId} 
                                onValueChange={(val) => setFormData({...formData, subjectId: val})}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-indigo-600/20 transition-all">
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 3. Assignment Type */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 ml-1">Assignment Type</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={(val) => setFormData({...formData, type: val})}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-indigo-600/20 transition-all">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HOMEWORK">Homework</SelectItem>
                                    <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                    <SelectItem value="PROJECT">Project</SelectItem>
                                    <SelectItem value="CLASSWORK">Classwork</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 4. Due Date */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 ml-1">Due Date</Label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input 
                                    type="date" 
                                    min={new Date().toISOString().split('T')[0]}
                                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-indigo-600/20 transition-all"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. Title */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-600 ml-1">Assignment Title</Label>
                        <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input 
                                placeholder="e.g. Chapter 1: Introduction to Algebra"
                                className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-indigo-600/20 transition-all font-bold"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* 6. Details */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-600 ml-1">Instructions & Details</Label>
                        <textarea 
                            rows={8}
                            placeholder="Provide detailed instructions, questions, or requirements for the students..."
                            className="w-full p-6 rounded-[2rem] border-slate-200 bg-slate-50/50 focus:ring-indigo-600/20 transition-all resize-none outline-none focus:border-indigo-600/50 text-slate-700 font-medium"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button 
                            type="submit" 
                            className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95"
                            disabled={loading}
                        >
                            {loading ? <Spinner className="mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                            {isEdit ? 'Update Assignment' : 'Assign to Class'}
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
