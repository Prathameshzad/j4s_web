'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowLeft,
  Filter,
  Download,
  Eye,
  CreditCard,
  User,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';
import { Button, Card, CardContent, Badge } from '@/component/ui/CustomUI';

const StudentFeesPage = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setStudents([
      { 
        id: '1', 
        name: 'Rahul Sharma', 
        rollNo: '101', 
        class: '10th Standard',
        total: 45000,
        paid: 30000,
        pending: 15000,
        status: 'PARTIAL'
      },
      { 
        id: '2', 
        name: 'Priya Patel', 
        rollNo: '102', 
        class: '10th Standard',
        total: 45000,
        paid: 45000,
        pending: 0,
        status: 'PAID'
      },
      { 
        id: '3', 
        name: 'Amit Kumar', 
        rollNo: '201', 
        class: '9th Standard',
        total: 35000,
        paid: 0,
        pending: 35000,
        status: 'PENDING'
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-5">
          <Link href="/dashboard/fees" className="w-11 h-11 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase font-header leading-none">
              Student Fees Registry
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Institutional Balance Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-md px-4 text-slate-500 border-slate-200">
                <Download size={18} />
            </Button>
            <Button className="h-11 rounded-md px-8 font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all active:scale-95 flex items-center gap-2">
                <Filter size={18} />
                Filter Registry
            </Button>
        </div>
      </div>

      {/* Main List */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or roll number..." 
              className="w-full pl-11 pr-6 py-3 bg-white rounded-md border border-slate-200 focus:border-primary transition-all text-xs font-bold uppercase tracking-tight"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/30">
                <th className="py-5 px-8">Student Detail</th>
                <th className="py-5 px-8">Class Node</th>
                <th className="py-5 px-8">Total Liability</th>
                <th className="py-5 px-8">Verified Paid</th>
                <th className="py-5 px-8">Outstanding</th>
                <th className="py-5 px-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student, idx) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs border border-slate-200">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight font-header">{student.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {student.rollNo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider text-slate-500 border-slate-200 h-6 px-3">
                        {student.class}
                    </Badge>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-sm font-black text-slate-900 tracking-tight">₹{student.total.toLocaleString()}</span>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-sm font-black text-emerald-600 tracking-tight">₹{student.paid.toLocaleString()}</span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black tracking-tight ${student.pending > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        ₹{student.pending.toLocaleString()}
                      </span>
                      {student.pending === 0 && <CheckCircle2 size={14} className="text-emerald-500" />}
                      {student.pending > student.total * 0.5 && <AlertCircle size={14} className="text-rose-500" />}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-slate-50 hover:bg-white hover:text-primary border border-transparent hover:border-slate-200 transition-all shadow-sm">
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" className="h-9 px-4 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={14} />
                        Pay
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentFeesPage;
