'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Badge, Spinner } from '@/component/ui/CustomUI';
import { 
  TrendingUp, Award, Clock, BookOpen, AlertCircle, 
  CheckCircle2, Target, BarChart2, Star 
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useStudentPerformance } from '@/hooks/usePerformance';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

export default function PerformanceDashboard() {
  const { selectedRole, selectedProfile, selectedChild } = useAuth();
  
  const studentId = useMemo(() => {
    if (selectedRole === 'PARENT') return selectedChild?.id || selectedChild?.profileId || selectedChild?.userId;
    if (selectedRole === 'STUDENT') return selectedProfile?.profileId || selectedProfile?.id || selectedProfile?.details?.id || selectedProfile?.userId;
    return null;
  }, [selectedRole, selectedProfile, selectedChild]);

  // Debugging extraction issues
  console.log('Performance Hook - Extracted ID:', studentId, 'Role:', selectedRole);

  const { data, loading, error } = useStudentPerformance(studentId);

  if (!['STUDENT', 'PARENT'].includes(selectedRole)) {
    return (
      <div className="p-6">
        <PageHeader title="Performance Analytics" subtitle="Not accessible for this role." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center h-[60vh]">
        <AlertCircle size={48} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-slate-700">Failed to load analytics</h2>
        <p className="text-slate-500 mt-2">{error || 'No performance data available.'}</p>
      </div>
    );
  }

  const {
    studentName, className, latestResult, trendData, 
    growthScore, attendancePercentage, homeworkPercentage,
    strongSubjects, weakSubjects, insights
  } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-6 space-y-6"
    >
      <PageHeader 
        title={`${selectedRole === 'PARENT' ? studentName + "'s " : ''}Exam Dashboard`}
        subtitle={`Academic Analytics & Exam Results • ${className}`}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between border-slate-200/60 bg-gradient-to-br from-white to-slate-50">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Growth Score</span>
            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
              <Target size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">{growthScore}</span>
            <span className="text-sm text-slate-400 font-medium"> / 100</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between border-slate-200/60 bg-gradient-to-br from-white to-slate-50">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Latest Exam</span>
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">
              {latestResult ? Math.round(latestResult.percentage) : '--'}%
            </span>
            {latestResult && (
              <p className="text-xs text-slate-400 mt-1 truncate">{latestResult.exam?.name}</p>
            )}
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between border-slate-200/60 bg-gradient-to-br from-white to-slate-50">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Class Rank</span>
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
              <Award size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">{latestResult?.rank || '--'}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between border-slate-200/60 bg-gradient-to-br from-white to-slate-50">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Attendance</span>
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">{attendancePercentage}%</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Graph */}
        <Card className="p-5 lg:col-span-2 border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 size={18} className="text-primary" />
                Performance Trajectory
              </h3>
              <p className="text-xs text-slate-500 mt-1">Percentage across chronological exams</p>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            {trendData && trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="examName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748B' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748B' }} 
                    domain={[0, 100]}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`${Math.round(value)}%`, 'Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#0EA5E9" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, fill: '#0EA5E9', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Not enough exam data to show trends.
              </div>
            )}
          </div>
        </Card>

        {/* AI Insights & Strengths */}
        <div className="space-y-6">
          <Card className="p-5 border-slate-200/60 bg-gradient-to-b from-blue-50/50 to-transparent shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Star size={18} className="text-amber-400" />
              Automated Insights
            </h3>
            {insights && insights.length > 0 ? (
              <ul className="space-y-3">
                {insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                    <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <span className="leading-tight">{insight}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">More data required to generate insights.</p>
            )}
          </Card>

          <Card className="p-5 border-slate-200/60 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-emerald-500" />
              Subject Overview
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Strengths</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {strongSubjects?.length > 0 ? strongSubjects.map(s => (
                    <Badge key={s} variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 text-[11px]">{s}</Badge>
                  )) : <span className="text-xs text-slate-400">None identified yet</span>}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded-md">Focus Needed</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {weakSubjects?.length > 0 ? weakSubjects.map(s => (
                    <Badge key={s} variant="outline" className="border-rose-200 text-rose-700 bg-rose-50 text-[11px]">{s}</Badge>
                  )) : <span className="text-xs text-slate-400">All subjects performing well</span>}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Exam Results */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BookOpen className="text-primary" size={24} />
          Detailed Exam Results
        </h2>
        
        {data.allResults && data.allResults.length > 0 ? (
          <div className="space-y-6">
            {data.allResults.map((result) => (
              <Card key={result.id} className="overflow-hidden border-slate-200/60 shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{result.exam.name}</h3>
                    <p className="text-sm text-slate-500">
                      Date: {new Date(result.exam.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-500">Percentage</p>
                      <p className="text-xl font-bold text-slate-800">{Math.round(result.percentage)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-500">Grade</p>
                      <Badge variant={result.isPassed ? "success" : "danger"} className="mt-1 text-sm font-bold px-3 py-1">
                        {result.grade || (result.isPassed ? 'PASS' : 'FAIL')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-bold">Subject</th>
                        <th className="px-6 py-4 font-bold text-center">Marks Obtained</th>
                        <th className="px-6 py-4 font-bold text-center">Max Marks</th>
                        <th className="px-6 py-4 font-bold text-center">Passing Marks</th>
                        <th className="px-6 py-4 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.subjectResults.map((sr) => (
                        <tr key={sr.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">{sr.subject.name}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-700">
                            {sr.isAbsent ? <span className="text-rose-500">ABSENT</span> : sr.marksObtained}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-500">{sr.maxMarks}</td>
                          <td className="px-6 py-4 text-center text-slate-500">{sr.passMarks}</td>
                          <td className="px-6 py-4 text-right">
                            <Badge variant={sr.isPassed ? "success" : "danger"} className="text-[10px]">
                              {sr.isPassed ? "PASS" : "FAIL"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-800 uppercase text-xs">Total</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800 text-base">{result.totalMarks}</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800">{result.maxTotalMarks}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-10 flex flex-col items-center justify-center text-center border-slate-200/60 shadow-sm border-dashed">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Exam Results Published</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
              Your detailed exam marks will appear here once the institute publishes the exam results.
            </p>
          </Card>
        )}
      </div>

    </motion.div>
  );
}
