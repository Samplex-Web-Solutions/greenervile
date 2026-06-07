import React, { useState } from 'react';
import { useToast } from '../../Components/Context/ToastContext';

const WithdrawalPage = () => {
  const { showToast } = useToast();
  const [method, setMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState({
    accountName: '', accountNumber: '', bankName: '', 
    swiftCode: '', cryptoAddress: '', network: 'ERC20'
  });

  const handleWithdraw = (e) => {
    e.preventDefault();
    showToast(`Pending Withdrawal not complete!`);
    setAmount('');
    console.log("Withdrawal Data Sent:", { method, amount, details });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mt-4 md:mt-1 mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F172A] p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Withdraw Funds</h2>
          <p className="opacity-80">Available for withdrawal: <span className="font-mono text-xl">$1,632,080.00</span></p>
        </div>

        {/* Method Selector */}
        <div className="flex border-b">
          <button 
            onClick={() => setMethod('bank')}
            className={`flex-1 py-4 font-semibold transition-all ${method === 'bank' ? 'border-b-4 border-[#0F172A] text-[#0F172A]' : 'text-gray-400'}`}
          >
            Bank Transfer
          </button>
          <button 
            onClick={() => setMethod('crypto')}
            className={`flex-1 py-4 font-semibold transition-all ${method === 'crypto' ? 'border-b-4 border-[#0F172A] text-[#0F172A]' : 'text-gray-400'}`}
          >
            Crypto Wallet
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="p-6 min-h-max space-y-5">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Amount to Withdraw (USD)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#0F172A] outline-none"
              placeholder="0.00"
              required
            />
          </div>

          {/* Dynamic Fields based on Method */}
          {method === 'bank' ? (
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Account Name" 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F172A]"
                required 
                onChange={(e) => setDetails({...details, accountName: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Account Number / IBAN" 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F172A]"
                required 
                onChange={(e) => setDetails({...details, accountNumber: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Bank Name" 
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F172A]"
                  required 
                  onChange={(e) => setDetails({...details, bankName: e.target.value})} 
                />
                <input 
                  type="text" 
                  placeholder="SWIFT/BIC Code" 
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F172A]"
                  onChange={(e) => setDetails({...details, swiftCode: e.target.value})} 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-[#0F172A]"
                onChange={(e) => setDetails({...details, network: e.target.value})}
              >
                <option value="ERC20">USDT (ERC20)</option>
                <option value="TRC20">USDT (TRC20)</option>
                <option value="BTC">Bitcoin (BTC)</option>
              </select>
              <input 
                type="text" 
                placeholder="Wallet Address" 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F172A]"
                required 
                onChange={(e) => setDetails({...details, cryptoAddress: e.target.value})} 
              />
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1e293b] transition-all shadow-lg active:scale-95"
          >
            Submit Withdrawal Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalPage;