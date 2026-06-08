import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../SuperBase/superbaseClient';
import {
  Building2, TrendingUp, Leaf, Search,
  ArrowUpRight, Zap, Globe2, MapPin, Landmark,
  ShieldCheck, BarChart3, AlertCircle, X
} from 'lucide-react';

// Maps database category strings to your UI's premium icons and accent colors
const categoryConfig = {
  "Real Estate": { icon: Building2, accent: "text-blue-600" },
  "Stocks": { icon: TrendingUp, accent: "text-amber-500" },
  "Green Energy": { icon: Zap, accent: "text-emerald-500" }
};

const MarketPlace = () => {
  const [globalAssets, setGlobalAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('info'); // 'info' or 'error'

  // Fetch real-time assets from Supabase
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('market_investments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGlobalAssets(data || []);
      } catch (error) {
        console.error('Error fetching marketplace assets:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAcquireStake = async (asset) => {
  try {
    // 1. Get the current logged-in user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setToastType('error');
      setToastMessage("Authentication required. Please log in to complete investments.");
      setShowToast(true);
      return;
    }

    // 2. Fetch the user's profile data to check their current balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles') 
      .select('asset_balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      setToastType('error');
      setToastMessage("Could not retrieve your wallet data. Please try again.");
      setShowToast(true);
      return;
    }

    // 3. Confirm financial coverage eligibility
    const userBalance = parseFloat(profile.asset_balance || 0);
    const investmentRequired = parseFloat(asset.min_investment);

    if (userBalance < investmentRequired) {
      setToastType('error');
      setToastMessage(`Insufficient funds. Your balance is $${userBalance.toLocaleString()}, but this contract requires $${investmentRequired.toLocaleString()}.`);
      setShowToast(true);
      return;
    }

    // 4. Record investment entry contract row as Pending
    // Note: The database trigger will automatically deduct the balance right after this insert!
    const { error: transactionError } = await supabase
      .from('user_investments')
      .insert([
        {
          user_id: user.id,
          asset_id: asset.id,
          amount: investmentRequired,
          status: 'Pending'
        }
      ]);

    if (transactionError) throw transactionError;

    // 5. Present confirmation manager tracking toast notification 
    setToastType('info');
    setToastMessage(`Order locked. Your dedicated account manager is currently processing your investment contract for ${asset.name}.`);
    setShowToast(true);

  } catch (error) {
    console.error("Investment processing error:", error);
    setToastType('error');
    setToastMessage("An error occurred while locking your contract. Please try again.");
    setShowToast(true);
  }
};

  const filteredAssets = globalAssets.filter(asset => {
    const matchesFilter = filter === 'All' || asset.category === filter;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-slate-50 min-h-screen relative">

      {/* --- DYNAMIC ACTION STATUS TOAST --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              x: ["-50%", "-48%", "-52%", "-50%"]
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-md"
            style={{ x: "-50%" }}
          >
            <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-4 md:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${toastType === 'error' ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                  <AlertCircle size={20} className={toastType === 'error' ? 'text-rose-500' : 'text-emerald-500'} />
                </div>
                <div>
                  <h4 className="text-white text-[10px] font-black uppercase tracking-widest">
                    {toastType === 'error' ? 'Transaction Stopped' : 'Investment Contract'}
                  </h4>
                  <p className="text-slate-400 text-[11px] font-medium leading-relaxed">{toastMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="p-1 text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketplace</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Globe2 size={14} className="text-emerald-500" /> Secure Global Assets
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="mt-8 w-full max-w-7xl">
          <div className="grid grid-cols-2 md:grid-flow-col items-center gap-2 bg-slate-200/50 p-2 rounded-[20px] md:rounded-2xl w-full sm:w-fit">
            {['All', 'Real Estate', 'Stocks', 'Green Energy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-4 md:px-6 py-2.5 rounded-xl 
                  text-[9px] font-black uppercase tracking-widest 
                  transition-all duration-300 border border-transparent
                  ${filter === cat
                    ? 'bg-white text-slate-900 shadow-sm border-slate-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assets Grid Area */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Market Contracts...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-[32px]">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">No investment assets match your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset, index) => {
                const config = categoryConfig[asset.category] || { icon: Building2, accent: "text-slate-500" };
                const AssetIcon = config.icon;
                const assetAccent = config.accent;

                const formattedInvestment = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(asset.min_investment);

                return (
                  <motion.div
                    layout
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image Header Section */}
                    <div className="relative h-52 md:h-60 overflow-hidden bg-slate-200">
                      <img
                        src={asset.image_url}
                        alt={asset.name}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop'; }}
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900">
                        High Yield
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 text-white bg-slate-900/40 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                        <MapPin size={10} className="text-emerald-400" />
                        <span className="text-[9px] font-bold uppercase tracking-wide">{asset.location}</span>
                      </div>
                    </div>

                    {/* Content Meta Section */}
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 ${assetAccent}`}>
                            {asset.category}
                          </p>
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{asset.name}</h3>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 text-slate-700">
                          <AssetIcon size={20} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Floor Capital</p>
                          <p className="text-sm font-black text-slate-900">{formattedInvestment}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Return Cap</p>
                          <div className="flex items-center space-x-1 text-emerald-600 font-black text-sm">
                            <ArrowUpRight size={14} />
                            <span>{asset.expected_return}% p.a</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcquireStake(asset)}
                        className="w-full py-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-all active:scale-[0.98]"
                      >
                        Acquire Stake
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;