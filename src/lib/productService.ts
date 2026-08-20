// src/lib/productService.ts
import type { Product } from '../types';

const API_BASE = import.meta.env.VITE_STORE_API_URL || 'http://localhost:3000/api';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    const rawProducts = Array.isArray(data) ? data : data.products || [];

    return rawProducts.map((item: any) => ({
      id: String(item.id),
      name: String(item.name || ''),
      category: String(item.category || 'Streetwear'),
      price: Number(item.price || 0),
      description: String(item.description || ''),
      image: Array.isArray(item.images) && item.images.length > 0 
        ? item.images[0] 
        : item.image || 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop',
      images: Array.isArray(item.images) ? item.images : [item.image],
      stockCount: item.inStock ? 50 : 0,
      stockStatus: item.inStock ? 'In Stock' : 'Out of Stock',
      totalSales: Number(item.totalSales || 0),
      sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
      colors: Array.isArray(item.colors) ? item.colors : [],
      featured: Boolean(item.featured),
      brand: String(item.brand || 'ZYN'),
    }));
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
}

export async function createProductInDb(productData: Omit<Product, 'id'>) {
  const payload = {
    name: productData.name,
    category: productData.category || 'Streetwear',
    price: Number(productData.price) || 0,
    description: productData.description || productData.name,
    image: productData.image,
    images: productData.images && productData.images.length > 0 ? productData.images : [productData.image],
    inStock: productData.stockStatus === 'In Stock',
    sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
    colors: productData.colors || [],
    featured: productData.featured || false,
    brand: productData.brand || 'ZYN',
  };

  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create product');
  }

  const data = await res.json();
  return data.product || data;
}

export async function updateProductInDb(product: Product) {
  const payload = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price) || 0,
    description: product.description,
    image: product.image,
    images: product.images && product.images.length > 0 ? product.images : [product.image],
    inStock: product.stockStatus === 'In Stock',
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    colors: product.colors || [],
    featured: product.featured || false,
    brand: product.brand || 'ZYN',
  };

  const res = await fetch(`${API_BASE}/products`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to update product');
  }

  const data = await res.json();
  return data.product || data;
}

export async function deleteProductFromDb(id: string) {
  const res = await fetch(`${API_BASE}/products?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to delete product');
  }

  return true;
}