'use client';

import React from 'react';
import { X, User, ChevronRight, Globe, LogOut } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

const categories = CATEGORIES;

export default function FlyoutSidebar() {
  const { isSidebarOpen, closeSidebar } = useUI();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-[70] h-full w-[365px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-12 w-full items-center bg-[#232f3e] px-8 text-white">
          <User className="mr-3 h-6 w-6" />
          <span className="text-lg font-bold">Hello, Sign in</span>
          <button 
            onClick={closeSidebar}
            className="absolute -right-12 top-2 p-2 text-white hover:bg-white/10 rounded transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-48px)] overflow-y-auto pb-10">
          <div className="border-b border-border py-4 px-8">
            <h3 className="text-lg font-bold text-[#0f1111] mb-2">Trending</h3>
            <ul className="space-y-3">
              <li className="text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2 block">Best Sellers</li>
              <li className="text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2 block">New Releases</li>
              <li className="text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2 block">Movers & Shakers</li>
            </ul>
          </div>

          <div className="border-b border-border py-4 px-8">
            <h3 className="text-lg font-bold text-[#0f1111] mb-2">Shop By Category</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link 
                    href={`/products?category=${cat.name}`}
                    onClick={closeSidebar}
                    className="flex items-center justify-between text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2.5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="py-4 px-8">
            <h3 className="text-lg font-bold text-[#0f1111] mb-2">Help & Settings</h3>
            <ul className="space-y-1">
              <li className="text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2.5 block">Your Account</li>
              <li className="flex items-center gap-2 text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2.5">
                <Globe className="h-4 w-4" /> English
              </li>
              <li className="text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2.5 block">Customer Service</li>
              <li className="flex items-center gap-2 text-[14px] text-[#555] cursor-pointer hover:bg-slate-50 -mx-8 px-8 py-2.5">
                Sign in <LogOut className="h-4 w-4 rotate-180" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
