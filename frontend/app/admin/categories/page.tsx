'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Plus, Edit3, Trash2, Tags, Loader2, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/categories');
      setCategories(res.data.categories || res.data || []);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    reset({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    reset({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Related products may be affected.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}`, data);
      } else {
        await api.post('/categories', {
          ...data,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        });
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
       alert('Failed to save category. Backend endpoint might not be properly set up.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#131921] uppercase italic tracking-tight">Categories</h1>
          <p className="text-sm font-bold text-slate-400 uppercase">Organize your store hierarchy</p>
        </div>
        <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-[#f08804] text-white font-bold rounded-xl hover:bg-[#e07b03] transition-colors shadow-sm text-sm uppercase tracking-wide">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#f08804]" />
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                     <Tags className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#131921]">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(cat)} className="p-1.5 text-slate-400 hover:text-[#f08804] bg-slate-50 hover:bg-orange-50 rounded transition-colors"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-4 line-clamp-2 min-h-[40px]">
                {cat.description || <span className="italic text-slate-400">No description provided</span>}
              </p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#131921]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-[#131921] uppercase italic tracking-tight">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-1.5">Name</label>
                <input {...register('name')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none" />
                {errors.name && <p className="text-xs text-red-500 mt-1 pl-1 font-bold">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-1.5">Description</label>
                <textarea rows={3} {...register('description')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center px-6 py-2.5 bg-[#131921] hover:bg-black text-white rounded-xl text-sm font-black uppercase tracking-widest transition-colors disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
