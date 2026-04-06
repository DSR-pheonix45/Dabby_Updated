import { supabase } from '../lib/supabase';

/**
 * Workbench Database Service
 */
export const dbService = {
  /**
   * Fetch all workbenches for the current user
   */
  async getWorkbenches(userId) {
    const { data, error } = await supabase
      .from('workbenches')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Create a new workbench metadata
   */
  async createWorkbench(workbenchData) {
    const { data, error } = await supabase
      .from('workbenches')
      .insert([workbenchData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Save a Chart of Accounts batch to Supabase
   */
  async saveCOA(workbenchId, accounts) {
    const accountsWithWorkbenchId = accounts.map(acc => ({
      workbench_id: workbenchId,
      name: acc.name,
      type: acc.type,
      balance: acc.balance || 0,
      balance_type: acc.balanceType || (acc.type.includes('Asset') || acc.type.includes('Expense') ? 'Dr' : 'Cr'),
      is_locked: acc.locked || false,
      zoho_id: acc.id?.toString() // Store Zoho ID if it exists
    }));

    const { data, error } = await supabase
      .from('coa_accounts')
      .insert(accountsWithWorkbenchId);

    if (error) throw error;
    return data;
  },

  /**
   * Fetch COA for a specific workbench
   */
  async getWorkbenchCOA(workbenchId) {
    const { data, error } = await supabase
      .from('coa_accounts')
      .select('*')
      .eq('workbench_id', workbenchId);

    if (error) throw error;
    return data;
  },

  /**
   * Fetch Inventory for a specific workbench
   */
  async getInventory(workbenchId) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('workbench_id', workbenchId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Create a new inventory item
   */
  async createInventoryItem(itemData) {
    const { data, error } = await supabase
      .from('inventory')
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update stock level for an item
   */
  async updateStock(itemId, quantityChange) {
    // This is a simplified version; in production, use a RPC or transaction
    const { data: item, error: fetchError } = await supabase
      .from('inventory')
      .select('current_stock')
      .eq('id', itemId)
      .single();

    if (fetchError) throw fetchError;

    const newStock = (item.current_stock || 0) + quantityChange;

    const { data, error } = await supabase
      .from('inventory')
      .update({ current_stock: newStock })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile data (plan, name, etc.)
   */
  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
