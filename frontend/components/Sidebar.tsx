import React from 'react';
import { ChevronDown, Plus, Star } from 'lucide-react';

const categories = [
  { name: 'Clothes', icon: '👕' },
  { name: 'Footwear', icon: '👟' },
  { name: 'Jewelry', icon: '💎' },
  { name: 'Perfume', icon: '🧴' },
  { name: 'Cosmetics', icon: '💄' },
  { name: 'Glasses', icon: '👓' },
  { name: 'Bags', icon: '👜' },
];

const bestSellers = [
  {
    name: 'Baby Fabric Shoes',
    price: 4.00,
    oldPrice: 5.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100',
  },
  {
    name: "Men's Hoodies T-Shirt",
    price: 7.00,
    oldPrice: 17.00,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=100',
  },
  {
    name: 'Girls T-Shirt',
    price: 3.00,
    oldPrice: 5.00,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=100',
  },
  {
    name: 'Woolen Hat For Men',
    price: 12.00,
    oldPrice: 15.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=100',
  },
];

export default function Sidebar() {
  return (
    <div className="w-full lg:w-[300px] flex flex-col gap-8 shrink-0">
      {/* Category Section */}
      <div className="rounded-lg bg-white border border-border p-6 shadow-sm">
        <h3 className="text-sm font-black tracking-widest text-[#0f1111] uppercase mb-6 flex items-center justify-between">
          Category
        </h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <div key={cat.name} className="group flex items-center justify-between py-2.5 cursor-pointer border-b border-border/50 last:border-none">
              <div className="flex items-center gap-3">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-[13px] font-medium text-[#565959] group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
              </div>
              <Plus className="h-3 w-3 text-[#565959] group-hover:text-accent" />
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-black tracking-widest text-[#0f1111] uppercase border-b border-border pb-2">
          Best Sellers
        </h3>
        <div className="flex flex-col gap-6">
          {bestSellers.map((product) => (
            <div key={product.name} className="flex gap-4 group cursor-pointer">
              <div className="h-16 w-16 shrink-0 rounded border border-border bg-[#f7f8f8] overflow-hidden">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[12px] font-bold text-[#0f1111] group-hover:text-accent transition-colors leading-tight">
                  {product.name}
                </h4>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-2.5 w-2.5 ${i < product.rating ? 'fill-accent text-accent' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[12px] font-black text-[#565959] line-through opacity-50">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                  <span className="text-[13px] font-black text-[#0f1111]">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
