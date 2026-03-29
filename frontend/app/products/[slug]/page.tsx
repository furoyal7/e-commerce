'use client';

import { useParams } from 'next/navigation';
import { useProduct, useAddToCart } from '../../hooks/use-api';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useProduct(slug);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCartMutation.mutate({
        productId: product.id,
        quantity,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product not found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <nav className="flex text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-gray-900">Products</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-96 object-cover object-center rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="bg-white rounded shadow-sm p-2">
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                <span className={`text-sm font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Category */}
            {product.category && (
              <div>
                <span className="text-sm text-gray-600">Category: </span>
                <a 
                  href={`/products?category=${product.category.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {product.category.name}
                </a>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Add to Cart</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                    className="w-16 text-center border-0 focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCartMutation.isPending}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : addToCartMutation.isPending
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {addToCartMutation.isPending
                  ? 'Adding to Cart...'
                  : product.stock === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'
                }
              </button>

              {addToCartMutation.isSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  Product added to cart successfully!
                </div>
              )}

              {addToCartMutation.isError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  Failed to add product to cart. Please try again.
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-600">Product ID:</dt>
                  <dd className="text-sm text-gray-900">{product.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-600">SKU:</dt>
                  <dd className="text-sm text-gray-900">{product.slug}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-600">Availability:</dt>
                  <dd className="text-sm text-gray-900">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-600">Added on:</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
