import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Components/Context/Authcontext';
import { adminService } from '../../Services/adminServices';
import { motion } from 'framer-motion';
import {
  Users,
  Banknote,
  Activity,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Loader2
} from 'lucide-react';

import PerformanceChart from '../../Components/Charts/PerformanceChart';
import AssetDonut from '../../Components/Charts/AssetDonut';

const AdminOverview = () => {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [chartMetrics, setChartMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      // Fetch calculation summaries and historical plot metrics simultaneously
      const [metricsRes, chartRes] = await Promise.all([
        adminService.getPlatformOverviewMetrics(),
        adminService.getPlatformChartMetrics()
      ]);

      if (metricsRes.success) {
        setMetrics(metricsRes.data);
      }
      if (chartRes.success) {
        setChartMetrics(chartRes.data);
      }
      
      setLoading(false);
    };

    fetchRealData();
  }, []);

  // Helper function to handle clean price parsing
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 space-y-3">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <p className="text-sm font-semibold text-slate-500">Compiling real-time platform metrics...</p>
      </div>
    );
  }

  // Dynamic assignment of live values matching your structural cards array
  const adminStats = [
    { 
      label: 'Total Platform AUM', 
      value: formatCurrency(metrics?.totalAUM), 
      change: '+12.5%', 
      icon: Banknote, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Global Active Partners', 
      value: metrics?.globalActivePartners?.toString() || '0', 
      change: 'Live Users', 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Platform Active Capital', 
      value: formatCurrency(metrics?.totalActiveInvestments), 
      change: 'In Trade', 
      icon: TrendingUp, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
  ];

  // Calculate the total explicit balance allocated across standard investment sectors
  const totalAllocated = (metrics?.stocksTotal || 0) + (metrics?.realEstateTotal || 0) + (metrics?.greenEnergyTotal || 0);

  // Dynamically break down weight values using proportional sector metrics or fallbacks if empty
  const globalAssetAllocation = totalAllocated > 0 ? [
    { 
      name: 'Stocks', 
      amount: formatCurrency(metrics.stocksTotal), 
      percentage: `${Math.round((metrics.stocksTotal / totalAllocated) * 100)}%`, 
      color: 'bg-emerald-500' 
    },
    { 
      name: 'Real Estate', 
      amount: formatCurrency(metrics.realEstateTotal), 
      percentage: `${Math.round((metrics.realEstateTotal / totalAllocated) * 100)}%`, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Green Energy', 
      amount: formatCurrency(metrics.greenEnergyTotal), 
      percentage: `${Math.round((metrics.greenEnergyTotal / totalAllocated) * 100)}%`, 
      color: 'bg-amber-500' 
    },
  ] : [
    // Standard visual fallback tracking configuration if database positions are empty
    { name: 'Stocks', amount: formatCurrency((metrics?.totalAUM || 0) * 0.49), percentage: '49%', color: 'bg-emerald-500' },
    { name: 'Real Estate', amount: formatCurrency((metrics?.totalAUM || 0) * 0.35), percentage: '35%', color: 'bg-blue-500' },
    { name: 'Green Energy', amount: formatCurrency((metrics?.totalAUM || 0) * 0.16), percentage: '16%', color: 'bg-amber-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

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
          <PerformanceChart title="Global Liquidity Growth (USD)" data={chartMetrics} />
        </div>

        {/* Global Asset Distribution */}
        <motion.div variants={itemVariants}>
          <AssetDonut
            assets={globalAssetAllocation}
            totalValue={formatCurrency(metrics?.totalAUM)}
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