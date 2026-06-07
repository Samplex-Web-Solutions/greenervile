import React, { useState } from 'react';
import { useAuth } from '../../Components/Context/Authcontext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, AtSign, Globe, ShieldCheck,
  CheckCircle, MailCheck, X, ArrowRight, ExternalLink, CheckCircle2
} from 'lucide-react';
import Logo from '../../assets/images/vile.png';

// Consistent Premium Success Modal
const SuccessModal = ({ isOpen, onClose, userEmail }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[32px] overflow-hidden max-w-sm w-full shadow-2xl relative border border-slate-100"
        >
          {/* Header Visual - Emerald Theme */}
          <div className="bg-emerald-600 p-8 flex justify-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-emerald-200 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/30"
            >
              <MailCheck className="text-white w-12 h-12" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Check your inbox!</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              A link to activate your account has been sent to <br />
              <span className="font-bold text-emerald-600">{userEmail}</span>. <br />
              Please verify your email to secure your assets.
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
                <span>Return to Login</span>
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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, firstName, lastName, username);

    if (error) {
      alert(`Registration Error: ${error.message}`);
      setLoading(false);
    } else {
      setLoading(false);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[550px] border border-slate-100">

        {/* Left Side: Visual Area */}
        <div className="hidden md:flex w-1/2 bg-slate-900 relative p-8 flex-col justify-center text-white overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl" />
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
            <div className="mb-4 inline-flex p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Globe className="text-emerald-500 w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl font-black mb-3 tracking-tight">Join the Network</h1>
            <ul className="space-y-3">
              {["Global Assets", "Real-time Data", "Secure Vault"].map((text, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center space-x-2 text-slate-400 text-[11px]">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <div className="absolute bottom-6 left-8 flex items-center space-x-2 text-slate-500 text-[10px]">
            <ShieldCheck size={12} />
            <span>Identity Verified Access</span>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center bg-white">
          <div className="max-w-[320px] mx-auto w-full">
            <header className="mb-5 text-center md:text-left">
              <h2 className="text-lg font-bold text-slate-900 mb-0.5">Create Account</h2>
              <p className="text-slate-500 text-[12px]">Start your green investment journey.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">First Name</label>
                  <input type="text" required value={firstName} autoComplete='off' onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 outline-none transition-all text-xs" placeholder="John" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Last Name</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 outline-none transition-all text-xs" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" required value={username} autoComplete='off' onChange={(e) => setUsername(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 outline-none transition-all text-xs" placeholder="username" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="email" required value={email} autoComplete='off' onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 outline-none transition-all text-xs" placeholder="email@example.com" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="password" required value={password} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 outline-none transition-all text-xs" placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md shadow-emerald-200 transition-all transform active:scale-[0.98] disabled:bg-slate-300 mt-2">
                {loading ? "Processing..." : "Create Account"}
              </button>
            </form>

            <footer className="mt-6 text-center">
              <p className="text-slate-500 text-[12px] font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-600 text-[12px] font-bold hover:underline">Log in</Link>
              </p>
            </footer>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userEmail={email}
      />
    </div>
  );
};

export default Register;