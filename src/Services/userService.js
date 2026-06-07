import { supabase } from '../SuperBase/superbaseClient';

export const userService = {
  // Submit a deposit request to the ledger
  requestDeposit: async (userId, amount, paymentMethod) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userId,
            amount: Number(amount),
            type: 'deposit', // Flags it explicitly for the cash balance pipeline
            status: 'pending', // Awaiting admin authorization
            metadata: { payment_method: paymentMethod } // Extra tracking context
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("[userService] Deposit Request Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Fetch individual investor transaction history
  getUserTransactions: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("[userService] History Fetch Error:", error.message);
      return { success: false, error: [] };
    }
  },
  // Submit a withdrawal request to the ledger
  requestWithdrawal: async (userId, amount, paymentMethod, paymentDetails) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userId,
            amount: Number(amount),
            type: 'withdrawal', // Flags it for the withdrawal pipeline
            status: 'pending',   // Awaiting administrative authorization
            metadata: { 
              payment_method: paymentMethod,
              details: paymentDetails // Store target account details safely
            } 
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("[userService] Withdrawal Request Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Dynamic profile balance fetcher
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("[userService] Profile Fetch Error:", error.message);
      return { success: false, error: null };
    }
  }
};