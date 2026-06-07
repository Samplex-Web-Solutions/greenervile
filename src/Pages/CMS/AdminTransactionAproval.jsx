import React, { useEffect, useState } from 'react';
import { adminService } from '../../Services/adminServices';
import { Check, X, Clock, Loader2, Landmark, Coins, Bitcoin } from 'lucide-react';

const AdminTransactionReview = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchLogs = async () => {
    const res = await adminService.getAllTransactions();
    if (res.success) {
      setTransactions(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

 const handleAction = async (txId, userId, amount, type, action) => {
    setProcessingId(txId);
    const res = await adminService.reviewTransaction(txId, userId, amount, type, action);
    if (res.success) {
      alert("Success! Transaction approved and wallet balance updated."); // <-- Add this confirmation
      await fetchLogs();
    } else {
      // This will now output the exact error string (e.g., "Target user profile not located.")
      alert(`Execution Error: ${res.error}`); 
    }
    setProcessingId(null);
  };

  // Maps the precise uppercase strings originating from your deposit forms
  const formatTxType = (type) => {
    if (!type) return 'Unknown Action';
    
    const normalized = type.toUpperCase();
    const mapping = {
      'BANK_WIRE': 'Bank Wire Transfer',
      'USDT_ERC20': 'USDT (Ethereum ERC20)',
      'USDT_TRC20': 'USDT (Tron TRC20)',
      'USDT_BTC': 'Bitcoin Network',
      'BTC': 'Bitcoin Network',
      'DEPOSIT': 'Cash Deposit',
      'WITHDRAWAL': 'Account Withdrawal',
      'INVEST_STOCKS': 'Stock Portfolio Allocation',
      'INVEST_REAL_ESTATE': 'Real Estate Capitalization',
      'INVEST_GREEN_ENERGY': 'Green Energy Project Stake'
    };
    return mapping[normalized] || type;
  };

  const getTypeIcon = (type) => {
    if (!type) return <Landmark size={14} />;
    const normalized = type.toUpperCase();
    if (normalized.includes('USDT')) return <Coins size={14} className="text-emerald-500" />;
    if (normalized.includes('BTC')) return <Bitcoin size={14} className="text-amber-500" />;
    return <Landmark size={14} className="text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-slate-900 mb-2" size={24} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Ledger Entries...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 font-sans">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Pending Verification Queue</h2>
        <p className="text-slate-400 text-xs font-medium">Review and authorize investor transactions, asset transfers, and withdrawals.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-wider">
              <th className="py-4 px-4">Investor</th>
              <th className="py-4 px-4">Transaction Type</th>
              <th className="py-4 px-4">Amount</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-all">
                <td className="py-4 px-4">
                  {tx.profiles ? (
                    <>
                      <p className="font-bold text-slate-900">{tx.profiles.first_name} {tx.profiles.last_name}</p>
                      <p className="text-slate-400 text-xs font-medium">{tx.profiles.email}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-900">System Account User</p>
                      <p className="text-slate-400 text-[10px] font-mono break-all">{tx.user_id}</p>
                    </>
                  )}
                </td>
                <td className="py-4 px-4 font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(tx.type)}
                    <span>{formatTxType(tx.type)}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-black text-slate-900">
                  ${Number(tx.amount).toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    tx.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    tx.status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                    'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {tx.status === 'pending' && <Clock size={10} className="animate-pulse" />}
                    <span>{tx.status}</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {tx.status === 'pending' ? (
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        disabled={processingId !== null}
                        onClick={() => handleAction(tx.id, tx.user_id, tx.amount, tx.type, 'success')}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all flex items-center justify-center min-w-[32px] min-h-[32px]"
                        title="Approve & Allocate"
                      >
                        {processingId === tx.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                      </button>
                      <button 
                        disabled={processingId !== null}
                        onClick={() => handleAction(tx.id, tx.user_id, tx.amount, tx.type, 'failed')}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all flex items-center justify-center min-w-[32px] min-h-[32px]"
                        title="Decline Transaction"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">Archived</span>
                  )}
                </td>
              </tr>
            ))}
            
            {transactions.length === 0 && (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                  No historical entries populate this tracking stream yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactionReview;