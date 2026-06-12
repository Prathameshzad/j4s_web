'use client';
import React, { useState, useRef } from 'react';
import { UploadCloud, Download, X, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/component/ui/CustomUI';

export default function BulkUploadModal({
  isOpen,
  onClose,
  onDownloadTemplate,
  onUpload,
  title = 'Bulk Upload Marks',
  subtitle = 'Download the template, fill it out, and upload it here.'
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    setSuccess('');
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await onUpload(file);
      setSuccess(response.message || 'Marks uploaded successfully!');
      setTimeout(() => {
        onClose();
        setFile(null);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to upload marks');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={!uploading ? onClose : undefined} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 z-10 space-y-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{subtitle}</p>
            </div>
            <button
              onClick={!uploading ? onClose : undefined}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={onDownloadTemplate}
              className="w-full h-12 border-primary/20 hover:border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              <Download size={16} className="mr-2" />
              Download CSV Template
            </Button>

            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer
                ${file ? 'border-primary/50 bg-primary/5' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 mt-2"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <UploadCloud size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-600">Click or drag CSV file here</p>
                  <p className="text-xs font-medium">Only .csv files are supported</p>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                {success}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest bg-primary text-white"
              onClick={handleSubmit}
              loading={uploading}
              disabled={!file}
            >
              Upload Marks
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
