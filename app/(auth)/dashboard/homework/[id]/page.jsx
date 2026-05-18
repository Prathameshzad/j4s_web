'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
    Button, 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    Badge,
    Spinner,
    Input,
    Label,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/component/ui/CustomUI';
import { 
    ChevronLeft, 
    Calendar, 
    Users, 
    BookOpen, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    Download,
    FileText,
    GraduationCap,
    Send,
    Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getMediaUrl } from '@/utils/media';

export default function HomeworkDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { token, selectedRole, selectedUserId } = useAuth();
    
    const [homework, setHomework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ feedback: '', grade: '', status: 'GRADED' });
    const [submittingGrade, setSubmittingGrade] = useState(false);

    useEffect(() => {
        if (id && token) {
            fetchHomeworkDetails();
        }
    }, [id, token]);

    const fetchHomeworkDetails = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            const response = await fetch(`${baseUrl}/homework/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId
                }
            });
            const result = await response.json();
            if (result.success) {
                setHomework(result.data);
            }
        } catch (error) {
            console.error('Error fetching homework details:', error);
            toast.error('Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        if (!gradingSubmission) return;

        setSubmittingGrade(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
            const response = await fetch(`${baseUrl}/homework/submission/${gradingSubmission.id}/grade`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-selected-role': selectedRole,
                    'x-selected-user-id': selectedUserId
                },
                body: JSON.stringify(gradeData)
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Submission graded successfully!');
                setGradingSubmission(null);
                fetchHomeworkDetails();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to submit grade');
        } finally {
            setSubmittingGrade(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Spinner size="lg" />
            <p className="text-slate-500 font-medium animate-pulse">Loading submission portal...</p>
        </div>
    );

    if (!homework) return <div className="text-center p-20">Homework not found</div>;

    const isStaff = selectedRole === 'STAFF' || selectedRole === 'TEACHER';
    const isParent = selectedRole === 'PARENT';
    const isStudent = selectedRole === 'STUDENT';

    const submissions = homework.submissions || [];
    const gradedCount = submissions.filter(s => s.status === 'GRADED').length;
    const pendingCount = submissions.filter(s => s.status === 'SUBMITTED').length;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-12 h-12 rounded-2xl hover:bg-slate-100"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-primary/10 text-primary border-none px-3 py-1 text-[10px] uppercase font-black tracking-widest">
                                {homework.type}
                            </Badge>
                            <span className="text-slate-400 font-bold text-xs">•</span>
                            <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                                {homework.class?.standard?.name} - {homework.class?.division?.name}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">
                            {homework.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Due Date</span>
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-rose-500" />
                            {new Date(homework.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details Column */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-primary text-white overflow-hidden">
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-4">
                                <p className="text-white/80 font-medium text-lg leading-relaxed">
                                    {homework.content}
                                </p>
                            </div>

                            {homework.attachments && homework.attachments.length > 0 && (
                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-white/70">Attachments</h3>
                                    <div className="space-y-2">
                                        {homework.attachments.map(file => (
                                            <a 
                                                key={file.id} 
                                                href={getMediaUrl(file.url)} 
                                                target="_blank" 
                                                className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-white/70" />
                                                    <span className="text-sm font-bold truncate max-w-[150px]">{file.originalName}</span>
                                                </div>
                                                <Download className="w-4 h-4" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {isStaff && (
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-none shadow-sm rounded-3xl bg-emerald-50 text-emerald-700">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <CheckCircle className="w-8 h-8 mb-2" />
                                    <span className="text-3xl font-black">{gradedCount}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">Graded</span>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm rounded-3xl bg-amber-50 text-amber-700">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <AlertCircle className="w-8 h-8 mb-2" />
                                    <span className="text-3xl font-black">{pendingCount}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">Pending</span>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Submissions Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <Users className="w-6 h-6 text-primary" />
                            {isStaff ? 'Student Submissions' : (isParent ? "Child's Submission" : 'Your Submission')}
                        </h2>
                        {isStaff && (
                            <Badge variant="outline" className="rounded-full px-4 py-1.5 font-bold text-slate-500 border-slate-200 bg-white">
                                Total: {submissions.length}
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-4">
                        {submissions.length === 0 ? (
                            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2rem]">
                                <CardContent className="flex flex-col items-center justify-center py-20">
                                    <p className="text-slate-400 font-bold">No submissions yet from this class.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            submissions.map((sub) => (
                                <Card key={sub.id} className="group border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] bg-white border border-slate-100 overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-primary font-black text-xl shadow-inner">
                                                    {sub.student?.name?.[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-800">{sub.student?.name}</h3>
                                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                                        <span>Roll: {sub.student?.student?.rollNumber || 'N/A'}</span>
                                                        <span>•</span>
                                                        <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Badge className={`
                                                    ${sub.status === 'GRADED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
                                                    border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest
                                                `}>
                                                    {sub.status}
                                                </Badge>
                                                
                                                {sub.grade && (
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                                                        {sub.grade}
                                                    </div>
                                                )}

                                                {isStaff && (
                                                    <Button 
                                                        className="rounded-2xl bg-slate-800 text-white hover:bg-slate-900 font-black px-6 shadow-lg shadow-black/5"
                                                        onClick={() => {
                                                            setGradingSubmission(sub);
                                                            setGradeData({
                                                                feedback: sub.feedback || '',
                                                                grade: sub.grade || '',
                                                                status: sub.status || 'GRADED'
                                                            });
                                                        }}
                                                    >
                                                        {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Now'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {sub.content && (
                                            <div className="mt-6 p-6 bg-slate-50 rounded-[1.5rem] text-slate-600 font-medium line-clamp-3">
                                                {sub.content}
                                            </div>
                                        )}

                                        {sub.attachments && sub.attachments.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {sub.attachments.map(file => (
                                                    <a key={file.id} href={getMediaUrl(file.url)} target="_blank" className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors">
                                                        <FileText className="w-3 h-3" />
                                                        {file.originalName}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Grading Dialog */}
            <Dialog open={!!gradingSubmission} onOpenChange={() => setGradingSubmission(null)}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
                        <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <GraduationCap className="w-6 h-6 text-primary" />
                            Grade Submission: {gradingSubmission?.student?.name}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleGradeSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-600">Grade / Score</Label>
                                <Input 
                                    placeholder="e.g. A, 9.5, 95%"
                                    className="h-14 rounded-2xl font-black text-lg border-slate-200 bg-slate-50 focus:ring-primary/20"
                                    value={gradeData.grade}
                                    onChange={(e) => setGradeData({...gradeData, grade: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-600">Status</Label>
                                <Select 
                                    value={gradeData.status}
                                    onValueChange={(val) => setGradeData({...gradeData, status: val})}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GRADED">Graded</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Feedback to Student</Label>
                            <textarea 
                                rows={5}
                                placeholder="Write some constructive feedback..."
                                className="w-full p-6 rounded-[2rem] border-slate-200 bg-slate-50 focus:ring-primary/20 transition-all outline-none text-slate-700 font-medium resize-none"
                                value={gradeData.feedback}
                                onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                            />
                        </div>

                        <DialogFooter className="pt-4 gap-3">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="h-14 px-8 rounded-2xl font-bold"
                                onClick={() => setGradingSubmission(null)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="h-14 px-10 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                                disabled={submittingGrade}
                            >
                                {submittingGrade ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
                                Submit Assessment
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
