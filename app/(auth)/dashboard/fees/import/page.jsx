'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BulkImportPage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      processFile(droppedFile);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (file) => {
    setFile(file);
    setLoading(true);
    // Simulated parsing logic
    setTimeout(() => {
      setPreview([
        { mobile: '9988776655', category: 'Tuition Fee', date: '2024-05-15', amount: 15000, status: 'VALID' },
        { mobile: '8877665544', category: 'Tuition Fee', date: '2024-05-14', amount: 12000, status: 'VALID' },
        { mobile: '7766554433', category: 'Lab Fee', date: '2024-05-14', amount: 5000, status: 'INVALID', error: 'Student not found' },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/fees" className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-primary transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Bulk Import Fees
            </h1>
            <p className="text-slate-500 font-medium">Upload CSV to record multiple payments at once</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
          <Download size={18} />
          Sample CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload Zone */}
        <div className="lg:col-span-4 space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`relative group cursor-pointer border-4 border-dashed rounded-[3rem] p-12 text-center transition-all ${
              isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv"
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center">
              <div className="p-6 bg-orange-100 dark:bg-primary/20 text-primary rounded-[2rem] mb-6 group-hover:scale-110 transition-transform">
                <Upload size={40} />
              </div>
              <h3 className="text-lg font-bold mb-2">Drop your CSV here</h3>
              <p className="text-sm text-slate-400">or click to browse files</p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Required Columns</h4>
              <ul className="space-y-2">
                {['Student Mobile', 'Fee Category', 'Payment Date', 'Amount'].map(col => (
                  <li key={col} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {col}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-primary text-white rounded-[2rem] flex items-center justify-between shadow-xl shadow-orange-200"
            >
              <div className="flex items-center gap-4">
                <FileSpreadsheet size={24} />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold truncate text-sm">{file.name}</span>
                  <span className="text-[10px] opacity-70">Ready to import</span>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <X size={20} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Preview Zone */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <FileText className="text-primary" size={20} />
                Data Preview
              </h2>
              {preview.length > 0 && (
                <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-100">
                  Confirm & Import
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Processing Data...</p>
                </div>
              ) : preview.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                      <th className="py-6 px-8">Mobile Number</th>
                      <th className="py-6 px-8">Category</th>
                      <th className="py-6 px-8">Date</th>
                      <th className="py-6 px-8">Amount</th>
                      <th className="py-6 px-8">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {preview.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-6 px-8">
                          <span className="font-mono text-sm text-slate-900 dark:text-white">{row.mobile}</span>
                        </td>
                        <td className="py-6 px-8">
                          <span className="text-sm font-bold text-slate-500">{row.category}</span>
                        </td>
                        <td className="py-6 px-8 text-sm font-medium text-slate-500">{row.date}</td>
                        <td className="py-6 px-8 font-black text-slate-900 dark:text-white">₹{row.amount.toLocaleString()}</td>
                        <td className="py-6 px-8">
                          {row.status === 'VALID' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 size={12} />
                              Valid
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider" title={row.error}>
                              <AlertCircle size={12} />
                              {row.error}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <div className="inline-flex p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-6">
                    <FileSpreadsheet size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">No data to display</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">Upload a CSV file to see a preview of the payments before confirming.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportPage;
