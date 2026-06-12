'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartestPhoneMockup } from './PhoneMockup';
import { Smartphone, ShieldCheck, BellRing, Sparkles } from 'lucide-react';

export default function MobileShowcase() {
  const [activeTab, setActiveTab] = React.useState<'student' | 'teacher'>('student');

  const tabs = [
    { id: 'student', label: 'Student / Parent' },
    { id: 'teacher', label: 'Teacher / Admin' },
  ];

  return (
    <section id="mobile-app" className="lg:hidden relative py-20 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-500 dark:border-orange-500/10 dark:bg-orange-950/20"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile-First Ecosystem</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Education Operating System, <br />
            <span className="font-caveat text-4xl sm:text-6xl text-orange-500">In the Palm of Your Hand.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto"
          >
            Never miss an update. Stay connected on the go with real-time notifications, 
            instant notice broadcasts, class chats, and attendance tracker widgets.
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mt-8 mb-10">
          <div className="relative flex rounded-full bg-slate-100 p-1 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'student' | 'teacher')}
                className={`relative rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider transition-colors duration-200 z-10 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 bg-orange-500 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          
          {/* Left Column: Details */}
          <div className="space-y-6 text-left">
            <AnimatePresence mode="wait">
              {activeTab === 'student' ? (
                <motion.div
                  key="student-details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <span className="inline-block text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 px-3 py-1 rounded-full">
                    Student / Parent Client
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Real-time Campus Tracker
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Parents can track their child&apos;s attendance instantly, submit digital leave 
                    requests, view upcoming exams, and access homework assignments directly.
                  </p>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="h-8 w-8 rounded-lg bg-orange-100/50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-bold text-xs">Instant PTM alerts & feedback loops</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="h-8 w-8 rounded-lg bg-orange-100/50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                        <BellRing className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-bold text-xs">Direct Notice Board notifications</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="teacher-details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <span className="inline-block text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 px-3 py-1 rounded-full">
                    Teacher / Admin Client
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Effortless Administration
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Mark attendance within seconds, distribute homework, approve leaves, 
                    and communicate directly with class parents without sharing personal phone numbers.
                  </p>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="h-8 w-8 rounded-lg bg-orange-100/50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-bold text-xs">Send push alerts directly to parents</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="h-8 w-8 rounded-lg bg-orange-100/50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                        <Smartphone className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-bold text-xs">Subject-wise messaging dashboard</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Badges card */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-900/80 flex flex-wrap gap-4 items-center">
              {/* App Store Badge */}
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 px-4 py-2 text-white border border-white/5 shadow-md select-none">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74,17,21.95,15.66,22c-1.31,0-1.72-.8-3.22-.8s-2,.78-3.25.8C7.89,22,7,20.75,6.13,19.5,4.39,17,3.07,12.38,4.86,9.28a5.51,5.51,0,0,1,4.68-2.82c1.28,0,2.49.89,3.28.89s2.21-.9,3.75-.75a5.16,5.16,0,0,1,4,2.2,5,5,0,0,0-2.43,4.3,4.89,4.89,0,0,0,3,4.5A13.41,13.41,0,0,1,18.71,19.5M16,4.87A4.75,4.75,0,0,0,17.13,1.5a4.89,4.89,0,0,0-3.19,1.63,4.5,4.5,0,0,0-1.15,3.22A4.18,4.18,0,0,0,16,4.87Z" />
                </svg>
                <div className="text-left leading-none">
                  <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">iOS App</p>
                  <p className="text-xs font-black">Coming Soon</p>
                </div>
              </div>

              {/* Play Store Badge */}
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 px-4 py-2 text-white border border-white/5 shadow-md select-none">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,3.06C4.78,3.06 4.57,3.18 4.47,3.38L12.77,11.68L17.39,7.06L5.38,3.13C5.26,3.09 5.13,3.06 5,3.06M3.66,4.24C3.56,4.45 3.5,4.71 3.5,5V19C3.5,19.29 3.56,19.55 3.66,19.76L12.06,11.36L3.66,4.24M18.84,7.84L13.47,12.07L18.84,16.27C19.26,15.82 19.5,15.19 19.5,14.5V9.5C19.5,8.81 19.26,8.18 18.84,7.84M12.77,12.38L4.47,20.68C4.57,20.88 4.78,21 5,21C5.13,21 5.26,20.97 5.38,20.93L17.39,17L12.77,12.38Z" />
                </svg>
                <div className="text-left leading-none">
                  <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Android App</p>
                  <p className="text-xs font-black">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Slanted Phone Mockup */}
          <div 
            className="relative flex justify-center items-center py-6"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <motion.div
              key={activeTab}
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ 
                opacity: 0, 
                rotateY: activeTab === 'student' ? -35 : 35, 
                scale: 0.9 
              }}
              animate={{ 
                opacity: 1, 
                rotateY: activeTab === 'student' ? -15 : 15,
                rotateX: 10,
                rotateZ: activeTab === 'student' ? -2 : 2,
                scale: 1
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 18 }}
              className="relative z-10"
            >
              <SmartestPhoneMockup role={activeTab} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
