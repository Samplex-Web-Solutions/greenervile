import React, { useState } from 'react';
import { supabase } from '../../SuperBase/superbaseClient';
import { useToast } from '../../Components/Context/ToastContext'; // Adjust path if needed

const CommentForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-support-email', {
        body: formData,
      });

      if (error) throw error;

      // Using your custom Toast Context
      if (showToast) {
        showToast("Message sent successfully!", "success");
      }
      
      setFormData({ name: '', email: '', comment: '' }); 
    } catch (err) {
      console.error('Error:', err);
      if (showToast) {
        showToast("Failed to send message. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Leave us a Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-slate-900"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-slate-900"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <textarea
            placeholder="How can we help?"
            required
            rows="4"
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-slate-900 resize-none"
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Sending...</span>
            </span>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;