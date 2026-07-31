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
  const { data, error } = await supabase
    .from('Product')
    .insert([
      {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        description: productData.name,
        sizes: ['S', 'M', 'L', 'XL'],
        images: [productData.image],
        inStock: productData.stockStatus === 'In Stock',
      },
    ])
    .select();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data[0];
}

export async function updateProductInDb(product: Product) {
  const { data, error } = await supabase
    .from('Product')
    .update({
      name: product.name,
      category: product.category,
      price: product.price,
      images: [product.image],
      inStock: product.stockStatus === 'In Stock',
    })
    .eq('id', product.id)
    .select();

  if (error) {
    console.error('Error updating product:', error);
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
    console.error('Error deleting product:', error);
    throw error;
  }
}