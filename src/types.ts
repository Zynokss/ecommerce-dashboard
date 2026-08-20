// src/types.ts

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  bgColor: 'mint' | 'sky' | 'white';
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
}

export interface ProductColorObject {
  name: string;
  hex: string;
}

export type ProductColor = string | ProductColorObject;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image: string;
  images?: string[];
  stockCount: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  totalSales: number;
  sizes?: string[];
  colors?: ProductColor[];
  featured?: boolean;
  brand?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    category?: string;
    image?: string;
    images?: string[];
  };
}

export interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  email: string;
  phone?: string;
  productName: string;
  productCategory: string;
  productImage: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  address?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  purchasesCount: number;
  totalSpent: number;
  city: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
  usageCount: number;
}