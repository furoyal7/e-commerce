import api from './api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  effective_price?: number;
  on_sale?: boolean;
  discount_percentage?: number;
  currency: string;
  stock: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'limited';
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';
  featured: boolean;
  image: string;
  images: string[];
  video_url?: string;
  tags: string[];
  publish_date?: string;
  sale_start?: string;
  sale_end?: string;
  created_at: string;
  updatedAt: string;
  categories: Category[];
  analytics?: {
    views: number;
    addToCartCount: number;
    purchaseCount: number;
  };
  _count?: {
    cartItems: number;
    orderItems: number;
    reviews: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  getProducts: (filters?: ProductFilters): Promise<{ products: Product[]; total: number }> =>
    api.get('products', { params: filters }).then(res => res.data),

  getProduct: (slug: string): Promise<Product> =>
    api.get(`products/slug/${slug}`).then(res => res.data.product),

  getProductById: (id: string): Promise<Product> =>
    api.get(`products/${id}`).then(res => res.data.product),
};

export const categoriesApi = {
  getCategories: (): Promise<Category[]> =>
    api.get('/categories').then(res => res.data),

  getRootCategories: (): Promise<Category[]> =>
    api.get('/categories/root').then(res => res.data),

  getCategory: (id: string): Promise<Category> =>
    api.get(`/categories/${id}`).then(res => res.data),
};
