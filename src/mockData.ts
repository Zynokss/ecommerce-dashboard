import type { 
  MetricCardData, 
  RevenueChartPoint, 
  Product, 
  Order, 
  Customer, 
  CountrySales, 
  StoreIntegration 
} from './types';

// --- Top-Line Metrics ---
export const mockMetrics: MetricCardData[] = [
  {
    title: 'Total Customer',
    value: '412.95K',
    change: '+34%',
    isPositive: true,
    timeframe: 'This month',
    bgColor: 'white'
  },
  {
    title: 'Total Revenue',
    value: '$48.20K',
    change: '+18%',
    isPositive: true,
    timeframe: 'This month',
    bgColor: 'mint'
  },
  {
    title: 'Total Deals',
    value: '3.15K',
    change: '+12%',
    isPositive: true,
    timeframe: 'This month',
    bgColor: 'sky'
  }
];

// --- Revenue Over Time Chart Data ---
export const mockRevenueChart: RevenueChartPoint[] = [
  { month: 'JAN', firstHalf: 45, topGross: 35 },
  { month: 'FEB', firstHalf: 50, topGross: 40 },
  { month: 'MAR', firstHalf: 75, topGross: 65 },
  { month: 'APR', firstHalf: 110, topGross: 140 },
  { month: 'MAY', firstHalf: 90, topGross: 175 },
  { month: 'JUN', firstHalf: 85, topGross: 145 },
  { month: 'JUL', firstHalf: 75, topGross: 90 },
  { month: 'AUG', firstHalf: 65, topGross: 75 },
  { month: 'SEP', firstHalf: 60, topGross: 70 },
  { month: 'OCT', firstHalf: 95, topGross: 105 },
  { month: 'NOV', firstHalf: 90, topGross: 95 },
  { month: 'DEC', firstHalf: 100, topGross: 90 }
];

// --- Catalog Products (20 Items) ---
export const mockProducts: Product[] = [
  {
    id: 'prod-01',
    name: 'Cyberpunk Oversized Hoodie',
    category: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 185,
    price: 95.00,
    totalSales: 2150,
    variants: { sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Graphite'] }
  },
  {
    id: 'prod-02',
    name: 'Stealth Tactical Cargo',
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'Low Stock',
    stockCount: 4,
    price: 120.00,
    totalSales: 1890,
    variants: { sizes: ['30', '32', '34'], colors: ['Dark Olive', 'Black'] }
  },
  {
    id: 'prod-03',
    name: 'Minimalist Core Tee',
    category: 'Essentials',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 310,
    price: 42.00,
    totalSales: 3410,
    variants: { sizes: ['S', 'M', 'L'], colors: ['White', 'Heather Gray'] }
  },
  {
    id: 'prod-04',
    name: 'Neon Cyber Bomber Jacket',
    category: 'Cyberwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 45,
    price: 189.99,
    totalSales: 870,
    variants: { sizes: ['M', 'L', 'XL'], colors: ['Neon Blue', 'Matte Black'] }
  },
  {
    id: 'prod-05',
    name: 'Future Matrix High-Tops',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 62,
    price: 210.50,
    totalSales: 1240,
    variants: { sizes: ['40', '41', '42', '43', '44'], colors: ['White/Cyber Violet'] }
  },
  {
    id: 'prod-06',
    name: 'Holographic LED Visor',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'Low Stock',
    stockCount: 2,
    price: 65.00,
    totalSales: 940,
    variants: { sizes: ['One Size'], colors: ['RGB Tint'] }
  },
  {
    id: 'prod-07',
    name: 'Modular Tech Crossbody Bag',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 88,
    price: 74.99,
    totalSales: 1560,
    variants: { sizes: ['Standard'], colors: ['Stealth Black', 'Concrete Gray'] }
  },
  {
    id: 'prod-08',
    name: 'Chrono Carbon Smartwatch',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 19,
    price: 299.00,
    totalSales: 630,
    variants: { sizes: ['44mm'], colors: ['Raw Carbon', 'Anodized Silver'] }
  },
  {
    id: 'prod-09',
    name: 'Night-Runner Windbreaker',
    category: 'Cyberwear',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 34,
    price: 142.50,
    totalSales: 1120,
    variants: { sizes: ['S', 'M', 'L'], colors: ['Reflective Silver'] }
  },
  {
    id: 'prod-10',
    name: 'Vaporwave Canvas Low-Tops',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'Low Stock',
    stockCount: 5,
    price: 95.00,
    totalSales: 1430,
    variants: { sizes: ['39', '40', '41', '42'], colors: ['Pastel Gradient'] }
  },
  {
    id: 'prod-11',
    name: 'Distressed Techwear Denim',
    category: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 27,
    price: 165.00,
    totalSales: 780,
    variants: { sizes: ['M', 'L', 'XL'], colors: ['Washed Black', 'Indigo'] }
  },
  {
    id: 'prod-12',
    name: 'Matte Black Anodized Ring Set',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 140,
    price: 32.00,
    totalSales: 2890,
    variants: { sizes: ['8', '9', '10', '11'], colors: ['Matte Black'] }
  },
  {
    id: 'prod-13',
    name: 'Matrix Trench Coat',
    category: 'Cyberwear',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 12,
    price: 245.00,
    totalSales: 410,
    variants: { sizes: ['M', 'L'], colors: ['Pitch Black'] }
  },
  {
    id: 'prod-14',
    name: 'Heavyweight Fleece Sweatpants',
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 95,
    price: 78.00,
    totalSales: 1620,
    variants: { sizes: ['S', 'M', 'L', 'XL'], colors: ['Charcoal', 'Oatmeal'] }
  },
  {
    id: 'prod-15',
    name: 'Retro Futuristic Sun-Shields',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 52,
    price: 58.00,
    totalSales: 1080,
    variants: { sizes: ['One Size'], colors: ['Chrome Mirror', 'Black'] }
  },
  {
    id: 'prod-16',
    name: 'Utility Strap Tactical Vest',
    category: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'Low Stock',
    stockCount: 3,
    price: 135.00,
    totalSales: 690,
    variants: { sizes: ['Adjustable'], colors: ['Tactical Tan', 'Black'] }
  },
  {
    id: 'prod-17',
    name: 'All-Terrain Cyber Combat Boots',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 38,
    price: 225.00,
    totalSales: 910,
    variants: { sizes: ['41', '42', '43', '44', '45'], colors: ['Crimson Red/Black'] }
  },
  {
    id: 'prod-18',
    name: 'Acid Wash Boxy Crewneck',
    category: 'Essentials',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 110,
    price: 68.00,
    totalSales: 2040,
    variants: { sizes: ['S', 'M', 'L', 'XL'], colors: ['Vintage Black', 'Washed Olive'] }
  },
  {
    id: 'prod-19',
    name: 'Seamless Thermal Compression Shirt',
    category: 'Essentials',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 74,
    price: 48.00,
    totalSales: 1350,
    variants: { sizes: ['S', 'M', 'L'], colors: ['Dark Slate', 'Black'] }
  },
  {
    id: 'prod-20',
    name: 'Waterproof Roll-Top Backpack',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    stockCount: 29,
    price: 115.00,
    totalSales: 820,
    variants: { sizes: ['25L'], colors: ['Matte Black', 'Olive Drab'] }
  }
];

// --- Top Countries Sales Data ---
export const mockCountries: CountrySales[] = [
  { country: 'United States', code: 'us', totalAmount: '52.10K', salesCount: '12.4K', trend: 'up' },
  { country: 'Germany', code: 'de', totalAmount: '38.40K', salesCount: '8.2K', trend: 'up' },
  { country: 'United Kingdom', code: 'gb', totalAmount: '34.80K', salesCount: '7.6K', trend: 'down' },
  { country: 'Japan', code: 'jp', totalAmount: '29.30K', salesCount: '5.9K', trend: 'up' },
  { country: 'Morocco', code: 'ma', totalAmount: '22.10K', salesCount: '4.8K', trend: 'up' }
];

// --- Top Customers (CRM) ---
export const mockTopCustomers: Customer[] = [
  {
    id: 'cust-01',
    name: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    purchasesCount: 34,
    totalSpent: 5820,
    country: 'United States',
    countryCode: 'US'
  },
  {
    id: 'cust-02',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    purchasesCount: 28,
    totalSpent: 4910,
    country: 'Germany',
    countryCode: 'DE'
  },
  {
    id: 'cust-03',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    purchasesCount: 22,
    totalSpent: 3840,
    country: 'United Kingdom',
    countryCode: 'GB'
  },
  {
    id: 'cust-04',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    purchasesCount: 19,
    totalSpent: 3100,
    country: 'Japan',
    countryCode: 'JP'
  }
];

// --- Recent Orders ---
export const mockRecentOrders: Order[] = [
  {
    id: 'ord-101',
    customerName: 'Alex Mercer',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    productName: 'Cyberpunk Oversized Hoodie',
    productCategory: 'Streetwear',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=120',
    amount: 190.00,
    status: 'Delivered',
    date: '5 mins ago'
  },
  {
    id: 'ord-102',
    customerName: 'Sarah Connor',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    productName: 'Minimalist Core Tee',
    productCategory: 'Essentials',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=120',
    amount: 84.00,
    status: 'Processing',
    date: '18 mins ago'
  },
  {
    id: 'ord-103',
    customerName: 'Marcus Vance',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    productName: 'Stealth Tactical Cargo',
    productCategory: 'Bottoms',
    productImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=120',
    amount: 120.00,
    status: 'Pending',
    date: '45 mins ago'
  }
];

// --- Integration Configs ---
export const mockIntegrations: StoreIntegration[] = [
  {
    id: 'int-01',
    storeName: 'Zynboard Official Store (Shopify)',
    type: 'shopify',
    isConnected: true,
    lastSyncedAt: 'Just now'
  },
  {
    id: 'int-02',
    storeName: 'PostgreSQL Warehouse DB',
    type: 'custom_postgres',
    isConnected: false
  }
];