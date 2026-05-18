'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Avatar,
  AvatarFallback,
} from '@/component/ui/CustomUI';
import { ChevronDown, Check, User } from 'lucide-react';

export function ChildSwitcher() {
  const { selectedProfile, selectedChild, switchChild, selectedRole } = useAuth();

  if (selectedRole !== 'PARENT' || !selectedProfile) {
    return null;
  }

  const childrenList = selectedProfile.children || selectedProfile.details?.children || [];

  if (childrenList.length === 0) return null;

  const isChildSelected = (child) => {
    const currentId = selectedChild?.id || selectedChild?.studentId;
    const itemId = child.id || child.studentId;
    return currentId && itemId && currentId === itemId;
  };

  const getChildId = (child) => child.id || child.studentId;
  const getChildClass = (child) => child.className || child.class || 'Class';

  // If only one child, just show a nice status badge/box without dropdown
  if (childrenList.length === 1) {
    const singleChild = childrenList[0];
    return (
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 transition-all duration-300">
        <Avatar className="h-8 w-8 ring-2 ring-primary/10 ring-offset-background">
          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
            {selectedChild?.name?.charAt(0) || 'S'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs font-bold leading-none text-slate-900 dark:text-slate-100">{selectedChild?.name}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{getChildClass(selectedChild)}</span>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/40 hover:bg-white/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 shadow-sm backdrop-blur-md transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 active:scale-95 outline-none"
        >
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-transform duration-500 group-hover:scale-110">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xs font-black uppercase">
                {selectedChild?.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>
          </div>
          
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover:text-primary transition-colors">Active Profile</span>
            <span className="text-[13px] font-black text-slate-900 dark:text-slate-100 leading-none flex items-center gap-1.5">
              {selectedChild?.name}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-all duration-300 group-data-[state=open]:rotate-180" />
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-72 p-2.5 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in zoom-in-95 duration-200"
      >
        <div className="px-4 py-3 mb-1 border-b border-slate-50 dark:border-slate-900/50">
            <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Switch Student</h3>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-tight">Select a profile to update your dashboard context.</p>
        </div>
        
        <div className="space-y-1 mt-1">
            {childrenList.map((child) => (
            <DropdownMenuItem
                key={getChildId(child)}
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 outline-none border ${
                isChildSelected(child) 
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/50 border-transparent'
                }`}
                onClick={() => switchChild(child)}
            >
                <div className="relative">
                    <Avatar className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <AvatarFallback className={`${
                        isChildSelected(child) 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    } text-sm font-black uppercase`}>
                        {child.name?.charAt(0)}
                    </AvatarFallback>
                    </Avatar>
                    {isChildSelected(child) && (
                        <div className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center border-2 border-white dark:border-slate-950">
                            <Check className="h-2 w-2 text-white" strokeWidth={4} />
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col flex-1 overflow-hidden">
                    <span className={`text-[13px] font-black leading-tight truncate ${isChildSelected(child) ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        {child.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter mt-0.5">{getChildClass(child)}</span>
                </div>
                
                {isChildSelected(child) && (
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                )}
            </DropdownMenuItem>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
