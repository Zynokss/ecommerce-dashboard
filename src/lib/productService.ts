import { supabase } from './supabase';
import type { Product } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  const items = data || [];

  return items.map((item: any) => ({
    id: String(item.id),
    name: String(item.name || ''),
    category: String(item.category || 'Uncategorized'),
    price: Number(item.price || 0),
    description: String(item.description || ''),
    image: Array.isArray(item.images) && item.images.length > 0 
      ? item.images[0] 
      : 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop',
    stockCount: item.inStock ? 50 : 0,
    stockStatus: item.inStock ? 'In Stock' : 'Low Stock',
    totalSales: Number(item.totalSales || 0),
  }));
}

export async function createProductInDb(productData: Omit<Product, 'id'>) {
  const now = new Date().toISOString();

  const payload: Record<string, any> = {
    id: `prod_${Date.now()}`,
    name: productData.name,
    category: productData.category || 'Uncategorized',
    price: Number(productData.price) || 0,
    description: productData.description || productData.name || '',
    images: productData.image ? [productData.image] : [],
    inStock: productData.stockStatus === 'In Stock',
    createdAt: now,
    updatedAt: now,
  };

  const { data, error } = await supabase
    .from('Product')
    .insert([payload])
    .select();

  if (error) {
    console.error('SUPABASE DB INSERT ERROR:', error.message, error.details, error.hint);
    throw error;
  }

  return data[0];
}

export async function updateProductInDb(product: Product) {
  const payload: Record<string, any> = {
    name: product.name,
    category: product.category,
    price: Number(product.price) || 0,
    description: product.description || product.name || '',
    images: product.image ? [product.image] : [],
    inStock: product.stockStatus === 'In Stock',
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('Product')
    .update(payload)
    .eq('id', product.id)
    .select();

  if (error) {
    console.error('SUPABASE DB UPDATE ERROR:', error.message, error.details, error.hint);
    throw error;
  }

  return data[0];
}

export async function deleteProductFromDb(id: string) {
  const { error } = await supabase
    .from('Product')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('SUPABASE DB DELETE ERROR:', error.message, error.details, error.hint);
    throw error;
  }
}