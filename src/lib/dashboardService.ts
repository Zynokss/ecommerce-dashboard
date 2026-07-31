import { supabase } from './supabase';
import type { MetricCardData } from '../types';

export async function fetchLiveMetrics(): Promise<MetricCardData[]> {
  const defaultMetrics: MetricCardData[] = [
    { title: 'TOTAL CUSTOMER', value: '0', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'sky' },
    { title: 'TOTAL REVENUE', value: '$0.00', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'mint' },
    { title: 'TOTAL DEALS', value: '0', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'white' },
  ];

  try {
    const { count: customerCount } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true });

    const { data: orders } = await supabase
      .from('Order')
      .select('total');

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const totalDeals = orders?.length || 0;

    return [
      { title: 'TOTAL CUSTOMER', value: (customerCount || 0).toLocaleString(), change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'sky' },
      { title: 'TOTAL REVENUE', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'mint' },
      { title: 'TOTAL DEALS', value: totalDeals.toLocaleString(), change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'white' },
    ];
  } catch (err) {
    console.error('Failed to load live metrics:', err);
    return defaultMetrics;
  }
}