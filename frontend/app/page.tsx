'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { apiClient } from '@/utils/api-client';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params: any = { status: 'published' };
        if (activeCategory) params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        
        const data = await apiClient.get<any>('/products', { params });
        setProducts(data.products || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products. Please check the backend connection.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex min-h-full flex-col bg-secondary-bg selection:bg-accent selection:text-white">
      <Navbar onSearch={(query) => setSearchQuery(query)} />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Sidebar */}
            <Sidebar 
              activeCategory={activeCategory} 
              onCategorySelect={(cat) => setActiveCategory(cat)} 
            />

            {/* Content Area */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-lg font-black tracking-tight text-[#0f1111] uppercase">
                  New Products
                </h2>
              </div>

              {/* Product Grid / Loading / Error */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-accent" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Inventory Sync in Progress...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-10 flex flex-col items-center gap-4 text-red-600">
                   <AlertCircle className="h-10 w-10" />
                   <h3 className="text-lg font-black uppercase tracking-tight">Deployment Error</h3>
                   <p className="text-xs font-bold uppercase tracking-widest text-center">{error}</p>
                   <button 
                     onClick={() => window.location.reload()}
                     className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                   >
                     Retry System Sync
                   </button>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 gray-50 rounded-2xl border-2 border-dashed border-slate-100">
                  <AlertCircle className="h-10 w-10 text-slate-300" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">No active deployments found in global inventory.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      name={product.name}
                      price={Number(product.price)}
                      image={product.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'}
                      categories={Array.isArray(product.categories) ? product.categories : [product.category || 'Tools']}
                      rating={4} // Default rating
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
