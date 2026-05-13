'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, Input } from "@/component/ui/CustomUI"
import { Command, ArrowLeft, CheckCircle2, ShieldCheck, Zap, Star } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/component/Navbar';

const LoginPage = () => {
    const [loginType, setLoginType] = useState('phone');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const router = useRouter();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authentication/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier }),
            });
            const data = await res.json();

            if (data.success) {
                setStep(2);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authentication/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, otp }),
            });
            const data = await res.json();

            if (data.success) {
                login(data.data.user, data.data.token);
                router.push('/dashboard');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {/* Left Side: Login Form */}
                <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[450px] xl:w-[550px] lg:px-12 overflow-y-auto">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-10"
                        >
                            <Link href="/" className="flex items-center gap-3">
                                <div className="flex h-16 w-16 items-center justify-center">
                                    <img src="/justlogo.png" alt="Logo" className="h-full w-full object-contain" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Shiksha Disha
                                </span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {step === 1 ? 'Sign in' : 'Verify Identity'}
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                {step === 1
                                    ? 'Access your school management dashboard'
                                    : `We've sent a 4-digit code to ${identifier}`}
                            </p>
                        </motion.div>

                        <div className="mt-10">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.form
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onSubmit={handleSendOtp}
                                        className="space-y-6"
                                    >
                                        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                                            <button
                                                type="button"
                                                onClick={() => setLoginType('phone')}
                                                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${loginType === 'phone' ? 'bg-white text-orange-600 shadow-sm dark:bg-slate-800' : 'text-slate-500'}`}
                                            >
                                                Mobile
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setLoginType('email')}
                                                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${loginType === 'email' ? 'bg-white text-orange-600 shadow-sm dark:bg-slate-800' : 'text-slate-500'}`}
                                            >
                                                Email
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {loginType === 'phone' ? 'Phone Number' : 'Email Address'}
                                            </label>
                                            <Input
                                                type={loginType === 'phone' ? 'tel' : 'email'}
                                                placeholder={loginType === 'phone' ? 'e.g. 9876543210' : 'e.g. alex@school.com'}
                                                required
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                className="h-12 rounded-2xl border-slate-200 focus:border-orange-500 dark:border-slate-800"
                                            />
                                        </div>

                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-sm font-medium text-red-500"
                                            >
                                                {error}
                                            </motion.p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-14 rounded-2xl bg-orange-500 text-lg font-semibold text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all"
                                        >
                                            {loading ? 'Sending Code...' : 'Request Verification'}
                                        </Button>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="step2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onSubmit={handleVerifyOtp}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    Verification Code
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
                                                >
                                                    <ArrowLeft className="h-3 w-3" /> Change {loginType}
                                                </button>
                                            </div>
                                            <Input
                                                type="text"
                                                maxLength={4}
                                                autoFocus
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="123"
                                                className="h-16 text-center text-3xl font-bold tracking-[0.5em] rounded-2xl border-slate-200 focus:border-orange-500 dark:border-slate-800"
                                            />
                                            <div className="flex items-center gap-2 rounded-xl bg-orange-50 p-3 dark:bg-orange-950/20">
                                                <Zap className="h-4 w-4 text-orange-500" />
                                                <p className="text-xs font-medium text-orange-900 dark:text-orange-200">
                                                    Quick Access: The default code is <span className="font-bold">123</span>
                                                </p>
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-sm font-medium text-red-500 text-center"
                                            >
                                                {error}
                                            </motion.p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-14 rounded-2xl bg-orange-500 text-lg font-semibold text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all"
                                        >
                                            {loading ? 'Verifying...' : 'Login Now'}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-10 border-t border-slate-100 pt-10 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 dark:border-slate-950" />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500">
                                    Join <span className="font-bold text-slate-900 dark:text-white">500+ schools</span> managing education better.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Image & Features */}
                <div className="relative hidden flex-1 lg:block">
                    <Image
                        src="/students_learning_modern.png"
                        alt="Students learning"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 via-orange-600/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-12 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="max-w-xl"
                        >
                            <div className="mb-6 flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 fill-white" />)}
                            </div>
                            <h3 className="text-4xl font-bold leading-tight">
                                "The smartest way to manage our school's daily operations."
                            </h3>
                            <p className="mt-4 text-lg font-medium text-orange-50">
                                Empowering students, teachers, and parents with a unified digital experience.
                                India's most trusted school management platform.
                            </p>

                            <div className="mt-12 grid grid-cols-2 gap-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-orange-200" />
                                    <span className="font-semibold">Real-time Updates</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-6 w-6 text-orange-200" />
                                    <span className="font-semibold">Secure Data</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
