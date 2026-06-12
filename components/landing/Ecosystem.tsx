'use client';

import { motion } from 'framer-motion';
import { Settings, Shield, User, Heart, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const roles = [
  {
    id: 'admin',
    title: 'Administration',
    subtitle: 'Ecosystem Core',
    description: 'Central controls for school management. Manages admissions, staff rosters, leaves approval, and portal security controls.',
    icon: Settings,
    color: 'from-orange-500 to-amber-500',
    colorText: 'text-orange-500',
    flow: 'Broadcasts notifications & policies'
  },
  {
    id: 'teacher',
    title: 'Teachers',
    subtitle: 'Academic Lead',
    description: 'Classroom operators. Track digital attendance, post daily assignments, host chat channels, and share notice boards.',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-500',
    colorText: 'text-blue-500',
    flow: 'Shares tasks & schedules grades'
  },
  {
    id: 'student',
    title: 'Students',
    subtitle: 'Primary Learner',
    description: 'Active learners. Participate in class chat streams, submit assignments, track schedules, and request leave.',
    icon: User,
    color: 'from-emerald-500 to-teal-500',
    colorText: 'text-emerald-500',
    flow: 'Submits assignments & requests leave'
  },
  {
    id: 'parent',
    title: 'Parents',
    subtitle: 'Connected Guardian',
    description: 'Home guardians. Track real-time attendance, receive PTM notifications, submit leave updates, and review grades.',
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    colorText: 'text-purple-500',
    flow: 'Monitors attendance & leaves'
  }
];

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-28 bg-white dark:bg-slate-900 overflow-hidden relative">
      {/* Light glow backdrops */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-500 dark:border-orange-500/10 dark:bg-orange-950/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Product Experience</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            A Unified Educational <br />
            <span className="font-caveat text-5xl sm:text-7xl text-orange-500">Connected Ecosystem</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-400"
          >
            Watch how data, communication, and updates flow seamlessly between parents, 
            students, teachers, and administrators.
          </motion.p>
        </div>

        {/* Desktop Connected Layout */}
        <div className="relative mt-12">
          
          {/* Animated SVG Flow lines (Visible on Desktop) */}
          <div className="hidden lg:block absolute inset-0 -z-10 pointer-events-none w-full h-full">
            <svg className="w-full h-full min-h-[300px]" viewBox="0 0 1200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Grid Connection Flow Path */}
              <path d="M 150 150 C 250 80, 350 80, 450 150 C 550 220, 650 220, 750 150 C 850 80, 950 80, 1050 150" 
                    stroke="url(#flowGradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeDasharray="12, 12"
                    className="animate-flow-dash"
              />
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="33%" stopColor="#3B82F6" />
                  <stop offset="66%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
            <style>{`
              @keyframes flowDashOffset {
                to {
                  stroke-dashoffset: -120;
                }
              }
              .animate-flow-dash {
                animation: flowDashOffset 6s linear infinite;
              }
            `}</style>
          </div>

          {/* Connected Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative rounded-[2rem] border border-slate-100 bg-slate-50/50 p-8 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5 dark:border-slate-800/40 dark:bg-slate-900/60 dark:hover:bg-slate-900"
              >
                {/* Visual Connector Point */}
                <div className="hidden lg:block absolute top-[138px] -right-4 w-8 h-px bg-slate-200 dark:bg-slate-800 last:hidden" />
                
                {/* Node icon */}
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <role.icon className="h-6 w-6" />
                </div>

                <div className="mt-6">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${role.colorText}`}>
                    {role.subtitle}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {role.title}
                  </h3>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Animated data flow badge at bottom */}
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="group-hover:text-orange-500 transition-colors">
                    {role.flow}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
