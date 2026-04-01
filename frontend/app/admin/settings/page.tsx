'use client';

import React from 'react';

export default function SettingsManagement() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#131921] uppercase italic tracking-tight">Settings</h1>
          <p className="text-sm font-bold text-slate-400 uppercase">Manage store configuration</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-lg font-black text-[#131921] uppercase tracking-wide">General Settings</h2>
        <p className="text-sm text-slate-500 mt-2">Configuration options for AmazonX Store.</p>
        <div className="mt-8 space-y-4 max-w-lg">
           <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-1.5">Store Name</label>
              <input type="text" defaultValue="AmazonX" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none" disabled />
           </div>
           <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-1.5">Contact Email</label>
              <input type="email" defaultValue="admin@amazonx.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none" disabled />
           </div>
           <button className="px-6 py-2.5 bg-[#131921] hover:bg-black text-white rounded-xl text-sm font-black uppercase tracking-widest transition-colors shadow-lg shadow-black/10 opacity-50 cursor-not-allowed">
              Save Changes
           </button>
        </div>
      </div>
    </div>
  );
}
