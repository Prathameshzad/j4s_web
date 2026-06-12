'use client';

import { motion, Variants } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Bell,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Real-time Attendance',
    description: 'Track student and staff attendance instantly with real-time digital logs. Parents receive instant notification of check-ins to ensure transparency and safety.',
    icon: Calendar,
    color: 'from-blue-500 to-indigo-500',
    gridSpan: 'sm:col-span-2',
    accentText: 'Most Popular'
  },
  {
    title: 'Notice Management',
    description: 'Broadcast important announcements and digital notices to students and parents instantly, replacing paper circulars.',
    icon: Bell,
    color: 'from-orange-400 to-amber-500',
    gridSpan: 'sm:col-span-1'
  },
  {
    title: 'Subject Chat Groups',
    description: 'Dedicated group chats for every subject to foster better learning, question solving, and active communication.',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    gridSpan: 'sm:col-span-1'
  },
  {
    title: 'PTM & Parent Groups',
    description: 'Direct and organized communication channels between parents and teachers, eliminating the noise of generic social chat applications.',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    gridSpan: 'sm:col-span-1'
  },
  {
    title: 'Leave Management',
    description: 'Easy-to-use digital leave application and approval system for students and staff. Track leave histories seamlessly.',
    icon: FileText,
    color: 'from-red-500 to-orange-500',
    gridSpan: 'sm:col-span-1'
  },
  {
    title: 'Systematic Assignments',
    description: 'Subject-wise assignment distribution, homework tracking, and grade returns without the clutter. Students submit digital attachments directly within the portal.',
    icon: BookOpen,
    color: 'from-indigo-500 to-violet-500',
    gridSpan: 'sm:col-span-2',
    accentText: 'Future-Ready'
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function Features() {
  return (
    <section id="features" className="py-28 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Visual Ambient Element */}
      <div className="absolute top-1/4 left-0 -z-10 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-500 dark:border-orange-500/10 dark:bg-orange-950/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Everything You Need</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Smartest Features for <br />
            <span className="font-caveat text-5xl sm:text-7xl text-orange-500">Modern Education</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-400"
          >
            Built with cutting-edge SaaS technology to make school administration seamless, 
            transparent, and highly efficient.
          </motion.p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`group relative rounded-[2rem] border border-slate-200/60 bg-white/60 p-8 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5 dark:border-slate-800/40 dark:bg-slate-900/60 dark:hover:bg-slate-900/90 ${feature.gridSpan}`}
            >
              {/* Feature Accent Tag */}
              {feature.accentText && (
                <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  {feature.accentText}
                </span>
              )}

              {/* Icon Container with gradient background */}
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-slate-900/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className="h-5 w-5" />
              </div>
              
              <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                {feature.description}
              </p>

              {/* Decorative Arrow Link */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-orange-500 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
                <span>Learn how it works</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>

              {/* Subtle hover background highlight overlay */}
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
