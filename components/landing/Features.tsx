'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Globe,
  Bell,
  FileText
} from 'lucide-react';

const features = [
  {
    title: 'Real-time Attendance',
    description: 'Track student and staff attendance instantly with real-time digital logs.',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    title: 'Notice Management',
    description: 'Broadcast important announcements and digital notices to students and parents instantly.',
    icon: Bell,
    color: 'bg-orange-400',
  },
  {
    title: 'Subject Chat Groups',
    description: 'Dedicated group chats for every subject to foster better learning and communication.',
    icon: MessageSquare,
    color: 'bg-green-500',
  },
  {
    title: 'PTM & Parent Groups',
    description: 'Direct and organized communication channels between parents and teachers.',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: 'Leave Management',
    description: 'Easy-to-use digital leave application and approval system for students and staff.',
    icon: FileText,
    color: 'bg-red-500',
  },
  {
    title: 'Systematic Assignments',
    description: 'Subject-wise assignment distribution and tracking without the clutter of social apps.',
    icon: BookOpen,
    color: 'bg-indigo-500',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold uppercase tracking-wider text-orange-500"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl font-caveat"
          >
            Smartest Features for Modern Education
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400"
          >
            Built with cutting-edge technology to make school administration seamless, 
            transparent, and highly efficient.
          </motion.p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative rounded-3xl border border-slate-100 bg-slate-50/50 p-8 transition-all hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
