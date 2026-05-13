'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  Loader2, User, Mail, Phone, Briefcase, GraduationCap,
  Users, MapPin, Calendar, Camera, Edit2, Check, X,
  ChevronRight, Award, BookOpen, Clock, LifeBuoy, Send, MessageSquare
} from 'lucide-react';
import { Card, Button, Badge, Input } from '@/component/ui/CustomUI';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function MyProfile() {
  const { token, selectedProfile, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  // Support Form State
  const [supportData, setSupportData] = useState({
    subject: '',
    message: '',
    category: 'TECHNICAL',
    priority: 'LOW'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/support/ticket`, {
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
        toast.success('Ticket submitted successfully!');
        setSupportData({ subject: '', message: '', category: 'TECHNICAL', priority: 'LOW' });
      }
    } catch (err) {
      toast.error('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (token && selectedProfile) {
      fetchProfile();
    }
  }, [token, selectedProfile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-selected-user-id': selectedProfile.userId,
          'x-selected-role': selectedProfile.role
        }
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast.error('Could not load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/user/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-selected-user-id': selectedProfile.userId,
          'x-selected-role': selectedProfile.role
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setProfile({ ...profile, ...data.data });
      }
    } catch (error) {
      console.error('Update failed', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-muted-foreground font-black uppercase tracking-tighter text-xs text-center">
          Synchronizing Identity...
        </p>
      </div>
    );
  }

  const roleName = selectedProfile?.role?.toUpperCase() || 'USER';
  const isTeacher = selectedProfile?.role?.toLowerCase() === 'teacher';
  const isParent = selectedProfile?.role?.toLowerCase() === 'parent';
  const isStudent = selectedProfile?.role?.toLowerCase() === 'student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-10 px-6 space-y-12"
    >
      {/* Header / Banner Section */}
      <div className="relative">
        <div className="h-56 w-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-[3rem] shadow-2xl shadow-primary/20 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-white rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          </div>
        </div>

        <div className="absolute -bottom-20 left-14 flex items-end gap-8">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] bg-card p-2 shadow-2xl shadow-black/10 transition-transform group-hover:scale-[1.02] duration-500">
              <div className="w-full h-full rounded-[2rem] bg-muted flex items-center justify-center overflow-hidden border-4 border-background">
                {profile?.profileUrl ? (
                  <img src={profile.profileUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-primary">
                    {profile?.name?.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-3 bg-card rounded-2xl shadow-xl border border-border/50 text-muted-foreground hover:text-primary transition-all active:scale-90">
              <Camera size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black text-foreground tracking-tight">{profile?.name}</h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                {roleName}
              </Badge>
            </div>
            <p className="text-muted-foreground font-bold flex items-center gap-2 mt-2">
              <MapPin size={16} className="text-primary" />
              {profile?.institute?.name}
            </p>
          </div>
        </div>

        <div className="absolute -bottom-12 right-10">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-card hover:bg-muted text-foreground border-2 border-border/50 rounded-2xl px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-black/5 transition-all active:scale-95"
            >
              <Edit2 size={18} /> Modify Profile
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-card hover:bg-muted text-muted-foreground border-2 border-border/50 rounded-2xl px-8 py-4 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Discard
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-primary/20 transition-all active:scale-95"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Commit Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-24 pt-12">
        {/* Basic Information */}
        <div className="lg:col-span-4 space-y-10">
          <section className="space-y-6">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Contact Intelligence</h3>
            <Card className="p-8 rounded-[2.5rem] border-border/50 shadow-2xl shadow-black/[0.02] space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-5 p-4 rounded-[1.5rem] hover:bg-muted/50 transition-all group">
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Electronic Mail</p>
                    {isEditing ? (
                      <input
                        className="w-full bg-transparent border-b-2 border-border focus:border-primary outline-none text-sm font-bold py-1.5 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-bold text-foreground truncate">{profile?.email || 'Not verified'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-5 p-4 rounded-[1.5rem] hover:bg-muted/50 transition-all group">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    <Phone size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Direct Line</p>
                    {isEditing ? (
                      <input
                        className="w-full bg-transparent border-b-2 border-border focus:border-primary outline-none text-sm font-bold py-1.5 transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-bold text-foreground">{profile?.phone || 'No direct line'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-5 p-4 rounded-[1.5rem] hover:bg-muted/50 transition-all group">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                    <Calendar size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Affiliated Since</p>
                    <p className="text-sm font-bold text-foreground">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '---'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Teacher Specific Small Stats */}
          {isTeacher && (
            <section className="space-y-6">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Professional Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 rounded-[2rem] border-border/50 shadow-xl shadow-black/[0.02] text-center space-y-2">
                  <p className="text-3xl font-black text-foreground">{profile?.staff?.experience || 0}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Years Exp.</p>
                </Card>
                <Card className="p-6 rounded-[2rem] border-border/50 shadow-xl shadow-black/[0.02] text-center space-y-2">
                  <p className="text-3xl font-black text-foreground">{profile?.staff?.bloodGroup || 'N/A'}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Blood Type</p>
                </Card>
              </div>
            </section>
          )}
        </div>

        {/* Role Specific Detailed Content */}
        <div className="lg:col-span-8 space-y-12">

          {/* TEACHER SECTION */}
          {isTeacher && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.25rem] bg-foreground text-background flex items-center justify-center shadow-2xl shadow-black/20">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Academic Profile</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Faculty Credentials & Credentials</p>
                </div>
              </div>

              <Card className="p-10 rounded-[3rem] border-border/50 shadow-2xl shadow-black/[0.02]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Primary Designation</label>
                    <p className="text-xl font-black text-foreground leading-tight">{profile?.staff?.designation || 'Faculty Member'}</p>
                    <div className="h-1.5 w-16 bg-primary rounded-full mt-2" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Faculty ID</label>
                    <p className="text-xl font-black text-foreground">#FAC-{profile?.id?.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-border">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Assigned Functional Roles</h4>
                  <div className="flex flex-wrap gap-3">
                    {profile?.staff?.roles?.map((r, i) => (
                      <Badge key={i} className="bg-muted text-foreground border-transparent px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* STUDENT SECTION */}
          {isStudent && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.25rem] bg-foreground text-background flex items-center justify-center shadow-2xl shadow-black/20">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Academic Records</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enrollment & Class Details</p>
                </div>
              </div>

              <Card className="p-10 rounded-[3rem] border-border/50 shadow-2xl shadow-black/[0.02]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Class Affiliation</label>
                    <p className="text-3xl font-black text-foreground">
                      {profile?.student?.class?.standard?.name} {profile?.student?.class?.division?.name}
                    </p>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-1">ACTIVE STATUS</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Roll Number</label>
                      <p className="text-xl font-black text-foreground">{profile?.student?.rollNumber || '---'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Admission ID</label>
                      <p className="text-xl font-black text-foreground">{profile?.student?.admissionNo || '---'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-border grid grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-muted rounded-[2rem]">
                    <BookOpen size={22} className="mx-auto text-primary mb-3" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Attendance</p>
                    <p className="text-xl font-black text-foreground">92.4%</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-[2rem]">
                    <Award size={22} className="mx-auto text-blue-500 mb-3" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Academic Rank</p>
                    <p className="text-xl font-black text-foreground">#04</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-[2rem]">
                    <Clock size={22} className="mx-auto text-purple-500 mb-3" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Conduct Grade</p>
                    <p className="text-xl font-black text-foreground">A+</p>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* PARENT SECTION - HIGHLIGHT CHILDREN */}
          {isParent && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.25rem] bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/20">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Family Hierarchy</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Linked Student Profiles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profile?.parent?.parentStudents?.length > 0 ? (
                  profile.parent.parentStudents.map((ps, index) => (
                    <Card key={index} className="group relative p-8 rounded-[2.5rem] border-border/50 shadow-2xl shadow-black/[0.02] hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-6 -mt-6 transition-all group-hover:scale-150 duration-700" />

                      <div className="relative flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-card p-1.5 shadow-xl border border-border/50">
                          <div className="w-full h-full rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
                            {ps.student?.user?.name?.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Student</p>
                          <h4 className="text-xl font-black text-foreground leading-tight">{ps.student?.user?.name}</h4>
                        </div>
                      </div>

                      <div className="mt-8 space-y-4 relative">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-[1.5rem]">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Academic Grade</span>
                          <span className="text-sm font-black text-foreground">
                            {ps.student?.class?.standard?.name} - {ps.student?.class?.division?.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted rounded-[1.5rem]">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Official Roll No</span>
                          <span className="text-sm font-black text-foreground">{ps.student?.rollNumber || '---'}</span>
                        </div>
                      </div>

                      <button className="mt-8 w-full py-5 rounded-[1.5rem] bg-foreground text-background text-[10px] font-black uppercase tracking-[3px] flex items-center justify-center gap-3 group-hover:bg-primary transition-all duration-300 shadow-2xl shadow-black/10 active:scale-95">
                        Deep Analytics <ChevronRight size={18} />
                      </button>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 py-16 text-center bg-muted/50 rounded-[3rem] border-4 border-dashed border-border/50">
                    <p className="text-muted-foreground font-bold italic">No student profiles are currently linked to this guardian account.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Biography/Metadata */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-muted text-muted-foreground flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Biography & Metadata</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Background Information</p>
              </div>
            </div>
            <Card className="p-10 rounded-[3rem] border-border/50 shadow-2xl shadow-black/[0.02]">
              <p className="text-base text-muted-foreground leading-relaxed italic font-medium">
                "Dedicated to the pursuit of knowledge and personal growth within the Shiksha Disha academic ecosystem.
                Focused on {isTeacher ? 'innovative teaching methodologies' : (isParent ? 'supporting comprehensive development' : 'excellence in learning')} and meaningful impact."
              </p>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <div className={`w-full h-full bg-gradient-to-br ${i === 1 ? 'from-primary to-orange-400' : (i === 2 ? 'from-blue-400 to-indigo-600' : 'from-emerald-400 to-green-600')} opacity-40`} />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Across 3 Academic Nodes</p>
              </div>
            </Card>
          </section>

          {/* SUPPORT SECTION */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 text-primary flex items-center justify-center">
                <LifeBuoy size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Help & Support</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Raise a Support Ticket</p>
              </div>
            </div>
            <Card className="p-10 rounded-[3rem] border-border/50 shadow-2xl shadow-black/[0.02]">
              <form onSubmit={handleSupportSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Category</label>
                    <select
                      className="w-full h-12 px-4 rounded-2xl border border-border bg-card focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-sm font-bold transition-all"
                      value={supportData.category}
                      onChange={(e) => setSupportData({ ...supportData, category: e.target.value })}
                    >
                      <option value="TECHNICAL">Technical Issue</option>
                      <option value="ACADEMIC">Academic Query</option>
                      <option value="FEES">Fee Related</option>
                      <option value="GENERAL">General Support</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Priority</label>
                    <select
                      className="w-full h-12 px-4 rounded-2xl border border-border bg-card focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-sm font-bold transition-all"
                      value={supportData.priority}
                      onChange={(e) => setSupportData({ ...supportData, priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="Subject"
                  placeholder="Briefly describe your issue"
                  value={supportData.subject}
                  onChange={(e) => setSupportData({ ...supportData, subject: e.target.value })}
                  required
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    className="w-full min-h-[120px] p-4 rounded-2xl border border-border bg-card focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-sm font-medium transition-all"
                    placeholder="Detailed explanation..."
                    value={supportData.message}
                    onChange={(e) => setSupportData({ ...supportData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto h-12 px-10 rounded-2xl shadow-xl shadow-primary/20">
                  {submitting ? <Loader2 className="animate-spin" /> : <Send className="mr-2" size={18} />}
                  Submit Ticket
                </Button>
              </form>
            </Card>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
