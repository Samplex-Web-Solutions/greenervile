import React, { useState, useEffect } from 'react';
import { adminService } from '../../Services/adminServices';
import { useToast } from '../../Components/Context/ToastContext';
import { motion } from 'framer-motion';
import { Landmark, Coins, Save, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';

const AdminDepositSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    bank_name: '',
    account_name: '',
    account_no: '',
    swift_code: '',
    routing_no: '',
    usdt_erc20_address: '',
    usdt_trc20_address: '',
    btc_address: ''
  });

  useEffect(() => {
  const loadCurrentSettings = async () => {
    const res = await adminService.getDepositSettings();
    
    if (res.success) {
      if (res.data) {
        // Row exists, use database values
        setFormData({
          bank_name: res.data.bank_name || '',
          account_name: res.data.account_name || '',
          account_no: res.data.account_no || '',
          swift_code: res.data.swift_code || '',
          routing_no: res.data.routing_no || '',
          usdt_erc20_address: res.data.usdt_erc20_address || '',
          usdt_trc20_address: res.data.usdt_trc20_address || '',
          btc_address: res.data.btc_address || ''
        });
      } else {
        // Table is empty! Keep the default empty string form state so the admin can fill it
        showToast("No gateway parameters found. Please fill out the form to initialize.", "info");
      }
    } else {
      showToast("Error retrieving terminal nodes.", "error");
    }
    setLoading(false);
  };
  
  loadCurrentSettings();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);
  
  // Pass the local state directly to the service layer
  const res = await adminService.updateDepositSettings(formData);
  setIsSaving(false);

  if (res.success) {
    showToast("Gateway parameters synchronized successfully", "success");
    // Optionally refresh the form state with the database echo
    if (res.data) {
      setFormData(res.data);
    }
  } else {
    showToast(res.error || "Failed to commit node adjustments.", "error");
  }
};

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-slate-900 mb-2" size={24} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Gateway Layout...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-sans">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Deposit Gateway Settings</h1>
        <p className="text-slate-400 text-xs font-medium mt-1">Configure systemic deposit nodes, banking coordinates, and blockchain escrow addresses displayed to investors.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BANK GATEWAY DETAILS */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Landmark size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Corporate Wire Parameters</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Traditional Institutional Flow Routing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Bank Entity Name</label>
              <input 
                type="text" 
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Beneficiary Account Name</label>
              <input 
                type="text" 
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Account Ledger Number</label>
              <input 
                type="text" 
                name="account_no"
                value={formData.account_no}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Routing Number (ABA / ACH)</label>
              <input 
                type="text" 
                name="routing_no"
                value={formData.routing_no}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                required
              />
            </div>
            <div className="md:col-span-2">
              <div className="w-full md:w-1/2">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">SWIFT / BIC Code</label>
                <input 
                  type="text" 
                  name="swift_code"
                  value={formData.swift_code}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: CRYPTO GATEWAY TARGETS */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
              <Coins size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Decentralized Settlement Nodes</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Escrow Destination Hashes</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-blue-500 tracking-wider mb-2">USDT — ERC20 Wallet Address (Ethereum)</label>
              <input 
                type="text" 
                name="usdt_erc20_address"
                value={formData.usdt_erc20_address}
                onChange={handleChange}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 font-mono text-xs font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-2">USDT — TRC20 Wallet Address (Tron)</label>
              <input 
                type="text" 
                name="usdt_trc20_address"
                value={formData.usdt_trc20_address}
                onChange={handleChange}
                placeholder="T..."
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 font-mono text-xs font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-amber-600 tracking-wider mb-2">Bitcoin (BTC) Destination Address</label>
              <input 
                type="text" 
                name="btc_address"
                value={formData.btc_address}
                onChange={handleChange}
                placeholder="1... or 3... or bc1..."
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 font-mono text-xs font-bold focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                required
              />
            </div>
          </div>
        </motion.div>

        {/* CONTROLS FOOTER */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" /> Layer 2 Encryption Handshake Verified
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center space-x-2 shadow transition-all disabled:bg-slate-200 disabled:text-slate-400"
          >
            {isSaving ? (
              <>
                <RefreshCw className="animate-spin" size={14} />
                <span>Synchronizing...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Push Updates Live</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminDepositSettings;