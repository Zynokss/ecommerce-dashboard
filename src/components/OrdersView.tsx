import React, { useState } from 'react';
import type { Order } from '../types';
import { exportToCsv } from '../utils/exportCsv';
import { Search, Download, ShoppingBag, ChevronDown, ChevronUp, MapPin, Phone, Mail, Package } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const headers: { key: keyof Order; label: string }[] = [
      { key: 'id', label: 'Order ID' },
      { key: 'customerName', label: 'Customer Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'productName', label: 'Product Purchased' },
      { key: 'amount', label: 'Amount (MAD)' },
      { key: 'status', label: 'Order Status' },
      { key: 'date', label: 'Date Placed' },
      { key: 'address', label: 'Address' },
      { key: 'city', label: 'City' },
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
            placeholder="Search orders, customer name, or email..."
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
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No orders matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        onClick={() => toggleExpand(order.id)}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.customerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.id}`}
                              alt={order.customerName}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
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
                              className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <span className="line-clamp-1">{order.productName}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                          {order.amount.toFixed(2)} MAD
                        </td>

                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {order.date}
                        </td>

                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
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

                        <td className="py-4 px-6 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Details Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                          <td colSpan={6} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Customer & Shipping Details */}
                              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                                <h4 className="text-[10px] font-mono font-bold uppercase text-indigo-500 tracking-wider flex items-center gap-1.5">
                                  <Package className="h-3.5 w-3.5" /> Customer & Delivery Details
                                </h4>
                                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                  <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                                  {order.email && (
                                    <p className="flex items-center gap-1.5 text-slate-500">
                                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {order.email}
                                    </p>
                                  )}
                                  {order.phone && (
                                    <p className="flex items-center gap-1.5 text-slate-500">
                                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {order.phone}
                                    </p>
                                  )}
                                  <p className="flex items-start gap-1.5 text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800 mt-2">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                                    <span>
                                      {order.address ? `${order.address}, ` : ''}
                                      {order.zipCode ? `${order.zipCode} ` : ''}
                                      {order.city || 'Casablanca'}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Ordered Items & Variants Breakdown */}
                              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                                <h4 className="text-[10px] font-mono font-bold uppercase text-indigo-500 tracking-wider">
                                  Ordered Items ({order.items?.length || 1})
                                </h4>
                                <div className="space-y-2">
                                  {(order.items && order.items.length > 0 ? order.items : [
                                    {
                                      id: '1',
                                      productId: '1',
                                      selectedSize: 'S',
                                      selectedColor: undefined,
                                      quantity: 1,
                                      price: order.amount,
                                      product: { name: order.productName, image: order.productImage }
                                    }
                                  ]).map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={item.product?.image || order.productImage}
                                          alt={item.product?.name || 'Product'}
                                          className="h-10 w-8 object-cover rounded bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                                        />
                                        <div>
                                          <p className="font-bold text-slate-900 dark:text-white text-xs">
                                            {item.product?.name || order.productName}
                                          </p>
                                          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                                            Size: <span className="font-bold text-slate-900 dark:text-white">{item.selectedSize}</span>
                                            {item.selectedColor ? (
                                              <>
                                                {' | '}Color: <span className="font-bold text-slate-900 dark:text-white">{item.selectedColor}</span>
                                              </>
                                            ) : null}
                                            {' | '}Qty: <span className="font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                                        {(item.price * item.quantity).toFixed(2)} MAD
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};