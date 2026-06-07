import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, TrendingUp, Leaf, Search, 
  ArrowUpRight, Zap, Globe2, MapPin, Landmark,
  ShieldCheck, BarChart3, AlertCircle, X
} from 'lucide-react';

const MarketPlace = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAcquireStake = () => {
    // Triggers the maximum investment notification
    setShowToast(true);
  };

  const globalAssets = [
    {
      id: 1,
      name: "Vetrina Marble Heights",
      location: "Milan, Italy",
      category: "Real Estate",
      minInvestment: "$142,500",
      expectedReturn: "11.2% p.a",
      duration: "36 Months",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000&auto=format&fit=crop",
      icon: Building2,
      accent: "text-blue-600",
    },
    {
      id: 2,
      name: "Helios Thermal Array",
      location: "Almeria, Spain",
      category: "Green Energy",
      minInvestment: "$88,000",
      expectedReturn: "21.5% p.a",
      duration: "60 Months",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop",
      icon: Zap,
      accent: "text-emerald-500",
    },
    {
      id: 3,
      name: "Aventine Wind Corridor",
      location: "Tasmania, Australia",
      category: "Green Energy",
      minInvestment: "$115,000",
      expectedReturn: "19.8% p.a",
      duration: "48 Months",
      image: "https://images.unsplash.com/photo-1466611653911-95282fc3656b?q=80&w=1000&auto=format&fit=crop",
      icon: Leaf,
      accent: "text-emerald-500",
    },
    {
      id: 4,
      name: "Hydro-Kinetic Nexus",
      location: "Reykjavík, Iceland",
      category: "Green Energy",
      minInvestment: "$130,500",
      expectedReturn: "14.2% p.a",
      duration: "72 Months",
      image: "https://images.unsplash.com/photo-1518115392411-92440c946663?q=80&w=1000&auto=format&fit=crop",
      icon: Zap,
      accent: "text-emerald-500",
    },
    {
      id: 5,
      name: "Bio-Genic Synthesis Plant",
      location: "Lyon, France",
      category: "Green Energy",
      minInvestment: "$55,000",
      expectedReturn: "26.0% p.a",
      duration: "24 Months",
      image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=1000&auto=format&fit=crop",
      icon: Leaf,
      accent: "text-emerald-500",
    },
    {
      id: 6,
      name: "Tidal Flux Generator 8",
      location: "Pentland Firth, UK",
      category: "Green Energy",
      minInvestment: "$92,000",
      expectedReturn: "22.7% p.a",
      duration: "40 Months",
      image: "https://images.unsplash.com/photo-1413882353051-404323608620?q=80&w=1000&auto=format&fit=crop",
      icon: Zap,
      accent: "text-emerald-500",
    },
    {
      id: 7,
      name: "Quasar Arbitrage Fund",
      location: "Offshore Cayman",
      category: "Stocks",
      minInvestment: "$125,000",
      expectedReturn: "31.2% p.a",
      duration: "12 Months",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1000&auto=format&fit=crop",
      icon: TrendingUp,
      accent: "text-amber-500",
    },
    {
      id: 8,
      name: "Lithium-Ion Equity Pool",
      location: "Toronto, Canada",
      category: "Stocks",
      minInvestment: "$45,000",
      expectedReturn: "18.5% p.a",
      duration: "Flexible",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop",
      icon: BarChart3,
      accent: "text-amber-500",
    },
    {
      id: 9,
      name: "Semi-Conductor Yield Trust",
      location: "Hsinchu, Taiwan",
      category: "Stocks",
      minInvestment: "$67,000",
      expectedReturn: "24.0% p.a",
      duration: "24 Months",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      icon: Landmark,
      accent: "text-amber-500",
    },
    {
      id: 10,
      name: "Alpha-Core Growth Portfolio",
      location: "Luxembourg City",
      category: "Stocks",
      minInvestment: "$35,500",
      expectedReturn: "12.8% p.a",
      duration: "Flexible",
      image: "https://images.unsplash.com/photo-1611974717482-58a25d3d171e?q=80&w=1000&auto=format&fit=crop",
      icon: TrendingUp,
      accent: "text-amber-500",
    },
    {
      id: 11,
      name: "Borealis Emerging Alpha",
      location: "Helsinki, Finland",
      category: "Stocks",
      minInvestment: "$28,000",
      expectedReturn: "16.4% p.a",
      duration: "36 Months",
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1000&auto=format&fit=crop",
      icon: ShieldCheck,
      accent: "text-amber-500",
    }
  ];

  const filteredAssets = globalAssets.filter(asset => {
    const matchesFilter = filter === 'All' || asset.category === filter;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-slate-50 min-h-screen relative">
      
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: ["-50%", "-48%", "-52%", "-50%"] // Subtle shake on entry
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-md"
            style={{ x: "-50%" }}
          >
            <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-4 md:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertCircle size={20} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Investment Control</h4>
                  <p className="text-slate-400 text-[11px] font-medium">Maximum number of investments reached.</p>
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
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Wrapping Navigation */}
       <div className="mt-8 w-full max-w-7xl">

          <div className="grid grid-cols-2 md:grid-flow-col items-center gap-2 bg-slate-200/50 p-2 rounded-[20px] md:rounded-2xl w-full sm:w-fit">
            {['All', 'Real Estate', 'Stocks', 'Green Energy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
          flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-xl 
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

      {/* Assets Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset, index) => (
              <motion.div
                layout
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-52 md:h-60 overflow-hidden bg-slate-200">
                  <img 
                    src={asset.image} 
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

                {/* Content Section */}
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 ${asset.accent}`}>
                        {asset.category}
                      </p>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{asset.name}</h3>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                      <asset.icon size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Floor Capital</p>
                      <p className="text-sm font-black text-slate-900">{asset.minInvestment}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Return Cap</p>
                      <div className="flex items-center space-x-1 text-emerald-600 font-black text-sm">
                        <ArrowUpRight size={14} />
                        <span>{asset.expectedReturn}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleAcquireStake}
                    className="w-full py-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-600 transition-all active:scale-[0.98]"
                  >
                    Acquire Stake
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;