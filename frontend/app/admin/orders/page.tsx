'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { ShoppingCart, Search, Filter, Eye, RefreshCw, Loader2, CheckCircle, Clock, Truck, XCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  totalPrice: string;
  currency: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data.orders || res.data || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-[#f08804]/10 text-[#f08804]"><Clock className="h-3 w-3" /> PENDING</span>;
      case 'PAID': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700"><DollarSign className="h-3 w-3" /> PAID</span>;
      case 'SHIPPED': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700"><Truck className="h-3 w-3" /> SHIPPED</span>;
      case 'DELIVERED': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700"><CheckCircle className="h-3 w-3" /> DELIVERED</span>;
      case 'CANCELLED': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> CANCELLED</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#131921] uppercase italic tracking-tight">Orders Management</h1>
          <p className="text-sm font-bold text-slate-400 uppercase">Track and fullfil customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={fetchOrders} className="flex items-center px-4 py-2 bg-white border border-slate-200 text-[#131921] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm uppercase tracking-wide">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID or email..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f08804] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f08804] focus:border-transparent transition-all font-bold text-slate-600 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#f08804]" />
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-extrabold">
                  <th className="px-6 py-4">Order Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center shrink-0">
                          <ShoppingCart className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-[#131921]">#{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-slate-400 font-medium">Payment: {order.paymentStatus}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#131921]">{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}</p>
                      <p className="text-xs text-slate-400 font-medium">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 font-black">${Number(order.totalPrice).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {updatingId === order.id ? (
                           <Loader2 className="h-4 w-4 animate-spin text-[#f08804]" />
                        ) : (
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-600 outline-none focus:border-[#f08804] cursor-pointer"
                          >
                            <option value="PENDING">Mark Pending</option>
                            <option value="PAID">Mark Paid</option>
                            <option value="SHIPPED">Mark Shipped</option>
                            <option value="DELIVERED">Mark Delivered</option>
                            <option value="CANCELLED">Cancel Order</option>
                          </select>
                        )}
                        <button className="text-slate-400 hover:text-[#f08804] transition-colors p-1" title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                     <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
