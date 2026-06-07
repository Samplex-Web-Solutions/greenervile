import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Components/Context/Authcontext'; // Adjust this path if needed
import { userService } from '../../Services/userService'; // Adjust this path if needed
import { useToast } from '../../Components/Context/ToastContext';
import { Loader2, Wallet, Building, ArrowLeftRight } from 'lucide-react';

const WithdrawalPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [method, setMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [details, setDetails] = useState({
    accountName: '', accountNumber: '', bankName: '', 
    swiftCode: '', cryptoAddress: '', network: 'ERC20'
  });

  // Pull real-time balance metrics on mount
  const fetchCurrentWallet = async () => {
    if (!user?.id) return;
    const res = await userService.getUserProfile(user.id);
    if (res.success && res.data) {
      // Pulling directly from your primary cash asset wallet column
      setAvailableBalance(Number(res.data.asset_balance || 0));
    }
    setLoadingBalance(false);
  };

  useEffect(() => {
    fetchCurrentWallet();
  }, [user?.id]);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const withdrawalAmount = Number(amount);

    // 1. Client-side protection barrier logic
    if (withdrawalAmount <= 0) {
      showToast("Please enter a valid amount greater than 0.");
      return;
    }

    if (withdrawalAmount > availableBalance) {
      showToast(`Insufficient balance. You can only withdraw up to $${availableBalance.toLocaleString()}`);
      return;
    }

    setSubmitting(true);

    // 2. Package metadata payload based on layout toggle
    const selectedMethodString = method === 'bank' ? 'BANK_WIRE' : `CRYPTO_${details.network}`;
    const paymentDetailsPayload = method === 'bank' ? {
      account_name: details.accountName,
      account_number: details.accountNumber,
      bank_name: details.bankName,
      swift_code: details.swiftCode
    } : {
      crypto_address: details.cryptoAddress,
      network: details.network
    };

    // 3. Dispatch straight onto the Supabase engine
    const res = await userService.requestWithdrawal(
      user.id, 
      withdrawalAmount, 
      selectedMethodString, 
      paymentDetailsPayload
    );

    if (res.success) {
      showToast("Withdrawal request submitted successfully! Awaiting review.");
      setAmount('');
      // Optimistically deduct balance locally or refresh profile
      setAvailableBalance(prev => prev - withdrawalAmount);
    } else {
      showToast(`Submission failure: ${res.error}`);
    }

    setSubmitting(false);
  };

  if (loadingBalance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-3">
        <Loader2 className="animate-spin text-[#0F172A]" size={32} />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Validating security context...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-xl mt-4 md:mt-1 mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Display */}
        <div className="bg-[#0F172A] p-8 text-white text-center relative">
          <div className="absolute top-4 right-4 opacity-10">
            <ArrowLeftRight size={80} />
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase mb-1">Withdraw Funds</h2>
          <p className="opacity-70 text-xs font-semibold uppercase tracking-wider mb-2">Available Liquid Balance</p>
          <p className="font-mono text-3xl font-bold text-emerald-400">
            ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
          <button 
            type="button"
            onClick={() => setMethod('bank')}
            className={`flex-1 py-4 font-bold text-xs uppercase tracking-wider transition-all rounded-2xl flex items-center justify-center gap-2 ${
              method === 'bank' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Building size={16} /> Bank Transfer
          </button>
          <button 
            type="button"
            onClick={() => setMethod('crypto')}
            className={`flex-1 py-4 font-bold text-xs uppercase tracking-wider transition-all rounded-2xl flex items-center justify-center gap-2 ${
              method === 'crypto' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Wallet size={16} /> Crypto Wallet
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="p-6 space-y-5">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Amount to Withdraw (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
              <input 
                type="number" 
                step="any"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] outline-none transition-all"
                placeholder="0.00"
                required
                disabled={submitting}
              />
            </div>
          </div>

          {/* Dynamic Input Matrix based on Method Selection */}
          {method === 'bank' ? (
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Account Name" 
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/5 font-semibold text-sm transition-all"
                required 
                disabled={submitting}
                value={details.accountName}
                onChange={(e) => setDetails({...details, accountName: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Account Number / IBAN" 
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/5 font-semibold text-sm transition-all"
                required 
                disabled={submitting}
                value={details.accountNumber}
                onChange={(e) => setDetails({...details, accountNumber: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Bank Name" 
                  className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/5 font-semibold text-sm transition-all"
                  required 
                  disabled={submitting}
                  value={details.bankName}
                  onChange={(e) => setDetails({...details, bankName: e.target.value})} 
                />
                <input 
                  type="text" 
                  placeholder="SWIFT/BIC Code" 
                  className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/5 font-semibold text-sm transition-all"
                  disabled={submitting}
                  value={details.swiftCode}
                  onChange={(e) => setDetails({...details, swiftCode: e.target.value})} 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <select 
                className="w-full p-4 border border-gray-200 rounded-2xl bg-white outline-none focus:border-[#0F172A] font-semibold text-sm transition-all"
                value={details.network}
                onChange={(e) => setDetails({...details, network: e.target.value})}
                disabled={submitting}
              >
                <option value="ERC20">USDT (Ethereum ERC20)</option>
                <option value="TRC20">USDT (TRON TRC20)</option>
                <option value="BTC">Bitcoin (Native Network)</option>
              </select>
              <input 
                type="text" 
                placeholder="Secure Wallet Address" 
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/5 font-mono text-sm transition-all"
                required 
                disabled={submitting}
                value={details.cryptoAddress}
                onChange={(e) => setDetails({...details, cryptoAddress: e.target.value})} 
              />
            </div>
          )}

          {/* Action Trigger Button */}
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1e293b] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Processing Secure Transfer...</span>
              </>
            ) : (
              <span>Submit Withdrawal Request</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalPage;