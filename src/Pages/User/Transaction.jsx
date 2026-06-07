import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, ArrowDownLeft, Search, 
  TrendingUp, Building2, Zap, BarChart3, Globe2
} from 'lucide-react';

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Animation Variants
  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const transactions = [
    { id: 1, type: 'Withdrawal', category: 'Cash', amount: '$170,400.00', rawAmount: 170400, date: 'Mar 09, 2026', status: 'Pending' },
    { id: 13, type: 'Invested', category: 'Real Estate', amount: '$123,200.00', rawAmount: 123200, date: 'Mar 04, 2026', status: 'Success', icon: Building2 },
    { id: 14, type: 'Invested', category: 'Stocks', amount: '$142,500.00', rawAmount: 142500, date: 'Feb 21, 2026', status: 'Success', icon: BarChart3 },
    { id: 2, type: 'Withdrawal', category: 'Cash', amount: '$65,000.00', rawAmount: 65000, date: 'Feb 18, 2026', status: 'Success' },
    { id: 3, type: 'Deposit', category: 'Cash', amount: '$340,600.00', rawAmount: 340600, date: 'Jan 24, 2026', status: 'Success' },
    { id: 4, type: 'Withdrawal', category: 'Cash', amount: '$98,700.00', rawAmount: 98700, date: 'Jan 14, 2026', status: 'Success' },
    { id: 15, type: 'Invested', category: 'Green Energy', amount: '$88,000.00', rawAmount: 88000, date: 'Jan 10, 2026', status: 'Success', icon: Zap },
    { id: 6, type: 'Deposit', category: 'Cash', amount: '$212,000.00', rawAmount: 212000, date: 'Dec 09, 2025', status: 'Success' },
    { id: 5, type: 'Withdrawal', category: 'Cash', amount: '$310,900.26', rawAmount: 310900.26, date: 'Dec 27, 2025', status: 'Success' },
    { id: 9, type: 'Deposit', category: 'Cash', amount: '$350,000.00', rawAmount: 350000, date: 'Nov 15, 2025', status: 'Success' },
    { id: 7, type: 'Withdrawal', category: 'Cash', amount: '$45,000.00', rawAmount: 45000, date: 'Dec 01, 2025', status: 'Success' },
    { id: 12, type: 'Deposit', category: 'Cash', amount: '$220,000.00', rawAmount: 120000, date: 'Oct 12, 2025', status: 'Success' },
    { id: 8, type: 'Withdrawal', category: 'Cash', amount: '$112,300.00', rawAmount: 112300, date: 'Nov 25, 2025', status: 'Success' },
    { id: 10, type: 'Withdrawal', category: 'Cash', amount: '$67,000.00', rawAmount: 67000, date: 'Nov 05, 2025', status: 'Success' },
  ];

  const filteredData = useMemo(() => {
    return transactions.filter(item => {
      const searchString = `${item.amount} ${item.date} ${item.category} ${item.type}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const summary = useMemo(() => {
    const deposits = transactions.filter(t => t.type === 'Deposit').reduce((acc, curr) => acc + curr.rawAmount, 0);
    const withdrawals = transactions.filter(t => t.type === 'Withdrawal').reduce((acc, curr) => acc + curr.rawAmount, 0);
    const performance = deposits > 0 ? ((deposits - withdrawals) / deposits) * 100 : 0;
    return { deposits, withdrawals, performance };
  }, [transactions]);

  return (
    <motion.div 
      initial="initial" animate="animate"
      className="p-4 md:p-8 lg:p-12 bg-slate-50 min-h-screen font-sans max-w-7xl mx-auto"
    >
      
      {/* Header Section */}
      <motion.div variants={itemVars} className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Transaction History</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe2 size={14} className="text-emerald-500" /> Professional Financial Ledger
          </p>
        </div>
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield Performance</span>
          </div>
          <h3 className="text-3xl font-bold text-emerald-400">+{summary.performance.toFixed(2)}%</h3>
        </motion.div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div variants={itemVars} className="bg-white p-3 rounded-[28px] border border-slate-200 shadow-sm mb-8 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
          {['All', 'Deposit', 'Withdrawal'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-1 min-w-[120px] px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                activeFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Transaction View */}
      <motion.div variants={itemVars} className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Mobile View */}
        <div className="block lg:hidden divide-y divide-slate-100 px-6">
          <AnimatePresence mode='popLayout'>
            {filteredData.map((tx) => (
              <motion.div 
                layout 
                key={tx.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-6 flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl ${tx.type === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {tx.icon ? <tx.icon size={18} /> : (tx.type === 'Deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">{tx.category !== 'Cash' ? tx.category : tx.type}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{tx.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black mb-1.5 ${tx.type === 'Deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'Deposit' ? '+' : '-'}{tx.amount}
                  </p>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Transaction Detail</th>
                <th className="px-10 py-6">Timeline</th>
                <th className="px-10 py-6">Amount (USD)</th>
                <th className="px-10 py-6 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode='popLayout'>
                {filteredData.map((tx) => (
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
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className={`p-3 rounded-2xl transition-all ${tx.type === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {tx.icon ? <tx.icon size={20} /> : (tx.type === 'Deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />)}
                        </motion.div>
                        <div>
                           <span className="block text-sm font-black text-slate-900">{tx.category !== 'Cash' ? tx.category : tx.type}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #TXN-{tx.id.toString().padStart(3, '0')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-tight">{tx.date}</td>
                    <td className="px-10 py-6">
                      <span className={`text-sm font-black ${tx.type === 'Deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'Deposit' ? '+' : '-'}{tx.amount}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.1em] border ${
                        tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransactionHistory;