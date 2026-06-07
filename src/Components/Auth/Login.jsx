import React, { useState } from 'react';
import { useAuth } from '../../Components/Context/Authcontext';
import { useToast } from '../../Components/Context/ToastContext'; // Import the Toast hook
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, TrendingUp, Shield } from 'lucide-react';
import Logo from '../../assets/images/vile.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
    } else {
      showToast(" Welcome back!", 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[550px] border border-slate-100">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex w-1/2 bg-slate-900 relative p-8 flex-col justify-center items-center text-white overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-900/40 rounded-full blur-3xl" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <div className="mb-4 inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="text-emerald-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black mb-2 tracking-tight">Greener Vile <br />Investment Inc.</h1>
            <p className="text-slate-400 text-sm max-w-[220px] mx-auto">
              Securely access your sustainable asset portfolio.
            </p>
          </motion.div>

          <div className="mt-8 flex items-end space-x-1.5 h-24">
            {[30, 60, 40, 80, 55, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                className="w-4 bg-emerald-500/30 rounded-t-md border-t border-emerald-500/50"
              />
            ))}
          </div>
          
          <div className="absolute bottom-6 flex items-center space-x-2 text-slate-500 text-[10px]">
            <Shield size={12} />
            <span>Encrypted Access</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-10 md:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-[320px] mx-auto w-full">
            <header className="mb-6 md:mb-8 text-center md:text-left">
               <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Partner Login</h2>
               <p className="text-slate-500 text-xs md:text-sm">Manage your green investments.</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest px-1">Email Address</label>
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

              <div className="space-y-1">
                <div className="flex justify-between items-center px-0.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
                  <Link to="/recover-account" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-900 text-sm"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md shadow-emerald-200 transition-all transform active:scale-[0.98] disabled:bg-slate-300 mt-2"
              >
                {loading ? 'Verifying...' : 'Access Portfolio'}
              </button>
            </form>

            <footer className="mt-8 text-center">
              <p className="text-slate-500 text-[12px] font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-emerald-600 text-[12px] font-bold hover:underline">Sign up</Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;