'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Users, Search, Loader2, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
}

export default function CustomersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data || []);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#131921] uppercase italic tracking-tight">Customers</h1>
          <p className="text-sm font-bold text-slate-400 uppercase">View registered accounts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers by email or name..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f08804] focus:border-transparent transition-all"
            />
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
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center shrink-0">
                          {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#131921] text-base">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Unnamed User'}</p>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" /> {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                       <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {format(new Date(user.createdAt), 'MMM d, yyyy')}</span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                     <td colSpan={3} className="py-12 text-center text-slate-400 font-medium">No customers found.</td>
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
