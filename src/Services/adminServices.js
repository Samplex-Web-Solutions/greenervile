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

// Ensure 'type' is included as the 4th parameter right before 'action'
reviewTransaction: async (txId, userId, amount, type, action) => {
  try {
    // 1. Force state modification on the base transaction record using the correct action variable
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .update({ status: action }) // This will now perfectly receive 'success' or 'failed'
      .eq('id', txId)
      .select();

    if (txError) throw txError;

    // 2. If approved, safely modify the targeted destination user balance
    if (action === 'success') {
      const cleanAmount = typeof amount === 'string' 
        ? parseFloat(amount.replace(/[^0-9.]/g, '')) 
        : Number(amount);

      if (isNaN(cleanAmount)) throw new Error("Invalid calculation value structure.");

      // Identify target portfolio tier based on the type parameter
      const normalizedType = type ? type.toUpperCase() : 'DEPOSIT';
      let balanceField = 'asset_balance'; 

      if (normalizedType.includes('STOCKS')) {
        balanceField = 'stocks_balance';
      } else if (normalizedType.includes('REAL_ESTATE')) {
        balanceField = 'real_estate_balance';
      } else if (normalizedType.includes('GREEN_ENERGY')) {
        balanceField = 'green_energy_balance';
      }

      // Query current ledger details safely
      const { data: profileData, error: profileFetchError } = await supabase
        .from('profiles')
        .select(`id, ${balanceField}`)
        .eq('id', userId);

      if (profileFetchError) throw profileFetchError;
      if (!profileData || profileData.length === 0) throw new Error("Target user profile not located.");

      // Calculate new balance based on direction (Deposit/Allocation vs Withdrawal)
      const existingBalance = Number(profileData[0][balanceField] || 0);
      let computedBalance;

      if (normalizedType.includes('WITHDRAWAL')) {
        // 🚨 SUBTRACTION DIRECTION LOGIC
        computedBalance = existingBalance - cleanAmount;

        // Safety Guardrail: Prevent overdrafting the user account row
        if (computedBalance < 0) {
          throw new Error("Insufficient user funds to clear this withdrawal settlement request.");
        }
      } else {
        // 🟢 ADDITION DIRECTION LOGIC (Deposits & Investment top-ups)
        computedBalance = existingBalance + cleanAmount;
      }

      // Update the correct asset column inside the user's profile
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ [balanceField]: computedBalance })
        .eq('id', userId);

      if (profileUpdateError) throw profileUpdateError;
    }

    return { success: true, data: txData?.[0] || null };
  } catch (error) {
    console.error("Critical Admin review fault exception:", error.message);
    return { success: false, error: error.message };
  }
},

getPlatformOverviewMetrics: async () => {
  
  try {
    const { data, error } = await supabase.rpc('get_platform_overview_metrics');
    if (error) throw error;

    const row = data[0] || {};
    
    // Format payload keys to match your frontend destructuring exactly
    return {
      success: true,
      data: {
        totalAUM: Number(row.total_aum || 0),
        globalActivePartners: Number(row.global_active_partners || 0),
        totalActiveInvestments: Number(row.total_active_investments || 0),
        stocksTotal: Number(row.stocks_total || 0),
        realEstateTotal: Number(row.real_estate_total || 0),
        greenEnergyTotal: Number(row.green_energy_total || 0)
      }
    };
  } catch (error) {
    console.error("[adminService] Global metrics fetch failure:", error.message);
    return { success: false, error: error.message };
  }
},

getPlatformChartMetrics: async () => {
  try {
    // Queries the last 6 entries from your timeline log table to paint the performance tracking graph
    const { data, error } = await supabase
      .from('platform_growth_logs')
      .select('month, amount')
      .order('created_at', { ascending: true })
      .limit(6);

    if (error) throw error;

    // Fallback data mapping in case your historical table isn't fully seeded yet
    if (!data || data.length === 0) {
      return {
        success: true,
        data: [
          { month: 'Jan', amount: 50000 },
          { month: 'Feb', amount: 85000 },
          { month: 'Mar', amount: 120000 },
          { month: 'Apr', amount: 190000 },
          { month: 'May', amount: 240000 },
          { month: 'Jun', amount: 310000 }
        ]
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[adminService] Chart metrics fetch failure:", error.message);
    return { success: false, error: error.message };
  }
},

getDepositSettings: async () => {
  try {
    const { data, error } = await supabase
      .from('deposit_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle(); // <-- Changed from .single() to prevent crashes if empty

    if (error) throw error;
    
    // If the database is empty, return null instead of breaking
    return { success: true, data };
  } catch (error) {
    console.error("[adminService] Fetch Settings Error:", error.message);
    return { success: false, error: error.message };
  }
},

updateDepositSettings: async (settingsData) => {
  try {
    const payload = {
      id: 1,
      bank_name: settingsData.bank_name,
      account_name: settingsData.account_name,
      account_no: settingsData.account_no,
      swift_code: settingsData.swift_code,
      routing_no: settingsData.routing_no,
      usdt_erc20_address: settingsData.usdt_erc20_address,
      usdt_trc20_address: settingsData.usdt_trc20_address,
      btc_address: settingsData.btc_address,
      updated_at: new Date().toISOString()
    };

    console.log("Transmission Payload Structure:", payload);

    const { data, error } = await supabase
      .from('deposit_settings')
      .upsert(payload)
      .select();

    if (error) throw error;
    
    console.log("Supabase Server Echo Response:", data);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("[adminService] Update Settings Error:", error.message);
    return { success: false, error: error.message };
  }
},
// Add this helper into your adminService object export:

getPlatformGlobalAUM: async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_platform_aum');

    if (error) throw error;
    
    // Returns the first row mapping containing our calculated figures
    return { success: true, stats: data[0] };
  } catch (error) {
    console.error("[adminService] AUM Read Failure:", error.message);
    return { success: false, error: error.message };
  }
},

addManualTransaction: async (userId, amount, type, status = 'success', customDate) => {
  try {
    // 1. Format the provided timestamp or default to the current execution time
    // If customDate is passed (e.g., "2026-03-15"), Supabase will parse it into the created_at column
    const transactionTimestamp = customDate ? new Date(customDate).toISOString() : new Date().toISOString();

    const cleanAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^0-9.]/g, '')) 
      : Number(amount);

    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      throw new Error("Invalid transaction amount structure.");
    }

    const normalizedType = type ? type.toUpperCase() : 'DEPOSIT';
    let balanceField = 'asset_balance'; 

    if (normalizedType.includes('STOCKS')) {
      balanceField = 'stocks_balance';
    } else if (normalizedType.includes('REAL_ESTATE')) {
      balanceField = 'real_estate_balance';
    } else if (normalizedType.includes('GREEN_ENERGY')) {
      balanceField = 'green_energy_balance';
    }

    // 2. Fetch current profile state to adjust values
    const { data: profileData, error: profileFetchError } = await supabase
      .from('profiles')
      .select(`id, ${balanceField}`)
      .eq('id', userId);

    if (profileFetchError) throw profileFetchError;
    if (!profileData || profileData.length === 0) throw new Error("Target user profile not located.");

    const existingBalance = Number(profileData[0][balanceField] || 0);
    let computedBalance;

    // Apply ledger math based on direction
    if (normalizedType.includes('WITHDRAWAL')) {
      computedBalance = existingBalance - cleanAmount;
      if (computedBalance < 0) {
        throw new Error("Insufficient fluid balance remaining to record this manual withdrawal reduction.");
      }
    } else {
      computedBalance = existingBalance + cleanAmount;
    }

    // 3. Create the historical ledger entry row explicitly handling the timestamp override
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          amount: cleanAmount,
          type: type, // e.g., 'deposit', 'withdrawal', 'invest_stocks'
          status: status, // Defaults to 'success' since it's an admin override
          created_at: transactionTimestamp, // 🕒 This forces the past/present calendar slot
          metadata: { admin_override: true, notes: "Manually registered ledger item" }
        }
      ])
      .select();

    if (txError) throw txError;

    // 4. Update the profile balance column to match the entry if the status is success
    if (status === 'success') {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ [balanceField]: computedBalance })
        .eq('id', userId);

      if (profileUpdateError) throw profileUpdateError;
    }

    return { success: true, data: txData?.[0] || null };
  } catch (error) {
    console.error("Critical Manual Transaction Exception:", error.message);
    return { success: false, error: error.message };
  }
},

getAllUsers: async () => {
  try {
    // 💡 Adjusted to grab explicit naming components rather than a single 'full_name' column
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, username, first_name, last_name'); 

    if (error) throw error;

    // Map through results to reconstruct a virtual fallback display name
    const formattedData = (data || []).map(user => {
      let derivedName = '';
      
      if (user.first_name || user.last_name) {
        derivedName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      } else {
        derivedName = user.username || user.email || 'Alternative Profile';
      }

      return {
        id: user.id,
        email: user.email,
        display_name: derivedName
      };
    });

    // Sort alphabetically by the newly generated display name
    formattedData.sort((a, b) => a.display_name.localeCompare(b.display_name));

    return { success: true, data: formattedData };
  } catch (error) {
    console.error("[adminService] Failed to fetch users list:", error.message);
    return { success: false, error: error.message };
  }
},
};