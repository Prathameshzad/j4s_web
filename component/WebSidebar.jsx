'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChevronRight,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { NAV_ITEMS } from '@/utils/navigation';

const WebSidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex h-full flex-col bg-white dark:bg-slate-900 overflow-hidden border-r border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-8">
                <div className="flex h-12 w-12 items-center justify-center shrink-0">
                    <img src="/justlogo.png" alt="Shiksha Disha Icon" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">Shiksha Disha</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{user?.userType || 'User'} PORTAL</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4 py-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-orange-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} />
                                {item.label}
                            </div>
                            {isActive && <ChevronRight size={14} />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                <div className="mb-4 flex items-center gap-3 px-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold dark:bg-primary/20">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-bold text-slate-900 dark:text-white">{user?.name}</span>
                        <span className="truncate text-[10px] text-slate-400 uppercase">{user?.roles?.[0] || 'Member'}</span>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden h-screen w-72 lg:block sticky top-0">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-[60]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900 shadow-xl dark:bg-slate-900 dark:text-white"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="relative h-full w-72 animate-fadeIn">
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
};

export default WebSidebar;
