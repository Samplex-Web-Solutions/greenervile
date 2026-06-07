import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../Services/adminServices';
import { useToast } from '../../Components/Context/ToastContext';
import { Calendar, DollarSign, User, PlusCircle, Loader2 } from 'lucide-react';

const AddTransaction = ({ onTransactionAdded }) => {
  const { showToast } = useToast();
  
  // Platform Directory States
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  // Core Form Input States
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit'); 
  const [customDate, setCustomDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load the virtual user directory from Supabase on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await adminService.getAllUsers();
        if (res.success) {
          setUsers(res.data || []);
        } else {
          showToast("Could not populate user search registry.");
        }
      } catch (err) {
        showToast("Error establishing connection to user registry database.");
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [showToast]);

  // Filter cached client list based on active input query values
  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    return users.filter(u => 
      u.display_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [userSearch, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      showToast("Please select a target user account first.");
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast("Please provide a valid asset configuration amount.");
      return;
    }

    setSubmitting(true);

    const res = await adminService.addManualTransaction(
      selectedUserId,
      amount,
      type,
      'success', // Admin entries post directly as processed success states
      customDate || null // Empty calendar picks default to current Postgres server timestamps
    );

    if (res.success) {
      showToast("Manual record successfully entered into system ledger!");
      setAmount('');
      setCustomDate('');
      setUserSearch('');
      setSelectedUserId('');
      if (onTransactionAdded) onTransactionAdded(); // Reloads active dashboard rows
    } else {
      showToast(`Ledger insertion fault: ${res.error}`);
    }
    
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 p-6 max-w-lg shadow-sm font-sans">
      
      {/* Header Profile Badge */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-slate-900 text-white rounded-xl">
          <PlusCircle size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Add Manual Transaction</h2>
          <p className="text-slate-400 text-xs font-medium">Record a past or present account change directly.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Searchable Target User Selector */}
        <div className="relative">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Target Account User
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={loadingUsers ? "Loading user profiles..." : "Type client name or email..."}
              disabled={loadingUsers || submitting}
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setShowDropdown(true);
                if (selectedUserId) setSelectedUserId(''); // Break lock if they type again
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/5 transition-all"
            />
          </div>

          {/* Floating Dropdown Result Pane Overlay */}
          {showDropdown && userSearch && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelectedUserId(u.id);
                    setUserSearch(u.display_name); // Populates text box with clean derived layout name
                    setShowDropdown(false);
                  }}
                  className="p-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col"
                >
                  <span className="text-slate-900">{u.display_name}</span>
                  <span className="text-slate-400 font-medium text-[10px] mt-0.5">{u.email}</span>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  No matching accounts located
                </div>
              )}
            </div>
          )}
        </div>

        {/* Amount Field Input */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Amount (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="number" 
              step="any"
              required
              disabled={submitting}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/5 transition-all"
            />
          </div>
        </div>

        {/* Destination Category Select Option Box */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Destination Category</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={submitting}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white transition-all text-slate-800"
          >
            <option value="deposit">Liquid Deposit (+ Cash)</option>
            <option value="withdrawal">Liquid Withdrawal (- Cash)</option>
            <option value="invest_stocks">Stocks Allocation (+ Stock Balance)</option>
            <option value="invest_real_estate">Real Estate Allocation (+ Property Balance)</option>
            <option value="invest_green_energy">Green Energy Allocation (+ Energy Balance)</option>
          </select>
        </div>

        {/* Custom Calendar Date Field Picker */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Timeline Assignment (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="date" 
              disabled={submitting}
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white transition-all"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1 pl-1">
            * Leave blank to apply present system date and transaction clock.
          </p>
        </div>

        {/* Action Form Submit Trigger */}
        <button
          type="submit"
          disabled={submitting || !selectedUserId}
          className="w-full mt-2 bg-slate-900 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-40 flex items-center justify-center space-x-2 shadow-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              <span>Writing Ledger Override...</span>
            </>
          ) : (
            <span>Commit Override Record</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;