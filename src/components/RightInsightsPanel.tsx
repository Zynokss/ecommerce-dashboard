import React from 'react';
import type { CountrySales, Customer, Order } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RightInsightsPanelProps {
  countries: CountrySales[];
  topCustomers: Customer[];
  recentOrders: Order[];
}

export const RightInsightsPanel: React.FC<RightInsightsPanelProps> = ({
  countries,
  topCustomers,
  recentOrders,
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Top Countries by Sells</h3>
        </div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-2xl font-extrabold text-slate-900">34.48K</span>
          <span className="text-xs font-medium text-slate-400">Since last week</span>
        </div>

        <div className="space-y-3.5">
          {countries.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={`https://flagcdn.com/24x18/${item.code}.png`}
                  alt={item.country}
                  className="w-5 h-3.5 rounded-sm object-cover shadow-2xs"
                />
                <span className="font-semibold text-slate-700">{item.country}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.trend === 'up' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="font-bold text-slate-800">{item.salesCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Top Customers</h3>
          <button className="text-xs font-semibold text-slate-400 hover:text-slate-700">
            See all
          </button>
        </div>

        <div className="space-y-4">
          {topCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{customer.name}</h4>
                  <p className="text-[11px] font-medium text-slate-400">
                    {customer.purchasesCount} Purchase
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900">
                ${(customer.totalSpent / 1000).toFixed(2)}K
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
          <button className="text-xs font-semibold text-slate-400 hover:text-slate-700">
            See all
          </button>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden border border-slate-200/60 flex items-center justify-center">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{order.productName}</h4>
                  <p className="text-[11px] font-medium text-slate-400">
                    {order.productCategory}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900">
                ${order.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};