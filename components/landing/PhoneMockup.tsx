'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageSquare, FileText, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

interface PhoneMockupProps {
  role: 'student' | 'teacher';
  image?: string; // Optional image for easy screenshot replacement in the future
}

export function SmartestPhoneMockup({ role, image }: PhoneMockupProps) {
  return (
    <div className="relative mx-auto border-slate-950 dark:border-slate-800 bg-slate-950 border-[12px] rounded-[3rem] h-[550px] w-[270px] shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
      
      {/* Notch / Speaker bar */}
      <div className="absolute top-0 inset-x-0 h-5 bg-slate-950 rounded-b-2xl z-20 flex justify-center items-center">
        <div className="h-1.5 w-16 bg-slate-800 rounded-full" />
      </div>

      {/* Screen area */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 flex flex-col pt-7 px-3 pb-3 overflow-hidden text-slate-800 dark:text-slate-100">
        {image ? (
          <img src={image} alt={`${role} app screen`} className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <div className="flex-grow flex flex-col justify-between">
            {/* Mock Mobile App UI */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-lg bg-orange-500 flex items-center justify-center text-white text-[9px] font-black">SD</div>
                  <span className="text-[10px] font-bold tracking-tight text-slate-700 dark:text-slate-300">Shiksha Disha</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center gap-2.5 mb-3">
                <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                  {role === 'student' ? 'AS' : 'PM'}
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-900 dark:text-white">
                    {role === 'student' ? 'Aarav Sharma' : 'Prof. Mehta'}
                  </h4>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400">
                    {role === 'student' ? 'Grade 10 - Section A' : 'Department of Physics'}
                  </p>
                </div>
              </div>

              {role === 'student' ? (
                /* Student Interface items */
                <div className="space-y-2.5">
                  {/* Attendance Card */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4.5 w-4.5 text-emerald-500" />
                      <span className="text-[10px] font-extrabold text-emerald-950 dark:text-emerald-300">Attendance</span>
                    </div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">96.4%</span>
                  </div>

                  {/* Tasks Card */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300">Assignments</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] bg-slate-50 dark:bg-slate-900/50 p-1 rounded">
                        <span className="text-slate-600 dark:text-slate-400">Math Homework</span>
                        <span className="text-red-500 font-bold">Due Tomorrow</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] bg-slate-50 dark:bg-slate-900/50 p-1 rounded">
                        <span className="text-slate-600 dark:text-slate-400">Physics Lab Doc</span>
                        <span className="text-slate-400">Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Group */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <MessageSquare className="h-4 w-4 text-indigo-500" />
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300">Class Chats</span>
                    </div>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                      Chemistry Group: 3 unread messages
                    </p>
                  </div>
                </div>
              ) : (
                /* Teacher Interface items */
                <div className="space-y-2.5">
                  {/* Mark attendance action */}
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-2.5 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4.5 w-4.5 text-orange-500" />
                      <span className="text-[10px] font-extrabold text-orange-950 dark:text-orange-300">Mark Attendance</span>
                    </div>
                    <span className="text-[9px] font-extrabold bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase">10-A</span>
                  </div>

                  {/* Leave approval list */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300">Leave Approvals</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded">
                        <span>Aman Verma (1 day)</span>
                        <span className="text-emerald-500 font-bold uppercase text-[8px]">Approve</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded">
                        <span>Reema Joy (2 days)</span>
                        <span className="text-slate-400 font-bold uppercase text-[8px]">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation simulator */}
            <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-2 flex items-center justify-around text-slate-400 dark:text-slate-500">
              <Calendar className="h-4 w-4 text-orange-500" />
              <MessageSquare className="h-4 w-4" />
              <FileText className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
      
      {/* Screen Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-10" />
    </div>
  );
}
