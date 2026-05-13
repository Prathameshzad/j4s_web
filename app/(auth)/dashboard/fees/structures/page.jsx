'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';

const FeeStructuresPage = () => {
  const { token } = useAuth();
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setStructures([
      { 
        id: '1', 
        class: '10th Standard', 
        division: 'Division A', 
        academicYear: '2024-25',
        totalAmount: 45000,
        items: [
          { head: 'Tuition Fee', amount: 30000 },
          { head: 'Registration Fee', amount: 5000 },
          { head: 'Lab Fee', amount: 10000 },
        ]
      },
      { 
        id: '2', 
        class: '9th Standard', 
        division: 'Division B', 
        academicYear: '2024-25',
        totalAmount: 35000,
        items: [
          { head: 'Tuition Fee', amount: 25000 },
          { head: 'Registration Fee', amount: 5000 },
          { head: 'Lab Fee', amount: 5000 },
        ]
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/fees" className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-primary transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Fee Structures
            </h1>
            <p className="text-slate-500 font-medium">Define class-wise fee breakdowns for the academic year</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Plus size={20} />
          Create Structure
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {structures.map((struct, idx) => (
          <motion.div 
            key={struct.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-100 dark:bg-primary/20 text-primary rounded-[1.5rem]">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{struct.class}</h3>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                    <span>{struct.division}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{struct.academicYear}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Value</p>
                <p className="text-2xl font-black text-primary">₹{struct.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {struct.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.head}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Last updated: 2 days ago</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <Plus size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeeStructuresPage;
