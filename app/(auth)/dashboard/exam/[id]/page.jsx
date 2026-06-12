'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  ClipboardList, Calendar, BookOpen, Users, ChevronRight,
  Send, SendHorizonal, RotateCcw, Trash2, ArrowLeft, CheckCircle2,
  Clock, AlertCircle, TrendingUp, PenLine, Layers, Pencil, X, Eye, UploadCloud
} from 'lucide-react';
import { Button, Badge, Card, Spinner } from '@/component/ui/CustomUI';
import { PageHeader } from '@/component/ui/CustomUI';
import { useExamDetail, useExamActions, useClassMonitor } from '@/hooks/useExam';
import ExamStatusBadge from '@/component/exam/ExamStatusBadge';
import ExamTypeTag from '@/component/exam/ExamTypeTag';
import DeletePopup from '@/component/popup/DeletePopup';
import BulkUploadModal from '@/component/BulkUploadModal';
import { useAuth } from '@/app/context/AuthContext';
import axiosClient from '@/lib/axiosClient';
import toast from 'react-hot-toast';

export default function ExamDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { selectedRole, selectedProfile } = useAuth();
  const userRole = selectedRole || 'STAFF';
  const isInstitute = userRole === 'INSTITUTE';

  const { exam, loading, refetch, staffId } = useExamDetail(id);
  const { publishExam, unpublishExam, generateResults, deleteExam, configureSubject } = useExamActions();

  const canPublish = isInstitute;
  const canGenerateResults = isInstitute;
  const canViewResults = isInstitute || (exam?.examClasses?.some(ec => ec.class?.classTeacherId === staffId) || false);
  const canEnterMarks = true;
  const canViewMarksOnly = false;

  const hasViewClassPermission = isInstitute || (exam?.examClasses?.some(ec => ec.class?.classTeacherId === staffId) || false);
  const managedClasses = selectedRole === 'INSTITUTE'
    ? (exam?.examClasses || [])
    : (exam?.examClasses?.filter(ec => ec.class?.classTeacherId === staffId) || []);

  const [publishing, setPublishing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadModalState, setUploadModalState] = useState({ isOpen: false, classId: null, className: '' });

  // Subject configure state
  const [editingSubject, setEditingSubject] = useState(null); // { id, name, className }
  const [editForm, setEditForm] = useState({ maxMarks: '', passMarks: '' });
  const [savingSubject, setSavingSubject] = useState(false);
  const [subjectError, setSubjectError] = useState('');

  const handleStartEditSubject = (es, className) => {
    setEditingSubject({
      id: es.id,
      name: es.subject?.name || 'Subject',
      className: className,
    });
    setEditForm({
      maxMarks: es.maxMarks.toString(),
      passMarks: es.passMarks.toString(),
    });
    setSubjectError('');
  };

  const handleSaveSubjectMarks = async () => {
    const max = parseFloat(editForm.maxMarks);
    const pass = parseFloat(editForm.passMarks);
    
    if (isNaN(max) || max <= 0) {
      setSubjectError('Max marks must be greater than 0');
      return;
    }
    if (isNaN(pass) || pass < 0) {
      setSubjectError('Pass marks cannot be negative');
      return;
    }
    if (pass > max) {
      setSubjectError('Pass marks cannot exceed max marks');
      return;
    }

    try {
      setSavingSubject(true);
      await configureSubject(id, editingSubject.id, { maxMarks: max, passMarks: pass });
      toast.success('Subject marks updated successfully');
      setEditingSubject(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update subject marks');
    } finally {
      setSavingSubject(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      if (exam?.status === 'PUBLISHED') {
        await unpublishExam(id);
        toast.success('Exam moved back to draft');
      } else {
        await publishExam(id);
        toast.success('Exam published successfully!');
      }
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setPublishing(false);
    }
  };

  const handleDownloadClassTemplate = async () => {
    try {
      const res = await fetch(`/api/web/exam/${id}/class/${uploadModalState.classId}/template`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to download template');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = `Template_Class_${uploadModalState.className}.csv`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download template');
    }
  };

  const handleBulkUploadClass = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/web/exam/${id}/class/${uploadModalState.classId}/bulk-upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    refetch();
    return result;
  };

  const handleGenerateResults = async () => {
    try {
      setGenerating(true);
      await generateResults(id);
      toast.success('Results generated successfully!');
      router.push(`/dashboard/exam/${id}/results`);
    } catch (err) {
      toast.error(err.message || 'Failed to generate results');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteExam(id);
      toast.success('Exam deleted');
      router.push('/dashboard/exam');
    } catch (err) {
      toast.error(err.message || 'Failed to delete exam');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle size={40} className="text-slate-300" />
        <p className="text-slate-500 font-semibold">Exam not found.</p>
        <Button variant="ghost" onClick={() => router.push('/dashboard/exam')}>← Back to Exams</Button>
      </div>
    );
  }

  const totalClasses = exam.examClasses?.length || 0;
  const totalSubjects = exam.examClasses?.reduce((s, ec) => s + (ec.examSubjects?.length || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard/exam')}
            className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Examinations
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-semibold text-tertiary tracking-tight">{exam.name}</h1>
            <ExamStatusBadge status={exam.status} className="mt-1" />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ExamTypeTag type={exam.examType} />
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(exam.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              {' — '}
              {new Date(exam.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">· {exam.academicYear?.name}</span>
          </div>
          {exam.description && (
            <p className="text-sm text-slate-500 font-medium max-w-lg">{exam.description}</p>
          )}
        </div>

        {(isInstitute || canPublish || canGenerateResults || canViewResults) && (
          <div className="flex items-center gap-2 flex-wrap">
            {exam.status === 'PUBLISHED' && canViewResults && (
              <Button
                onClick={() => router.push(`/dashboard/exam/${id}/results`)}
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-[11px]"
              >
                <TrendingUp size={15} className="mr-2" />
                View Results
              </Button>
            )}
            {canGenerateResults && (
              <Button
                onClick={handleGenerateResults}
                loading={generating}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-[11px]"
              >
                <RotateCcw size={15} className="mr-2" />
                Generate Results
              </Button>
            )}
            {canPublish && (
              <Button
                onClick={handlePublish}
                loading={publishing}
                className={exam.status === 'PUBLISHED'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px]'
                  : 'bg-primary text-white font-semibold text-[11px]'}
              >
                {exam.status === 'PUBLISHED' ? (
                  <><RotateCcw size={15} className="mr-2" />Unpublish</>
                ) : (
                  <><SendHorizonal size={15} className="mr-2" />Publish</>
                )}
              </Button>
            )}
            {isInstitute && (
              <button
                onClick={() => setShowDelete(true)}
                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all border border-slate-200 hover:border-rose-200"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Classes', value: totalClasses, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Subjects', value: totalSubjects, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Status', value: exam.status === 'PUBLISHED' ? 'Published' : 'Draft', icon: CheckCircle2, color: exam.status === 'PUBLISHED' ? 'text-emerald-600' : 'text-amber-600', bg: exam.status === 'PUBLISHED' ? 'bg-emerald-50' : 'bg-amber-50' },
          { label: 'Duration', value: `${Math.ceil((new Date(exam.endDate) - new Date(exam.startDate)) / (1000 * 60 * 60 * 24))} Days`, icon: Clock, color: 'text-primary', bg: 'bg-primary/5' },
        ].map((s, i) => (
          <Card key={i} className="p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-md ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-bold text-tertiary mt-0.5">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Class Teacher Dashboard */}
      {hasViewClassPermission && managedClasses.length > 0 && (
        <ClassMonitorSection examId={id} managedClasses={managedClasses} />
      )}

      {/* Classes / Subjects grid */}
      <div>
        <h2 className="text-lg font-bold text-tertiary mb-4">Classes & Subjects</h2>
        {exam.examClasses?.length === 0 ? (
          <Card className="p-10 text-center">
            <Users size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold text-sm">No classes assigned yet.</p>
            {isInstitute && (
              <p className="text-slate-400 text-[11px] mt-1">
                Delete and recreate the exam to assign classes, or contact support.
              </p>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {exam.examClasses.map((ec, idx) => {
              const className = `${ec.class?.standard?.name || ''} ${ec.class?.division?.name || ''}`.trim();
              const totalSubs = ec.examSubjects?.length || 0;

              return (
                <motion.div
                  key={ec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card hover className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-tertiary">{className}</h3>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {ec.class?.board?.name} · {ec.class?.medium?.name}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                        <Layers size={16} className="text-primary" />
                      </div>
                    </div>

                    {/* Subject list */}
                    <div className="space-y-2">
                      {ec.examSubjects?.map(es => {
                        return (
                          <div key={es.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                            <span className="text-[11px] font-semibold text-slate-600">{es.subject?.name}</span>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                <span className="text-[9px] text-slate-500 font-bold">
                                  Max: {es.maxMarks} · Pass: {es.passMarks}
                                </span>
                                {isInstitute && (
                                  <button
                                    onClick={() => handleStartEditSubject(es, className)}
                                    className="text-slate-400 hover:text-primary hover:bg-slate-200/50 p-0.5 rounded transition-all"
                                    title="Edit Subject Marks"
                                  >
                                    <Pencil size={10} />
                                  </button>
                                )}
                              </div>
                              
                              {canEnterMarks && (
                                <button
                                  onClick={() => router.push(`/dashboard/exam/${id}/marks/${es.id}`)}
                                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-dark transition-colors"
                                >
                                  <PenLine size={12} />
                                  {isInstitute ? 'Marks' : 'Enter Marks'}
                                </button>
                              )}
                              {canViewMarksOnly && (
                                <button
                                  onClick={() => router.push(`/dashboard/exam/${id}/marks/${es.id}`)}
                                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-dark transition-colors"
                                >
                                  <Eye size={12} />
                                  View Marks
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {(isInstitute || ec.isClassTeacher) && (
                      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {totalSubs} subjects
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] font-semibold h-8 rounded-md border-primary/20 text-primary bg-primary/5 hover:bg-primary/10"
                            onClick={() => setUploadModalState({ isOpen: true, classId: ec.classId, className })}
                          >
                            <UploadCloud size={12} className="mr-1.5" />
                            Bulk Upload
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] font-semibold h-8 rounded-md border-slate-200"
                            onClick={() => router.push(`/dashboard/exam/${id}/results/${ec.classId}`)}
                          >
                            <TrendingUp size={12} className="mr-1.5" />
                            Results
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Subject Marks Modal */}
      <AnimatePresence>
        {editingSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingSubject(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 z-10 space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Configure Marks</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {editingSubject.name} · {editingSubject.className}
                  </p>
                </div>
                <button
                  onClick={() => setEditingSubject(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {subjectError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  {subjectError}
                </div>
              )}

              {exam?.status === 'PUBLISHED' && (
                <div className="p-3 bg-amber-55/60 border border-amber-100 text-amber-700 rounded-xl text-xs font-medium flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-500" />
                  <span>
                    <strong>Warning:</strong> This exam is published. Changing mark criteria may invalidate existing results.
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Maximum Marks</label>
                  <input
                    type="number"
                    value={editForm.maxMarks}
                    onChange={(e) => setEditForm(prev => ({ ...prev, maxMarks: e.target.value }))}
                    placeholder="e.g. 100"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Passing Marks</label>
                  <input
                    type="number"
                    value={editForm.passMarks}
                    onChange={(e) => setEditForm(prev => ({ ...prev, passMarks: e.target.value }))}
                    placeholder="e.g. 35"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-widest"
                  onClick={() => setEditingSubject(null)}
                  disabled={savingSubject}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-widest bg-primary text-white"
                  onClick={handleSaveSubjectMarks}
                  loading={savingSubject}
                >
                  Save Configuration
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeletePopup
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Examination?"
        message={`This will permanently delete "${exam.name}" along with all marks and results.`}
      />

      <BulkUploadModal
        isOpen={uploadModalState.isOpen}
        onClose={() => setUploadModalState({ isOpen: false, classId: null, className: '' })}
        onDownloadTemplate={handleDownloadClassTemplate}
        onUpload={handleBulkUploadClass}
        title="Class Bulk Upload"
        subtitle={`Upload all subject marks for ${uploadModalState.className}`}
      />
    </motion.div>
  );
}

// ─── Class Teacher Monitor Component ──────────────────────────────────────────

function ClassMonitorSection({ examId, managedClasses }) {
  const [selectedClassId, setSelectedClassId] = useState(managedClasses[0]?.classId);
  const activeClass = managedClasses.find(c => c.classId === selectedClassId);
  const className = activeClass ? `${activeClass.class?.standard?.name || ''} ${activeClass.class?.division?.name || ''}`.trim() : '';

  const { data: monitorData, loading } = useClassMonitor(examId, selectedClassId);

  return (
    <Card className="p-6 rounded-[1.5rem] border-slate-100 shadow-sm space-y-6 bg-slate-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users size={20} className="text-primary" /> Class Teacher Dashboard
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Monitor progress and view results for your assigned classes.
          </p>
        </div>
        {managedClasses.length > 1 && (
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-bold outline-none bg-white focus:border-primary"
          >
            {managedClasses.map(c => {
              const name = `${c.class?.standard?.name || ''} ${c.class?.division?.name || ''}`.trim();
              return <option key={c.classId} value={c.classId}>{name}</option>;
            })}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : monitorData ? (
        <div className="space-y-8">
          {/* Progress Bar & Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 md:col-span-2 bg-white flex flex-col justify-between gap-4 rounded-2xl border-slate-100">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Marks Submission Progress</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black tracking-tight text-slate-800">{monitorData.completionPercentage}%</span>
                  <span className="text-xs text-slate-450 font-semibold">Completed</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${monitorData.completionPercentage}%` }} 
                />
              </div>
            </Card>
            <Card className="p-5 bg-white flex flex-col justify-center items-center text-center rounded-2xl border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</span>
              <span className="text-4xl font-black text-primary mt-2">{monitorData.totalStudents}</span>
              <span className="text-xs text-slate-450 font-semibold mt-1">Enrolled in {className}</span>
            </Card>
          </div>

          {/* Subject Submission Status */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Subject Submissions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {monitorData.subjects?.map((sub) => (
                <Card key={sub.examSubjectId} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{sub.subjectName}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Teacher: {sub.teacherName}</p>
                    </div>
                    <Badge variant={sub.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[9px] px-2 py-0.5">
                      {sub.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>{sub.markedCount} / {sub.totalStudents} Students</span>
                    <span>{sub.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-2 mt-1.5 overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full transition-all duration-300 ${sub.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${sub.completionPercentage}%` }} 
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Generated Results */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Generated Student Results</h3>
            {monitorData.results?.length === 0 ? (
              <Card className="p-8 text-center bg-white rounded-2xl border-slate-100">
                <AlertCircle size={28} className="text-slate-350 mx-auto mb-2" />
                <p className="text-slate-500 font-semibold text-sm">Results are not generated yet.</p>
                <p className="text-[10px] text-slate-450 mt-1">
                  Once all teachers submit marks, results can be generated by the institute administrator.
                </p>
              </Card>
            ) : (
              <Card className="overflow-hidden bg-white border border-slate-100 rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-5 py-3.5">Roll No</th>
                        <th className="px-5 py-3.5">Name</th>
                        <th className="px-5 py-3.5">Total Marks</th>
                        <th className="px-5 py-3.5">Percentage</th>
                        <th className="px-5 py-3.5">Grade</th>
                        <th className="px-5 py-3.5">Rank</th>
                        <th className="px-5 py-3.5 text-right">Report Card</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                      {monitorData.results.map((res) => {
                        const name = [res.student?.firstName, res.student?.middleName, res.student?.lastName]
                          .filter(Boolean)
                          .join(' ') || res.student?.user?.name || 'Unknown';
                        
                        return (
                          <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3.5 text-slate-400">#{res.student?.rollNumber || '---'}</td>
                            <td className="px-5 py-3.5 text-slate-900 font-bold">{name}</td>
                            <td className="px-5 py-3.5">{res.totalMarks} / {res.maxTotalMarks}</td>
                            <td className="px-5 py-3.5">
                              <span className={res.isPassed ? 'text-green-600 font-bold' : 'text-rose-600 font-bold'}>
                                {res.percentage.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <Badge variant={res.isPassed ? 'success' : 'destructive'} className="text-[9px] font-bold">
                                {res.grade.replace('_', '+')}
                              </Badge>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="bg-slate-105 text-slate-700 px-2 py-0.5 rounded font-black text-[10px]">
                                Rank {res.rank || 'N/A'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg px-3 py-1 h-8"
                                onClick={async () => {
                                  try {
                                    const axiosRes = await axiosClient.get(`/exam/results/${res.id}/report-card`, { responseType: 'blob' });
                                    const url = window.URL.createObjectURL(new Blob([axiosRes.data], { type: 'application/pdf' }));
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `report-card-${name}.pdf`;
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                  } catch (err) {
                                    toast.error('Failed to download report card');
                                  }
                                }}
                              >
                                Download PDF
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 font-medium text-sm">Failed to load monitoring data.</div>
      )}
    </Card>
  );
}
