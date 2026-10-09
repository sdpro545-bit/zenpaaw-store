'use client';

import React, { useState, useEffect } from 'react';
import { Order, Product, Coupon, SiteContent } from '@/types';
import {
  Shield,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Tag,
  LogOut,
  Edit,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'cms'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [statusInput, setStatusInput] = useState<Order['fulfillmentStatus']>('Awaiting Fulfillment');
  const [orderUpdateSuccess, setOrderUpdateSuccess] = useState('');

  // CMS state
  const [announcementInput, setAnnouncementInput] = useState('');
  const [cmsSaveSuccess, setCmsSaveSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [ordersRes, prodsRes, couponsRes, contentRes] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/coupons').then((r) => r.json()),
        fetch('/api/content').then((r) => r.json())
      ]);

      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (prodsRes.products) setProducts(prodsRes.products);
      if (couponsRes.coupons) setCoupons(couponsRes.coupons);
      if (contentRes.content) {
        setContent(contentRes.content);
        setAnnouncementInput(contentRes.content.announcementBar);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem('zenpaaw_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('zenpaaw_admin_token', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Network error logging in');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zenpaaw_admin_token');
    setIsAuthenticated(false);
  };

  const handleUpdateOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fulfillmentStatus: statusInput,
          trackingNumber: trackingInput
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(orders.map((o) => (o.id === orderId ? data.order : o)));
        setSelectedOrder(data.order);
        setOrderUpdateSuccess('Order updated successfully!');
        setTimeout(() => setOrderUpdateSuccess(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementBar: announcementInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContent(data.content);
        setCmsSaveSuccess('Announcement banner updated across the storefront!');
        setTimeout(() => setCmsSaveSuccess(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const awaitingFulfillmentCount = orders.filter((o) => o.fulfillmentStatus === 'Awaiting Fulfillment').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#162624]">ZenPaaw Portal</h1>
            <p className="text-xs text-gray-500">Sign in to manage dropshipping fulfillment & catalog</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Admin Email</label>
              <input
                type="text"
                placeholder="admin@zenpaaw.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0C534E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0C534E]"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-sm hover:bg-[#093B37] shadow-lg shadow-[#0C534E]/20 transition"
            >
              Sign In to Store Admin
            </button>

            <div className="text-center pt-2">
              <span className="text-[0.68rem] text-gray-400">
                Demo access: <code>admin@zenpaaw.com</code> / <code>zenpaaw2026</code>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Navigation Bar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#162624]">ZenPaaw Operations Center</h1>
              <p className="text-xs text-gray-500">Live Dropshipping Store Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-[#0C534E] text-[#FFC800]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'products'
                  ? 'bg-[#0C534E] text-[#FFC800]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'coupons'
                  ? 'bg-[#0C534E] text-[#FFC800]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Coupons
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'cms'
                  ? 'bg-[#0C534E] text-[#FFC800]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CMS Banner
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition ml-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* High-Level Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-[#0C534E]" />
            </div>
            <div className="text-2xl font-black text-[#0C534E] tabular-nums">
              ${totalRevenue.toFixed(2)}
            </div>
            <p className="text-[0.68rem] text-emerald-600 font-bold">100% Verified Gateway Payments</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Orders Placed</span>
              <Package className="w-4 h-4 text-[#FFC800]" />
            </div>
            <div className="text-2xl font-black text-[#162624] tabular-nums">
              {totalOrders}
            </div>
            <p className="text-[0.68rem] text-gray-400">All customer orders</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Awaiting Dispatch</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 tabular-nums">
              {awaitingFulfillmentCount}
            </div>
            <p className="text-[0.68rem] text-amber-600 font-bold">Requires supplier tracking number</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Avg Order Value</span>
              <TrendingUp className="w-4 h-4 text-[#0C534E]" />
            </div>
            <div className="text-2xl font-black text-[#162624] tabular-nums">
              ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
            </div>
            <p className="text-[0.68rem] text-gray-400">Target: $28.00+</p>
          </div>
        </div>

        {/* Tab 1: Orders & Dropshipping Fulfillment Queue */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-black text-[#162624]">Customer Orders Queue</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAFBF9]">
                        <td className="py-3 font-mono font-bold text-[#0C534E]">{o.id}</td>
                        <td className="py-3">
                          <strong className="text-[#162624] block">{o.customer.firstName} {o.customer.lastName}</strong>
                          <span className="text-gray-400 text-[0.68rem]">{o.customer.email}</span>
                        </td>
                        <td className="py-3">{o.items.length} item(s)</td>
                        <td className="py-3 font-bold tabular-nums text-[#162624]">${o.total.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[0.65rem] font-black ${
                              o.fulfillmentStatus === 'Shipped'
                                ? 'bg-emerald-50 text-emerald-700'
                                : o.fulfillmentStatus === 'Awaiting Fulfillment'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {o.fulfillmentStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setStatusInput(o.fulfillmentStatus);
                              setTrackingInput(o.trackingNumber || '');
                            }}
                            className="px-3 py-1 rounded-full bg-[#0C534E] text-[#FFC800] text-[0.68rem] font-bold hover:bg-[#093B37]"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Detail & Fulfillment Action Panel */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#162624]">Fulfillment Dispatcher</h3>

              {selectedOrder ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-2xl bg-[#F0F7F6] border border-[#E2EBEA]">
                    <div className="flex justify-between font-bold text-[#0C534E] mb-1">
                      <span>Order: {selectedOrder.id}</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <p className="text-gray-500">{selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
                  </div>

                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Fulfillment Status</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs outline-none bg-white"
                    >
                      <option value="Awaiting Fulfillment">Awaiting Fulfillment</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Carrier Tracking Number (USPS/UPS)</label>
                    <input
                      type="text"
                      placeholder="e.g. 9400111899562910394812"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono outline-none"
                    />
                  </div>

                  {orderUpdateSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>{orderUpdateSuccess}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleUpdateOrder(selectedOrder.id)}
                    className="w-full py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-xs hover:bg-[#093B37] transition shadow-md"
                  >
                    Save Fulfillment Update
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-8 text-center">
                  Select an order on the left to edit fulfillment status or add supplier tracking.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Catalog Manager */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#162624]">Product Inventory & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-bold text-[#0C534E] uppercase">{p.category}</span>
                    <span className="text-xs font-extrabold text-[#0C534E]">${p.price.toFixed(2)}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#162624] line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.tagline}</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-gray-600 border-t border-gray-100">
                    <span>Stock: <strong>{p.stockCount} units</strong></span>
                    {p.isFlagship && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FFC800] text-[#162624] text-[0.62rem] font-black">
                        Flagship
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Coupons */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#162624]">Active Promo Codes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-[#FAFBF9] border border-gray-200 space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-mono font-black">
                    {c.code}
                  </span>
                  <h4 className="font-bold text-sm text-[#162624] pt-1">{c.description}</h4>
                  <p className="text-xs text-gray-500">
                    {c.discountPercent > 0 ? `${c.discountPercent}% Discount` : 'Free Shipping Promo'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: CMS Banner Control */}
        {activeTab === 'cms' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm max-w-2xl space-y-4">
            <h2 className="text-base font-black text-[#162624]">Storefront Announcement Banner</h2>
            <p className="text-xs text-gray-500">
              Update the top ticker announcement shown across every page without changing code.
            </p>

            <form onSubmit={handleSaveCMS} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Banner Text</label>
                <input
                  type="text"
                  value={announcementInput}
                  onChange={(e) => setAnnouncementInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold outline-none focus:border-[#0C534E]"
                />
              </div>

              {cmsSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{cmsSaveSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black hover:bg-[#093B37] transition"
              >
                Publish Announcement
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
