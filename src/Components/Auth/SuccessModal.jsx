import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck, X, ArrowRight, ExternalLink, KeyRound } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, userEmail }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
          >
            {/* Header Visual - Emerald Theme */}
            <div className="bg-emerald-600 p-8 flex justify-center relative">
              <div 
                className="absolute top-4 right-4 text-emerald-200 hover:text-white cursor-pointer transition-colors" 
                onClick={onClose}
              >
                <X size={20} />
              </div>
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/30"
              >
                <KeyRound className="text-white w-12 h-12" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Check your inbox!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                A secure recovery link has been sent to <br />
                <span className="text-emerald-600 font-bold">{userEmail}</span>. 
                Please follow the instructions to reset your password.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                >
                  <span>Open Email</span>
                  <ExternalLink size={16} />
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-3 text-slate-500 hover:text-slate-700 font-bold text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Back to login</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-2 bg-emerald-500/20 w-full" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;