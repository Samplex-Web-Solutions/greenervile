import React, { useState } from 'react';
import { supabase } from '../../SuperBase/superbaseClient';
import { Building2, PlusCircle, Image, DollarSign, Clock, Percent, MapPin } from 'lucide-react';

const AdminAddInvestment = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: 'Real Estate',
    min_investment: '',
    expected_return: '',
    duration: '',
    image_url: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Format fields correctly for the numeric database records
    const assetPayload = {
      name: formData.name,
      location: formData.location,
      category: formData.category,
      min_investment: parseFloat(formData.min_investment),
      expected_return: parseFloat(formData.expected_return),
      duration: formData.duration,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
    };

    try {
      const { error } = await supabase
        .from('market_investments')
        .insert([assetPayload]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Asset added to user marketplace successfully!' });
      // Reset state form
      setFormData({
        name: '',
        location: '',
        category: 'Real Estate',
        min_investment: '',
        expected_return: '',
        duration: '',
        image_url: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-[32px] p-6 md:p-10 shadow-sm">
        
        {/* Header */}
        <div className="mb-8 space-y-1">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
            <Building2 size={16} /> Asset Management Portal
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Market Investment</h1>
        </div>

        {/* System Message Notifications */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold tracking-wide border ${
            message.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Asset Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vetrina Marble Heights"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <MapPin size={12} /> Location
              </label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Milan, Italy"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Classification</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800 appearance-none"
              >
                <option value="Real Estate">Real Estate</option>
                <option value="Stocks">Stocks</option>
                <option value="Green Energy">Green Energy</option>
              </select>
            </div>

            {/* Floor Capital (Investment Cost) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <DollarSign size={12} /> Floor Capital ($ USD)
              </label>
              <input
                required
                type="number"
                name="min_investment"
                value={formData.min_investment}
                onChange={handleChange}
                placeholder="142500"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>

            {/* Return Cap Percentage */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <Percent size={12} /> Return Cap (% p.a)
              </label>
              <input
                required
                type="number"
                step="0.1"
                name="expected_return"
                value={formData.expected_return}
                onChange={handleChange}
                placeholder="11.2"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <Clock size={12} /> Lockup Duration
              </label>
              <input
                required
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="36 Months"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
              <Image size={12} /> Asset Cover Display Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-emerald-500 transition-all text-slate-800"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            <PlusCircle size={16} />
            {loading ? 'Publishing Asset Contract...' : 'Publish Asset to Marketplace'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddInvestment;