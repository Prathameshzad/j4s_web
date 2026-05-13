'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';

const FeeHeadsPage = () => {
  const { token } = useAuth();
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHead, setEditingHead] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'MANDATORY',
    frequency: 'ONE_TIME',
    isRefundable: false
  });

  useEffect(() => {
    // Initial defaults as requested by user
    setHeads([
      { id: '1', name: 'Tuition Fee', type: 'MANDATORY', frequency: 'MONTHLY', isRefundable: false },
      { id: '2', name: 'Registration Fee', type: 'MANDATORY', frequency: 'ONE_TIME', isRefundable: false },
      { id: '3', name: 'Lab Fee', type: 'OPTIONAL', frequency: 'YEARLY', isRefundable: false },
    ]);
    setLoading(false);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (editingHead) {
      setHeads(heads.map(h => h.id === editingHead.id ? { ...formData, id: h.id } : h));
    } else {
      setHeads([...heads, { ...formData, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setShowModal(false);
    setEditingHead(null);
    setFormData({ name: '', type: 'MANDATORY', frequency: 'ONE_TIME', isRefundable: false });
  };

  const deleteHead = (id) => {
    if (confirm('Are you sure you want to delete this fee head? This may affect existing structures.')) {
      setHeads(heads.filter(h => h.id !== id));
    }
  };

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
              Fee Heads
            </h1>
            <p className="text-slate-500 font-medium">Define and categorize different types of fees</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingHead(null);
            setFormData({ name: '', type: 'MANDATORY', frequency: 'ONE_TIME', isRefundable: false });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          Add New Head
        </button>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search fee heads..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-transparent focus:bg-white focus:border-primary transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                <th className="py-6 px-8">Fee Head Name</th>
                <th className="py-6 px-8">Type</th>
                <th className="py-6 px-8">Frequency</th>
                <th className="py-6 px-8 text-center">Refundable</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {heads.map((head, idx) => (
                <motion.tr 
                  key={head.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-6 px-8">
                    <span className="font-bold text-slate-900 dark:text-white">{head.name}</span>
                  </td>
                  <td className="py-6 px-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      head.type === 'MANDATORY' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {head.type}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-sm font-bold text-slate-500 uppercase">{head.frequency}</span>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex justify-center">
                      {head.isRefundable ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : (
                        <XCircle size={20} className="text-slate-200" />
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingHead(head);
                          setFormData(head);
                          setShowModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteHead(head.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <form onSubmit={handleSave} className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingHead ? 'Edit Fee Head' : 'New Fee Head'}
                  </h2>
                  <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                    <Plus size={24} className="rotate-45 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Tuition Fee" 
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary transition-all text-sm font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Type</label>
                      <select 
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary transition-all text-sm font-bold appearance-none cursor-pointer"
                      >
                        <option value="MANDATORY">Mandatory</option>
                        <option value="OPTIONAL">Optional</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Frequency</label>
                      <select 
                        value={formData.frequency}
                        onChange={e => setFormData({...formData, frequency: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary transition-all text-sm font-bold appearance-none cursor-pointer"
                      >
                        <option value="ONE_TIME">One Time</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={16} className="text-primary" />
                      <span className="text-sm font-bold">Is Refundable?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.isRefundable}
                        onChange={e => setFormData({...formData, isRefundable: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingHead ? 'Update Fee Head' : 'Create Fee Head'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeeHeadsPage;
