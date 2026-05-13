'use client';

import React from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const DashboardHeader = () => {
    const { displayName } = useAuth();

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
        >
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        Welcome back, <span className="text-primary">{displayName}</span>
                    </h1>
                    <Sparkles size={18} className="text-primary animate-pulse" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Here's what's happening in your academy today
                </p>
            </div>
        </motion.div>
    );
};

export default DashboardHeader;
