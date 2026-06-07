import React from 'react';
import { useAuth } from '../../Components/Context/Authcontext';
import { motion } from 'framer-motion';
import {
  Wallet, TrendingUp, ArrowUpRight,
  PieChart, Clock, ArrowDownLeft, Mail, 
  LineChart, ShieldAlert, BarChart3, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, subtext, icon: Icon, color, bg, isPositive, variants }) => (
  <motion.div 
    variants={variants}
    whileHover={{ y: -5 }}
    className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm relative group"
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className={`p-2 rounded-lg ${bg}`}>
        <Icon size={18} className={color} />
      </div>
      <span className="text-xs md:text-sm font-semibold text-slate-400">{label}</span>
    </div>
    <div className="flex items-baseline space-x-2 md:space-x-3 overflow-hidden">
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-none truncate">{value}</h3>
      {isPositive !== undefined && (
        <span className={`text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg flex-shrink-0 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? '↑' : '↓'} 21.8%
        </span>
      )}
    </div>
    <p className={`text-[9px] md:text-[10px] font-bold mt-2 uppercase tracking-wider ${color}`}>{subtext}</p>
  </motion.div>
);

const AssetDonut = ({ assets = [], totalValue = "$0.00" }) => {
  let cumulativePercentage = 0;
  const gradientSlices = assets.map((asset) => {
    const start = cumulativePercentage;
    const percentageValue = parseInt(asset.percentage) || 0;
    const end = start + percentageValue;
    cumulativePercentage = end;

    const colorMap = {
      'bg-emerald-500': '#10b981',
      'bg-blue-500': '#3b82f6',
      'bg-amber-500': '#f59e0b',
      'bg-slate-300': '#cbd5e1'
    };

    return `${colorMap[asset.color] || '#cbd5e1'} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="bg-white rounded-[32px] border border-slate-200  p-6 md:p-8 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] md:text-xs">Portfolio Breakdown</h3>
        <PieChart className="text-slate-300" size={18} />
      </div>

      <div className="relative flex justify-center mb-6 md:mb-8">
        <div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full relative flex items-center justify-center shadow-inner"
          style={{ background: `conic-gradient(${gradientSlices})` }}
        >
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="text-center">
              <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Total Value</p>
              <p className="text-lg md:text-xl font-bold text-slate-900">{totalValue}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {assets.map((asset, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${asset.color}`} />
            <span className="text-[10px] md:text-[11px] font-bold text-slate-600 truncate">{asset.name} ({asset.percentage})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ManagerCard = ({ name, email, image, role }) => (
  <div className="bg-slate-900 rounded-[32px] overflow-hidden text-white border border-slate-800 shadow-xl h-full flex flex-col">
    <div className="h-48 md:h-64 w-full relative">
      <img src={image} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
    </div>
    <div className="p-6 md:p-8 flex-grow flex flex-col">
      <p className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Account Manager</p>
      <h4 className="text-xl md:text-2xl font-bold mb-1">{name}</h4>
      <p className="text-[10px] md:text-xs text-slate-400 font-medium mb-6 md:mb-8">{role}</p>
      <div className="mt-auto">
        <a href={`mailto:${email}`} className="flex items-center justify-center space-x-3 p-3 md:p-4 bg-white/5 rounded-2xl hover:bg-emerald-600 transition-all group overflow-hidden">
          <Mail size={14} className="group-hover:text-white text-emerald-400 flex-shrink-0" />
          <span className="text-[10px] md:text-xs font-bold text-slate-300 group-hover:text-white truncate">{email}</span>
        </a>
      </div>
    </div>
  </div>
);

const MonthlyActivityChart = ({ transactions }) => {
  const monthlyData = transactions.reduce((acc, curr) => {
    const dateParts = curr.date.split(' ');
    const monthYear = `${dateParts[0]} ${dateParts[2]}`;
    if (!acc[monthYear]) acc[monthYear] = { deposit: 0, withdrawal: 0 };
    if (curr.type === 'Deposit') acc[monthYear].deposit += curr.rawAmount;
    else acc[monthYear].withdrawal += curr.rawAmount;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyData);
  const allValues = sortedMonths.flatMap(m => [monthlyData[m].deposit, monthlyData[m].withdrawal]);
  const maxVal = Math.max(...allValues);

  return (
    <div className="space-y-8 md:y-10 w-full">
      {sortedMonths.map((month, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
             <div className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-widest">
                {month}
             </div>
             <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">
                {monthlyData[month].deposit > monthlyData[month].withdrawal ? 'Positive Growth' : 'High Outflow'}
             </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(monthlyData[month].deposit / maxVal) * 100}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <div className="w-16 md:w-24 text-right text-[9px] md:text-[10px] font-bold text-emerald-600">
                +${monthlyData[month].deposit.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(monthlyData[month].withdrawal / maxVal) * 100}%` }}
                  className="h-full bg-slate-300 rounded-full"
                />
              </div>
              <div className="w-16 md:w-24 text-right text-[9px] md:text-[10px] font-bold text-slate-500">
                -${monthlyData[month].withdrawal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { profile } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const dashboardData = {
    stats: [
      { label: 'Asset Balance', value: '$1,632,080.00', subtext: 'AVAILABLE CAPITAL', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Active Investment', value: '$223,200.00', subtext: 'CAPITAL IN MARKET', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Total Profit/Loss', value: '+$48,657.60', subtext: 'NET PORTFOLIO GAIN', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', isPositive: true },
    ],
    assets: [
      { name: 'Stocks', percentage: '40%', color: 'bg-emerald-500' },
      { name: 'Energy', percentage: '30%', color: 'bg-amber-500' },
      { name: 'Real Estate', percentage: '20%', color: 'bg-blue-500' },
      { name: 'Cash', percentage: '10%', color: 'bg-slate-300' },
    ],
    transactions: [
     {type: 'Withdrawal',amount: '$170,400.00', rawAmount: 170400, date: 'Mar 09, 2026', status: 'Pending' },
    { type: 'Real Estate',amount: '$123,200.00', rawAmount: 123200, date: 'Mar 04, 2026', status: 'Success', }, 
    { type: 'Stocks', amount: '$142,500.00', rawAmount: 142500, date: 'Feb 21, 2026', status: 'Success', },
    { type: 'Withdrawal',amount: '$65,000.00', rawAmount: 65000, date: 'Feb 18, 2026', status: 'Success' },
    { type: 'Deposit', amount: '$340,600.00', rawAmount: 340600, date: 'Jan 24, 2026', status: 'Success' },
    { type: 'Withdrawal',amount: '$98,700.00', rawAmount: 98700, date: 'Jan 14, 2026', status: 'Success' },
       ],
    manager: {
      name: "Charlotte Arthur",
      email: "charlottearthur8080@gmail.com",
      role: "Senior Account Officer",
      image: "https://dnpgmymexiiagsocjyyv.supabase.co/storage/v1/object/public/public-assets/manager.webp"
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Portfolio Insights</h1>
          <p className="text-slate-500 text-[11px] md:text-sm font-medium uppercase tracking-wider">Hi, {profile?.first_name || 'Partner'}{" "}{profile?.last_name}</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center space-x-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 w-fit">
          <ShieldAlert size={14} className="text-amber-600" />
          <span className="text-[9px] md:text-[10px] font-black text-amber-700 uppercase tracking-widest">Verification - Pending</span>
        </motion.div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {dashboardData.stats.map((stat, index) => (
          <StatCard key={index} {...stat} variants={itemVariants} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <motion.div variants={itemVariants}>
            <AssetDonut assets={dashboardData.assets} totalValue="$1,632,080" />
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] md:text-xs">Recent Transactions</h3>
              <Link to="/transaction" className="text-[9px] md:text-[10px] font-black text-emerald-600 hover:underline tracking-widest uppercase">View All</Link>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4 md:pl-8 md:text-center text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dashboardData.transactions.map((tx, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${tx.type === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                            {tx.type === 'Deposit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-medium text-slate-500">{tx.date}</td>
                      <td className={`py-4 text-sm font-black ${tx.type === 'Deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.amount}</td>
                      <td className="py-4 text-right">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Transaction List) */}
            <div className="md:hidden space-y-4">
              {dashboardData.transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${tx.type === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-600 border border-slate-200 shadow-sm'}`}>
                      {tx.type === 'Deposit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-none mb-1">{tx.type}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black mb-1 ${tx.type === 'Deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.amount}</p>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${tx.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="lg:col-span-1 h-max">
          <ManagerCard {...dashboardData.manager} />
        </motion.div>
      </div>

      {/* Monthly Chart */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] md:text-xs">Performance History</h3>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mt-1">Monthly Flow Comparison</p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit">
            <button className="px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black uppercase bg-white shadow-sm rounded-lg text-slate-700">Detailed View</button>
          </div>
        </div>
        
        <div className="bg-slate-50/30 p-4 md:p-8 rounded-[24px] border border-slate-100">
            <MonthlyActivityChart transactions={dashboardData.transactions} />
        </div>
        
        <div className="mt-8 md:mt-10 flex items-center justify-start space-x-6 md:space-x-8 border-t border-slate-50 pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Deposit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Withdrawal</span>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;