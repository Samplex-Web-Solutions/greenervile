import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../Components/Context/ToastContext';
import { 
  CreditCard, Landmark, Bitcoin, ShieldCheck, 
  ArrowRight, CheckCircle2, Copy, Info, 
  ChevronLeft, Loader2, Timer, Building, Construction,
  Coins
} from 'lucide-react';

const Deposit = () => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null); // 'bank', 'card', 'crypto'
  const [cryptoType, setCryptoType] = useState(null); // 'erc20', 'btc', 'trc20'
  const [amount, setAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAddress, setActiveAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({ acc: '', swift: '', routing: '' });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Address Generation Logic
  useEffect(() => {
    if (step === 3) {
      const chars = '0123456789abcdefABCDEF';
      const btcChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      let addr = '';

      if (method === 'crypto') {
        if (cryptoType === 'erc20') {
          addr = '0x';
          for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * chars.length)];
        } else if (cryptoType === 'trc20') {
          addr = 'T';
          for (let i = 0; i < 33; i++) addr += chars[Math.floor(Math.random() * chars.length)];
        } else if (cryptoType === 'btc') {
          addr = Math.random() > 0.5 ? '1' : '3';
          for (let i = 0; i < 32; i++) addr += btcChars[Math.floor(Math.random() * btcChars.length)];
        }
        setActiveAddress(addr);
      }

      // Bank details generation remains same
      const accNum = Math.floor(1000000000 + Math.random() * 9000000000);
      const routing = Math.floor(100000000 + Math.random() * 900000000);
      setBankDetails({ acc: accNum, swift: `PVCA${Math.floor(100 + Math.random() * 899)}US6L`, routing });
    }
  }, [step, cryptoType, method]);

  useEffect(() => {
    if (step === 3 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied`, "success");
  };

  const handleFinalConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast(`Audit initiated for $${Number(amount).toLocaleString()} deposit`, "success");
      setStep(1);
      setAmount('');
      setCryptoType(null);
    }, 3000);
  };

  const cryptoOptions = [
    { id: 'erc20', name: 'USDT', network: 'Ethereum (ERC20)', icon: Coins, color: 'text-blue-500' },
    { id: 'btc', name: 'Bitcoin', network: 'BTC Network', icon: Bitcoin, color: 'text-amber-500' },
    { id: 'trc20', name: 'USDT', network: 'Tron (TRC20)', icon: Coins, color: 'text-emerald-500' },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-slate-50 min-h-screen flex justify-center font-sans">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Fund Your Account</h1>
          <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Tier One Minimum: <span className="text-slate-900">$10,000.00</span></p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center space-x-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {step > s ? <CheckCircle2 size={14} /> : s}
              </div>
              {s !== 3 && <div className={`w-10 h-[2px] mx-1 ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Main Method Selection */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Channel</h2>
              
              {/* Bank Transfer */}
              <button onClick={() => { setMethod('bank'); setStep(2); }} className="w-full bg-white p-6 rounded-[28px] border border-slate-200 flex items-center justify-between hover:border-slate-900 transition-all shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-2xl bg-blue-50 text-blue-600"><Landmark size={20} /></div>
                  <div className="text-left">
                    <p className="text-base font-black text-slate-900">Bank Transfer</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">California Pacific Trust</p>
                  </div>
                </div>
                <ChevronLeft size={18} className="rotate-180 text-slate-300" />
              </button>

              {/* Maintenance Card */}
              <button disabled className="w-full bg-slate-50 p-6 rounded-[28px] border border-slate-100 flex items-center justify-between opacity-60 cursor-not-allowed">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-2xl bg-slate-100 text-slate-300"><Construction size={20} /></div>
                  <div className="text-left">
                    <p className="text-base font-black text-slate-400">Card Payment</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">System Update</p>
                  </div>
                </div>
                <span className="text-[8px] font-black bg-rose-100 text-rose-600 px-2 py-1 rounded-md uppercase tracking-widest">Maintenance</span>
              </button>

              {/* Crypto (Multi-Option) */}
              <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-2xl bg-amber-50 text-amber-500"><Bitcoin size={20} /></div>
                  <div className="text-left">
                    <p className="text-base font-black text-slate-900">Cryptocurrency</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Auto-settlement enabled</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cryptoOptions.map((opt) => (
                    <button 
                      key={opt.id} 
                      onClick={() => { setMethod('crypto'); setCryptoType(opt.id); setStep(2); }}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all group"
                    >
                      <opt.icon size={18} className={`${opt.color} group-hover:text-white mb-2`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{opt.name}</span>
                      <span className="text-[7px] font-bold opacity-60 uppercase">{opt.id.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              
            </motion.div>
          )}

          {/* STEP 2: Amount Entry */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-8 md:p-12 rounded-[32px] border border-slate-200 shadow-sm">
              <button onClick={() => setStep(1)} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 mb-8 font-black text-[9px] uppercase tracking-widest transition-colors"><ChevronLeft size={16} /> Back</button>
              <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Enter Investment Amount</h2>
              <div className="relative mb-6">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                <input type="number" placeholder="0.00" className="w-full pl-12 pr-6 py-6 bg-slate-50 border-none rounded-2xl text-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 transition-colors ${amount >= 10000 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                <Info size={16} />
                <p className="text-[10px] font-black uppercase tracking-widest">Required Deposit: $10,000</p>
              </div>
              <button disabled={!amount || amount < 10000} onClick={() => setStep(3)} className="w-full py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 disabled:bg-slate-200 transition-all flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* STEP 3: Payment Details */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-6 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Escrow Total</p>
                    <h2 className="text-3xl font-black">${Number(amount).toLocaleString()}</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl">
                    <Timer size={14} className="text-amber-400" />
                    <span className="text-xs font-black font-mono tracking-tighter">{formatTime(timeLeft)}</span>
                  </div>
                </div>

                {/* BANK TRANSFER VIEW */}
                {method === 'bank' && (
                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bank Name</p>
                      <p className="text-[10px] font-black text-white">Pacific Venture Bank, CA</p>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Account Name</p>
                      <p className="text-xs font-black text-emerald-400">Greener Vile</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Account No.</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono font-bold">{bankDetails.acc}</p>
                        <button onClick={() => handleCopy(bankDetails.acc, "Account")} className="p-1.5 hover:bg-white/10 rounded-lg"><Copy size={12}/></button>
                      </div>
                    </div>
                  </div>
                )}

                {/* CRYPTO VIEW */}
                {method === 'crypto' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        {cryptoOptions.find(o => o.id === cryptoType)?.network}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Deposit Address</p>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-[10px] font-mono text-emerald-400 break-all leading-tight">{activeAddress}</code>
                        <button onClick={() => handleCopy(activeAddress, "Address")} className="p-3 bg-white/10 rounded-xl hover:bg-white/20"><Copy size={14} /></button>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleFinalConfirm} 
                  disabled={isProcessing}
                  className="w-full mt-10 py-5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  {isProcessing ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Confirm Transfer'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> Greener Vile Institutional Terminal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Deposit;