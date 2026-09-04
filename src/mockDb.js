// Persistent local data layer caching your tenant accounts
if (!global.mockDbLeads) {
  global.mockDbLeads = [];
}
export const database = {
  getLeads: () => global.mockDbLeads,
  saveLead: (lead) => { global.mockDbLeads.push(lead); return lead; },
  updateLead: (id, field, value) => {
    const match = global.mockDbLeads.find(l => l.id === id);
    if (match) {
      match[field] = value;
      return match;
    }
    return null;
  },
  deleteLead: (id) => {
    const initialLength = global.mockDbLeads.length;
    global.mockDbLeads = global.mockDbLeads.filter(l => l.id !== id);
    return global.mockDbLeads.length < initialLength;
  }
};
