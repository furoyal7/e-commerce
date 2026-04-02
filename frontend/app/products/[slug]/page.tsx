'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/use-api';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Loader2, AlertCircle, ChevronLeft, Heart, Share2, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const { data: product, isLoading, error } = useProduct(slug) as any;
  const { addToCart } = useCart();

  useEffect(() => {
    if (addedSuccess) {
      const timer = setTimeout(() => setAddedSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [addedSuccess]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    setErrorStatus(null);
    try {
      await addToCart(product.id, quantity);
      setAddedSuccess(true);
    } catch (err: any) {
      setErrorStatus(err.message || 'Authentication required to add items to cart.');
      if (err.message?.includes('logged in')) {
          router.push('/login');
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-[#f08804] border-t-transparent rounded-full font-mono"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Sync in Progress...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-10 gap-6">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center text-red-400">
             <AlertCircle className="h-10 w-10" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-[#131921] uppercase italic tracking-tight">Product Not Found</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">The requested asset could not be located in global inventory.</p>
          </div>
          <Link href="/products" className="bg-[#131921] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#232f3e] transition-all">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = product.images?.length > 0 ? product.images : [product.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'];
  const stockCount = typeof product.stock === 'number' ? product.stock : 0;
  const inStock = stockCount > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Back Button */}
          <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 hover:text-[#f08804] transition-colors group">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
          </Link>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Image Gallery Section */}
            <div className="w-full lg:w-[600px] flex gap-4">
              {/* Thumbnails */}
              <div className="hidden sm:flex flex-col gap-3">
                {allImages.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${activeImage === idx ? 'border-[#f08804] shadow-md' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="Thumb" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center relative overflow-hidden group">
                <img 
                  src={allImages[activeImage]} 
                  alt={product.name} 
                  className="max-h-[500px] w-auto object-contain transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md text-slate-400 hover:text-red-500 transition-colors border border-slate-100">
                        <Heart className="h-5 w-5" />
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md text-slate-400 hover:text-[#f08804] transition-colors border border-slate-100">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="bg-[#131921] text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded">
                        {product.categories?.[0]?.name || 'TECHNICAL'}
                    </span>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 4 ? 'fill-[#f08804] text-[#f08804]' : 'text-slate-200'}`} />
                        ))}
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4.8 Rating</span>
                    </div>
                </div>
                
                <h1 className="text-5xl font-black text-[#131921] uppercase italic tracking-tighter leading-none">
                  {product.name}
                </h1>
                
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest max-w-xl leading-relaxed">
                  {product.description || 'Global inventory asset with certified technical specifications and industrial-grade durability.'}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="flex items-end gap-6 uppercase">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 tracking-widest block">Unit Price</span>
                  <span className="text-5xl font-black text-[#131921] italic tracking-tighter">
                    ${Number(product.effective_price || product.price).toFixed(2)}
                  </span>
                </div>
                <div className="pb-1.5">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] shadow-sm border ${inStock ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {inStock ? `${stockCount} IN STOCK` : 'UNAVAILABLE'}
                  </span>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-md">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Quantity</span>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-[#f08804] text-slate-400 transition-colors">
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-black text-[#131921]">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(stockCount, quantity + 1))} className="p-3 hover:text-[#f08804] text-slate-400 transition-colors">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {errorStatus && (
                    <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 animate-pulse">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{errorStatus}</span>
                    </div>
                )}

                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding || !inStock}
                  className="w-full bg-[#f08804] text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#e07b03] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#f08804]/20 disabled:opacity-30 disabled:grayscale"
                >
                  {isAdding ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : addedSuccess ? (
                    'Added Success!'
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" /> Add to Secure Cart
                    </>
                  )}
                </button>

                <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-[#f08804]">
                         <Truck className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Priority<br/>Shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-[#f08804]">
                         <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Secure<br/>Sync</span>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="space-y-4 max-w-xl">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest underline decoration-[#f08804] decoration-2 underline-offset-4">Technical Specifications</span>
                 </div>
                 <div className="grid grid-cols-2 gap-y-4 py-6 border-y border-slate-100">
                    <div>
                        <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Stock ID</span>
                        <span className="font-mono text-[10px] font-bold text-slate-600 truncate block uppercase">{product.id}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Global SKU</span>
                        <span className="font-mono text-[10px] font-bold text-slate-600 block uppercase">{product.slug}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Availability</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Sync</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Verified Logistics</span>
                        <span className="text-[10px] font-black text-[#f08804] uppercase tracking-widest">AmazonX Global</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
