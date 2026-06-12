'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/component/ui/CustomUI';
import { 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Bell, 
  Users, 
  FileText, 
  BookOpen, 
  Play, 
  Check 
} from 'lucide-react';
import React, { useRef } from 'react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

interface Particle {
  id: number;
  width: number;
  height: number;
  left: string;
  top: string;
  xAnim: number;
  duration: number;
  delay: number;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [particlesData, setParticlesData] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    const data = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      width: Math.random() * 6 + 4,
      height: Math.random() * 6 + 4,
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 50 + 10}%`,
      xAnim: Math.random() * 12 - 6,
      duration: Math.random() * 5 + 6,
      delay: Math.random() * 2,
    }));
    setParticlesData(data);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-white pt-16 pb-28 dark:bg-slate-950 lg:pt-24 lg:pb-36 text-center flex flex-col items-center"
    >
      {/* 1. BACKGROUND EFFECTS */}
      {/* Soft orange radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-[80%] max-w-7xl rounded-full bg-orange-500/[0.03] blur-3xl opacity-75 dark:bg-orange-500/[0.02]" />
      <div className="absolute top-24 left-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-amber-400/5 blur-3xl opacity-50 dark:bg-amber-950/10" />
      <div className="absolute top-36 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-orange-400/5 blur-3xl opacity-50 dark:bg-orange-950/10" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] dark:opacity-10" />

      {/* Subtle floating particles */}
      {particlesData.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-400/10 dark:bg-orange-500/5"
          style={{
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.xAnim, 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* HERO MAIN BODY */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/50 px-5.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500 dark:border-orange-500/10 dark:bg-orange-950/20"
        >
          <Sparkles className="h-3 w-3" />
          <span>India&apos;s Most Affordable Institute Management Platform</span>
        </motion.div>

        {/* Heading: dominated, correctly scaled */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight max-w-4xl"
        >
          Manage Your Institute <br />
          <span className="relative inline-block mt-1">
            <span className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent font-caveat text-5xl sm:text-7xl lg:text-8xl px-2">
              Smarter, Not Harder.
            </span>
          </span>
        </motion.h1>

        {/* Subtext with controlled width */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base lg:text-lg max-w-2xl"
        >
          Shiksha Disha helps schools, colleges, and coaching institutes manage academics,
          communication, attendance, notices, and administration through one smart digital ecosystem.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springTransition}>
            <Button
              render={<Link href="/login" />}
              className="group relative h-12.5 rounded-xl bg-orange-500 px-7 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all cursor-pointer"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springTransition}>
            <Button
              render={<Link href="#features" />}
              variant="outline"
              className="group h-12.5 rounded-xl border-slate-200 bg-white px-7 text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-orange-500 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Play className="h-2 w-2 fill-current ml-0.5" />
              </div>
              See How It Works
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500"
        >
          <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-500">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <span>Secure. Reliable. Built for Educational Excellence.</span>
        </motion.div>

        {/* VISUAL ECOSYSTEM CANVAS */}
        <div className="hidden lg:block relative mt-20 w-full max-w-6xl">

          {/* SVG Orbit Flow Circles */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <svg className="w-[90%] h-[90%] opacity-30 dark:opacity-10" viewBox="0 0 1000 500" fill="none">
              <ellipse cx="500" cy="250" rx="360" ry="180" stroke="#f97316" strokeWidth="1.5" strokeDasharray="6 6" />
              <ellipse cx="500" cy="250" rx="440" ry="220" stroke="#f97316" strokeWidth="1" strokeOpacity="0.3" />
            </svg>
          </div>

          {/* DESKTOP LAYOUT (Surrounding cards with center phones) */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-center min-h-[500px]">

            {/* Left Column: 3 Cards */}
            <div className="col-span-3 flex flex-col gap-6 text-right items-end pr-4">
              {/* Card 1: Attendance */}
              <motion.div
                whileHover={{ x: -4 }}
                className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70 w-[280px]"
              >
                <div className="text-left flex-grow">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Real-time Attendance</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Digital attendance for students and staff</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5" />
                </div>
              </motion.div>

              {/* Card 2: Chat Groups */}
              <motion.div
                whileHover={{ x: -4 }}
                className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70 w-[280px]"
              >
                <div className="text-left flex-grow">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Subject Chat Groups</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Dedicated groups for every classroom</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </motion.div>

              {/* Card 3: Leave Management */}
              <motion.div
                whileHover={{ x: -4 }}
                className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70 w-[280px]"
              >
                <div className="text-left flex-grow">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Leave Management</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Apply, approve and track leaves digitally</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-green-50 text-green-500 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
              </motion.div>
            </div>

            {/* Center Column: Twin-Phone Mockup (6 Columns) */}
            <div className="col-span-6 flex justify-center items-center gap-6">

              {/* Phone 1: Attendance Tracker (Left Tilted) */}
              <motion.div
                initial={{ rotate: -4, y: 15 }}
                animate={{ y: [15, 0, 15] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative border-[8px] border-slate-950 bg-slate-950 rounded-[2.5rem] h-[450px] w-[230px] shadow-2xl overflow-hidden flex flex-col pt-6 px-3.5 pb-3.5 text-left"
              >
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-950 rounded-b-xl z-20 flex justify-center items-center">
                  <div className="h-1.5 w-14 bg-slate-850 rounded-full" />
                </div>
                {/* Screen UI */}
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 pt-7 px-2.5 pb-2.5 flex flex-col justify-between overflow-hidden">
                  <div className="flex flex-col gap-2.5">
                    {/* Header */}
                    <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold border-b pb-1.5 border-slate-200/60 dark:border-slate-800">
                      <span>9:41</span>
                      <span>Attendance</span>
                      <div className="h-1 w-1 bg-emerald-500 rounded-full" />
                    </div>
                    {/* Ring Chart */}
                    <div className="flex flex-col items-center bg-white dark:bg-slate-800 rounded-xl p-2.5 border border-slate-100 dark:border-slate-750 shadow-sm relative">
                      <div className="relative h-20 w-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-100 dark:text-slate-750" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-emerald-500" strokeWidth="3" strokeDasharray="92, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center leading-none">
                          <span className="text-[10px] font-black text-slate-950 dark:text-white">92%</span>
                          <span className="text-[6px] text-slate-400 font-bold uppercase mt-0.5">Present</span>
                        </div>
                      </div>

                      {/* Box statistics */}
                      <div className="grid grid-cols-3 gap-1.5 w-full mt-2 border-t border-slate-100 dark:border-slate-700/60 pt-2 text-[7px] font-black text-center">
                        <div>
                          <p className="text-emerald-500">240</p>
                          <p className="text-slate-400 text-[5px]">Present</p>
                        </div>
                        <div>
                          <p className="text-red-500">18</p>
                          <p className="text-slate-400 text-[5px]">Absent</p>
                        </div>
                        <div>
                          <p className="text-orange-500">06</p>
                          <p className="text-slate-400 text-[5px]">Leave</p>
                        </div>
                      </div>
                    </div>
                    {/* Log list */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold uppercase tracking-wider">Recent Activity</div>
                      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-750 flex items-center justify-between text-[7.5px] font-bold">
                        <span>Rohit Sharma</span>
                        <span className="text-emerald-500 text-[7px]">Present</span>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-750 flex items-center justify-between text-[7.5px] font-bold">
                        <span>Ananya Singh</span>
                        <span className="text-emerald-500 text-[7px]">Present</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-20 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
                </div>
              </motion.div>

              {/* Phone 2: Notice Board (Right Tilted) */}
              <motion.div
                initial={{ rotate: 4, y: 0 }}
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="relative border-[8px] border-slate-950 bg-slate-950 rounded-[2.5rem] h-[450px] w-[230px] shadow-2xl overflow-hidden flex flex-col pt-6 px-3.5 pb-3.5 text-left"
              >
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-950 rounded-b-xl z-20 flex justify-center items-center">
                  <div className="h-1.5 w-14 bg-slate-850 rounded-full" />
                </div>
                {/* Screen UI */}
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 pt-7 px-2.5 pb-2.5 flex flex-col justify-between overflow-hidden">
                  <div className="flex flex-col gap-2.5">
                    {/* Header */}
                    <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold border-b pb-1.5 border-slate-200/60 dark:border-slate-800">
                      <span>9:41</span>
                      <span>Notice Board</span>
                      <div className="h-1 w-1 bg-orange-500 rounded-full" />
                    </div>
                    {/* Tabs */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-center text-[7px] font-bold">
                      <span className="bg-white dark:bg-slate-900 rounded p-1 text-slate-900 dark:text-white shadow-sm">All</span>
                      <span className="p-1 text-slate-400">General</span>
                      <span className="p-1 text-slate-400">Important</span>
                    </div>
                    {/* Notice list */}
                    <div className="space-y-2">
                      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 p-2 rounded-xl shadow-sm relative">
                        <span className="absolute top-2 right-2 text-[5px] font-bold text-orange-500 uppercase tracking-widest">Urgent</span>
                        <h5 className="text-[8px] font-extrabold text-slate-950 dark:text-white">Annual Day Celebration</h5>
                        <p className="text-[6px] text-slate-400 mt-0.5">24 May 2026</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 p-2 rounded-xl shadow-sm">
                        <h5 className="text-[8px] font-extrabold text-slate-950 dark:text-white">Sports Day Notice</h5>
                        <p className="text-[6px] text-slate-400 mt-0.5">20 May 2026</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 p-2 rounded-xl shadow-sm">
                        <h5 className="text-[8px] font-extrabold text-slate-950 dark:text-white">Holiday Announcement</h5>
                        <p className="text-[6px] text-slate-400 mt-0.5">18 May 2026</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-20 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
                </div>
              </motion.div>

            </div>

            {/* Right Column: 3 Cards */}
            <div className="col-span-3 flex flex-col gap-6 text-left items-start pl-4">
              {/* Card 4: Notice Management */}
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70 w-[280px]"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Notice Management</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Send important announcements instantly</p>
                </div>
              </motion.div>

              {/* Card 5: PTM Groups */}
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70 w-[280px]"
              >
                <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-950/30 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">PTM & Parent Groups</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Stay connected with parents and guardians</p>
                </div>
              </motion.div>

              {/* Card 6: Assignments */}
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70 w-[280px]"
              >
                <div className="h-10 w-10 rounded-xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Systematic Assignments</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Create, assign and track homework easily</p>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
