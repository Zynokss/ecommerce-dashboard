import React, { useState } from 'react';
import type { Order, Product } from '../types';
import { exportToCsv } from '../utils/exportCsv';
import { 
  Search, 
  Download, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  MessageCircle, 
  FileText,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  products?: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onCreateOrder?: (newOrder: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ 
  orders, 
  products = [], 
  onUpdateOrderStatus,
  onCreateOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Manual Order Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('Casablanca');
  const [customerAddress, setCustomerAddress] = useState('');

  // Selected Item State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState('');

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

  const generateWhatsAppLink = (order: Order) => {
    const rawPhone = (order.phone || '').replace(/\D/g, '');
    let formattedPhone = rawPhone;
    if (rawPhone.startsWith('0')) {
      formattedPhone = '212' + rawPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Salam ${order.customerName},\n\n` +
      `Merci pour votre commande chez ZYN Store (#${order.id.slice(-6).toUpperCase()}) !\n` +
      `Montant total: ${order.amount.toFixed(2)} MAD\n` +
      `Statut actuel: ${order.status}\n\n` +
      `Si vous avez effectué un virement CIH Bank, merci de nous transmettre le reçu ici.`
    );
    return `https://wa.me/${formattedPhone}?text=${message}`;
  };

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
    exportToCsv(`zyn_orders_${Date.now()}`, filteredOrders, headers);
  };

  const handleOpenManualModal = () => {
    setFormError('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerCity('Casablanca');
    setCustomerAddress('');
    if (products.length > 0) {
      setSelectedProductId(products[0].id);
      setSelectedSize(products[0].sizes?.[0] || 'M');
    }
    setQuantity(1);
    setIsManualModalOpen(true);
  };

  const handleCreateManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!customerName.trim()) {
      setFormError('Customer name is required.');
      return;
    }
    const selectedProduct = products.find((p) => p.id === selectedProductId);
    if (!selectedProduct) {
      setFormError('Please select a valid product.');
      return;
    }

    const orderPrice = selectedProduct.price * quantity;
    const orderId = `ord_manual_${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      customerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${orderId}`,
      email: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '.')}@manual.store`,
      phone: customerPhone.trim(),
      productName: selectedProduct.name,
      productCategory: selectedProduct.category,
      productImage: selectedProduct.image,
      amount: orderPrice,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      address: customerAddress.trim(),
      city: customerCity.trim(),
      items: [
        {
          id: `item_${Date.now()}`,
          productId: selectedProduct.id,
          selectedSize: selectedSize,
          selectedColor: selectedColor || undefined,
          quantity: quantity,
          price: selectedProduct.price,
          product: {
            name: selectedProduct.name,
            category: selectedProduct.category,
            image: selectedProduct.image,
          },
        },
      ],
    };

    if (onCreateOrder) {
      onCreateOrder(newOrder);
    }
    setIsManualModalOpen(false);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 dark:border-white/[0.08] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 dark:text-white">Orders & Fulfillment</h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Monitor customer transactions, WhatsApp payment confirmations, and manual phone orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenManualModal}
            className="flex items-center gap-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Manual Order
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] hover:bg-slate-700/40 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1c202c]/90 dark:bg-[#0e1015]/90 p-3.5 rounded-2xl border border-slate-700/50 dark:border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search orders, phone, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#7c5cfc]"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', 'Delivered', 'Processing', 'Pending', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#7c5cfc] text-white shadow-sm'
                  : 'bg-[#121520] dark:bg-[#08090d] text-slate-400 hover:text-white border border-slate-700/50 dark:border-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl border border-slate-700/50 dark:border-white/[0.08] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121520] dark:bg-[#08090d] border-b border-slate-700/50 dark:border-white/[0.08] text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Customer</th>
                <th className="py-3 px-4">Item(s)</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 dark:divide-white/5 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    <ShoppingBag className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        onClick={() => toggleExpand(order.id)}
                        className="hover:bg-slate-700/30 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.customerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.id}`}
                              alt={order.customerName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-700/50 dark:border-white/10 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-100 dark:text-white font-mono">#{order.id.slice(-6).toUpperCase()}</p>
                              <p className="text-[11px] text-slate-400">{order.customerName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-300">
                          <div className="flex items-center gap-2">
                            <img
                              src={order.productImage}
                              alt={order.productName}
                              className="w-6 h-6 rounded object-cover border border-slate-700/50 dark:border-white/10 shrink-0"
                            />
                            <span className="line-clamp-1">{order.productName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-100 dark:text-white">
                          {order.amount.toFixed(2)} MAD
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {order.date}
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border focus:outline-none cursor-pointer ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : order.status === 'Processing'
                                ? 'bg-[#7c5cfc]/10 text-[#7c5cfc] border-[#7c5cfc]/30'
                                : order.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            <option value="Delivered" className="bg-[#121520] text-slate-100">Delivered</option>
                            <option value="Processing" className="bg-[#121520] text-slate-100">Processing</option>
                            <option value="Pending" className="bg-[#121520] text-slate-100">Pending</option>
                            <option value="Cancelled" className="bg-[#121520] text-slate-100">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="p-1 text-slate-400 hover:text-[#7c5cfc] transition-colors">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#121520]/80 border-b border-slate-700/50 dark:border-white/[0.08]">
                          <td colSpan={6} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Shipping Info Card */}
                              <div className="bg-[#1c202c] dark:bg-[#0e1015] p-4 rounded-xl border border-slate-700/50 dark:border-white/[0.08] space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/5 pb-2">
                                  <h4 className="text-xs font-mono font-bold uppercase text-[#7c5cfc] flex items-center gap-1.5">
                                    <Package className="h-3.5 w-3.5" /> Customer & Shipping Details
                                  </h4>
                                  {order.phone && (
                                    <a
                                      href={generateWhatsAppLink(order)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                                    >
                                      <MessageCircle className="w-3 h-3" /> WhatsApp Order
                                    </a>
                                  )}
                                </div>
                                <div className="space-y-1.5 text-xs text-slate-300">
                                  <p className="font-bold text-white">{order.customerName}</p>
                                  {order.email && (
                                    <p className="flex items-center gap-1.5 text-slate-400 font-mono">
                                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {order.email}
                                    </p>
                                  )}
                                  {order.phone && (
                                    <p className="flex items-center gap-1.5 text-slate-400 font-mono">
                                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {order.phone}
                                    </p>
                                  )}
                                  <p className="flex items-start gap-1.5 text-slate-400 pt-1 border-t border-slate-700/50 dark:border-white/5 mt-2">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                                    <span>
                                      {order.address ? `${order.address}, ` : ''}
                                      {order.zipCode ? `${order.zipCode} ` : ''}
                                      {order.city || 'Casablanca'}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Purchased Items Card */}
                              <div className="bg-[#1c202c] dark:bg-[#0e1015] p-4 rounded-xl border border-slate-700/50 dark:border-white/[0.08] space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/5 pb-2">
                                  <h4 className="text-xs font-mono font-bold uppercase text-[#7c5cfc] flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5" /> Items Purchased ({order.items?.length || 1})
                                  </h4>
                                  <span className="text-[10px] font-mono bg-[#7c5cfc]/10 text-[#7c5cfc] px-2 py-0.5 rounded border border-[#7c5cfc]/30">
                                    CIH Bank Transfer / COD
                                  </span>
                                </div>
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
                                      className="flex items-center justify-between p-2 rounded-lg bg-[#121520] border border-slate-700/50 dark:border-white/5"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <img
                                          src={item.product?.image || order.productImage}
                                          alt={item.product?.name || 'Product'}
                                          className="h-8 w-8 object-cover rounded bg-[#08090d] border border-slate-700/50 shrink-0"
                                        />
                                        <div>
                                          <p className="font-semibold text-white text-xs">
                                            {item.product?.name || order.productName}
                                          </p>
                                          <p className="text-[10px] font-mono text-slate-400">
                                            Size: <span className="font-bold text-slate-200">{item.selectedSize}</span>
                                            {item.selectedColor ? <> | Color: <span className="font-bold text-slate-200">{item.selectedColor}</span></> : null}
                                            <> | Qty: <span className="font-bold text-slate-200">{item.quantity}</span></>
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-white text-xs">
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

      {/* Create Manual Order Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/60 dark:border-white/[0.1] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#7c5cfc]" /> Create Manual Order (Phone / WhatsApp / DM)
              </h3>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateManualOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Youssef Amrani"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0612345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">City</label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Address / Neighborhood</label>
                  <input
                    type="text"
                    placeholder="e.g. Maarif, Bd Zerktouni"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>
              </div>

              <div className="border-t border-slate-700/50 dark:border-white/[0.08] pt-3 space-y-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Select Catalog Item</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      const p = products.find((prod) => prod.id === e.target.value);
                      if (p?.sizes?.[0]) setSelectedSize(p.sizes[0]);
                    }}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#121520]">
                        {p.name} — {p.price.toFixed(2)} MAD
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {(selectedProduct?.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                        <option key={sz} value={sz} className="bg-[#121520]">{sz}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Color Variant</label>
                    <input
                      type="text"
                      placeholder="e.g. Pitch Black"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#121520] border border-slate-700/50 dark:border-white/[0.08] rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">Calculated Order Total:</span>
                <span className="text-sm font-mono font-black text-[#7c5cfc]">
                  {((selectedProduct?.price || 0) * quantity).toFixed(2)} MAD
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/50 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};