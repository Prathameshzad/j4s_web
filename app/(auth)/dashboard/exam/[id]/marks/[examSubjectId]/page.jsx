'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { PenLine, Save, ArrowLeft, Users, BookOpen, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { Button, Card, Spinner } from '@/component/ui/CustomUI';
import { PageHeader } from '@/component/ui/CustomUI';
import { useMarkEntry } from '@/hooks/useExam';
import MarkEntryRow from '@/component/exam/MarkEntryRow';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import BulkUploadModal from '@/component/BulkUploadModal';

export default function MarkEntryPage() {
  const { id: examId, examSubjectId } = useParams();
  const router = useRouter();
  const { data, loading, refetch, saveMarks } = useMarkEntry(examSubjectId);
  const [marks, setMarks] = useState({}); // { studentId: { marks, isAbsent, remarks } }
  const [saving, setSaving] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const { selectedRole } = useAuth();

  const examStatus = data?.examSubject?.examClass?.exam?.status || 'DRAFT';
  const isReadOnly = false;

  // Initialise marks state when data loads
  useEffect(() => {
    if (data?.students) {
      const init = {};
      data.students.forEach(s => {
        init[s.studentId] = {
          marks: s.existingMark?.marks ?? '',
          isAbsent: s.existingMark?.isAbsent ?? false,
          remarks: s.existingMark?.remarks ?? '',
        };
      });
      setMarks(init);
    }
  }, [data]);

  const handleSave = async () => {
    if (isReadOnly) {
      toast.error('You do not have permission to modify marks.');
      return;
    }

    // Validate
    const maxMarks = data?.examSubject?.maxMarks || 100;
    for (const [sid, v] of Object.entries(marks)) {
      if (!v.isAbsent && v.marks !== '' && parseFloat(v.marks) > maxMarks) {
        toast.error(`Marks cannot exceed ${maxMarks}`);
        return;
      }
    }
    try {
      setSaving(true);
      const records = Object.entries(marks).map(([studentId, v]) => ({
        studentId,
        marks: v.isAbsent ? null : (v.marks === '' ? null : parseFloat(v.marks)),
        isAbsent: v.isAbsent,
        remarks: v.remarks || null,
      }));
      await saveMarks(records);
      toast.success('Marks saved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch(`/api/web/exam/${examId}/marks/${examSubjectId}/template`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to download template');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = `Template_${data?.examSubject?.subject?.name || 'Marks'}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download template');
    }
  };

  const handleBulkUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/web/exam/${examId}/marks/${examSubjectId}/bulk-upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    refetch(); 
    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <AlertCircle size={36} className="text-slate-300" />
        <p className="text-slate-500 font-semibold">Subject not found or access denied.</p>
        <Button variant="ghost" onClick={() => router.back()}>← Go Back</Button>
      </div>
    );
  }

  const { examSubject, students } = data;
  const maxMarks = examSubject?.maxMarks || 100;
  const passMarks = examSubject?.passMarks || 35;

  const enteredCount = Object.values(marks).filter(v => v.isAbsent || (v.marks !== '' && v.marks !== null)).length;
  const absentCount = Object.values(marks).filter(v => v.isAbsent).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-2">
          <button
            onClick={() => router.push(`/dashboard/exam/${examId}`)}
            className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Exam
          </button>
          <h1 className="text-3xl font-semibold text-tertiary tracking-tight">Mark Entry</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <BookOpen size={14} className="text-primary" />
              {examSubject?.subject?.name}
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-semibold text-slate-500">
              Max: <span className="text-tertiary">{maxMarks}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Pass: <span className="text-tertiary">{passMarks}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-50 rounded-md border border-slate-100">
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Entered</p>
              <p className="text-lg font-bold text-primary">{enteredCount}/{students?.length || 0}</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Absent</p>
              <p className="text-lg font-bold text-rose-500">{absentCount}</p>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBulkUpload(true)}
                className="h-11 px-4 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10"
              >
                <UploadCloud size={15} className="mr-2" />
                Bulk Upload
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
                className="bg-primary text-white h-11 px-6"
              >
                <Save size={15} className="mr-2" />
                Save Marks
              </Button>
            </div>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <span>Read-Only Mode: You do not have permission to enter or edit marks for this examination.</span>
        </div>
      )}

      {/* Mark Entry Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide w-20">Roll No</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Student Name</th>
                <th className="text-center px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide w-24">Absent</th>
                <th className="px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide w-40">
                  Marks <span className="text-slate-400 font-normal normal-case">(/{maxMarks})</span>
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Remarks</th>
                <th className="text-center px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide w-16">Status</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student, idx) => (
                <tr 
                  key={student.studentId} 
                  className={`border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                >
                  <MarkEntryRow
                    student={student}
                    maxMarks={maxMarks}
                    value={marks[student.studentId] || { marks: '', isAbsent: false, remarks: '' }}
                    onChange={(v) => setMarks(prev => ({ ...prev, [student.studentId]: v }))}
                    disabled={isReadOnly}
                  />
                </tr>
              ))}
              {(!students || students.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Users size={32} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-semibold text-sm">No students found in this class.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {students?.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[11px] text-slate-400 font-medium">
              {students.length} students · {enteredCount} marked · {absentCount} absent
            </p>
            {!isReadOnly && (
              <Button onClick={handleSave} loading={saving} className="bg-primary text-white">
                <Save size={14} className="mr-2" />
                Save All Marks
              </Button>
            )}
          </div>
        )}
      </Card>

      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onDownloadTemplate={handleDownloadTemplate}
        onUpload={handleBulkUpload}
        title="Upload Marks for Subject"
        subtitle={`Upload marks for ${data?.examSubject?.subject?.name || ''}`}
      />
    </motion.div>
  );
}
