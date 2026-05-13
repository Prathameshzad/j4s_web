'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/component/ui/CustomUI';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-16 pb-32 dark:bg-slate-950 lg:pt-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-80 lg:top-[-200px]">
        <svg viewBox="0 0 1108 632" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full opacity-20 dark:opacity-10">
          <path d="M.5 200.5c68.8-56.3 222-64.6 307.5-21 110 56.5 273.5 12.5 315-10.5 41.5-23 151-51 224-21 73 30 205.5 106 260.5 119" stroke="url(#paint0_linear)" strokeWidth="2" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="200.5" x2="1108" y2="200.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#FB923C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/50 px-4 py-1.5 text-sm font-semibold text-orange-500 backdrop-blur-sm dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
          >
            <Sparkles className="h-4 w-4" />
            <span>India's Most Affordable Institute Management App</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl md:text-8xl"
          >
            Manage Your Institute <br />
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 bg-clip-text text-transparent font-caveat">
              Smarter, Not Harder.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-8 text-slate-600 dark:text-slate-400 sm:text-xl"
          >
            The all-in-one solution for schools, colleges, and coaching centers. 
            Streamline admissions, attendance, fees, and more with the 
            <strong className="font-caveat text-orange-500 dark:text-orange-400 text-2xl px-1"> cheapest </strong> enterprise-grade portal in India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            <Button
              render={<Link href="/login" />}
              className="h-14 rounded-2xl bg-orange-400 px-8 text-lg font-semibold text-white shadow-xl shadow-orange-400/20 hover:bg-orange-500 active:scale-95 transition-all"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              render={<Link href="#features" />}
              variant="outline"
              className="h-14 rounded-2xl border-slate-200 bg-white px-8 text-lg font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 transition-all"
            >
              See How It Works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative"
          >
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-2xl"></div>
            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
               {/* This would be a screenshot or a demo UI */}
               <div className="aspect-[16/9] w-full overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Zap className="h-12 w-12 animate-pulse text-orange-400" />
                    <span className="text-sm font-medium tracking-wider uppercase">Interactive Dashboard Preview</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
