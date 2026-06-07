import React, { useState } from 'react';
import { useAuth } from '../../Components/Context/Authcontext';
import { useToast } from '../../Components/Context/ToastContext';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, 
  ShieldCheck, CreditCard, Building2, 
  Globe, Camera, Save, AlertCircle,
  ChevronRight, KeyRound, Landmark,
  FileCheck, Loader2
} from 'lucide-react';

const AccountSettings = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile '); // Defaulting to KYC for preview
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile settings updated successfully!", "success");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-slate-50 min-h-screen font-sans">
      
      <div className="max-w-6xl mx-auto mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Account Settings</h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">Manage your identity, payouts, and verification status</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex lg:flex-col flex-row gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
          {[
            { id: 'profile', label: 'Identity', icon: User },
            { id: 'kyc', label: 'Verification', icon: FileCheck },
            { id: 'withdrawal', label: 'Payouts', icon: Globe },
            { id: 'security', label: 'Security', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center justify-between px-6 py-4 rounded-2xl transition-all min-w-[140px] lg:min-w-0 ${
                activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <tab.icon size={18} className={activeTab === tab.id ? 'text-emerald-400' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </div>
              <ChevronRight size={14} className={`hidden lg:block ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-9 bg-white rounded-[32px] md:rounded-[48px] border border-slate-200 shadow-sm p-6 md:p-10 lg:p-14"
        >
          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 pb-10 text-center md:text-left">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-900 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-emerald-400 text-3xl font-black">
                    {profile?.username?.charAt(0) || 'U'}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {profile?.username || 'Authenticated User'}
                  </h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Tier 1 Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <InputField label="First Name" placeholder="Enter first name" icon={User} />
                <InputField label="Last Name" placeholder="Enter last name" icon={User} />
                <InputField label="Email Address" placeholder="Email Address" icon={Mail} />
                <InputField label="Phone Number" placeholder="+1 (000) 000-0000" icon={Phone} />
              </div>
            </div>
          )}

          {/* VERIFICATION SECTION (ONLY SHOWING PROCESSING) */}
          {activeTab === 'kyc' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">KYC Documents</h3>
                <span className="bg-amber-50 text-amber-600 border border-amber-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Processing
                </span>
              </div>

              <div className="p-8 md:p-16 bg-[#0F172A] rounded-[40px] text-center relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-400/20">
                    <Loader2 className="text-amber-400 animate-spin" size={28} />
                  </div>
                  
                  <h3 className="text-white font-black uppercase tracking-[0.1em] text-xl md:text-2xl mb-4">
                    Document Processing
                  </h3>
                  
                  <p className="text-slate-400 text-xs md:text-sm max-w-sm mx-auto leading-relaxed font-medium">
                    Your identity documents have been safely received. Our compliance team is currently reviewing your submission. This usually takes <span className="text-slate-200">**12-24 hours**</span>.
                  </p>

                  <div className="mt-10 flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-400 text-[9px] font-black uppercase tracking-[0.2em]">Upload Section Locked</span>
                  </div>
                </div>

                {/* Abstract Background Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                  <FileCheck size={320} className="text-white" />
                </div>
              </div>
            </div>
          )}

          {/* WITHDRAWAL SECTION */}
          {activeTab === 'withdrawal' && (
            <div className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <InputField label="Bank Name" placeholder="e.g. JPMorgan Chase" icon={Building2} />
                <InputField label="Bank Country" placeholder="International Branch Location" icon={Landmark} />
                <InputField label="IBAN / Account Number" placeholder="Global account format" icon={CreditCard} />
                <InputField label="SWIFT / BIC Code" placeholder="8 or 11 characters" icon={Globe} />
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <InputField label="Current Security Key" type="password" icon={Lock} placeholder="••••••••" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 pt-4 border-t border-slate-50">
                <InputField label="New Security Key" type="password" icon={Lock} />
                <InputField label="Confirm New Key" type="password" icon={Lock} />
              </div>
            </div>
          )}

          {/* FOOTER ACTION (Hidden on KYC tab) */}
          {activeTab !== 'kyc' && (
            <div className="mt-14 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span>Cloud Profile Synchronized</span>
              </div>
              
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full md:w-auto flex items-center justify-center space-x-4 px-12 py-4 rounded-2xl font-black transition-all shadow-xl ${
                  isSaving ? 'bg-slate-400 cursor-not-allowed scale-95' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                }`}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} className="text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em]">Update Profile</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, type = "text", placeholder }) => (
  <div className="space-y-2.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={17} />
      </div>
      <input 
        type={type}
        autoComplete="off"
        placeholder={placeholder}
        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-100 focus:ring-[6px] focus:ring-slate-50 transition-all outline-none placeholder:text-slate-300 placeholder:font-medium"
      />
    </div>
  </div>
);

export default AccountSettings;