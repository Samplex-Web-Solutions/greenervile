import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a toast
  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  // Function to remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-xs sm:max-w-sm p-4 flex flex-col items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 20, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="w-full mb-3 pointer-events-auto"
            >
              <div className={`bg-white border-l-4 ${
                toast.type === 'error' ? 'border-red-500' : 
                toast.type === 'info' ? 'border-blue-500' : 'border-emerald-500'
              } shadow-2xl rounded-2xl p-4 flex items-center space-x-3 border border-slate-100`}>
                
                {/* Icon Section */}
                <div className={`${
                  toast.type === 'error' ? 'bg-red-50' : 
                  toast.type === 'info' ? 'bg-blue-50' : 'bg-emerald-50'
                } p-2 rounded-full flex-shrink-0`}>
                  {toast.type === 'error' ? (
                    <AlertCircle className="text-red-500 w-5 h-5" />
                  ) : toast.type === 'info' ? (
                    <Info className="text-blue-500 w-5 h-5" />
                  ) : (
                    <CheckCircle className="text-emerald-500 w-5 h-5" />
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    toast.type === 'error' ? 'text-red-500' : 
                    toast.type === 'info' ? 'text-blue-500' : 'text-emerald-500'
                  }`}>
                    {toast.type === 'error' ? 'System Alert' : toast.type === 'info' ? 'Information' : 'Success'}
                  </p>
                  <p className="text-slate-600 text-xs font-semibold truncate">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};