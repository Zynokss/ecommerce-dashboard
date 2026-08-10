import type { MetricCardData, Order, OrderItem, RevenueChartPoint } from '../types';

const API_BASE = import.meta.env.VITE_STORE_API_URL || 'http://localhost:3000/api';

export interface CategoryBreakdown {
  name: string;
  amount: string;
  numericTotal: number;
  color?: string;
}

export interface LiveStatsResponse {
  metrics: MetricCardData[];
  topCategories: CategoryBreakdown[];
  chartData: RevenueChartPoint[];
  conversionFunnel?: {
    views: number;
    carts: number;
    checkout: number;
    completed: number;
  };
}

export async function fetchLiveStats(): Promise<LiveStatsResponse> {
  const defaultMetrics: MetricCardData[] = [
    { title: 'TOTAL SALES', value: '0.00 MAD', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'mint' },
    { title: 'TOTAL ORDERS', value: '0', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'sky' },
    { title: 'TOTAL VISITORS', value: '0', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'white' },
  ];

  try {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');

    const data = await res.json();

    const metrics: MetricCardData[] = [
      { 
        title: 'TOTAL SALES', 
        value: `${Number(data.revenue || 0).toFixed(2)} MAD`, 
        change: '+3.34%', 
        isPositive: true, 
        timeframe: 'vs last week', 
        bgColor: 'mint' 
      },
      { 
        title: 'TOTAL ORDERS', 
        value: Number(data.deals || 0).toLocaleString(), 
        change: '-2.89%', 
        isPositive: false, 
        timeframe: 'vs last week', 
        bgColor: 'sky' 
      },
      { 
        title: 'TOTAL VISITORS', 
        value: Number(data.customers || 0).toLocaleString(), 
        change: '+8.02%', 
        isPositive: true, 
        timeframe: 'vs last week', 
        bgColor: 'white' 
      },
    ];

    return {
      metrics,
      topCategories: Array.isArray(data.topCategories) ? data.topCategories : [],
      chartData: Array.isArray(data.chartData) ? data.chartData : [],
      conversionFunnel: data.conversionFunnel || {
        views: 25000,
        carts: 12000,
        checkout: 8500,
        completed: Number(data.deals || 0),
      },
    };
  } catch (err) {
    console.error('Failed to load live stats:', err);
    return {
      metrics: defaultMetrics,
      topCategories: [],
      chartData: [],
    };
  }
}

export async function fetchLiveMetrics(): Promise<MetricCardData[]> {
  const stats = await fetchLiveStats();
  return stats.metrics;
}

export async function fetchLiveOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');

    const data = await res.json();
    const rawOrders = Array.isArray(data.orders) ? data.orders : (Array.isArray(data) ? data : []);

    return rawOrders.map((dbOrder: any): Order => {
      const items: OrderItem[] = Array.isArray(dbOrder.items)
        ? dbOrder.items.map((it: any): OrderItem => ({
            id: String(it.id || Date.now()),
            productId: String(it.productId || ''),
            selectedSize: String(it.selectedSize || 'S'),
            selectedColor: it.selectedColor ? String(it.selectedColor) : undefined,
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
            product: {
              name: String(it.product?.name || it.name || 'Product'),
              category: String(it.product?.category || 'Streetwear'),
              image: String(it.product?.image || it.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop'),
            },
          }))
        : [];

      const firstItem = items[0];
      const productName = firstItem?.product?.name || 'Custom Order Item';
      const productCategory = firstItem?.product?.category || 'Streetwear';
      const productImage = firstItem?.product?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop';

      let uiStatus: Order['status'] = 'Pending';
      const rawStatus = String(dbOrder.status || '').toUpperCase();

      if (rawStatus === 'DELIVERED' || rawStatus === 'COMPLETED') uiStatus = 'Delivered';
      else if (rawStatus === 'SHIPPED') uiStatus = 'Shipped';
      else if (rawStatus === 'PROCESSING') uiStatus = 'Processing';
      else if (rawStatus === 'CANCELLED' || rawStatus === 'CANCELED') uiStatus = 'Cancelled';

      const customerName = `${dbOrder.firstName || ''} ${dbOrder.lastName || ''}`.trim() || String(dbOrder.email || 'Customer');

      return {
        id: String(dbOrder.id ?? ''),
        customerName,
        customerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          String(dbOrder.email || dbOrder.id || 'user')
        )}`,
        email: String(dbOrder.email || 'No email'),
        phone: String(dbOrder.phone || dbOrder.user?.phone || 'N/A'),
        productName: items.length > 1 ? `${productName} (+${items.length - 1} more)` : productName,
        productCategory,
        productImage,
        amount: Number(dbOrder.total) || 0,
        status: uiStatus,
        date: new Date(dbOrder.createdAt || Date.now()).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        address: String(dbOrder.address || ''),
        city: String(dbOrder.city || ''),
        zipCode: String(dbOrder.zipCode || ''),
        state: String(dbOrder.state || ''),
        items,
      };
    });
  } catch (error) {
    console.error('Error fetching live orders:', error);
    return [];
  }
}

export async function updateOrderStatusInDb(orderId: string, uiStatus: Order['status']): Promise<void> {
  let dbStatus = 'PROCESSING';
  if (uiStatus === 'Delivered') dbStatus = 'DELIVERED';
  if (uiStatus === 'Shipped') dbStatus = 'SHIPPED';
  if (uiStatus === 'Processing') dbStatus = 'PROCESSING';
  if (uiStatus === 'Cancelled') dbStatus = 'CANCELLED';
  if (uiStatus === 'Pending') dbStatus = 'PENDING_PAYMENT';

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      orderId: orderId,
      id: orderId,
      status: dbStatus 
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to update order status');
  }
}