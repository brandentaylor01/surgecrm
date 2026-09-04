if (!global.mockDbLeads) {
  global.mockDbLeads = [
    // --- RAINMAKER INTERNAL AGENCY SEED ENTRIES ---
    {
      id: "opp_seed_1", companyAccount: "Acme Corporates", initialContact: "Alice Smith",
      city: "New York", address: "100 Broadway", email: "alice@acme.com", phone: "555-0101",
      status: "secured", clientWorkspace: "rainmaker", notes: "Enterprise close loop completed.",
      proposals: [{ id: "l1", name: "CRM Automation Seat", price: 49.00, quantity: 20, billingCycle: "monthly_1yr", contractYears: 1 }]
    },
    {
      id: "opp_seed_2", companyAccount: "Nexus Trading", initialContact: "Bob Johnson",
      city: "Chicago", address: "200 LaSalle", email: "bob@nexus.com", phone: "555-0102",
      status: "proposal", clientWorkspace: "rainmaker", notes: "Sent proposal draft review.",
      proposals: [{ id: "l2", name: "VoIP Seat License", price: 24.99, quantity: 50, billingCycle: "monthly_multi", contractYears: 2 }]
    },
    {
      id: "opp_seed_3", companyAccount: "Horizon Tech", initialContact: "Charlie Brown",
      city: "Austin", address: "300 Congress", email: "charlie@horizon.com", phone: "555-0103",
      status: "qualifying", clientWorkspace: "rainmaker", notes: "Inbound qualification screening phase.",
      proposals: [{ id: "l3", name: "CRM Automation Seat", price: 49.00, quantity: 5, billingCycle: "one-time" }]
    },
    // --- AIM RESTORATION SEED ENTRIES ---
    {
      id: "opp_seed_4", companyAccount: "Apex Properties", initialContact: "David Miller",
      city: "Miami", address: "400 Brickell", email: "david@apex.com", phone: "555-0201",
      status: "secured", clientWorkspace: "aim", notes: "Annual emergency services contract finalized.",
      proposals: [{ id: "l4", name: "Restoration Retainer", price: 500.00, quantity: 1, billingCycle: "monthly_1yr", contractYears: 1 }]
    },
    {
      id: "opp_seed_5", companyAccount: "Vanguard Logistics", initialContact: "Eva Green",
      city: "Atlanta", address: "500 Peachtree", email: "eva@vanguard.com", phone: "555-0202",
      status: "proposal", clientWorkspace: "aim", notes: "Warehouse mitigation structural design appraisal.",
      proposals: [{ id: "l5", name: "Site Assessment", price: 2500.00, quantity: 2, billingCycle: "one-time" }]
    },
    {
      id: "opp_seed_6", companyAccount: "Summit Hospitality", initialContact: "Frank Wright",
      city: "Denver", address: "600 17th St", email: "frank@summit.com", phone: "555-0203",
      status: "qualifying", clientWorkspace: "aim", notes: "Hotel water framework analysis discovery.",
      proposals: [{ id: "l6", name: "Restoration Retainer", price: 300.00, quantity: 5, billingCycle: "monthly_multi", contractYears: 3 }]
    },
    // --- TELEVOI COMMUNICATIONS SEED ENTRIES ---
    {
      id: "opp_seed_7", companyAccount: "Global Call Centers", initialContact: "Grace Hopper",
      city: "Phoenix", address: "700 Central", email: "grace@global.com", phone: "555-0301",
      status: "secured", clientWorkspace: "televoi", notes: "Provisioned 200 standard trunk configurations.",
      proposals: [{ id: "l7", name: "VoIP Seat License", price: 19.99, quantity: 200, billingCycle: "monthly_multi", contractYears: 2 }]
    },
    {
      id: "opp_seed_8", companyAccount: "Delta Financial", initialContact: "Henry Ford",
      city: "Charlotte", address: "800 Tryon", email: "henry@delta.com", phone: "555-0302",
      status: "proposal", clientWorkspace: "televoi", notes: "Bank compliance architecture pricing layout.",
      proposals: [{ id: "l8", name: "CRM Automation Seat", price: 59.00, quantity: 35, billingCycle: "monthly_1yr", contractYears: 1 }]
    },
    {
      id: "opp_seed_9", companyAccount: "Prime Healthcare", initialContact: "Ivy League",
      city: "Boston", address: "900 Boylston", email: "ivy@prime.com", phone: "555-0303",
      status: "qualifying", clientWorkspace: "televoi", notes: "Clinic setup structural routing survey.",
      proposals: [{ id: "l9", name: "VoIP Seat License", price: 24.99, quantity: 15, billingCycle: "one-time" }]
    }
  ];
}

export const database = {
  getLeads: () => global.mockDbLeads,
  saveLead: (lead) => { global.mockDbLeads.push(lead); return lead; },
  updateLead: (id, field, value) => {
    const match = global.mockDbLeads.find(l => l.id === id);
    if (match) { match[field] = value; return match; }
    return null;
  },
  deleteLead: (id) => {
    const initialLength = global.mockDbLeads.length;
    global.mockDbLeads = global.mockDbLeads.filter(l => l.id !== id);
    return global.mockDbLeads.length < initialLength;
  }
};
