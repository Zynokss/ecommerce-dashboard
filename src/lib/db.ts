// src/lib/api.ts (In ecommerce-dashboard)
const BASE_URL = import.meta.env.VITE_STORE_API_URL || 'http://localhost:3000/api';

export async function getDashboardStats() {
  const res = await fetch(`${BASE_URL}/admin/stats`, { credentials: 'include' });
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`, { credentials: 'include' });
  return res.json();
}

export async function addProduct(productData: any) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${BASE_URL}/products?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}