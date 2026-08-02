import { supabase } from './supabase';
import type { MetricCardData, Order } from '../types';

export async function fetchLiveMetrics(): Promise<MetricCardData[]> {
  const defaultMetrics: MetricCardData[] = [
    { title: 'TOTAL CUSTOMER', value: '0', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'sky' },
    { title: 'TOTAL REVENUE', value: '0.00 MAD', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'mint' },
    { title: 'TOTAL DEALS', value: '0', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'white' },
  ];

  try {
    const { count: customerCount } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true });

    const { data: orders } = await supabase
      .from('Order')
      .select('total');

    const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
    const totalDeals = orders?.length || 0;

    return [
      { 
        title: 'TOTAL CUSTOMER', 
        value: (customerCount || 0).toLocaleString(), 
        change: '+0%', 
        isPositive: true, 
        timeframe: 'this month', 
        bgColor: 'sky' 
      },
      { 
        title: 'TOTAL REVENUE', 
        value: `${totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`, 
        change: '+0%', 
        isPositive: true, 
        timeframe: 'this month', 
        bgColor: 'mint' 
      },
      { 
        title: 'TOTAL DEALS', 
        value: totalDeals.toLocaleString(), 
        change: '+0%', 
        isPositive: true, 
        timeframe: 'this month', 
        bgColor: 'white' 
      },
    ];
  } catch (err) {
    console.error('Failed to load live metrics:', err);
    return defaultMetrics;
  }
}

export async function fetchLiveOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('Order')
    .select(`
      *,
      items:OrderItem (
        *,
        product:Product (*)
      )
    `)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching live orders:', error);
    throw error;
  }

  const rawOrders = (data ?? []) as Record<string, any>[];

  return rawOrders.map((dbOrder): Order => {
    const items = Array.isArray(dbOrder.items) ? dbOrder.items : [];
    const firstItem = items[0];
    const productName = firstItem?.product?.name || 'Custom Order Item';
    const productCategory = firstItem?.product?.category || 'Apparel';
    const productImage =
      firstItem?.product?.image ||
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop';

    // Map Supabase database status to Order interface union
    let uiStatus: Order['status'] = 'Pending';
    if (dbOrder.status === 'COMPLETED') uiStatus = 'Delivered';
    else if (dbOrder.status === 'SHIPPED') uiStatus = 'Shipped';
    else if (dbOrder.status === 'PROCESSING') uiStatus = 'Processing';
    else if (dbOrder.status === 'CANCELLED') uiStatus = 'Cancelled';
    else if (dbOrder.status === 'PENDING_PAYMENT') uiStatus = 'Pending';
    else uiStatus = 'Pending';

    return {
      id: String(dbOrder.id ?? ''),
      customerName:
        `${dbOrder.firstName || ''} ${dbOrder.lastName || ''}`.trim() ||
        String(dbOrder.email || 'Customer'),
      customerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        String(dbOrder.email || dbOrder.id || 'user')
      )}`,
      productName:
        items.length > 1 ? `${productName} (+${items.length - 1} more)` : productName,
      productCategory: String(productCategory),
      productImage: String(productImage),
      amount: Number(dbOrder.total) || 0,
      status: uiStatus,
      date: new Date(dbOrder.createdAt || Date.now()).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
  });
}

export async function updateOrderStatusInDb(orderId: string, uiStatus: Order['status']) {
  let dbStatus = 'PENDING_PAYMENT';
  if (uiStatus === 'Delivered') dbStatus = 'COMPLETED';
  if (uiStatus === 'Shipped') dbStatus = 'SHIPPED';
  if (uiStatus === 'Processing') dbStatus = 'PROCESSING';
  if (uiStatus === 'Cancelled') dbStatus = 'CANCELLED';
  if (uiStatus === 'Pending') dbStatus = 'PENDING_PAYMENT';

  const { error } = await supabase
    .from('Order')
    .update({ status: dbStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}