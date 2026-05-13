'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  History,
  PieChart,
  ChevronRight,
  Receipt,
  Download,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, CardDescription } from '@/component/ui/CustomUI';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/component/ui/Table/BaseTable';

const FeesDashboard = () => {
  const { token, selectedProfile } = useAuth();
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalPending: 0,
    activeStudents: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for initial UI - would fetch from backend normally
    setStats({
      totalCollected: 1254000,
      totalPending: 450000,
      activeStudents: 1200,
      recentPayments: [
        { id: 1, student: 'Rahul Sharma', amount: 15000, date: '2024-05-15', mode: 'UPI', status: 'SUCCESS' },
        { id: 2, student: 'Priya Patel', amount: 12000, date: '2024-05-14', mode: 'CASH', status: 'SUCCESS' },
        { id: 3, student: 'Amit Kumar', amount: 25000, date: '2024-05-14', mode: 'CARD', status: 'SUCCESS' },
        { id: 4, student: 'Sneha Singh', amount: 8000, date: '2024-05-13', mode: 'UPI', status: 'SUCCESS' },
      ]
    });
    setLoading(false);
  }, [token, selectedProfile]);

  const statsConfig = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalCollected.toLocaleString()}`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      href: '/dashboard/fees/payments'
    },
    {
      title: 'Pending Receivables',
      value: `₹${stats.totalPending.toLocaleString()}`,
      change: '-5.2%',
      isPositive: false,
      icon: FileText,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      href: '/dashboard/fees/students'
    },
    {
      title: 'Active Assignments',
      value: stats.activeStudents.toString(),
      change: '+48 students',
      isPositive: true,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      href: '/dashboard/fees/structures'
    },
    {
      title: 'Avg. Transaction',
      value: '₹14,200',
      change: '+2.1%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      href: '/dashboard/fees/payments'
    }
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <DollarSign size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase font-header">Financial Management</h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Institutional Revenue & Collections</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-md text-xs font-bold border-slate-200">
            <Download size={16} className="mr-2 opacity-50" />
            Export Audit
          </Button>
          <Button className="h-11 rounded-md px-6 text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/10 transition-all active:scale-95">
            <Plus size={16} className="mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((card, idx) => (
          <Card key={idx} className="hover:shadow-md transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-md ${card.color} flex items-center justify-center border`}>
                  <card.icon size={24} />
                </div>
                <Badge variant={card.isPositive ? 'success' : 'error'} className="h-6">
                  {card.change}
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-header">{card.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Module Navigation */}
        <div className="xl:col-span-4 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Financial Modules</CardTitle>
              <CardDescription>Core system architecture</CardDescription>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {[
                { title: 'Fee Heads', icon: PieChart, desc: 'Revenue category mapping', href: '/dashboard/fees/heads' },
                { title: 'Fee Structures', icon: FileText, desc: 'Academic billing templates', href: '/dashboard/fees/structures' },
                { title: 'Student Registry', icon: Users, desc: 'Individual payment tracking', href: '/dashboard/fees/students' }
              ].map((item, idx) => (
                <Link key={idx} href={item.href} className="flex items-center justify-between p-4 rounded-md hover:bg-slate-50 group transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.title}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Compliance & Security */}
          <div className="bg-slate-900 text-white rounded-md p-8 relative overflow-hidden shadow-lg group">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-2 uppercase font-header">Data Integrity</h3>
              <p className="text-slate-400 font-semibold text-[11px] leading-relaxed mb-6">
                All financial records are encrypted and stored in an immutable ledger. Audit trails are maintained for every system modification.
              </p>
              <Button variant="outline" className="w-full h-11 border-white/10 text-white hover:bg-white/5 font-bold text-[10px] uppercase tracking-wider rounded-md transition-all">
                Generate Security Audit
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
          </div>
        </div>

        {/* Recent Ledger Activity */}
        <div className="xl:col-span-8">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">Transaction Ledger</CardTitle>
                <CardDescription>Live payment monitoring</CardDescription>
              </div>
              <Button variant="ghost" className="h-8 text-[10px] font-bold px-4 rounded-md uppercase tracking-wider text-slate-400 hover:text-primary">
                View All Activity
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">Payer Identity</TableHead>
                      <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">Quantum</TableHead>
                      <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">Timestamp</TableHead>
                      <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">Gateway</TableHead>
                      <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentPayments.map((p) => (
                      <TableRow key={p.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-0">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">
                              {p.student.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm tracking-tight">{p.student}</p>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Verified</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="font-bold text-slate-900 text-sm">₹{p.amount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight italic">
                            {p.date}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="info" className="h-6 text-[9px]">{p.mode}</Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-primary/10 hover:text-primary text-slate-300">
                            <Receipt size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats.recentPayments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                              <History size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">No activity detected</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeesDashboard;
