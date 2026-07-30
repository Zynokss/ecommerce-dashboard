import { supabase } from './supabase';
import type { MetricCardData } from '../types';

export async function fetchLiveMetrics(): Promise<MetricCardData[]> {
  try {
    // 1. Fetch total customers count from 'User' table
    const { count: customerCount, error: userErr } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true });

    // 2. Fetch all orders to compute total revenue and total deals
    const { data: orders, error: orderErr } = await supabase
      .from('Order')
      .select('total');

    if (userErr) console.error('Error fetching customers:', userErr);
    if (orderErr) console.error('Error fetching orders:', orderErr);

    const typedOrders = (orders as { total: number }[]) || [];

    const totalRevenue = typedOrders.reduce(
      (sum: number, order: { total: number }) => sum + (order.total || 0),
      0
    );
    const totalDeals = typedOrders.length;

    return [
      {
        title: 'TOTAL CUSTOMER',
        value: (customerCount || 0).toLocaleString(),
        change: '+0%',
        isPositive: true,
        timeframe: 'this month',
      },
      {
        title: 'TOTAL REVENUE',
        value: `$${totalRevenue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        change: '+0%',
        isPositive: true,
        timeframe: 'this month',
      },
      {
        title: 'TOTAL DEALS',
        value: totalDeals.toLocaleString(),
        change: '+0%',
        isPositive: true,
        timeframe: 'this month',
      },
    ] as MetricCardData[];
  } catch (err) {
    console.error('Failed to load live metrics:', err);
    return [];
  }
}