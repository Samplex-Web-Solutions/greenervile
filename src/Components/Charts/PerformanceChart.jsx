import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const PerformanceChart = ({ title, data }) => {
  const formatYAxis = (tickItem) => {
    return `$${(tickItem / 1000).toFixed(0)}k`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm w-full">
      <div className="mb-6">
        <h3 className="text-base font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-[11px] font-medium text-slate-400">Live system performance trajectory logs</p>
      </div>
      
      <div className="w-full h-[300px]" style={{ minWidth: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            {/* Maps 'month' key directly from your array objects */}
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            />
            
            <YAxis 
              tickFormatter={formatYAxis}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            />
            
            <Tooltip 
              contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
              labelStyle={{ color: '#94a3b8', fontWeight: 700 }}
            />
            
            {/* Maps 'amount' key directly from your array objects */}
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;