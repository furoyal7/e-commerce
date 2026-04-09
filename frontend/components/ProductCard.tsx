'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye, Loader2, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getCategoryIcon } from '@/lib/constants';

interface ProductCardProps {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviews?: number;
  image: string;
  categories: any[];
  featured?: boolean;
  onSale?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  discountPrice,
  rating,
  image,
  categories,
  featured,
  onSale,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const router = require('next/navigation').useRouter();

  const handleNavigate = () => {
    router.push(`/products/${slug}`);
  };


  const displayCategory = Array.isArray(categories) 
    ? (categories[0]?.name || categories[0] || 'Uncategorized') 
    : 'Uncategorized';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(id.toString(), 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div 
      onClick={handleNavigate}
      className="group relative flex flex-col bg-white rounded-lg border border-border overflow-hidden transition-all hover:shadow-md h-full cursor-pointer"
    >
      {/* Badges ... (No change) */}
      <div className="absolute top-4 left-0 z-10 flex flex-col gap-1">
        {featured && (
          <div className="bg-[#f08804] px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest shadow-sm">
            FEATURED
          </div>
        )}
        {onSale && (
          <div className="bg-destructive px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest shadow-sm relative">
            SALE
            <span className="absolute right-0 top-0 h-full w-2 bg-destructive skew-x-12 translate-x-1" />
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-[#f7f8f8] p-4">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-accent hover:text-white transition-all disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : added ? <Check className="h-4 w-4 text-green-500" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-accent hover:text-white transition-all"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button 
            onClick={handleNavigate}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-accent hover:text-white transition-all"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2 p-5 text-left">
        <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-accent uppercase">
          <span className="text-[14px] leading-none mb-0.5">{getCategoryIcon(displayCategory)}</span>
          {displayCategory}
        </span>
        <h3 className="text-[14px] font-bold text-[#0f1111] line-clamp-2 leading-tight min-h-[40px] group-hover:text-accent transition-colors">
          {name}
        </h3>

        
        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < rating ? 'fill-accent text-accent' : 'text-gray-300'}`} />
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-[16px] font-black text-[#0f1111]">
            ${(onSale && discountPrice ? discountPrice : price).toFixed(2)}
          </span>
          {onSale && discountPrice && (
            <span className="text-[13px] font-medium text-[#565959] line-through opacity-50">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
