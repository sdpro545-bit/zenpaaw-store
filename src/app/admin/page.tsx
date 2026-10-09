'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Copy,
  Download,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'cms'>('orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [content, setContent] = useState<any | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('USPS');
  const [statusInput, setStatusInput] = useState('paid');
  const [orderUpdateSuccess, setOrderUpdateSuccess] = useState('');
  const [copiedSupplierDetails, setCopiedSupplierDetails] = useState(false);

  // Filter states
  const [orderFilter, setOrderFilter] = useState<'all' | 'needs_action' | 'shipped'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // CMS state
  const [announcementInput, setAnnouncementInput] = useState('');
  const [cmsSaveSuccess, setCmsSaveSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [ordersRes, prodsRes, couponsRes, contentRes] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/products').then((r) => r.json()).catch(() => ({ products: [] })),
        fetch('/api/coupons').then((r) => r.json()).catch(() => ({ coupons: [] })),
        fetch('/api/content').then((r) => r.json()).catch(() => ({ content: null }))
      ]);

      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (prodsRes.products) setProducts(prodsRes.products);
      if (couponsRes.coupons) setCoupons(couponsRes.coupons);
      if (contentRes.content) {
        setContent(contentRes.content);
        setAnnouncementInput(contentRes.content.announcementBar || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

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
        if (data.token) localStorage.setItem('zenpaaw_admin_token', data.token);
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
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setIsAuthenticated(false);
  };

  // Order helpers
  const getOrderTotal = (o: any): number => {
    if (typeof o.totalCents === 'number') return o.totalCents / 100;
    if (typeof o.total === 'number') return o.total;
    return 0;
  };

  const getCustomerName = (o: any): string => {
    if (o.shippingAddress?.firstName || o.shippingAddress?.lastName) {
      return `${o.shippingAddress.firstName || ''} ${o.shippingAddress.lastName || ''}`.trim();
    }
    if (o.customer?.firstName || o.customer?.lastName) {
      return `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim();
    }
    return o.email || 'Customer';
  };

  const getCustomerAddress = (o: any): string => {
    const addr = o.shippingAddress || o.customer || {};
    const parts = [
      addr.address,
      addr.apartment,
      addr.city,
      addr.state,
      addr.zipCode || addr.postalCode,
      addr.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  const getOrderStatus = (o: any): string => {
    return o.status || o.fulfillmentStatus || 'pending';
  };

  const formatSupplierDispatch = (order: any): string => {
    const addr = order.shippingAddress || order.customer || {};
    const name = getCustomerName(order);
    const itemsText = (order.items || []).map((it: any, idx: number) => {
      const title = it.titleSnapshot || it.productName || it.title || 'Product';
      const sku = it.variantId || it.productId || it.sku || `SKU-${idx + 1}`;
      const qty = it.qty || it.quantity || 1;
      return `Item ${idx + 1}: ${title}\n  SKU/Ref: ${sku}\n  Qty: ${qty}`;
    }).join('\n\n');

    return `========================================
ZENPAAW DROPSHIPPING SUPPLIER DISPATCH
Order: ${order.number || order.id}
Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}
========================================

RECIPIENT / SHIP TO:
Name: ${name}
Address 1: ${addr.address || ''}
${addr.apartment ? `Address 2: ${addr.apartment}\n` : ''}City: ${addr.city || ''}
State/Region: ${addr.state || ''}
Postal/ZIP: ${addr.zipCode || addr.postalCode || ''}
Country: ${addr.country || 'United States'}
Phone: ${addr.phone || 'N/A'}
Email: ${order.email || addr.email || ''}

ITEMS TO FULFILL:
${itemsText}

SHIPPING CARRIER INSTRUCTION:
Standard Tracked Delivery (ePacket / USPS / YunExpress)
========================================`;
  };

  const handleCopySupplier = (order: any) => {
    const text = formatSupplierDispatch(order);
    navigator.clipboard.writeText(text);
    setCopiedSupplierDetails(true);
    setTimeout(() => setCopiedSupplierDetails(false), 3000);
  };

  const handleUpdateOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusInput,
          carrier: carrierInput,
          trackingNumber: trackingInput
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(orders.map((o) => (o.id === orderId || o.number === orderId ? data.order : o)));
        setSelectedOrder(data.order);
        setOrderUpdateSuccess('Order fulfillment saved successfully!');
        setTimeout(() => setOrderUpdateSuccess(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Items Count', 'Total USD', 'Status', 'Tracking Number', 'Carrier', 'Shipping Address'];
    const rows = orders.map((o) => {
      const tracking = o.shipments?.[0]?.trackingNumber || o.trackingNumber || '';
      const carrier = o.shipments?.[0]?.carrier || 'USPS';
      return [
        `"${o.number || o.id}"`,
        `"${o.createdAt || ''}"`,
        `"${getCustomerName(o).replace(/"/g, '""')}"`,
        `"${o.email || o.customer?.email || ''}"`,
        o.items?.length || 0,
        getOrderTotal(o).toFixed(2),
        `"${getOrderStatus(o)}"`,
        `"${tracking}"`,
        `"${carrier}"`,
        `"${getCustomerAddress(o).replace(/"/g, '""')}"`
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zenpaaw_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportProductsCSV = () => {
    const headers = ['Product ID', 'Title', 'Slug', 'Category', 'Retail Price USD', 'Supplier Cost USD', 'Margin %', 'Stock Units', 'Margin Status'];
    const rows = products.map((p) => {
      const price = typeof p.priceCents === 'number' ? p.priceCents / 100 : (p.price || 0);
      const variantCost = p.variants?.[0]?.costCents;
      const cost = typeof variantCost === 'number' ? variantCost / 100 : (typeof p.costCents === 'number' ? p.costCents / 100 : price * 0.45);
      const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;
      const marginStatus = margin < 40 ? 'LOW_MARGIN_ALERT' : 'HEALTHY';
      return [
        `"${p.id}"`,
        `"${(p.title || p.name || '').replace(/"/g, '""')}"`,
        `"${p.slug || ''}"`,
        `"${p.categoryId || p.category || ''}"`,
        price.toFixed(2),
        cost.toFixed(2),
        margin,
        p.stockCount || 50,
        marginStatus
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zenpaaw_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    .filter((o) => ['paid', 'sent_to_supplier', 'shipped', 'delivered'].includes((o.status || '').toLowerCase()) || o.paymentStatus === 'Paid')
    .reduce((acc, o) => acc + getOrderTotal(o), 0);
  const totalOrders = orders.length;
  const awaitingFulfillmentCount = orders.filter((o) => ['paid', 'awaiting fulfillment'].includes((o.status || '').toLowerCase()) || o.fulfillmentStatus === 'Awaiting Fulfillment').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#162624]">ZenPaaw Portal</h1>
            <p className="text-xs text-gray-500">Sign in to manage dropshipping fulfillment &amp; catalog</p>
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

  const filteredOrders = orders.filter((o) => {
    const s = (o.status || o.fulfillmentStatus || '').toLowerCase();
    if (orderFilter === 'needs_action') return ['paid', 'awaiting fulfillment'].includes(s);
    if (orderFilter === 'shipped') return ['shipped', 'delivered'].includes(s);
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (!catalogSearch) return true;
    const term = catalogSearch.toLowerCase();
    const title = (p.title || p.name || '').toLowerCase();
    const cat = (p.categoryId || p.category || '').toLowerCase();
    return title.includes(term) || cat.includes(term);
  });

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
              <p className="text-xs text-gray-500">Live Dropshipping Store Manager &amp; Supplier Dispatcher</p>
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
              Coupons ({coupons.length})
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
            <p className="text-[0.68rem] text-emerald-600 font-bold">Verified Customer Purchases</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Orders Placed</span>
              <Package className="w-4 h-4 text-[#FFC800]" />
            </div>
            <div className="text-2xl font-black text-[#162624] tabular-nums">
              {totalOrders}
            </div>
            <p className="text-[0.68rem] text-gray-400">Total customer orders recorded</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Ready for Supplier</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 tabular-nums">
              {awaitingFulfillmentCount}
            </div>
            <p className="text-[0.68rem] text-amber-600 font-bold">Needs supplier dispatch &amp; tracking</p>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-[#162624]">Customer Orders Queue</h2>
                  <p className="text-xs text-gray-500">Manage order dispatch and carrier tracking</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-full bg-gray-100 p-0.5 text-[0.68rem] font-bold">
                    <button
                      onClick={() => setOrderFilter('all')}
                      className={`px-3 py-1 rounded-full transition ${orderFilter === 'all' ? 'bg-white shadow text-[#162624]' : 'text-gray-500'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setOrderFilter('needs_action')}
                      className={`px-3 py-1 rounded-full transition ${orderFilter === 'needs_action' ? 'bg-white shadow text-amber-700 font-extrabold' : 'text-gray-500'}`}
                    >
                      Needs Dispatch
                    </button>
                    <button
                      onClick={() => setOrderFilter('shipped')}
                      className={`px-3 py-1 rounded-full transition ${orderFilter === 'shipped' ? 'bg-white shadow text-emerald-700' : 'text-gray-500'}`}
                    >
                      Shipped
                    </button>
                  </div>

                  <button
                    onClick={exportOrdersCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[0.68rem] font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No orders found matching the selected filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider text-[0.68rem]">
                        <th className="pb-3">Order Number</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.map((o) => {
                        const status = getOrderStatus(o);
                        const isShipped = status === 'shipped' || status === 'delivered';
                        const isPaid = status === 'paid' || status === 'awaiting fulfillment';

                        return (
                          <tr key={o.id || o.number} className="hover:bg-[#FAFBF9]">
                            <td className="py-3 font-mono font-bold text-[#0C534E]">
                              {o.number || o.id}
                            </td>
                            <td className="py-3">
                              <strong className="text-[#162624] block">{getCustomerName(o)}</strong>
                              <span className="text-gray-400 text-[0.68rem]">{o.email || o.customer?.email}</span>
                            </td>
                            <td className="py-3">{o.items?.length || 0} item(s)</td>
                            <td className="py-3 font-bold tabular-nums text-[#162624]">
                              ${getOrderTotal(o).toFixed(2)}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[0.65rem] font-black ${
                                  isShipped
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isPaid
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setStatusInput(o.status || 'paid');
                                  setTrackingInput(o.shipments?.[0]?.trackingNumber || o.trackingNumber || '');
                                  setCarrierInput(o.shipments?.[0]?.carrier || 'USPS');
                                }}
                                className="px-3 py-1 rounded-full bg-[#0C534E] text-[#FFC800] text-[0.68rem] font-bold hover:bg-[#093B37] transition"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Detail & Fulfillment Action Panel */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#162624]">Fulfillment Dispatcher</h3>

              {selectedOrder ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#F0F7F6] border border-[#E2EBEA] space-y-1">
                    <div className="flex justify-between font-bold text-[#0C534E]">
                      <span>Order: {selectedOrder.number || selectedOrder.id}</span>
                      <span>${getOrderTotal(selectedOrder).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-700 font-bold">{getCustomerName(selectedOrder)}</p>
                    <p className="text-gray-500 text-[0.68rem] leading-relaxed">{getCustomerAddress(selectedOrder)}</p>
                  </div>

                  {/* Supplier Copy Action */}
                  <div>
                    <button
                      onClick={() => handleCopySupplier(selectedOrder)}
                      className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                        copiedSupplierDetails
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {copiedSupplierDetails ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Copied for Supplier!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#0C534E]" />
                          <span>Copy Supplier Order Details</span>
                        </>
                      )}
                    </button>
                    <p className="text-[0.65rem] text-gray-400 mt-1 text-center">
                      Formats address and SKUs for AliExpress / CJ Dropshipping ordering
                    </p>
                  </div>

                  {/* Order Items Snapshot */}
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <span className="font-bold text-gray-600 block">Ordered Items:</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {(selectedOrder.items || []).map((it: any, i: number) => (
                        <div key={i} className="flex justify-between text-[0.68rem] p-1.5 rounded-lg bg-gray-50">
                          <span className="font-semibold text-gray-800 truncate mr-2">
                            {it.titleSnapshot || it.productName || it.title || 'Product'} (x{it.qty || it.quantity || 1})
                          </span>
                          <span className="font-mono text-gray-500 shrink-0">
                            ${((it.priceSnapshotCents ? it.priceSnapshotCents / 100 : it.price || 0) * (it.qty || 1)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status update form */}
                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <div>
                      <label className="font-bold text-gray-600 block mb-1">Fulfillment Status</label>
                      <select
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs outline-none bg-white"
                      >
                        <option value="pending_payment">pending_payment (Unpaid)</option>
                        <option value="paid">paid (Ready for Supplier)</option>
                        <option value="sent_to_supplier">sent_to_supplier (Supplier Ordered)</option>
                        <option value="shipped">shipped (In Transit)</option>
                        <option value="delivered">delivered (Completed)</option>
                        <option value="cancelled">cancelled (Refunded)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-600 block mb-1">Shipping Carrier</label>
                      <select
                        value={carrierInput}
                        onChange={(e) => setCarrierInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none bg-white"
                      >
                        <option value="USPS">USPS (ePacket / First Class)</option>
                        <option value="UPS">UPS Ground</option>
                        <option value="FedEx">FedEx Home Delivery</option>
                        <option value="YunExpress">YunExpress Tracked</option>
                        <option value="Cainiao">Cainiao Global</option>
                        <option value="4PX">4PX Express</option>
                        <option value="DHL">DHL eCommerce</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-600 block mb-1">Carrier Tracking Number</label>
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
                      onClick={() => handleUpdateOrder(selectedOrder.id || selectedOrder.number)}
                      className="w-full py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-xs hover:bg-[#093B37] transition shadow-md"
                    >
                      Save Fulfillment Update
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-8 text-center">
                  Select an order on the left to copy supplier details, update status, or add carrier tracking.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Catalog Manager & Pricing Engine Margins */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-[#162624]">Catalog &amp; Pricing Margin Engine</h2>
                <p className="text-xs text-gray-500">Live inventory, supplier costs, and gross margin guardrails</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-full border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
                  />
                </div>

                <button
                  onClick={exportProductsCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[0.68rem] font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Catalog CSV</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const title = p.title || p.name || 'Product';
                const price = typeof p.priceCents === 'number' ? p.priceCents / 100 : (p.price || 0);
                const variantCost = p.variants?.[0]?.costCents;
                const cost = typeof variantCost === 'number' ? variantCost / 100 : (typeof p.costCents === 'number' ? p.costCents / 100 : price * 0.45);
                const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;
                const isLowMargin = margin < 40;

                return (
                  <div key={p.id} className="p-4 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.68rem] font-bold text-[#0C534E] uppercase tracking-wider">
                          {p.categoryId || p.category || 'Toy'}
                        </span>
                        <span className="text-xs font-black text-[#0C534E] tabular-nums">
                          ${price.toFixed(2)}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-[#162624] line-clamp-1">{title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{p.summary || p.tagline || p.description}</p>
                    </div>

                    {/* Pricing Engine Margin Analysis */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-[0.68rem] text-gray-600 font-medium">
                        <span>Supplier Cost: <strong className="font-mono text-gray-800">${cost.toFixed(2)}</strong></span>
                        <span>Gross Margin: <strong className="font-mono text-gray-800">{margin}%</strong></span>
                      </div>

                      {/* Margin Guardrail Badge */}
                      <div>
                        {isLowMargin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[0.62rem] font-bold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Margin Warning: {margin}% (&lt;40% target)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[0.62rem] font-bold">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Healthy Margin ({margin}%)</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[0.68rem] text-gray-400 pt-1">
                        <span>SKU: {p.variants?.[0]?.sku || p.id}</span>
                        <span>Stock: {p.stockCount || 50} units</span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
