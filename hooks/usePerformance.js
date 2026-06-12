import { useState, useEffect } from 'react';
import axiosClient from '@/lib/axiosClient';
import toast from 'react-hot-toast';

export function useStudentPerformance(studentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get(`/exam/analytics/student/${studentId}`);
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics');
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [studentId]);

  return { data, loading, error, refetch: fetchAnalytics };
}
