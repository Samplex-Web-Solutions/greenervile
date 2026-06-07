import React, { useState } from 'react';
import { adminService } from '../../Services/adminServices';
import { UserPlus, Loader2 } from 'lucide-react';

const AdminCreateUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const res = await adminService.adminCreateUserWithPassword(formData);
    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Investor account successfully provisioned!' });
      setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' }); // Clear form
    } else {
      setMessage({ type: 'error', text: `Failed: ${res.error}` });
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
          <UserPlus size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Provision Investor Account</h2>
          <p className="text-slate-400 text-xs font-medium">Create a new secure credentials profile instantly.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-semibold mb-4 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">First Name</label>
            <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Last Name</label>
            <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 text-sm" required />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
          <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 text-sm" required />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 text-sm" required />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Temporary Password</label>
          <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 text-sm" required />
        </div>

        <button type="submit" disabled={loading} className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 text-sm">
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Generating New User...</span>
            </>
          ) : (
            <span>Create & Verify User Account</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateUserForm;