import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AssetDonut = ({ assets = [], totalValue = "$0.00" }) => {
  const colorMap = {
    'bg-emerald-500': '#10b981',
    'bg-blue-500': '#3b82f6',
    'bg-amber-500': '#f59e0b',
    'bg-slate-300': '#cbd5e1'
  };

  const data = assets.map(asset => ({
    name: asset.name,
    value: parseInt(asset.percentage?.toString().replace(/[^0-9]/g, '')) || 0,
    color: colorMap[asset.color] || '#cbd5e1'
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm h-full flex flex-col justify-between">
      <h3 className="font-bold text-slate-900 text-lg mb-4 text-center md:text-left tracking-tight">Portfolio Breakdown</h3>
      
      <div className="relative w-full h-64 mb-6 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}   // <-- Ring Inner Radius adjusted cleanly
              outerRadius={85}   // <-- Ring Outer Radius FIXED (Must be greater than innerRadius!)
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={600}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Floating Absolute Center Total Value Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Total Assets</p>
            <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{totalValue}</p>
          </div>
        </div>
      </div>

      {/* Dynamic Proportional Legend Matrix List */}
      <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1 mt-auto">
        {assets.map((asset, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <div className={`w-2.5 h-2.5 rounded-full ${asset.color} shrink-0`} />
              <span className="text-sm font-bold text-slate-600">{asset.name}</span>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-black text-slate-900 leading-none">{asset.amount}</p>
              <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden ml-auto">
                <div 
                  className={`h-full ${asset.color} rounded-full transition-all duration-700`} 
                  style={{ width: asset.percentage?.toString().includes('%') ? asset.percentage : `${asset.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetDonut;