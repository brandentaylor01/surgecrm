import fs from 'fs';
import path from 'path';

const fp = path.join(process.cwd(), 'leads.json');

export const getLeads = () => { 
  try { 
    if (!fs.existsSync(fp)) return [];
    const raw = fs.readFileSync(fp, 'utf8');
    return JSON.parse(raw || '[]'); 
  } catch { 
    return []; 
  } 
};

export const saveLead = (nl) => { 
  try { 
    const ls = getLeads(); 
    ls.push(nl); 
    fs.writeFileSync(fp, JSON.stringify(ls, null, 2)); 
  } catch {} 
};
