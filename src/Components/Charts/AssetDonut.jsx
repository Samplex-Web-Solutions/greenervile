import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AssetDonut = ({ assets = [], totalValue = "$0.00" }) => {
  // Map Tailwind classes to Hex for Recharts
  const colorMap = {
    'bg-emerald-500': '#10b981',
    'bg-blue-500': '#3b82f6',
    'bg-amber-500': '#f59e0b',
    'bg-slate-300': '#cbd5e1'
  };

  // Format data for Recharts (ensure percentage is a number)
  const data = assets.map(asset => ({
    name: asset.name,
    value: parseInt(asset.percentage),
    color: colorMap[asset.color] || '#cbd5e1'
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-full flex flex-col">
      <h3 className="font-bold text-slate-900 text-lg mb-4 text-center md:text-left">Portfolio Breakdown</h3>
      
      <div className="relative w-full h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={10}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Total Value Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Value</p>
            <p className="text-xl font-bold text-slate-900">{totalValue}</p>
          </div>
        </div>
      </div>

      {/* Legend List */}
      <div className="space-y-5 overflow-y-auto custom-scrollbar pr-2">
        {assets.map((asset, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <div className={`w-2.5 h-2.5 rounded-full ${asset.color}`} />
              <span className="text-sm font-bold text-slate-600">{asset.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-900">{asset.amount}</p>
              <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full ${asset.color} rounded-full transition-all duration-700`} 
                  style={{ width: asset.percentage }}
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