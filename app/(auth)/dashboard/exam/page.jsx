'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ClipboardList, Plus, BookOpen, CheckCircle2, FileEdit,
  CalendarRange, Trash2, Eye, Settings, GraduationCap
} from 'lucide-react';
import { Button, Badge, StatsCard, Spinner } from '@/component/ui/CustomUI';
import { PageHeader } from '@/component/ui/CustomUI';
import Table from '@/component/ui/Table/Table';
import TableControls from '@/component/ui/Table/TableControls';
import { useAuth } from '@/app/context/AuthContext';
import { useExams, useAcademicYears, useExamActions } from '@/hooks/useExam';
import ExamStatusBadge from '@/component/exam/ExamStatusBadge';
import ExamTypeTag from '@/component/exam/ExamTypeTag';
import DeletePopup from '@/component/popup/DeletePopup';
import toast from 'react-hot-toast';

export default function ExamListPage() {
  const router = useRouter();
  const { selectedRole } = useAuth();
  const userRole = selectedRole || 'STAFF';
  const isInstitute = userRole === 'INSTITUTE';

  const [filters, setFilters] = useState({ status: '', academicYearId: '', page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { exams, total, loading, refetch } = useExams(filters);
  const { academicYears } = useAcademicYears();
  const { deleteExam } = useExamActions();

  // Stats derived from list
  const published = exams.filter(e => e.status === 'PUBLISHED').length;
  const draft = exams.filter(e => e.status === 'DRAFT').length;
  const upcoming = exams.filter(e => new Date(e.startDate) > new Date()).length;

  const filteredExams = searchTerm
    ? exams.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : exams;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteExam(deleteTarget.id);
      toast.success('Exam deleted');
      refetch();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete exam');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Examination',
      accessor: 'name',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => router.push(`/dashboard/exam/${row.id}`)}
            className="text-sm font-bold text-slate-800 hover:text-primary transition-colors text-left"
          >
            {row.name}
          </button>
          <div className="flex items-center gap-2">
            <ExamTypeTag type={row.examType} />
            <span className="text-[10px] text-slate-450 font-medium">{row.academicYear?.name}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Period',
      accessor: 'startDate',
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-slate-700">
            {new Date(row.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <span className="text-[10px] text-slate-400">→ {new Date(row.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
        </div>
      )
    },
    {
      header: 'Classes',
      accessor: 'examClasses',
      render: (row) => (
        <div className="flex items-center gap-2">
          <GraduationCap size={14} className="text-primary" />
          <span className="text-[11px] font-semibold text-slate-700">
            {row.examClasses?.length || 0} {row.examClasses?.length === 1 ? 'Class' : 'Classes'}
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <ExamStatusBadge status={row.status} />
    }
  ];

  const renderRowActions = (row) => (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="font-semibold text-[11px] h-9 rounded-md border-slate-200 hover:border-primary/40"
        onClick={() => router.push(`/dashboard/exam/${row.id}`)}
      >
        <Eye size={14} className="mr-1.5" />
        View
      </Button>
      {isInstitute && (
        <button
          onClick={() => setDeleteTarget(row)}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden"
    >
      <PageHeader
        title="Examinations"
        subtitle="Plan, manage, and publish examination schedules across all classes."
        icon={ClipboardList}
        actions={[
          isInstitute && (
            <Button
              key="create"
              onClick={() => router.push('/dashboard/exam/create')}
              className="bg-primary text-white"
            >
              <Plus size={16} className="mr-2" />
              New Exam
            </Button>
          ),
        ].filter(Boolean)}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={ClipboardList}
          title="Total Exams"
          value={total.toString().padStart(2, '0')}
          status="All Time"
          statusVariant="primary"
          iconColor="var(--primary)"
          iconBg="bg-primary/5"
        />
        <StatsCard
          icon={CheckCircle2}
          title="Published"
          value={published.toString().padStart(2, '0')}
          status="Live"
          statusVariant="success"
          iconColor="#10B981"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          icon={FileEdit}
          title="Draft"
          value={draft.toString().padStart(2, '0')}
          trend="In Progress"
          iconColor="#F59E0B"
          iconBg="bg-amber-50"
        />
        <StatsCard
          icon={CalendarRange}
          title="Upcoming"
          value={upcoming.toString().padStart(2, '0')}
          trend="Scheduled"
          iconColor="#8B5CF6"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Table */}
      <div className="space-y-4">
        <TableControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Search by exam name..."
          showAdd={false}
          showExport={false}
          filters={[
            {
              key: 'status',
              name: 'Status',
              options: [
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Published', value: 'PUBLISHED' },
              ]
            },
            {
              key: 'academicYearId',
              name: 'Academic Year',
              options: academicYears.map(y => ({ label: y.name, value: y.id }))
            }
          ]}
          activeFilters={{ status: filters.status, academicYearId: filters.academicYearId }}
          onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val, page: 1 }))}
          onResetFilters={() => {
            setSearchTerm('');
            setFilters({ status: '', academicYearId: '', page: 1, limit: 20 });
          }}
        />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Table
            columns={columns}
            data={filteredExams}
            loading={loading}
            searchTerm={searchTerm}
            emptyText="No exams found."
            showAdd={false}
            rowActions={renderRowActions}
            pagination={{ page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) }}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          />
        </motion.div>
      </div>

      <DeletePopup
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Examination?"
        message={`"${deleteTarget?.name}" and all its marks and results will be permanently deleted. This cannot be undone.`}
      />
    </motion.div>
  );
}
