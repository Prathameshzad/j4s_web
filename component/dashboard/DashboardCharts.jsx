'use client';

import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { Badge } from '@/component/ui/CustomUI';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

const DashboardCharts = ({ data = {}, role }) => {
    // Colors based on brand
    const COLORS = ['#f97316', '#0f172a', '#334155', '#475569', '#64748b'];

    // Ensure we have some data for the chart to render a line even if all values are 0
    const attendanceData = data.attendanceTrend?.length > 0 
        ? data.attendanceTrend 
        : [
            { date: 'Mon', value: 0 },
            { date: 'Tue', value: 0 },
            { date: 'Wed', value: 0 },
            { date: 'Thu', value: 0 },
            { date: 'Fri', value: 0 },
            { date: 'Sat', value: 0 },
          ];

    const distributionData = data.distributionData?.length > 0 
        ? data.distributionData 
        : [
            { name: 'Students', count: 0 },
            { name: 'Teachers', count: 0 },
            { name: 'Staff', count: 0 },
          ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-950/90">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {payload[0].value} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1 font-bold">Units</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const ChartHeader = ({ title, description, icon: Icon }) => (
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-400 group-hover:text-primary transition-all duration-300 border border-transparent group-hover:border-primary/10">
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{description}</p>
                </div>
            </div>
            <Badge variant="outline" className="h-7 text-[9px] border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-widest px-3 rounded-full bg-slate-50/50 dark:bg-slate-800/50">Live</Badge>
        </div>
    );

    const commonTransition = { duration: 1, ease: [0.23, 1, 0.32, 1] };

    if (role === 'STUDENT') {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={commonTransition}
                className="h-full"
            >
                <div className="p-6 lg:p-8">
                    <ChartHeader 
                        title="Attendance Trajectory" 
                        description="Academic Engagement Analysis" 
                        icon={Activity} 
                    />
                    <div className="h-[300px] sm:h-[400px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceData}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={15}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dx={-10}
                                    domain={[0, 100]}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#f97316" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorStudents)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-50 dark:bg-slate-800/50">
            <div className="bg-white dark:bg-slate-900 p-6 lg:p-8">
                <ChartHeader 
                    title="Operational Pulse" 
                    description="Institutional Attendance Stream" 
                    icon={TrendingUp} 
                />
                <div className="h-[300px] sm:h-[350px] w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceData}>
                            <defs>
                                <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                            <XAxis dataKey="date" hide />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                                dx={-10}
                                domain={[0, 'auto']}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#f97316" 
                                fill="url(#colorPulse)" 
                                strokeWidth={4} 
                                animationDuration={2500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 border-l border-slate-50 dark:border-slate-800/50">
                <ChartHeader 
                    title="Structural Metrics" 
                    description="Resource Allocation Map" 
                    icon={BarChart3} 
                />
                <div className="h-[300px] sm:h-[350px] w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distributionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                dy={15}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }} />
                            <Bar 
                                dataKey="count" 
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                                animationDuration={2000}
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f97316' : '#0f172a'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
