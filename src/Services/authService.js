import { supabase } from '../SuperBase/superbaseClient';

export const authService = {
  register: async (email, password, firstName, lastName, username) => {
    try {
      // 1. Sign up the user inside Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            first_name: firstName,
            last_name: lastName,
            username: username,
            role: 'user' // Embedded secure metadata tag
          },
        },
      });

      if (authError) throw authError;

      // If signUp succeeds but user is null (e.g. email confirmation required, though pkce handles this)
      if (!authData?.user) {
        return { data: authData, error: null };
      }

      // 2. IMMEDIATELY seed their baseline client row inside the public.profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id, // Absolute 1:1 sync with the brand new Auth account ID
            email,
            first_name: firstName,
            last_name: lastName,
            username,
            role: 'user', // Explicitly lock them out of admin status on creation
            verification_status: 'pending',
            asset_balance: 0.00,
            active_investment: 0.00,
            total_profit_loss: 0.00,
            profit_percentage: 0.00,
            stocks_percentage: 40.00,
            energy_percentage: 30.00,
            real_estate_percentage: 20.00,
            cash_percentage: 10.00,
            manager_name: 'Charlotte Arthur',
            manager_role: 'Senior Account Officer',
            manager_email: 'charlottearthur8080@gmail.com'
          }
        ]);

      if (profileError) {
        console.error("[authService] Failed to seed user profile:", profileError.message);
        // Note: You could optionally roll back/delete auth user here, 
        // but typically throwing the error for the UI handler is sufficient.
        return { data: null, error: profileError };
      }

      return { data: authData, error: null };

    } catch (error) {
      console.error("[authService] Critical Registration Error:", error.message);
      return { data: null, error };
    }
  },

  login: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  logout: async () => {
    return await supabase.auth.signOut();
  },

  resetPassword: async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
  },

  updatePassword: async (newPassword) => {
    return await supabase.auth.updateUser({
      password: newPassword,
    });
  }
};