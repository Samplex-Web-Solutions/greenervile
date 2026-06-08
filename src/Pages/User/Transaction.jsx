import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../Components/Context/Authcontext'; 
import { supabase } from '../../SuperBase/superbaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownLeft, Search,
  TrendingUp, Building2, Zap, BarChart3, Globe2, Loader2, RefreshCw
} from 'lucide-react';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Combined fetch logic: Pulls standard ledger entries AND asset contracts
  const fetchLedgerData = async () => {
    if (!user?.id) return;
    try {
      // 1. Fetch Standard Cash Logs (Deposits / Withdrawals)
      const { data: standardTx, error: err1 } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      // 2. Fetch Market Asset Allocation Logs (Linked to Market Categories)
      const { data: marketTx, error: err2 } = await supabase
        .from('user_investments')
        .select(`
          id,
          amount,
          status,
          created_at,
          market_investments (
            name,
            category
          )
        `)
        .eq('user_id', user.id);

      if (err1) throw err1;
      if (err2) throw err2;

      // 3. Normalize market investments to match your transaction schema structures
      const normalizedMarketTx = (marketTx || []).map(item => ({
        id: `INV-${item.id}`,
        amount: item.amount,
        status: item.status,
        created_at: item.created_at,
        // Save the structural type based on database metadata category matches
        type: item.market_investments?.category === 'Stocks' ? 'INVEST_STOCKS' :
              item.market_investments?.category === 'Real Estate' ? 'INVEST_REAL_ESTATE' :
              item.market_investments?.category === 'Green Energy' ? 'INVEST_GREEN_ENERGY' : 'INVESTMENT',
        asset_name: item.market_investments?.name
      }));

      // 4. Merge streams together and order by time execution
      const mergedStream = [...(standardTx || []), ...normalizedMarketTx].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setTransactions(mergedStream);
    } catch (error) {
      console.error("Ledger compilation crash:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, [user?.id]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchLedgerData();
  };

  // Maps database transaction tags to custom premium graphics layouts
  const parseTransactionDetails = (tx) => {
    const dbType = tx.type ? tx.type.toUpperCase() : 'DEPOSIT';

    let displayType = 'Deposit';
    let displayCategory = tx.asset_name || 'Cash';
    let DisplayIcon = ArrowDownLeft;

    if (dbType.includes('WITHDRAWAL')) {
      displayType = 'Withdrawal';
      displayCategory = 'Cash';
      DisplayIcon = ArrowUpRight;
    } else if (dbType.includes('STOCKS')) {
      displayType = 'Invested';
      displayCategory = tx.asset_name || 'Stock Portfolio';
      DisplayIcon = BarChart3;
    } else if (dbType.includes('REAL_ESTATE')) {
      displayType = 'Invested';
      displayCategory = tx.asset_name || 'Real Estate';
      DisplayIcon = Building2;
    } else if (dbType.includes('GREEN_ENERGY')) {
      displayType = 'Invested';
      displayCategory = tx.asset_name || 'Green Energy Stake';
      DisplayIcon = Zap;
    }

    return { displayType, displayCategory, DisplayIcon };
  };

  const filteredData = useMemo(() => {
    return transactions.filter(item => {
      const { displayType, displayCategory } = parseTransactionDetails(item);
      const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const formattedAmount = `$${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

      const searchString = `${formattedAmount} ${formattedDate} ${displayCategory} ${displayType} ${item.status}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || displayType === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, transactions]);

  const summary = useMemo(() => {
    const deposits = transactions
      .filter(t => !t.type?.toUpperCase().includes('WITHDRAWAL') && t.status?.toLowerCase() === 'success')
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const withdrawals = transactions
      .filter(t => t.type?.toUpperCase().includes('WITHDRAWAL') && t.status?.toLowerCase() === 'success')
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const performance = deposits > 0 ? ((deposits - withdrawals) / deposits) * 100 : 0;
    return { deposits, withdrawals, performance };
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 space-y-4">
        <Loader2 className="animate-spin text-emerald-500" size={36} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Decrypting ledger pipeline...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial" animate="animate"
      className="p-4 md:p-8 lg:p-12 bg-slate-50 min-h-screen font-sans max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Transaction History</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe2 size={14} className="text-emerald-500" /> Professional Financial Ledger
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl shadow-sm hover:shadow transition-all"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl"><ArrowDownLeft size={20} className="text-emerald-600" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Deposits</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">${summary.deposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-slate-100 rounded-xl"><ArrowUpRight size={20} className="text-slate-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Withdrawals</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">${summary.withdrawals.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl text-white sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl"><TrendingUp size={20} className="text-emerald-400" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Margin Weight</span>
          </div>
          <h3 className="text-3xl font-bold text-emerald-400">
            {summary.performance >= 0 ? '+' : ''}{summary.performance.toFixed(2)}%
          </h3>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-[28px] border border-slate-200 shadow-sm mb-8 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions by category, amount, date..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
          {['All', 'Deposit', 'Withdrawal', 'Invested'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-1 min-w-[120px] px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* View Container */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Desktop View Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6 w-[40%]">Transaction Detail</th>
                <th className="px-10 py-6 w-[20%]">Timeline</th>
                <th className="px-10 py-6 w-[20%]">Amount (USD)</th>
                <th className="px-10 py-6 w-[20%] text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode='popLayout'>
                {filteredData.map((tx) => {
                  const { displayType, displayCategory, DisplayIcon } = parseTransactionDetails(tx);
                  const formattedDate = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <motion.tr 
                      layout 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      key={tx.id} 
                      className="group hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-5">
                          <div className={`p-3 rounded-2xl transition-all ${displayType === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                            <DisplayIcon size={20} />
                          </div>
                          <div>
                            <span className="block text-sm font-black text-slate-900 line-clamp-1">{displayCategory}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {tx.id.toString().startsWith('INV-') ? 'ASSET ALLOCATION' : `ID: #TXN-${tx.id.toString().substring(0, 6).toUpperCase()}`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-tight">{formattedDate}</td>
                      <td className="px-10 py-6">
                        <span className={`text-sm font-black ${displayType === 'Deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {displayType === 'Deposit' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`inline-block text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.1em] border ${
                          tx.status?.toLowerCase() === 'approved' || tx.status?.toLowerCase() === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          tx.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No matching records located in this view structure.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory;