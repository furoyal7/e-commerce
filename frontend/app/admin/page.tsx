'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { DollarSign, Package, ShoppingBag, Clock, Loader2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalProducts: number;
  publishedProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

const mockChartData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex min-h-[500px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#f08804]" />
    </div>
  );

  const statCards = [
    { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'text-[#f08804]', bg: 'bg-[#f08804]/10' },
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h1 className="text-2xl font-black text-[#131921] uppercase italic tracking-tight">Dashboard Overview</h1>
        <p className="text-sm font-bold text-slate-400 uppercase">Welcome back to the command center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-[#131921]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-[#131921] uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#f08804]" />
              Revenue Overview
            </h2>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f08804" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f08804" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#131921' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#f08804" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
