'use client';

import React from 'react';
import { Printer, Download, Share2 } from 'lucide-react';

const FeeReceipt = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-2xl mx-auto border border-slate-100 text-slate-900 font-sans">
      {/* Receipt Header */}
      <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-8">
        <div>
          <div className="flex h-16 w-16 items-center justify-center mb-4">
            <img src="/justlogo.png" alt="Icon" className="h-full w-full object-contain" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Shiksha Disha</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Educational Excellence</p>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-black text-slate-900 uppercase">Receipt</h1>
          <p className="text-sm font-bold text-primary">#{data.id}</p>
          <div className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Date: {data.date}<br />
            Mode: {data.mode}
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2">Student Details</h4>
          <p className="font-black text-lg">{data.student}</p>
          <p className="text-sm text-slate-500 font-medium">Class: {data.class || 'N/A'}</p>
          <p className="text-sm text-slate-500 font-medium">Roll No: {data.rollNo || 'N/A'}</p>
        </div>
        <div className="text-right">
          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2">Payment Info</h4>
          <p className="text-sm font-bold text-slate-700">Ref: {data.ref}</p>
          <p className="text-sm text-slate-500 font-medium">Recorded by: {data.recordedBy}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr className="font-bold">
              <td className="py-6 text-slate-700">Academic Fees Payment</td>
              <td className="py-6 text-right text-slate-900">₹{data.amount.toLocaleString()}</td>
            </tr>
            {/* Breakdowns could go here if available */}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end gap-2 mb-12">
        <div className="flex items-center gap-12 text-sm font-bold text-slate-500">
          <span>Subtotal</span>
          <span>₹{data.amount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-12 text-2xl font-black text-primary pt-4 border-t-2 border-slate-100 w-full justify-end">
          <span className="text-sm uppercase tracking-[2px]">Total Paid</span>
          <span>₹{data.amount.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-dashed border-slate-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">This is a computer generated receipt</p>
        <div className="flex items-center justify-center gap-6 no-print">
          <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
            <Download size={14} /> Download
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeReceipt;
