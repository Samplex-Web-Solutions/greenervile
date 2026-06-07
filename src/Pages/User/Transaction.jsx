import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../Components/Context/Authcontext'; // Verify this path matches your auth context
import { userService } from '../../Services/userService'; // Verify this path matches your service layer
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

  // Fetch live ledger records
  const fetchLedgerData = async () => {
    if (!user?.id) return;
    const res = await userService.getUserTransactions(user.id);
    if (res.success) {
      setTransactions(res.data || []);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLedgerData();
  }, [user?.id]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchLedgerData();
  };

  // Helper parser for mapping database fields to custom UI icons and readable strings
  const parseTransactionDetails = (tx) => {
    const dbType = tx.type ? tx.type.toUpperCase() : 'DEPOSIT';

    let displayType = 'Deposit';
    let displayCategory = 'Cash';
    let DisplayIcon = ArrowDownLeft;

    if (dbType.includes('WITHDRAWAL')) {
      displayType = 'Withdrawal';
      displayCategory = 'Cash';
      DisplayIcon = ArrowUpRight;
    } else if (dbType.includes('STOCKS')) {
      displayType = 'Invested';
      displayCategory = 'Stocks';
      DisplayIcon = BarChart3;
    } else if (dbType.includes('REAL_ESTATE')) {
      displayType = 'Invested';
      displayCategory = 'Real Estate';
      DisplayIcon = Building2;
    } else if (dbType.includes('GREEN_ENERGY')) {
      displayType = 'Invested';
      displayCategory = 'Green Energy';
      DisplayIcon = Zap;
    }

    return { displayType, displayCategory, DisplayIcon };
  };

  // Dynamic filter pipeline matching live user inputs
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

  // Real-time calculation of dashboard summary block metrics
  const summary = useMemo(() => {
    const deposits = transactions
      .filter(t => !t.type?.toUpperCase().includes('WITHDRAWAL') && t.status === 'success')
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const withdrawals = transactions
      .filter(t => t.type?.toUpperCase().includes('WITHDRAWAL') && t.status === 'success')
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const performance = deposits > 0 ? ((deposits - withdrawals) / deposits) * 100 : 0;
    return { deposits, withdrawals, performance };
  }, [transactions]);

  // Animation Configs
  const containerVars = {
    animate: { transition: { staggerChildren: 0.05 } }
  };

  const itemVars = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
  };

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
      <motion.div variants={itemVars} className="flex items-center justify-between mb-10 gap-6">
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
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <motion.div variants={itemVars} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl"><ArrowDownLeft size={20} className="text-emerald-600" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Deposits</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">${summary.deposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </motion.div>

        <motion.div variants={itemVars} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-slate-100 rounded-xl"><ArrowUpRight size={20} className="text-slate-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Withdrawals</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">${summary.withdrawals.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </motion.div>

        <motion.div variants={itemVars} className="bg-slate-900 p-8 rounded-[32px] shadow-xl text-white sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl"><TrendingUp size={20} className="text-emerald-400" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Margin Weight</span>
          </div>
          <h3 className="text-3xl font-bold text-emerald-400">
            {summary.performance >= 0 ? '+' : ''}{summary.performance.toFixed(2)}%
          </h3>
        </motion.div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div variants={itemVars} className="bg-white p-3 rounded-[28px] border border-slate-200 shadow-sm mb-8 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions by category, amount, date..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
          {['All', 'Deposit', 'Withdrawal', 'Invested'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-1 min-w-[120px] px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Transaction View Container */}
      <motion.div variants={itemVars} className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">

        {/* Mobile View Stream */}
        <div className="block lg:hidden divide-y divide-slate-100 px-6">
          <AnimatePresence mode='popLayout'>
            {filteredData.map((tx) => {
              const { displayType, displayCategory, DisplayIcon } = parseTransactionDetails(tx);
              const formattedDate = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <motion.div
                  layout
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${displayType === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      <DisplayIcon size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{displayCategory !== 'Cash' ? displayCategory : displayType}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{formattedDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black mb-1.5 ${displayType === 'Deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {displayType === 'Deposit' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${tx.status?.toLowerCase() === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        tx.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                      {tx.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Desktop View Table */}
{/* Desktop View */}
<div className="hidden lg:block w-full overflow-x-auto">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
        {/* Added intentional % based widths to force strict spacing alignment */}
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
          const formattedDate = new Date(tx.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });

          return (
            <motion.tr 
              layout 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              key={tx.id} 
              className="group hover:bg-slate-50/40 transition-colors"
            >
              {/* Cell 1: Detail */}
              <td className="px-10 py-6">
                <div className="flex items-center space-x-5">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-2xl transition-all ${displayType === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}
                  >
                    <DisplayIcon size={20} />
                  </motion.div>
                  <div>
                    <span className="block text-sm font-black text-slate-900">
                      {displayCategory !== 'Cash' ? displayCategory : displayType}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      ID: #TXN-{tx.id.toString().substring(0, 6).toUpperCase()}
                    </span>
                  </div>
                </div>
              </td>

              {/* Cell 2: Timeline */}
              <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-tight">
                {formattedDate}
              </td>

              {/* Cell 3: Amount */}
              <td className="px-10 py-6">
                <span className={`text-sm font-black ${displayType === 'Deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {displayType === 'Deposit' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </td>

              {/* Cell 4: Settlement (Matches text-right header perfectly) */}
              <td className="px-10 py-6 text-right">
                <span className={`inline-block text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.1em] border ${
                  tx.status?.toLowerCase() === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  tx.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-rose-50 text-rose-600 border-rose-100'
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
    </motion.div>
    </motion.div >
  );
};

export default TransactionHistory;