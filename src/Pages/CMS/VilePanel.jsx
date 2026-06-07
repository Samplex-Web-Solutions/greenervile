import React from 'react';
import { useAuth } from '../../Components/Context/Authcontext';
import { motion } from 'framer-motion';
import {
  Users,
  Banknote,
  Activity,
  TrendingUp,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';

import PerformanceChart from '../../Components/Charts/PerformanceChart';
import AssetDonut from '../../Components/Charts/AssetDonut';

const AdminOverview = () => {
  const { profile } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const adminStats = [
    { label: 'Total Platform AUM', value: '$1,248,500', change: '+12.5%', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Global Active Partners', value: '842', change: '+48 this week', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Platform ROI Paid', value: '$92,400', change: 'Stable', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const globalAssetAllocation = [
    { name: 'Stocks', amount: '$612,000', percentage: '49%', color: 'bg-emerald-500' },
    { name: 'Real Estate', amount: '$435,000', percentage: '35%', color: 'bg-blue-500' },
    { name: 'Green Energy', amount: '$201,500', percentage: '16%', color: 'bg-amber-500' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 md:pt-5 md:p-8 bg-slate-50 min-h-screen font-sans">

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center uppercase">
            Admin Control Panel <Activity className="ml-2 text-green-500" size={24} />
          </h1>
          <p className="text-slate-500 text-sm font-medium">Global liquidity and project participation overview.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-sm leading-none">Logged Admin: {profile?.first_name} {profile?.last_name}</span>
          </div>
        </motion.div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <button className="text-slate-300 hover:text-slate-500 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-400">{stat.label}</p>
              <div className="flex items-center space-x-2">
                <h3 className="text-3xl font-black text-slate-900 leading-none">{stat.value}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.bg} ${stat.color} flex items-center`}>
                  {stat.change} <ArrowUpRight size={10} className="ml-1" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Platform Growth Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart title="Global Liquidity Growth (USD)" data={[1, 2, 3]} />
        </div>

        {/* Global Asset Distribution */}
        <motion.div variants={itemVariants}>
          <AssetDonut
            assets={globalAssetAllocation}
            totalValue="$1.24M"
          />
          <div className="mt-4 p-4 bg-emerald-900 rounded-2xl text-white">
            <p className="text-[10px] font-bold uppercase text-emerald-300 mb-1">Top Performing Sector</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">US Tech Stocks</span>
              <span className="text-emerald-400 text-sm font-black">+18.2%</span>
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};

export default AdminOverview;