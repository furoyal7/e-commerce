'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Globe,
  Bell
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Isolated from Storefront */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#131921] text-white shrink-0 border-r border-white/5">
        <div className="p-8 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f08804] text-[#131921] font-black text-lg italic transition-transform group-hover:scale-105">
              A
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">
              ADMIN<span className="text-[#f08804]">X</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, href: '/admin', active: true },
            { name: 'Inventory', icon: Package, href: '#' },
            { name: 'Orders', icon: ShoppingCart, href: '#' },
            { name: 'Customers', icon: Users, href: '#' },
            { name: 'Settings', icon: Settings, href: '#' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-[#f08804] text-[#131921] shadow-lg shadow-[#f08804]/10' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-2">
           <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-white/40 hover:text-white transition-all"
          >
            <Globe className="h-5 w-5" />
            <span className="font-bold text-[10px] uppercase tracking-widest">Storefront</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-white/20 hover:text-red-400 transition-all border border-transparent hover:border-red-400/20"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-bold text-sm tracking-tight">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <Menu className="h-6 w-6 text-[#131921]" />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2.5 text-slate-400 hover:text-[#131921] transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-[#f08804] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
               <div className="hidden md:block text-right">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Admin User</p>
                <p className="text-[13px] font-bold text-[#131921]">System Operator</p>
               </div>
               <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+X&background=131921&color=fff" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
