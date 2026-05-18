'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Save, X, Calendar, BookOpen, Clock, FileText, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HomeworkForm({ initialData, isEdit = false }) {
    const router = useRouter();
    const { token, selectedRole, selectedUserId } = useAuth();
    const fileInputRef = useRef(null);
    
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    const [pairings, setPairings] = useState([]);
    const [selectedPairing, setSelectedPairing] = useState('');
    const [attachments, setAttachments] = useState(initialData?.attachments || []);
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const [formData, setFormData] = useState({
        classId: initialData?.classId || '',
        subjectId: initialData?.subjectId || '',
        title: initialData?.title || '',
        content: initialData?.content || '',
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchPairings();
    }, [token, selectedRole, selectedUserId]);

    const fetchPairings = async () => {
        if (!token) return;
        setFetchingData(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            
            const res = await fetch(`${baseUrl}/homework/meta/pairings`, {
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'x-selected-role': selectedRole, 
                    'x-selected-user-id': selectedUserId 
                }
            });

            const result = await res.json();
            if (result.success) {
                setPairings(result.data);
                
                // If editing, auto-select current pairing
                if (initialData?.classId && initialData?.subjectId) {
                    const match = result.data.find(
                        p => p.classId === initialData.classId && p.subjectId === initialData.subjectId
                    );
                    if (match) {
                        setSelectedPairing(`${match.classId}_${match.subjectId}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching teacher pairings:', error);
            toast.error('Failed to load classes or subjects');
        } finally {
            setFetchingData(false);
        }
    };

    const handlePairingChange = (val) => {
        setSelectedPairing(val);
        const [classId, subjectId] = val.split('_');
        setFormData(prev => ({ ...prev, classId, subjectId }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setSelectedFiles(prev => [...prev, ...files]);
        if (e.target) e.target.value = '';
    };

    const handleRemoveAttachment = (id) => {
        setAttachments(attachments.filter(a => a.id !== id));
        toast.success('Existing file removed');
    };

    const handleRemoveSelectedFile = (idx) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
        toast.success('File removed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.content || !formData.classId || !formData.subjectId) {
            toast.error('Please select a target class/subject and fill all required fields');
            return;
        }

        if (formData.title.trim().length < 3) {
            toast.error('Homework title must be at least 3 characters long');
            return;
        }

        if (formData.content.trim().length < 10) {
            toast.error('Instructions & details must be at least 10 characters long');
            return;
        }

        setLoading(true);
        try {
            let newlyUploadedIds = [];
            
            // Upload selected files if any
            if (selectedFiles.length > 0) {
                setUploading(true);
                const uploadData = new FormData();
                selectedFiles.forEach(file => {
                    uploadData.append('files', file);
                });

                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
                const uploadUrl = apiBase.replace('/api/web', '/api/app') + '/media/upload';
                const uploadRes = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: uploadData
                });

                const uploadResult = await uploadRes.json();
                setUploading(false);

                if (uploadResult.success) {
                    newlyUploadedIds = uploadResult.data.map(m => m.id);
                } else {
                    throw new Error(uploadResult.message || 'File upload failed');
                }
            }

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            const payload = {
                title: formData.title,
                content: formData.content,
                classId: formData.classId,
                subjectId: formData.subjectId,
                type: 'HOMEWORK',
                dueDate: new Date(formData.dueDate).toISOString(),
                attachments: [...attachments.map(a => a.id), ...newlyUploadedIds]
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
                try {
                    const parsedError = JSON.parse(result.message);
                    if (Array.isArray(parsedError) && parsedError[0]?.message) {
                        toast.error(parsedError[0].message);
                    } else {
                        toast.error(result.message || 'Something went wrong');
                    }
                } catch {
                    toast.error(result.message || 'Something went wrong');
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.message || 'Failed to save homework');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (fetchingData) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-slate-100 dark:border-slate-800 p-8">
                    <CardTitle className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        {isEdit ? 'Edit Homework Assignment' : 'Create New Homework Assignment'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 1. Target Class & Subject */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Class & Subject Pair</Label>
                            <Select 
                                value={selectedPairing} 
                                onValueChange={handlePairingChange}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-primary/20 transition-all text-slate-800 dark:text-white font-medium">
                                    <SelectValue placeholder="Select class & subject you teach" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pairings.map(p => (
                                        <SelectItem key={`${p.classId}_${p.subjectId}`} value={`${p.classId}_${p.subjectId}`}>
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 2. Due Date */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Due Date</Label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input 
                                    type="date" 
                                    min={new Date().toISOString().split('T')[0]}
                                    className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-primary/20 transition-all font-semibold"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Title */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Homework Title</Label>
                        <Input 
                            placeholder="e.g. Chapter 1: Algebraic Expressions Practice"
                            className="h-14 px-6 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-primary/20 transition-all font-bold text-slate-800 dark:text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* 4. Instructions */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Instructions & Details</Label>
                        <textarea 
                            rows={8}
                            placeholder="Provide detailed instructions, questions, or specific reading assignments..."
                            className="w-full p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-primary/20 transition-all resize-none outline-none focus:border-primary/50 text-slate-700 dark:text-slate-300 font-medium"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                    </div>

                    {/* 5. File Uploadation System */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Attach Materials & Files (Optional)</Label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-[2rem] p-8 text-center cursor-pointer bg-slate-50/30 dark:bg-slate-900/30 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all group"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                multiple 
                                onChange={handleFileChange} 
                            />
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                                    {uploading ? (
                                        <Spinner className="text-primary w-6 h-6" />
                                    ) : (
                                        <Upload className="text-primary w-6 h-6" />
                                    )}
                                </div>
                                <span className="font-black text-slate-700 dark:text-slate-300 mt-2">
                                    {uploading ? 'Uploading your files...' : 'Drag & drop or click to upload'}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    Support PDF, DOCX, PNG, JPG (Max 50MB)
                                </span>
                            </div>
                        </div>

                        {/* List of Attachments */}
                        {(attachments.length > 0 || selectedFiles.length > 0) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {/* Server attachments */}
                                {attachments.map(att => (
                                    <div 
                                        key={att.id} 
                                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                                                <FileText size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                                    {att.originalName}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    {(att.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleRemoveAttachment(att.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl flex-shrink-0"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}

                                {/* Locally selected files */}
                                {selectedFiles.map((file, idx) => (
                                    <div 
                                        key={`local-${idx}`} 
                                        className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 dark:bg-primary/5 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 bg-primary/20 rounded-xl text-primary flex-shrink-0">
                                                <Upload size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB (Queued)
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleRemoveSelectedFile(idx)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl flex-shrink-0"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button 
                            type="submit" 
                            className="flex-1 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
                            disabled={loading || uploading}
                        >
                            {loading ? <Spinner className="mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                            {isEdit ? 'Update Assignment' : 'Assign to Class'}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="h-16 px-8 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
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
