'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Plus, Edit3, Trash2, Package, Search, Upload, Eye, X, Save, FileUp, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CATEGORIES } from '@/lib/constants';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  stock: number;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  featured: boolean;
  categories: any[];
}

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  featured: z.boolean(),
  imageUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  categories: z.string().min(1, 'Category is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'draft',
      featured: false,
      price: 0,
      stock: 0,
      imageUrl: '',
      categories: '',
    }
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/products');
      // AdminController GET /admin/products might return array directly or { success: true, products: [] }
      setProducts(res.data.products || res.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    reset({
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      stock: product.stock,
      status: product.status,
      featured: product.featured,
      imageUrl: (product as any).image || '',
      categories: product.categories?.map(c => c.name).join(', ') || '',
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      status: 'draft',
      featured: false,
      imageUrl: 'https://via.placeholder.com/400',
      categories: 'General',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const onSubmit = async (data: ProductFormData | any) => {
    try {
      const payload = {
        ...data,
        currency: 'USD',
        categories: typeof data.categories === 'string' 
          ? data.categories.split(',').map((c: string) => c.trim()).filter(Boolean)
          : data.categories,
      };

      if (editingId) {
        await api.patch(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save product. Ensure the backend route allows updating properties.');
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#131921] uppercase italic tracking-tight">Products Management</h1>
          <p className="text-sm font-bold text-slate-400 uppercase">Manage your storefront inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-[#131921] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm uppercase tracking-wide">
            <FileUp className="h-4 w-4 mr-2" /> Import CSV
          </button>
          <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-[#f08804] text-white font-bold rounded-xl hover:bg-[#e07b03] transition-colors shadow-sm text-sm uppercase tracking-wide">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-extrabold">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-[#131921]">{product.name}</p>
                          <p className="text-xs text-slate-400 font-medium">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${product.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 text-slate-400">
                        <button onClick={() => handleEdit(product)} className="hover:text-[#f08804] transition-colors p-1"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(product.id)} className="hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                     <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#131921]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-[#131921] uppercase italic tracking-tight">
                {editingId ? 'Edit Product' : 'Create New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Name</label>
                  <input {...register('name')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none transition-all font-medium" />
                  {errors.name?.message && <p className="text-xs text-red-500 mt-1 pl-1 font-bold">{errors.name.message as string}</p>}
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Image URL</label>
                  <input {...register('imageUrl')} placeholder="https://..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none transition-all font-medium" />
                  {errors.imageUrl?.message && <p className="text-xs text-red-500 mt-1 pl-1 font-bold">{errors.imageUrl.message as string}</p>}
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Category</label>
                  <select 
                    {...register('categories')} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none transition-all font-medium appearance-none"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categories?.message && <p className="text-xs text-red-500 mt-1 pl-1 font-bold">{errors.categories.message as string}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Price ($)</label>
                  <input type="number" step="0.01" {...register('price')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none transition-all font-medium" />
                  {errors.price?.message && <p className="text-xs text-red-500 mt-1 pl-1 font-bold">{errors.price.message as string}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Stock</label>
                  <input type="number" {...register('stock')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none transition-all font-medium" />
                  {errors.stock?.message && <p className="text-xs text-red-500 mt-1 pl-1 font-bold">{errors.stock.message as string}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Status</label>
                  <select {...register('status')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none transition-all font-medium">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" {...register('featured')} id="featured" className="h-4 w-4 rounded border-slate-300 text-[#f08804] focus:ring-[#f08804]" />
                  <label htmlFor="featured" className="text-sm font-bold text-slate-600">Mark as Featured Product</label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Description</label>
                <textarea rows={4} {...register('description')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#f08804] outline-none transition-all font-medium"></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center px-6 py-2.5 bg-[#131921] hover:bg-black text-white rounded-xl text-sm font-black uppercase tracking-widest transition-colors shadow-lg shadow-black/10 disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
