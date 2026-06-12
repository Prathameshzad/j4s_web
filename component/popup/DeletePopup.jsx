import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button, Card } from '../ui/CustomUI';

export default function DeletePopup({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md bg-white rounded-[2.5rem] border-none shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertTriangle size={40} />
          </div>
          
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            {title || 'Are you sure?'}
          </h3>
          
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            {message || 'This action cannot be undone. All associated data will be permanently removed.'}
          </p>
          
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-gray-100"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20"
              onClick={onConfirm}
              loading={loading}
            >
              Delete now
            </Button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </Card>
    </div>
  );
}
