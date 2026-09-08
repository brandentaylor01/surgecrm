'use client';
import React from 'react';

export default function AvailabilityView() {
  // Hardcoded premium, clean-cut, anonymous slot presentation vectors
  const openTimeSlots = [
    { id: "slot-1", day: "Thursday, Sept 10", time: "2:00 PM - 2:30 PM EST", status: "Available" },
    { id: "slot-2", day: "Thursday, Sept 10", time: "4:15 PM - 4:45 PM EST", status: "Available" },
    { id: "slot-3", day: "Friday, Sept 11", time: "1:00 PM - 1:30 PM EST", status: "Available" },
    { id: "slot-4", day: "Friday, Sept 11", time: "3:30 PM - 4:00 PM EST", status: "Available" }
  ];

  const handleAnonymousBooking = (slotId: string) => {
    alert(`// Initiating booking protocol for token [${slotId}] over secure cloud channels...`);
  };

  return (
    <div className="p-6 bg-[#131316] border border-[#1f1f23] rounded font-sans font-light text-[12px] text-zinc-300 max-w-md">
      <div className="border-b border-[#1f1f23] pb-4 mb-4">
        <h3 className="text-white font-medium text-[13px] tracking-wide uppercase font-mono">// Select Strategy Consultation Slot</h3>
        <p className="text-zinc-500 text-[11px] mt-1">Your identity and contact details are completely masked for secure communication paths.</p>
      </div>

      <div className="flex flex-col gap-2">
        {openTimeSlots.map((slot) => (
          <div key={slot.id} className="flex items-center justify-between p-3 border border-[#1f1f23] bg-[#0d0d0e] rounded hover:border-zinc-600 transition-all duration-300">
            <div className="flex flex-col">
              <span className="text-zinc-400 font-mono text-[11px]">{slot.day}</span>
              <span className="text-white font-medium mt-0.5">{slot.time}</span>
            </div>
            <button 
              onClick={() => handleAnonymousBooking(slot.id)}
              className="bg-transparent hover:bg-white hover:text-black border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded transition-all duration-300"
            >
              Book Slot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
