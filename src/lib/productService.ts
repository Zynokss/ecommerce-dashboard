import type { Product } from '../types';

const API_BASE = import.meta.env.VITE_STORE_API_URL || 'http://localhost:3000/api';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    const rawProducts = data.products || [];

    return rawProducts.map((item: any) => ({
      id: String(item.id),
      name: String(item.name || ''),
      category: String(item.category || 'Uncategorized'),
      price: Number(item.price || 0),
      description: String(item.description || ''),
      image: Array.isArray(item.images) && item.images.length > 0 
        ? item.images[0] 
        : item.image || 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop',
      stockCount: item.inStock ? 50 : 0,
      stockStatus: item.inStock ? 'In Stock' : 'Low Stock',
      totalSales: Number(item.totalSales || 0),
      colors: Array.isArray(item.colors) ? item.colors : [],
    }));
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
}

export async function createProductInDb(productData: Omit<Product, 'id'>) {
  const name = productData.name;
  const category = productData.category || 'Streetwear';
  const price = Number(productData.price) || 0;
  const description = productData.description || productData.name || '';
  const image = productData.image || 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop';
  const inStock = productData.stockStatus === 'In Stock';
  const colors = Array.isArray(productData.colors) ? productData.colors : [];

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category,
        price,
        description,
        image,
        images: [image],
        inStock,
        colors,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to create product');
    }

    const data = await res.json();
    return data.product;
  } catch (error: any) {
    console.error('API PRODUCT INSERT ERROR:', error.message || error);
    throw error;
  }
}

export async function updateProductInDb(product: Product) {
  const name = product.name;
  const category = product.category;
  const price = Number(product.price) || 0;
  const description = product.description || product.name || '';
  const image = product.image;
  const inStock = product.stockStatus === 'In Stock';
  const colors = Array.isArray(product.colors) ? product.colors : [];

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: product.id,
        name,
        category,
        price,
        description,
        image,
        images: [image],
        inStock,
        colors,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to update product');
    }

    const data = await res.json();
    return data.product;
  } catch (error: any) {
    console.error('API PRODUCT UPDATE ERROR:', error.message || error);
    throw error;
  }
}

export async function deleteProductFromDb(id: string) {
  try {
    const res = await fetch(`${API_BASE}/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to delete product');
    }

    return true;
  } catch (error: any) {
    console.error('API PRODUCT DELETE ERROR:', error.message || error);
    throw error;
  }
}