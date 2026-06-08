import React, { useEffect, useState } from 'react';
import { supabase } from '../../SuperBase/superbaseClient';
import { Check, X, Clock, Loader2, Landmark, TrendingUp, Zap, Building2 } from 'lucide-react';

const AdminInvestmentReview = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchInvestments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_investments')
        .select(`
          id,
          amount,
          status,
          created_at,
          user_id,
          profiles!user_investments_user_id_fkey (
            first_name,
            last_name,
            email
          ),
          market_investments!user_investments_asset_id_fkey (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Supabase Data Received:", data); // Check your browser console!
      setInvestments(data || []);
    } catch (err) {
      console.error("Error pulling investments log:", err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const handleAction = async (investmentId, userId, amount, statusAction) => {
        setProcessingId(investmentId);
        try {
            if (statusAction === 'success') {
                // --- 1. APPROVAL LOGIC ---
                // Since balance was automatically deducted at checkout, approving simply locks the status to Approved
                const { error: updateError } = await supabase
                    .from('user_investments')
                    .update({ status: 'Approved' })
                    .eq('id', investmentId);

                if (updateError) throw updateError;
                alert("Success! Investment asset contract authorized and activated.");

            } else if (statusAction === 'failed') {
                // --- 2. DECLINE / REJECT LOGIC ---
                // If declined, we reject the contract and return the locked amount back to the user's profile asset_balance

                // Fetch current profile balance to avoid race conditions
                const { data: profile, error: profileErr } = await supabase
                    .from('profiles')
                    .select('asset_balance')
                    .eq('id', userId)
                    .single();

                if (profileErr) throw new Error("Target investor profile could not be located.");

                const currentBalance = parseFloat(profile.asset_balance || 0);
                const refundedBalance = currentBalance + parseFloat(amount);

                // Update profile balance
                const { error: refundErr } = await supabase
                    .from('profiles')
                    .update({ asset_balance: refundedBalance })
                    .eq('id', userId);

                if (refundErr) throw refundErr;

                // Update transaction status row
                const { error: updateError } = await supabase
                    .from('user_investments')
                    .update({ status: 'Declined' })
                    .eq('id', investmentId);

                if (updateError) throw updateError;
                alert("Contract declined. Funds reverted fully to the investor's balance.");
            }

            // Re-sync data stream visual state
            await fetchInvestments();

        } catch (err) {
            alert(`Execution Error: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Real Estate': return <Building2 size={14} className="text-blue-500" />;
            case 'Stocks': return <TrendingUp size={14} className="text-amber-500" />;
            case 'Green Energy': return <Zap size={14} className="text-emerald-500" />;
            default: return <Landmark size={14} className="text-slate-500" />;
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex flex-col justify-center items-center min-h-[300px]">
                <Loader2 className="animate-spin text-slate-900 mb-2" size={24} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Investment Ledger...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 font-sans">
            <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Market Asset Verification Queue</h2>
                <p className="text-slate-400 text-xs font-medium">Review, authorize, or reject pending user asset investments and contract stakes.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                            <th className="py-4 px-4">Investor</th>
                            <th className="py-4 px-4">Asset Target</th>
                            <th className="py-4 px-4">Capital Allocated</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                </table>
                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                    {investments.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-all">
                            {/* Investor details */}
                            <td className="py-4 px-4">
                                {inv.profiles ? (
                                    <>
                                        <p className="font-bold text-slate-900">{inv.profiles.first_name} {inv.profiles.last_name}</p>
                                        <p className="text-slate-400 text-xs font-medium">{inv.profiles.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-slate-900">System Account User</p>
                                        <p className="text-slate-400 text-[10px] font-mono break-all">{inv.user_id}</p>
                                    </>
                                )}
                            </td>

                            {/* Target Asset Details gathered via select relation join */}
                            <td className="py-4 px-4 font-semibold text-slate-600">
                                {inv.market_investments ? (
                                    <div className="flex items-center gap-2">
                                        {getCategoryIcon(inv.market_investments.category)}
                                        <div>
                                            <p className="text-slate-900 font-bold">{inv.market_investments.name}</p>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{inv.market_investments.category}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 italic text-xs">Unknown Asset Contract</span>
                                )}
                            </td>

                            {/* Amount Allocated */}
                            <td className="py-4 px-4 font-black text-slate-900">
                                ${Number(inv.amount).toLocaleString()}
                            </td>

                            {/* Status Badges */}
                            <td className="py-4 px-4">
                                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${inv.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                        inv.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            'bg-rose-50 text-rose-700 border border-rose-100'
                                    }`}>
                                    {inv.status === 'Pending' && <Clock size={10} className="animate-pulse" />}
                                    <span>{inv.status}</span>
                                </span>
                            </td>

                            {/* Operations Actions */}
                            <td className="py-4 px-4 text-right">
                                {inv.status === 'Pending' ? (
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            disabled={processingId !== null}
                                            onClick={() => handleAction(inv.id, inv.user_id, inv.amount, 'success')}
                                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all flex items-center justify-center min-w-[32px] min-h-[32px]"
                                            title="Approve Stake Contract"
                                        >
                                            {processingId === inv.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                                        </button>
                                        <button
                                            disabled={processingId !== null}
                                            onClick={() => handleAction(inv.id, inv.user_id, inv.amount, 'failed')}
                                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all flex items-center justify-center min-w-[32px] min-h-[32px]"
                                            title="Decline & Refund Account"
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

                    {investments.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                                No active investment entries populate this tracking stream yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </div>
        </div>
    );
};

export default AdminInvestmentReview;