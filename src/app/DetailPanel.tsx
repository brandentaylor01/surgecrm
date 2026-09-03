"use client";
import React, { useState, useEffect } from 'react';

export interface LineItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  category: string;
}

export interface Opp { 
  id: string; 
  company: string; 
  value: number; 
  status: string; 
  city?: string; 
  contact?: string; 
  clientKey: string; 
  type?: 'product' | 'service'; 
  qty1?: number;
  qty2?: number;
  customProposalJson?: string; 
}

interface DetailPanelProps {
  sel: Opp | null;
  stages: string[];
  setField: (id: string, f: keyof Opp, v: any) => Promise<void>;
  setSel: React.Dispatch<React.SetStateAction<Opp | null>>;
}

export default function DetailPanel({ sel, stages, setField, setSel }: DetailPanelProps) {
  const [items, setItems] = useState<LineItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState('SERVICES');

  const standardCategories = ['SERVICES', 'HARDWARE', 'LICENSES / SAAS', 'LABOR / ONBOARDING'];

  if (!sel) return null;

  useEffect(() => {
    try {
      if (sel.customProposalJson) {
        setItems(JSON.parse(sel.customProposalJson));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }, [sel.id, sel.customProposalJson]);

  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);

  useEffect(() => {
    if (subtotal !== sel.value) {
      setField(sel.id, 'value', subtotal);
    }
  }, [subtotal, sel.id, sel.value, setField]);
  const saveItems = (updatedItems: LineItem[]) => {
    setItems(updatedItems);
    setField(sel.id, 'customProposalJson', JSON.stringify(updatedItems));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const priceNum = Number(newItemPrice) || 0;
    const qtyNum = Number(newItemQty) || 1;
    
    const updated = [
      ...items, 
      { 
        id: 'item_' + Date.now(), 
        name: newItemName.trim(), 
        price: priceNum,
        qty: qtyNum,
        category: newItemCategory 
      }
    ];
    
    saveItems(updated);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQty('1');
  };

  const updateItemPrice = (itemId: string, newPrice: number) => {
    const updated = items.map(item => item.id === itemId ? { ...item, price: newPrice } : item);
    saveItems(updated);
  };

  const updateItemQty = (itemId: string, newQty: number) => {
    const updated = items.map(item => item.id === itemId ? { ...item, qty: newQty < 1 ? 1 : newQty } : item);
    saveItems(updated);
  };

  const removeItem = (itemId: string) => {
    const updated = items.filter(item => item.id !== itemId);
    saveItems(updated);
  };

  const triggerFollowUpEmail = () => {
    const subject = encodeURIComponent('PROPOSAL UPDATE - ' + sel.company);
    const body = encodeURIComponent(
      'HI ' + (sel.contact || 'TEAM') + ',\n\n' +
      'FOLLOWING UP ON OUR DISCUSSION REGARDING THE PROPOSAL FOR ' + sel.company + '.\n\n' +
      'THE TOTAL PROPOSED BALANCE STANDS AT $' + subtotal.toLocaleString() + '.\n\n' +
      'LET ME KNOW IF YOU HAVE ANY QUESTIONS SO WE CAN CONCLUDE ON THIS ESTIMATE.\n\n' +
      'BEST REGARDS,\n' +
      'SALES MATRIX'
    );
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-96 bg-[#0c0c0f] border-l border-[#1a1a1e] p-6 text-[11px] font-mono uppercase tracking-wider text-[#737373] flex flex-col justify-between shadow-2xl z-50 overflow-y-auto">
      <div className="space-y-6">
        
        {/* SECTION 1: HEADER & CLOSE */}
        <div className="flex justify-between items-center border-b border-[#1c1c22] pb-4">
          <div>
            <span className="text-[9px] text-[#404040] block font-bold">PROPOSAL CONSOLE</span>
            <h2 className="text-[#e5e5e5] font-bold text-xs tracking-widest truncate max-w-[180px] mt-0.5">{sel.company}</h2>
          </div>
          <button onClick={() => setSel(null)} className="text-[#404040] hover:text-[#a3a3a3] text-[10px] font-bold border border-[#22222a] px-2 py-0.5 rounded bg-[#141419] cursor-pointer transition">CLOSE</button>
        </div>

        {/* SECTION 2: ADD PROPOSAL ITEM */}
        <div className="space-y-2 bg-[#07070a] border border-[#14141c] p-3 rounded-lg">
          <span className="text-[9px] text-white font-bold block tracking-widest">➕ INSERT PROPOSAL ITEM</span>
          <form onSubmit={addItem} className="space-y-2">
            <div className="flex gap-1.5">
              <input 
                type="text" 
                placeholder="ITEM NAME" 
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full bg-[#0c0c10] border border-[#1a1a24] p-2 rounded text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none"
              />
              <input 
                type="number" 
                placeholder="$ PRICE" 
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="w-18 bg-[#0c0c10] border border-[#1a1a24] p-2 rounded text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none text-right"
              />
              <input 
                type="number" 
                placeholder="QTY" 
                value={newItemQty}
                onChange={e => setNewItemQty(e.target.value)}
                className="w-12 bg-[#0c0c10] border border-[#1a1a24] p-2 rounded text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none text-center"
              />
            </div>
            <div className="flex gap-1.5">
              <select
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value)}
                className="flex-1 bg-[#0c0c10] border border-[#1a1a24] p-2 rounded text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none"
              >
                {standardCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 rounded text-[10px] transition">ADD ITEM</button>
            </div>
          </form>
        </div>
        {/* SECTION 3: LINE ITEM DIRECTORY LIST */}
        <div className="space-y-3">
          <span className="text-[9px] text-[#404040] font-bold block tracking-widest">📋 ACTIVE PRICE SHEET</span>
          
          <div className="space-y-4 max-h-[260px] overflow-y-auto border border-[#14141f] rounded-lg bg-[#070709]/50 p-3">
            {items.length === 0 ? (
              <div className="text-[#333333] text-[9px] italic text-center py-4">No active line items assigned.</div>
            ) : (
              standardCategories.map(cat => {
                const categoryItems = items.filter(item => item.category === cat);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="text-[8px] font-bold text-indigo-400 bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-900/30 tracking-widest">{cat}</div>
                    {categoryItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-2 bg-[#0c0c12] p-2 rounded border border-[#14141f]">
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-neutral-400 font-bold truncate">{item.name}</span>
                          <span className="text-[8px] text-neutral-600 font-mono mt-0.5">
                            TOTAL: ${((item.price || 0) * (item.qty || 1)).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] text-neutral-600 font-bold mr-0.5">$:</span>
                          <input 
                            type="number" 
                            value={item.price}
                            onChange={e => updateItemPrice(item.id, Number(e.target.value) || 0)}
                            className="w-14 bg-[#070709] border border-[#1a1a26] p-1 rounded text-emerald-400 font-bold text-right font-mono text-[10px] focus:outline-none"
                          />
                          <span className="text-[8px] text-neutral-600 font-bold ml-1 mr-0.5">X:</span>
                          <input 
                            type="number" 
                            value={item.qty || 1}
                            onChange={e => updateItemQty(item.id, Number(e.target.value) || 1)}
                            className="w-10 bg-[#070709] border border-[#1a1a26] p-1 rounded text-neutral-300 font-bold text-center font-mono text-[10px] focus:outline-none"
                          />
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-600 hover:text-rose-500 font-bold px-1 text-[9px] transition ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SECTION 4: CLIENT ACCOUNT PARAMETERS */}
        <div className="space-y-4 border-t border-[#14141a] pt-4">
          <div className="flex items-end gap-1.5">
            <div className="flex-1">
              <label className="block text-[#404040] text-[9px] mb-1 font-bold">PRIMARY CONTACT</label>
              <input 
                type="text" 
                value={sel.contact || ''} 
                onChange={(e) => setField(sel.id, 'contact', e.target.value)} 
                className="w-full bg-[#070709] border border-[#17171d] p-2 rounded text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none"
              />
            </div>
            <button 
              onClick={triggerFollowUpEmail}
              className="bg-zinc-900 border border-zinc-800 text-neutral-300 font-bold p-2 rounded text-[10px] hover:text-white transition cursor-pointer"
            >
              ✉️
            </button>
          </div>

          <div>
            <label className="block text-[#404040] text-[9px] mb-1 font-bold">TARGET REGION / CITY</label>
            <input 
              type="text" 
              value={sel.city || ''} 
              onChange={(e) => setField(sel.id, 'city', e.target.value)} 
              className="w-full bg-[#070709] border border-[#17171d] p-2 rounded text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#404040] text-[9px] mb-1 font-bold">PROPOSAL PIPELINE STATUS</label>
            <select 
              value={sel.status} 
              onChange={(e) => setField(sel.id, 'status', e.target.value)} 
              className="w-full bg-[#070709] border border-[#17171d] p-2 rounded text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none"
            >
              {stages.map(stg => (
                <option key={stg} value={stg}>{stg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 5: MASTER BALANCE & PRINT GENERATOR */}
      <div className="pt-4 border-t border-[#1c1c22] mt-6 font-mono space-y-3">
        <div className="flex justify-between text-neutral-400 font-bold text-xs">
          <span>PROPOSAL BALANCE TOTAL:</span>
          <span className="text-emerald-400">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        
        <button 
          onClick={() => {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head>
                    <title>PROPOSAL</title>
                    <style>
                      body { font-family: monospace; padding: 40px; background: #fff; color: #000; line-height: 1.6; text-transform: uppercase; }
                      .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 30px; font-weight: bold; font-size: 14px; }
                      .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                      .table th { border-bottom: 1px solid #000; padding: 6px; text-align: left; font-weight: bold; }
                      .table td { padding: 6px; border-bottom: 1px dashed #ccc; }
                      .total { text-align: right; margin-top: 30px; font-weight: bold; font-size: 13px; border-top: 2px solid #000; padding-top: 10px; }
                    </style>
                  </head>
                  <body>
                    <div class="header">
                      <div>SURGECRM PROPOSAL REGISTRY CONTROL SHEET</div>
                    </div>
                    <div class="total">
                      TOTAL EVALUATED OUTSTANDING BALANCE: $${subtotal.toFixed(2)}
                    </div>
                    <script>window.print();</script>
                  </body>
                </html>
              `);
              printWindow.document.close();
            }
          }}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded text-[10px] tracking-widest cursor-pointer text-center transition"
        >
          📄 COMPILE & PRINT PROPOSAL
        </button>
      </div>
    </div>
  );
}
