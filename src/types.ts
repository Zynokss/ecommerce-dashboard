// --- Core Analytics & Overview Metrics ---
export interface MetricCardData {
  title: string;
  value: string;
  change: string; // e.g., "+30%" or "-15%"
  isPositive: boolean;
  timeframe: string; // e.g., "This month"
  bgColor: 'mint' | 'sky' | 'white';
}

export interface RevenueChartPoint {
  month: string;
  firstHalf: number;
  topGross: number;
}

// --- Product & Inventory Management ---
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
  stockCount: number;
  price: number;
  totalSales: number;
  variants?: {
    sizes: string[];
    colors: string[];
  };
}

// --- Order & Fulfillment Management ---
export interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  productCategory: string;
  productImage: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

// --- Customer Management (CRM) ---
export interface Customer {
  id: string;
  name: string;
  avatar: string;
  purchasesCount: number;
  totalSpent: number; // Lifetime Value (LTV)
  country: string;
  countryCode: string; // e.g., 'US', 'CA', 'AU'
}

// --- Country Sales Data ---
export interface CountrySales {
  country: string;
  code: string; // ISO 2-letter code for flags
  totalAmount: string;
  salesCount: string;
  trend: 'up' | 'down';
}

// --- Client Integration Layer ---
export type StoreType = 'shopify' | 'woocommerce' | 'custom_postgres' | 'mock';

export interface StoreIntegration {
  id: string;
  storeName: string;
  type: StoreType;
  isConnected: boolean;
  apiKey?: string;
  connectionUrl?: string;
  lastSyncedAt?: string;
}