'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, LifeBuoy, Map, Ghost } from 'lucide-react';
import { Button, Badge } from '@/component/ui/CustomUI';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 overflow-hidden relative">
      {/* Background System Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center space-y-12">
        {/* Large Styled 404 */}
        <div className="relative inline-block">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-[180px] sm:text-[240px] font-black leading-none tracking-tighter text-slate-900 dark:text-white"
          >
            4<span className="text-primary inline-block transform -rotate-12 translate-y-2">0</span>4
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, rotate: 10, y: 20 }}
            animate={{ opacity: 1, rotate: -15, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute -top-4 -right-12 sm:-right-20 bg-primary px-4 py-2 rounded-xl shadow-2xl shadow-primary/40"
          >
            <span className="font-caveat text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
              Lost in class?
            </span>
          </motion.div>
        </div>

        <div className="space-y-6 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-4"
          >
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-4 h-8 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              Route Not Found
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Even the brightest students<br />
              <span className="text-slate-400">lose their way sometimes.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
              The page you're looking for has either graduated, moved to a different classroom, or never existed in this syllabus.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link href="/dashboard" asChild>
              <Button className="h-14 px-10 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 group">
                <Home size={18} className="transition-transform group-hover:-translate-y-0.5" />
                Go to Dashboard
                <ArrowLeft size={18} className="rotate-180 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Link href="/dashboard/support" asChild>
              <Button variant="ghost" className="h-14 px-8 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-3">
                <LifeBuoy size={18} />
                Get Help
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* System Breadcrumb Style Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
          className="pt-12 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          <Ghost size={14} />
          <span>Missing Object Detection System</span>
        </motion.div>
      </div>
    </div>
  );
}
