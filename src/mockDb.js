import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const database = {
  getLeads: async () => {
    try {
      const { data, error } = await supabase.from('opportunities').select('*').order('id', { ascending: false });
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id, companyAccount: r.company_account, initialContact: r.initial_contact,
        city: r.city, address: r.address, email: r.email, phone: r.phone,
        status: r.status, clientWorkspace: r.client_workspace, notes: r.notes, proposals: r.proposals || []
      }));
    } catch { return []; }
  },
  saveLead: async (l) => {
    try {
      const { data, error } = await supabase.from('opportunities').insert([{
        id: l.id, company_account: l.companyAccount, initial_contact: l.initialContact,
        city: l.city, address: l.address, email: l.email, phone: l.phone,
        status: l.status, client_workspace: l.clientWorkspace, notes: l.notes, proposals: l.proposals || []
      }]);
      if (error) throw error;
      return l;
    } catch { return null; }
  },
  updateLead: async (id, field, value) => {
    try {
      const f = field === 'companyAccount' ? 'company_account' : field === 'initialContact' ? 'initial_contact' : field === 'clientWorkspace' ? 'client_workspace' : field;
      const { data, error } = await supabase.from('opportunities').update({ [f]: value }).eq('id', id);
      if (error) throw error;
      return data;
    } catch { return null; }
  },
  deleteLead: async (id) => {
    try {
      const { error } = await supabase.from('opportunities').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch { return false; }
  }
};
