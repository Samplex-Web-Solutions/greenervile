import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, ShieldCheck, ArrowLeft, Send, CheckCircle2, X } from 'lucide-react';
import Logo from '../../assets/images/vile.png';
import { authService } from '../../Services/authService'; // Ensure this path is correct
import { useToast } from '../../Components/Context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        showToast(error.message, "error");
      } else {
        // Success: Trigger the modal
        setShowModal(true);
      }
    } catch (err) {
      showToast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* --- SUCCESS MODAL OVERLAY --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
            >
              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-2">Check Your Email</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-8">
                  A secure recovery link has been sent to <br /> 
                  <span className="font-bold text-slate-900">{email}</span>. <br />
                  Please check your inbox and spam folder.
                </p>

                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  Got it, thanks
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MAIN CARD --- */}
      <div className="max-w-3xl w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[450px] border border-slate-100">
        
        {/* Left Side: Security Visual */}
        <div className="hidden md:flex w-1/2 bg-slate-900 relative p-8 flex-col justify-center items-center text-white overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <div className="mb-4 inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <KeyRound size={32} />
            </div>
            <h1 className="text-xl font-black mb-3 tracking-tight">Account Recovery</h1>
            <p className="text-slate-400 text-[11px] max-w-[200px] mx-auto leading-relaxed">
              Don't worry! We'll send you secure instructions to reset your password and protect your assets.
            </p>
          </motion.div>

          <div className="absolute bottom-6 flex items-center space-x-2 text-slate-500 text-[10px]">
            <ShieldCheck size={12} />
            <span>Secure Verification Link</span>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-[320px] mx-auto w-full">
            <header className="mb-6 text-center md:text-left">
               <img src={Logo} alt="Logo" className="w-10 h-10 mb-3 mx-auto md:mx-0" />
               <h2 className="text-xl font-bold text-slate-900 mb-1">Reset Password</h2>
               <p className="text-slate-500 text-[11px]">Enter your email to receive a recovery link.</p>
            </header>

            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-900 text-sm"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md shadow-emerald-200 transition-all transform active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center space-x-2"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>

            <footer className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center space-x-2 text-emerald-600 font-bold text-[11px] hover:underline">
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;