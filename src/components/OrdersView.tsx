import React, { useState } from 'react';
import type { Order } from '../types';
import { exportToCsv } from '../utils/exportCsv';
import { Search, Download, ShoppingBag } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const headers: { key: keyof Order; label: string }[] = [
      { key: 'id', label: 'Order ID' },
      { key: 'customerName', label: 'Customer Name' },
      { key: 'productName', label: 'Product Purchased' },
      { key: 'amount', label: 'Amount (MAD)' },
      { key: 'status', label: 'Order Status' },
      { key: 'date', label: 'Date Placed' },
    ];

    exportToCsv(`orders_export_${Date.now()}`, filteredOrders, headers);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Store Orders Feed</h2>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Track customer transactions, order status fulfillments, and purchase records
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export Orders CSV
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search orders or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Delivered', 'Processing', 'Pending', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Order ID & Customer</th>
                <th className="py-3.5 px-4">Item Purchased</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Date Placed</th>
                <th className="py-3.5 px-6 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No orders matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.customerAvatar}
                          alt={order.customerName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">#{order.id.toUpperCase()}</p>
                          <p className="text-[11px] text-slate-400">{order.customerName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <span>{order.productName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      {order.amount.toFixed(2)} MAD
                    </td>

                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                      {order.date}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60'
                            : order.status === 'Processing'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/60'
                            : order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60'
                            : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60'
                        }`}
                      >
                        <option value="Delivered">Delivered</option>
                        <option value="Processing">Processing</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};