import type { MetricCardData, Order, OrderItem, RevenueChartPoint } from '../types';

const API_BASE = import.meta.env.VITE_STORE_API_URL || 'http://localhost:3000/api';

export class AuthError extends Error {}

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
  totalVisitors: number;
  conversionRate: string;
}

export async function fetchLiveStats(): Promise<LiveStatsResponse> {
  const defaultMetrics: MetricCardData[] = [
    { title: 'Total Sales', value: '0.00 MAD', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'mint' },
    { title: 'Total Orders', value: '0', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'sky' },
    { title: 'Registered Users', value: '0', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'white' },
  ];

  try {
    const res = await fetch(`${API_BASE}/admin/stats`, { credentials: 'include' });
    if (res.status === 401 || res.status === 403) throw new AuthError('Session expired or unauthorized');
    if (!res.ok) throw new Error('Failed to fetch stats');

    const data = await res.json();
    const stats = data.stats || {};

    const metrics: MetricCardData[] = [
      {
        title: 'Total Sales',
        value: `${Number(stats.totalRevenue || 0).toFixed(2)} MAD`,
        change: '+0%',
        isPositive: true,
        timeframe: 'all time',
        bgColor: 'mint',
      },
      {
        title: 'Total Orders',
        value: Number(stats.totalOrders || 0).toLocaleString(),
        change: '+0%',
        isPositive: true,
        timeframe: 'all time',
        bgColor: 'sky',
      },
      {
        title: 'Registered Users',
        value: Number(stats.totalVisitors || 0).toLocaleString(),
        change: '+0%',
        isPositive: true,
        timeframe: 'all time',
        bgColor: 'white',
      },
    ];

    return {
      metrics,
      topCategories: Array.isArray(stats.topCategories) ? stats.topCategories : [],
      chartData: Array.isArray(stats.chartData) ? stats.chartData : [],
      totalVisitors: Number(stats.totalVisitors || 0),
      conversionRate: String(stats.conversionRate || '0%'),
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    console.error('Failed to load live stats:', err);
    return {
      metrics: defaultMetrics,
      topCategories: [],
      chartData: [],
      totalVisitors: 0,
      conversionRate: '0%',
    };
  }
}

export async function fetchLiveMetrics(): Promise<MetricCardData[]> {
  const stats = await fetchLiveStats();
  return stats.metrics;
}

export async function fetchLiveOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/orders`, { credentials: 'include' });
    if (res.status === 401 || res.status === 403) throw new AuthError('Session expired or unauthorized');
    if (!res.ok) throw new Error('Failed to fetch orders');

    const data = await res.json();
    const rawOrders = Array.isArray(data.orders) ? data.orders : (Array.isArray(data) ? data : []);

    return rawOrders.map((dbOrder: any, orderIdx: number): Order => {
      const items: OrderItem[] = Array.isArray(dbOrder.items)
        ? dbOrder.items.map((it: any, itemIdx: number): OrderItem => ({
            id: String(it.id || `${dbOrder.id || 'ord'}-item-${itemIdx}`),
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
        id: String(dbOrder.id ?? `order-${orderIdx}`),
        customerName,
        customerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          String(dbOrder.email || dbOrder.id || `user-${orderIdx}`)
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
    if (error instanceof AuthError) throw error;
    console.error('Error fetching live orders:', error);
    return [];
  }
}

export async function updateOrderStatusInDb(orderId: string, uiStatus: Order['status']): Promise<void> {
  let dbStatus = 'PROCESSING';
  if (uiStatus === 'Delivered') dbStatus = 'DELIVERED';
  if (uiStatus === 'Shipped') dbStatus = 'SHIPPED';
  if (uiStatus === 'Processing') dbStatus = 'PROCESSING';
  if (uiStatus === 'Cancelled') dbStatus = 'CANCELED';
  if (uiStatus === 'Pending') dbStatus = 'PENDING_PAYMENT';

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'PATCH',
    credentials: 'include',
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
