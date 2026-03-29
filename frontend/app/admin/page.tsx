'use client';

import React, { useState, useEffect, useOptimistic, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '../../utils/api-client';
import { 
  Package, 
  Plus, 
  DollarSign, 
  Tag, 
  Image as ImageIcon, 
  FileText,
  CheckCircle2,
  TrendingUp,
  Box,
  AlertCircle,
  Clock,
  ExternalLink,
  Trash2,
  Loader2,
  Globe,
  Edit
} from 'lucide-react';

// Zod Schema for validation
const productSchema = z.object({
  name: z.string().min(3, 'Tool name must be at least 3 characters'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  discount_price: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
  categories: z.string().min(1, 'Please select categories (comma separated)'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
  featured: z.boolean().default(false),
  tags: z.string().optional(),
  publish_date: z.string().optional(),
  sale_start: z.string().optional(),
  sale_end: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  effective_price?: number;
  currency: string;
  categories: { name: string }[] | string[];
  image: string;
  images: string[];
  status: string;
  visibility: string;
  featured: boolean;
  created_at: string;
  stock: number;
  analytics?: {
    views: number;
    addToCartCount: number;
    purchaseCount: number;
  };
}

interface Stats {
  activeItems: number;
  liveValuation: number;
  totalOrders: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState<Stats>({ activeItems: 0, liveValuation: 0, totalOrders: 0, pendingOrders: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const [isPending, startTransition] = useTransition();

  // Optimistic UI Hook
  const [optimisticProducts, addOptimisticProduct] = useOptimistic(
    products,
    (state: Product[], newProduct: Product | { id: string, delete: boolean }) => {
      if ('delete' in newProduct && newProduct.delete) {
        return state.filter(p => p.id !== newProduct.id);
      }
      return [newProduct as Product, ...state];
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      currency: 'USD',
      categories: 'Precision Tools',
      stock: 0,
      status: 'published',
      visibility: 'public',
      featured: false
    }
  });

  const fetchData = async () => {
    try {
      // Get admin stats, products and analytics
      const [statsData, productsData, analyticsData] = await Promise.all([
        apiClient.get<any>('/admin/stats'),
        apiClient.get<any>('/admin/products'),
        apiClient.get<any>('/admin/analytics').catch(() => null)
      ]);
      
      const products = productsData || [];
      const activeItems = statsData.publishedProducts || 0;
      const liveValuation = statsData.totalRevenue || 0;

      setStats({
        activeItems,
        liveValuation,
        totalOrders: statsData.totalOrders || 0,
        pendingOrders: statsData.pendingOrders || 0
      });
      setProducts(products);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({ activeItems: 0, liveValuation: 0, totalOrders: 0, pendingOrders: 0 });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
       window.location.href = '/login';
       return;
    }
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        setValue('imageUrl', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setErrorStatus(null);
    
    // Format categories and tags into arrays
    const payload = {
      ...data,
      categories: data.categories.split(',').map(s => s.trim()),
      tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
    };

    startTransition(async () => {
      try {
        if (editingProduct) {
          await apiClient.patch(`/products/${editingProduct.id}`, payload);
          setEditingProduct(null);
        } else {
          await apiClient.post('/products', payload);
        }
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        reset();
        setPreviewImage(null);
        fetchData();
      } catch (err: any) {
        setErrorStatus(err.message || 'Deployment failure. Rollback engaged.');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('price', product.price);
    setValue('discount_price', product.discount_price);
    setValue('stock', product.stock);
    setValue('description', product.description);
    setValue('imageUrl', product.image);
    setValue('categories', Array.isArray(product.categories) ? product.categories.map((c: any) => typeof c === 'string' ? c : c.name).join(', ') : '');
    setValue('status', product.status as any);
    setValue('visibility', product.visibility as any);
    setValue('featured', product.featured);
    setPreviewImage(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    reset();
    setPreviewImage(null);
  };

  const bulkStatusUpdate = async (ids: string[], action: string) => {
    try {
      await apiClient.post('/admin/products/bulk', { ids, action });
      fetchData();
    } catch (err) {
      console.error('Bulk action failed:', err);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
      await apiClient.patch(`/products/${id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    
    startTransition(async () => {
      addOptimisticProduct({ id, delete: true });
      try {
        await apiClient.delete(`/products/${id}`);
        fetchData();
      } catch (err: any) {
        setErrorStatus('Deletion failed. Rollback engaged.');
      }
    });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Top Banner/Stats */}
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#131921] tracking-tight mb-2 uppercase italic">
            Control Center
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Advanced Tool Management & Global Logistics
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Live Tools', value: stats.activeItems.toString(), icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Valuation', value: `$${Number(stats.liveValuation).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Open Orders', value: stats.pendingOrders.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Volume', value: stats.totalOrders.toString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 transition-all hover:shadow-md">
            <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
              <p className="text-2xl font-black text-[#131921] italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          {/* Main Deployment Form */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#f08804]/10 text-[#f08804] flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#131921] tracking-tight uppercase">
                  {editingProduct ? `Modify Entry: ${editingProduct.id}` : 'Deploy Technical Asset'}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Full System Configuration</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
              {errorStatus && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 animate-pulse">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-xs font-bold uppercase tracking-widest">{errorStatus}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Asset Name</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                    <input {...register('name')} type="text" placeholder="Technical Identifier" className={`w-full bg-slate-50 border ${errors.name ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Price Configuration (Base/Sale)</label>
                  <div className="flex gap-2">
                    <div className="relative group flex-1">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                      <input {...register('price')} type="number" step="0.01" placeholder="Base" className={`w-full bg-slate-50 border ${errors.price ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} />
                    </div>
                    <div className="relative group flex-1">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                      <input {...register('discount_price')} type="number" step="0.01" placeholder="Sale" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none" />
                    </div>
                  </div>
                  {errors.price && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Logistic Categories (Comma Separated)</label>
                  <div className="relative group">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                    <input {...register('categories')} type="text" placeholder="e.g. AI, Backend, Tools" className={`w-full bg-slate-50 border ${errors.categories ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} />
                  </div>
                  {errors.categories && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.categories.message}</p>}
                </div>

                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Control Status & Visibility</label>
                   <div className="flex gap-2">
                     <select {...register('status')} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none appearance-none">
                        <option value="published">Live (Public)</option>
                        <option value="draft">Draft (Private)</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="archived">Archived</option>
                     </select>
                     <select {...register('visibility')} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none appearance-none">
                        <option value="public">Global Public</option>
                        <option value="private">internal Use</option>
                        <option value="unlisted">Link Only</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Inventory & Featured</label>
                  <div className="flex gap-4 items-center">
                    <div className="relative group flex-1">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input {...register('stock')} type="number" placeholder="Units" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] transition-all outline-none" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 hover:bg-white transition-all">
                       <input {...register('featured')} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#f08804] focus:ring-[#f08804]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#131921]">Promote</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">SEO Tags (Comma Separated)</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                    <input {...register('tags')} type="text" placeholder="SEO Keywords" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none" />
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Visual Asset Selection</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button type="button" onClick={() => setImageMode('url')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${imageMode === 'url' ? 'bg-white text-[#131921]' : 'text-slate-400'}`}>URL</button>
                      <button type="button" onClick={() => setImageMode('upload')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${imageMode === 'upload' ? 'bg-white text-[#131921]' : 'text-slate-400'}`}>Upload</button>
                    </div>
                  </div>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('imageUrl')} type="url" placeholder="Technical Image URL" className={`w-full bg-slate-50 border ${errors.imageUrl ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] outline-none`} />
                  </div>
                  {errors.imageUrl && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.imageUrl.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Technical Documentation</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                  <textarea {...register('description')} rows={4} placeholder="Full Spec Sheets..." className={`w-full bg-slate-50 border ${errors.description ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-[#f08804] outline-none resize-none`}></textarea>
                </div>
                {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.description.message}</p>}
              </div>

              <div className="flex items-center justify-between pt-4">
                 <div className="flex items-center gap-3">
                    {editingProduct && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                    )}
                 </div>
                 <button disabled={isSubmitting} type="submit" className={`px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-white transition-all shadow-xl ${success ? 'bg-green-500' : 'bg-[#131921] hover:bg-[#232f3e]'}`}>
                   {isSubmitting ? 'Syncing...' : success ? 'Entry Synced!' : editingProduct ? 'Commit Changes' : 'Initialize Asset'}
                 </button>
              </div>
            </form>
          </div>

          {/* Active Logistics Table */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Package className="h-6 w-6 text-slate-600" />
                  <div>
                    <h2 className="text-xl font-black text-[#131921] uppercase tracking-tight">Active Inventory</h2>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => fetchData()} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                      <Clock className="h-4 w-4 text-slate-400" />
                   </button>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metrics</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status/Control</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {optimisticProducts.map((product) => (
                      <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                             <div className="h-10 w-10 bg-slate-100 rounded-lg overflow-hidden">
                                <img src={product.image || '/placeholder.jpg'} alt={product.name} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                             </div>
                             <div>
                                <p className="text-[13px] font-black text-[#131921] uppercase italic">{product.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                   {Array.isArray(product.categories) ? product.categories.map((c: any) => c.name || c).join(' / ') : 'Base Tool'}
                                </p>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 font-bold text-xs uppercase">
                           <div className="flex flex-col gap-1">
                              <span className="text-slate-400">Views: <span className="text-[#131921]">{product.analytics?.views || 0}</span></span>
                              <span className="text-slate-400">Rate: <span className="text-green-600">+{product.analytics?.purchaseCount || 0}</span></span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex gap-2 items-center">
                              <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${product.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{product.status}</span>
                              <span className="text-[8px] font-black uppercase text-slate-300">|</span>
                              <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${product.visibility === 'public' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>{product.visibility}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right space-x-2">
                           <button onClick={() => handleEdit(product)} className="text-[#f08804] p-2 hover:bg-[#f08804]/10 rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                           <button onClick={() => deleteProduct(product.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          <div className="bg-[#131921] p-10 rounded-[40px] shadow-2xl text-white">
            <h3 className="text-lg font-black uppercase italic mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
               <TrendingUp className="h-5 w-5 text-[#f08804]" />
               Performance Log
            </h3>
            
            <div className="space-y-8">
              {analytics?.productViews?.map((item: any) => (
                <div key={item.productId} className="flex items-center justify-between group">
                   <div className="flex-1 overflow-hidden mr-4">
                      <p className="text-[11px] font-black uppercase truncate group-hover:text-[#f08804] transition-colors">{item.product.name}</p>
                      <div className="flex gap-4 mt-1">
                         <span className="text-[9px] text-white/30 uppercase">Views: {item.views}</span>
                         <span className="text-[9px] text-white/30 uppercase">Cart: {item.addToCartCount}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-black italic text-[#f08804]">{item.purchaseCount}</div>
                      <div className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Units</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#f08804] p-8 rounded-[40px] text-white">
             <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <h4 className="text-[12px] font-black uppercase">System Verified</h4>
             </div>
             <p className="text-[10px] font-bold leading-relaxed uppercase opacity-80">
                Data layer is fully synchronized with edge servers. All inventory movements are immutable and tracked for audit logging.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
