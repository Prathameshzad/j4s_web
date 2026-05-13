'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../app/context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/70"
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="group flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex h-32 w-auto items-center justify-center py-2"
                        >
                            <img
                                src="/justlogo.png"
                                alt="Shiksha Disha Logo"
                                className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-normal"
                            />
                        </motion.div>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors dark:text-slate-300 dark:hover:text-orange-400">Features</Link>
                    <Link href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors dark:text-slate-300 dark:hover:text-orange-400">Pricing</Link>
                    <Link href="#contact" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors dark:text-slate-300 dark:hover:text-orange-400">Contact</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                Hi, <span className="text-orange-500">{user.name}</span>
                            </span>
                            <button
                                onClick={logout}
                                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-orange-500 px-8 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-95"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
