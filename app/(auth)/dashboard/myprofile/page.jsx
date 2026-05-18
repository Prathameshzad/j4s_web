'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  Loader2, User, Mail, Phone, Briefcase, GraduationCap,
  Users, MapPin, Calendar, Camera, BookOpen, Clock, 
  LifeBuoy, Send, ShieldCheck, Star, Sparkles, Building,
  ArrowRight, CreditCard, ClipboardCheck, MessageSquare,
  Shield, Info, ChevronRight
} from 'lucide-react';
import { Card, Button, Badge, Avatar, AvatarFallback, AvatarImage } from '@/component/ui/CustomUI';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function MyProfile() {
  const { token, selectedProfile, loading: authLoading, displayName } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Support Form State
  const [supportData, setSupportData] = useState({
    subject: '',
    message: '',
    category: 'TECHNICAL',
    priority: 'LOW'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token && selectedProfile) {
      fetchProfile();
    }
  }, [token, selectedProfile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-selected-user-id': selectedProfile.userId,
          'x-selected-role': selectedProfile.role
        }
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast.error('Could not load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/ticket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-selected-user-id': selectedProfile.userId,
          'x-selected-role': selectedProfile.role
        },
        body: JSON.stringify(supportData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Support ticket submitted!');
        setSupportData({ subject: '', message: '', category: 'TECHNICAL', priority: 'LOW' });
      }
    } catch (err) {
      toast.error('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4 opacity-50" />
        <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest animate-pulse">
          Loading Profile...
        </p>
      </div>
    );
  }

  const isTeacher = profile?.type === 'teacher';
  const isParent = profile?.type === 'parent';
  const isStudent = profile?.type === 'student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-8 px-4 space-y-10 mb-20"
    >
      {/* Profile Header */}
      <Card className="relative overflow-hidden border-none shadow-xl bg-slate-900 rounded-[2.5rem] p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-1.5 shadow-2xl">
              <Avatar className="w-full h-full rounded-2xl border-none">
                <AvatarImage src={profile?.basicDetails?.avatarUrl} />
                <AvatarFallback className="bg-slate-100 text-primary text-4xl font-black">
                  {profile?.basicDetails?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl text-white shadow-lg border-2 border-slate-900">
              {isTeacher ? <Briefcase size={18} /> : (isStudent ? <GraduationCap size={18} /> : <Users size={18} />)}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {profile?.basicDetails?.name}
              </h1>
              <Badge variant="primary" className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm px-4 py-1">
                {selectedProfile?.role}
              </Badge>
            </div>
            <p className="text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2 text-sm">
              <Building size={16} className="text-primary" />
              {profile?.basicDetails?.instituteName}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-center px-4 border-r border-white/10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-white">ACTIVE</span>
              </div>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Member Since</p>
              <span className="text-xs font-bold text-white">2024</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Basic Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
            <Info size={14} className="text-primary" /> Contact Details
          </h3>
          <Card className="p-6 rounded-3xl border-slate-100 shadow-sm space-y-6">
            <InfoItem icon={<Mail size={18} />} label="Email" value={profile?.basicDetails?.email || 'N/A'} color="orange" />
            <InfoItem icon={<Phone size={18} />} label="Phone" value={profile?.basicDetails?.phone || 'N/A'} color="blue" />
            {profile?.basicDetails?.whatsappNo && (
              <InfoItem icon={<MessageSquare size={18} />} label="WhatsApp" value={profile?.basicDetails?.whatsappNo} color="green" />
            )}
            <InfoItem icon={<Shield size={18} />} label="Verification" value="Verified User" color="purple" />
          </Card>

          {isTeacher && (
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Experience" value={`${profile?.basicDetails?.experience || 0} Years`} />
              <StatCard label="Blood Group" value={profile?.basicDetails?.bloodGroup || 'N/A'} />
            </div>
          )}

          {isStudent && (
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Roll No" value={profile?.basicDetails?.rollNumber || '---'} />
              <StatCard label="Gender" value={profile?.basicDetails?.gender || 'N/A'} />
            </div>
          )}
        </div>

        {/* Detailed Info Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TEACHER: Assigned Classes */}
          {isTeacher && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">My Classes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile?.classes?.length > 0 ? profile.classes.map((c, i) => (
                  <Card key={i} className="p-5 rounded-2xl border-slate-100 hover:border-primary/30 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="neutral" className="text-[9px]">{c.board || 'CBSE'}</Badge>
                      <span className="text-[10px] font-bold text-primary uppercase">{c.medium || 'English'}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{c.name}</h4>
                  </Card>
                )) : (
                  <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">No assigned classes found.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* STUDENT: Academic Profile */}
          {isStudent && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Academic Profile</h3>
              <Card className="p-8 rounded-3xl border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Class</p>
                    <p className="text-3xl font-black text-slate-900 leading-none">{profile?.basicDetails?.className}</p>
                    <div className="flex items-center gap-2 pt-3">
                      <Badge variant="success">Active Student</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Roll Number</p>
                      <p className="text-sm font-bold text-slate-900">{profile?.basicDetails?.rollNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Group</p>
                      <p className="text-sm font-bold text-slate-900">{profile?.basicDetails?.bloodGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">D.O.B</p>
                      <p className="text-sm font-bold text-slate-900">
                        {profile?.basicDetails?.dateOfBirth ? new Date(profile.basicDetails.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Admission Status</p>
                      <p className="text-sm font-bold text-green-600">CONFIRMED</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* PARENT: Linked Children */}
          {isParent && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Linked Children</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile?.children?.length > 0 ? profile.children.map((child, i) => (
                  <Card key={i} className="p-6 rounded-3xl border-slate-100 hover:shadow-lg transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] -mr-6 -mt-6 transition-transform group-hover:scale-110" />
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-xl font-black text-primary border border-slate-100">
                        {child.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Student</p>
                        <h4 className="text-lg font-black text-slate-900">{child.name}</h4>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Class</span>
                        <span className="text-xs font-bold text-slate-900">{child.className}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Roll No</span>
                        <span className="text-xs font-bold text-slate-900">#{child.rollNumber || '---'}</span>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="col-span-2 p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">No linked student profiles found.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Support Ticket Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Need Assistance?</h3>
            <Card className="p-8 rounded-3xl border-slate-100 shadow-sm">
              <form onSubmit={handleSupportSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary outline-none text-xs font-bold transition-all"
                      value={supportData.category}
                      onChange={(e) => setSupportData({...supportData, category: e.target.value})}
                    >
                      <option value="TECHNICAL">Technical Issue</option>
                      <option value="ACADEMIC">Academic Support</option>
                      <option value="FEES">Fee Related</option>
                      <option value="GENERAL">General Help</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                    <select 
                      className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary outline-none text-xs font-bold transition-all"
                      value={supportData.priority}
                      onChange={(e) => setSupportData({...supportData, priority: e.target.value})}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                  <input 
                    className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary outline-none text-sm font-bold transition-all"
                    placeholder="Short summary of your issue"
                    value={supportData.subject}
                    onChange={(e) => setSupportData({...supportData, subject: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
                  <textarea 
                    className="w-full min-h-[120px] p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary outline-none text-sm font-medium transition-all"
                    placeholder="Describe your concern in detail..."
                    value={supportData.message}
                    onChange={(e) => setSupportData({...supportData, message: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full h-14 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
                  {submitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={16} />}
                  Send Ticket
                </Button>
              </form>
            </Card>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

// Helper Components
function InfoItem({ icon, label, value, color }) {
  const colorMap = {
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <div className="flex items-center gap-4 group">
      <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${colorMap[color] || colorMap.blue}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="p-4 text-center border-slate-100 shadow-sm rounded-2xl">
      <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
    </Card>
  );
}
