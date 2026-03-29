'use client';

import React from 'react';
import { Search, ShoppingCart, User, Menu, Globe, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar({ onSearch }: { onSearch?: (query: string) => void }) {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 w-full bg-primary text-white shadow-md font-sans border-none m-0 p-0">
      {/* Top Header */}
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-12">
          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <Menu className="h-6 w-6 lg:hidden cursor-pointer" />
            <div className="flex items-center gap-1 cursor-pointer group">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-accent text-white font-black text-sm italic">
                A
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic leading-none group-hover:text-accent transition-colors">
                AMAZON<span className="text-accent">X</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden flex-1 items-center max-w-4xl lg:flex">
            <div className="relative w-full group">
              <form onSubmit={handleSearch} className="flex items-center h-10 w-full rounded-md overflow-hidden bg-white ring-offset-primary transition-all focus-within:ring-2 focus-within:ring-accent">
                {/* Category Dropdown */}
                <button type="button" className="flex items-center gap-1.5 bg-[#f3f3f3] px-3.5 h-full text-[12px] font-medium text-[#555] hover:bg-[#e3e3e3] hover:text-[#0f1111] transition-all border-r border-[#ddd] shrink-0">
                  All <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
                
                {/* Input Area */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search technical inventory..."
                  className="h-full w-full bg-transparent px-4 text-[14px] font-medium text-[#0f1111] placeholder:text-[#565959] focus:outline-none"
                />
                
                {/* Search Button */}
                <button type="submit" className="flex h-full w-[45px] items-center justify-center bg-accent text-white hover:bg-accent-light transition-all">
                  <Search className="h-5.5 w-5.5 stroke-[2.5px]" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden items-center gap-1 text-[11px] font-bold cursor-pointer hover:outline hover:outline-1 hover:outline-white/40 p-1 rounded lg:flex">
              <Globe className="h-4 w-4" />
              <span>EN</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </div>

            <div className="flex flex-col cursor-pointer hover:outline hover:outline-1 hover:outline-white/40 p-1 rounded">
              <span className="text-[10px] text-white/70 leading-none">Hello, Sign in</span>
              <div className="flex items-center gap-1 text-[12px] font-bold">
                <span>Account & Lists</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </div>
            </div>

            <div className="flex flex-col cursor-pointer hover:outline hover:outline-1 hover:outline-white/40 p-1 rounded">
              <span className="text-[10px] text-white/70 leading-none">Returns</span>
              <span className="text-[12px] font-bold tracking-tight">& Orders</span>
            </div>

            <div className="relative flex items-end gap-1 cursor-pointer hover:outline hover:outline-1 hover:outline-white/40 p-1 rounded group">
              <div className="relative">
                <ShoppingCart className="h-7 w-7" />
                <span className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-black text-white">
                  {totalItems}
                </span>
              </div>
              <span className="hidden text-[12px] font-bold tracking-tight lg:block">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Nav Area - Dark Navy */}
      <div className="bg-[#232f3e] border-t border-white/5">
        <div className="mx-auto max-w-[1400px] px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            <button className="flex items-center gap-1 text-[11px] font-bold hover:outline hover:outline-1 hover:outline-white/40 px-1 rounded shrink-0">
              <Menu className="h-4 w-4" /> All
            </button>
            {['Today\'s Deals', 'Customer Service', 'Registry', 'Gift Cards', 'Sell'].map((item) => (
              <a key={item} href="#" className="text-[11px] font-semibold whitespace-nowrap hover:outline hover:outline-1 hover:outline-white/40 px-1 rounded transition-all">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
