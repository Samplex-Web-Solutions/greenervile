import React from 'react';
import { TrendingUp } from 'lucide-react';

const PerformanceChart = ({ data = [], title = "Performance Chart" }) => {
  const isEmpty = data.length === 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm h-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
          <p className="text-xs text-slate-400 font-medium flex items-center mt-1">
            <TrendingUp size={12} className="mr-1 text-emerald-500" /> 
            Live Asset Tracking
          </p>
        </div>
        {/* Removed Bar/Line Toggle to keep it strictly a Line Chart */}
        <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
          USD Portfolio
        </div>
      </div>

      <div className="relative h-64 w-full flex flex-col justify-end">
        {isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
              <TrendingUp className="text-slate-300" size={24} />
            </div>
            <p className="text-slate-400 text-sm font-medium text-center px-4">
               Waiting for market data to plot your growth...
            </p>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* SVG Mockup for the Line Chart Path */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path 
                d="M0,80 Q25,20 50,50 T100,10" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
              />
              <path 
                d="M0,80 Q25,20 50,50 T100,10 L100,100 L0,100 Z" 
                fill="url(#chartGradient)" 
                opacity="0.1"
              />
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
        
        {/* Y-Axis Labels Mockup */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-slate-300 py-2 pointer-events-none">
          <span>$10k</span><span>$5k</span><span>$0</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;