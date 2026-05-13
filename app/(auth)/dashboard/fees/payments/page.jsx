'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ArrowLeft,
  FileText,
  Download,
  CreditCard,
  History,
  Printer,
  ChevronDown,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';
import { Button, Card, CardContent, Badge } from '@/component/ui/CustomUI';

const PaymentsPage = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setPayments([
      { id: 'PAY-1001', student: 'Rahul Sharma', amount: 15000, date: '2024-05-15', mode: 'UPI', ref: 'UPI99228833', recordedBy: 'Admin' },
      { id: 'PAY-1002', student: 'Priya Patel', amount: 45000, date: '2024-05-14', mode: 'CASH', ref: '-', recordedBy: 'Admin' },
      { id: 'PAY-1003', student: 'Amit Kumar', amount: 12000, date: '2024-05-12', mode: 'BANK_TRANSFER', ref: 'TXN882299', recordedBy: 'Staff_2' },
    ]);
    setLoading(false);
  }, []);

  const handlePrintReceipt = (payment) => {
    alert(`Generating receipt for ${payment.id}...`);
  };

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
              Payment Ledger
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Institutional Transaction History</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowPayModal(true)}
          className="h-11 rounded-md px-8 font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          Record Payment
        </Button>
      </div>

      {/* List */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by transaction ID or student..." 
              className="w-full pl-11 pr-6 py-3 bg-white rounded-md border border-slate-200 focus:border-primary transition-all text-xs font-bold uppercase tracking-tight"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 rounded-md px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-slate-200">
                This Month <ChevronDown size={14} className="ml-2 opacity-50" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/30">
                <th className="py-5 px-8">Transaction ID</th>
                <th className="py-5 px-8">Student Entity</th>
                <th className="py-5 px-8">Quantum</th>
                <th className="py-5 px-8">Protocol</th>
                <th className="py-5 px-8">Timestamp</th>
                <th className="py-5 px-8 text-right">Receipting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p, idx) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-5 px-8">
                    <span className="font-mono text-[11px] font-black text-primary tracking-tighter uppercase">{p.id}</span>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight font-header">{p.student}</span>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-sm font-black text-slate-900 tracking-tight">₹{p.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-5 px-8">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider text-slate-500 border-slate-200 h-6 px-3">
                      {p.mode}
                    </Badge>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="opacity-40" />
                        <span className="text-xs font-bold uppercase tracking-tighter">{p.date}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <Button 
                      onClick={() => handlePrintReceipt(p)}
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border-emerald-100 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      <Printer size={14} />
                      Print Receipt
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white rounded-md shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase font-header leading-none">Record Payment</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Transaction Node Input</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowPayModal(false)} className="h-10 w-10 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                    <X size={20} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Entry</label>
                        <select className="w-full px-4 py-3 bg-slate-50 rounded-md border border-slate-200 focus:border-primary transition-all text-xs font-bold uppercase tracking-tight">
                            <option>Select Student...</option>
                            <option>Rahul Sharma (101)</option>
                            <option>Priya Patel (102)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantum (₹)</label>
                        <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 rounded-md border border-slate-200 focus:border-primary transition-all text-xs font-bold uppercase tracking-tight" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol Mode</label>
                        <select className="w-full px-4 py-3 bg-slate-50 rounded-md border border-slate-200 focus:border-primary transition-all text-xs font-bold uppercase tracking-tight">
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Debit/Credit Card</option>
                            <option value="NETBANKING">Net Banking</option>
                            <option value="CHEQUE">Cheque</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference ID</label>
                        <input type="text" placeholder="TXN-XXXX" className="w-full px-4 py-3 bg-slate-50 rounded-md border border-slate-200 focus:border-primary transition-all text-xs font-bold uppercase tracking-tight" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Internal Remarks</label>
                    <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 rounded-md border border-slate-200 focus:border-primary transition-all text-xs font-bold uppercase tracking-tight resize-none" placeholder="Add optional context..."></textarea>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button className="flex-1 h-12 rounded-md font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/10">
                    Commit Transaction
                  </Button>
                  <Button variant="outline" className="h-12 w-16 rounded-md border-emerald-100 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-600 hover:text-white transition-all">
                    <Printer size={20} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentsPage;
