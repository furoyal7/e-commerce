'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Loader2, TrendingUp, Eye, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsManagement() {
  const [data, setData] = useState<{ productViews: any[], topSelling: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex min-h-[500px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#f08804]" />
    </div>
  );

  const viewsChartData = data?.productViews?.map(p => ({
    name: p.product?.name || 'Unknown',
    views: p.views
  })) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#131921] uppercase italic tracking-tight">Analytics</h1>
          <p className="text-sm font-bold text-slate-400 uppercase">Deep dive into store performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Viewed Products Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-[#131921] uppercase tracking-wide flex items-center gap-2 mb-6">
            <Eye className="h-5 w-5 text-[#f08804]" />
            Most Viewed Products
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#131921' }}
                />
                <Bar dataKey="views" fill="#f08804" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-[#131921] uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Top Selling Items
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
             <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                  <th className="px-6 py-3">Product ID</th>
                  <th className="px-6 py-3 text-right">Total Units Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {data?.topSelling?.length === 0 && (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-400">No sales data yet.</td></tr>
                )}
                {data?.topSelling?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-[#131921]">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-xs">#{idx + 1}</div>
                         <span className="font-mono text-xs">{item.productId.slice(0, 12)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="bg-slate-100 px-3 py-1 rounded-full font-black text-[#131921] text-xs inline-flex items-center gap-1.5"><ShoppingCart className="h-3 w-3" /> {item._sum.quantity} Units</span>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
}
