'use client';
import { useState, useEffect, useCallback } from 'react';
import axiosClient from '@/lib/axiosClient';
import toast from 'react-hot-toast';

// ─── Academic Years ────────────────────────────────────────────────────────────

export function useAcademicYears() {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/exam/academic-years');
      if (res.data.success) setAcademicYears(res.data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data) => {
    const res = await axiosClient.post('/exam/academic-years', data);
    if (res.data.success) { await fetch(); return res.data.data; }
    throw new Error(res.data.message);
  };

  const update = async (id, data) => {
    const res = await axiosClient.patch(`/exam/academic-years/${id}`, data);
    if (res.data.success) { await fetch(); return res.data.data; }
    throw new Error(res.data.message);
  };

  return { academicYears, loading, refetch: fetch, create, update };
}

// ─── Exam List ─────────────────────────────────────────────────────────────────

export function useExams(filters = {}) {
  const [exams, setExams] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 20, ...filters };
      // strip empty
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await axiosClient.get('/exam', { params });
      if (res.data.success) {
        setExams(res.data.exams || []);
        setTotal(res.data.total || 0);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { exams, total, loading, refetch: fetch };
}

// ─── Teacher Context (staff only) ─────────────────────────────────────────────

export function useTeacherExamContext() {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/exam/my-context')
      .then(r => { if (r.data.success) setContext(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { context, loading };
}

// ─── Single Exam Detail ────────────────────────────────────────────────────────

export function useExamDetail(id) {
  const [exam, setExam] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await axiosClient.get(`/exam/${id}`);
      if (res.data.success) {
        setExam(res.data.data);
        setStaffId(res.data.staffId || null);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { exam, loading, refetch: fetch, staffId };
}

// ─── Exam Actions ──────────────────────────────────────────────────────────────

export function useExamActions() {
  const createExam = async (data) => {
    const res = await axiosClient.post('/exam', data);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  const updateExam = async (id, data) => {
    const res = await axiosClient.put(`/exam/${id}`, data);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  const deleteExam = async (id) => {
    const res = await axiosClient.delete(`/exam/${id}`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data;
  };

  const assignClasses = async (id, classIds) => {
    const res = await axiosClient.post(`/exam/${id}/assign-classes`, { classIds });
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  const bulkConfigureSubjects = async (id, subjects) => {
    const res = await axiosClient.post(`/exam/${id}/subjects/bulk-configure`, { subjects });
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  const configureSubject = async (examId, examSubjectId, data) => {
    const res = await axiosClient.put(`/exam/${examId}/subjects/${examSubjectId}`, data);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  const publishExam = async (id) => {
    const res = await axiosClient.put(`/exam/${id}/publish`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  const unpublishExam = async (id) => {
    const res = await axiosClient.put(`/exam/${id}/unpublish`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  const generateResults = async (id) => {
    const res = await axiosClient.post(`/exam/${id}/generate-results`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  return {
    createExam, updateExam, deleteExam,
    assignClasses, bulkConfigureSubjects, configureSubject,
    publishExam, unpublishExam, generateResults,
  };
}

// ─── Mark Entry ────────────────────────────────────────────────────────────────

export function useMarkEntry(examSubjectId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!examSubjectId) return;
    try {
      setLoading(true);
      const res = await axiosClient.get(`/exam/subjects/${examSubjectId}/students`);
      if (res.data.success) setData(res.data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [examSubjectId]);

  useEffect(() => { fetch(); }, [fetch]);

  const saveMarks = async (records) => {
    const res = await axiosClient.post('/exam/marks', { examSubjectId, records });
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  };

  return { data, loading, refetch: fetch, saveMarks };
}

// ─── Results ───────────────────────────────────────────────────────────────────

export function useClassResults(examId, classId) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!examId || !classId) return;
    try {
      setLoading(true);
      const res = await axiosClient.get(`/exam/${examId}/results/${classId}`);
      if (res.data.success) setResults(res.data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [examId, classId]);

  useEffect(() => { fetch(); }, [fetch]);

  const downloadReportCard = async (resultId, studentName) => {
    try {
      const res = await axiosClient.get(`/exam/results/${resultId}/report-card`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-card-${studentName || resultId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download report card');
    }
  };

  return { results, loading, refetch: fetch, downloadReportCard };
}

// ─── Class Teacher Monitor Hook ────────────────────────────────────────────────

export function useClassMonitor(examId, classId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!examId || !classId) return;
    try {
      setLoading(true);
      const res = await axiosClient.get(`/exam/${examId}/class-monitor/${classId}`);
      if (res.data.success) setData(res.data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [examId, classId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
}
