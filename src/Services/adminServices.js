import { supabase } from '../SuperBase/superbaseClient';

export const adminService = {
  // 1. --- NEWLY DEPLOYED EDGE FUNCTION TRIGGER ---
  adminCreateUserWithPassword: async ({ email, password, firstName, lastName, username }) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { email, password, firstName, lastName, username }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Admin user provisioning error:", error.message);
      return { success: false, error: error.message };
    }
  },

  // 2. --- USER MANAGEMENT ---
  getAllInvestors: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("CMS Fetch Error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  // Update specific numeric balances or portfolio charts manually per user
  updateUserFinancials: async (userId, updateFields) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updateFields)
      .eq('id', userId)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  updateUserRole: async (userId, newRole) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  deleteInvestor: async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  // 3. --- LOGS & TRANSACTIONS MANAGEMENT ---
  getAllTransactions: async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  reviewTransaction: async (transactionId, userId, currentAssetBalance, amount, type, newStatus) => {
    const { error: txError } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', transactionId);

    if (txError) return { success: false, error: txError.message };

    if (newStatus === 'success') {
      let updatedBalance = Number(currentAssetBalance);
      
      if (type.toLowerCase() === 'deposit') {
        updatedBalance += Number(amount);
      } else if (type.toLowerCase() === 'withdrawal') {
        updatedBalance -= Number(amount);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ asset_balance: updatedBalance })
        .eq('id', userId);

      if (profileError) return { success: false, error: profileError.message };
    }

    return { success: true };
  }
};