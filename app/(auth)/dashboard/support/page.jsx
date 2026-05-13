'use client';
import React, { useState, useEffect } from 'react';
import {
  LifeBuoy, Send, MessageSquare, Shield,
  Phone, Mail, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import {
  Button, Input, Textarea, Card, CardHeader, CardTitle,
  CardDescription, CardContent, Badge,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/component/ui/CustomUI';
import { useAuth } from '@/app/context/AuthContext';
import axiosClient from '@/lib/axiosClient';

export default function SupportPage() {
  const { user, selectedProfile } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'TECHNICAL',
    priority: 'LOW'
  });

  useEffect(() => {
    fetchMyTickets();
  }, [selectedProfile]);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/app/support/my-tickets');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/app/support/ticket', formData);
      if (res.data.success) {
        setTickets([res.data.data, ...tickets]);
        setFormData({ subject: '', message: '', category: 'TECHNICAL', priority: 'LOW' });
      }
    } catch (err) {
      console.error('Failed to submit ticket', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'warning';
      case 'IN_PROGRESS': return 'info';
      case 'RESOLVED': return 'success';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Care</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">General Support</h1>
          <p className="text-slate-500 font-medium mt-1">Need help? Send us a message and we'll get back to you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-white/50 backdrop-blur-xl">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl">Send a Message</CardTitle>
              <CardDescription>Tell us what's on your mind. We're here to help!</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">What's this about?</label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TECHNICAL">App & Technical</SelectItem>
                        <SelectItem value="ACADEMIC">Classes & Study</SelectItem>
                        <SelectItem value="FEES">Fees & Payments</SelectItem>
                        <SelectItem value="GENERAL">General Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">How urgent is it?</label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => setFormData({ ...formData, priority: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Take Your Time</SelectItem>
                        <SelectItem value="MEDIUM">Standard</SelectItem>
                        <SelectItem value="HIGH">Important</SelectItem>
                        <SelectItem value="URGENT">Needs Action Now</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Short Summary</label>
                  <Input
                    placeholder="e.g., Cannot see my schedule"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Detailed Message</label>
                  <Textarea
                    placeholder="Explain your problem here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="min-h-[180px]"
                  />
                </div>

                <Button type="submit" loading={submitting} className="w-full sm:w-auto h-14 px-12 shadow-2xl shadow-primary/20 rounded-[32px]">
                  <Send size={18} className="mr-2" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Previous Tickets */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Previous Messages
              </h3>
              <Badge variant="outline" className="opacity-50">{tickets.length} Total</Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[32px]" />)}
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:border-primary/20 transition-all group rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/20 bg-white">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant={getStatusColor(ticket.status)} className="rounded-full px-4">{ticket.status}</Badge>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{ticket.category}</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight mb-2 uppercase tracking-tight">{ticket.subject}</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{ticket.message}</p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2 shrink-0">
                          <span className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">#{ticket.id.substring(0, 8).toUpperCase()}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none rounded-[40px] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <CardHeader className="p-8 pb-4 relative z-10">
              <CardTitle className="text-white text-2xl">Quick Help</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Reach us directly for urgent needs.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8 relative z-10">
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-primary transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[2px] mb-1">Call Support</p>
                  <p className="text-lg font-black tracking-tight">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-primary transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[2px] mb-1">Email Us</p>
                  <p className="text-lg font-black tracking-tight">care@shikshadisha.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 border-emerald-100 rounded-[40px] border-2 border-dashed">
            <CardContent className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 size={36} className="text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Instant FAQ</h4>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">Find answers instantly in our knowledge base.</p>
              </div>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-black uppercase text-[10px] tracking-[2px]">Browse Guide</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
