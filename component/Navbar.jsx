'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../app/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/60 p-1.5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800/40 dark:bg-slate-950/65"
            >
                <div className="flex items-center justify-between px-4 py-2">
                    {/* Brand/Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="group flex items-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                className="flex h-10 w-auto items-center justify-center"
                            >
                                <img
                                    src="/justlogo.png"
                                    alt="Shiksha Disha Logo"
                                    className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-normal"
                                />
                                <span className="ml-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                                    Shiksha Disha
                                </span>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Pricing', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="relative text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors dark:text-slate-300 dark:hover:text-orange-400 py-1"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Right Hand Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    Hi, <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{user.name}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="rounded-xl border border-slate-200 bg-white/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-xl bg-orange-500 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {/* Glow Effect */}
                                <div className="absolute -inset-0.5 rounded-xl bg-orange-500 opacity-0 blur group-hover:opacity-30 transition-all duration-300" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/40 text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 cursor-pointer"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Premium Mobile Menu Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 top-[76px] -z-10 bg-slate-950/40 backdrop-blur-sm md:hidden"
                        />
                        {/* Drawer body */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 top-[76px] z-40 w-full max-w-xs border-l border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
                        >
                            <div className="flex flex-col gap-6 mt-4">
                                {['Features', 'Pricing', 'Contact'].map((item) => (
                                    <Link
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-bold text-slate-900 hover:text-orange-500 transition-colors dark:text-white dark:hover:text-orange-400"
                                    >
                                        {item}
                                    </Link>
                                ))}

                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            Hi, <span className="text-orange-500">{user.name}</span>
                                        </span>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-white cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600"
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
