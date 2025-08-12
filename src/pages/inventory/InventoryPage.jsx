/*
InventoryPage — Enhanced UI for Homeopathy Management System
Save as: InventoryPage.js
Dependencies: react, recharts, lucide-react, framer-motion, react-toastify, tailwindcss
Install: npm i recharts lucide-react framer-motion react-toastify

Notes:
- This file improves visuals (earthy/homeopathy palette), micro-interactions, faster feel,
  glassmorphism cards, hero banner, and subtle animations.
- Replace service imports with your actual service paths if different.
*/

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  BarChart3,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Download,
  Upload,
  Settings,
  Eye,
  PlusCircle,
  AlertCircle,
  ArrowRight,
  Leaf
} from 'lucide-react';
import InventoryItemList from './InventoryItemList';
import {
  getInventoryItems
} from '../../services/inventory/inventoryItem';
import { getAllSuppliers } from '../../services/inventory/supplier';
import { getAllGoodsReceipts } from '../../services/inventory/goodsReceipt';
import { getAllPurchaseOrders } from '../../services/inventory/purchaseOrder';

// --------------------- useInventory Hook ----------------------------------
const useInventory = () => {
  const [data, setData] = useState({
    stats: {},
    items: [],
    lowStockItems: [],
    recentMovements: [],
    stockAlerts: [],
    charts: { stockTrend: [], categoryBreakdown: [] }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [itemsResponse, suppliersResponse, goodsReceiptsResponse, purchaseOrdersResponse] = await Promise.all([
        getInventoryItems(),
        getAllSuppliers(),
        getAllGoodsReceipts(),
        getAllPurchaseOrders()
      ]);

      const items = itemsResponse?.data || [];
      const lowStockItems = items.filter(item => (item.quantity || 0) <= (item.reorderLevel || item.minQuantity || 10));

      const totalItems = items.length;
      const stockValue = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
      const expiringSoon = items.filter(item => {
        if (!item.expiryDate) return false;
        const expiryDate = new Date(item.expiryDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate <= thirtyDaysFromNow;
      }).length;
      const totalSuppliers = suppliersResponse?.data?.length || 0;

      const recentMovements = [
        ...(goodsReceiptsResponse?.data || []).map(gr => ({
          id: `gr-${gr.id}`,
          type: 'Goods Receipt',
          item: gr.items?.[0]?.item?.name || 'Multiple Items',
          quantity: gr.items?.reduce((sum, it) => sum + (it.quantity || 0), 0),
          date: gr.receiptDate,
          status: gr.status
        })),
        ...(purchaseOrdersResponse?.data || []).map(po => ({
          id: `po-${po.id}`,
          type: 'Purchase Order',
          item: po.items?.[0]?.item?.name || 'Multiple Items',
          quantity: po.items?.reduce((sum, it) => sum + (it.quantity || 0), 0),
          date: po.orderDate,
          status: po.status
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

      // gentle homeopathy-themed chart (demo)
      const stockTrend = [
        { month: 'Jan', stock: 120 },
        { month: 'Feb', stock: 135 },
        { month: 'Mar', stock: 128 },
        { month: 'Apr', stock: 142 },
        { month: 'May', stock: 138 },
        { month: 'Jun', stock: 155 },
        { month: 'Jul', stock: 148 }
      ];

      const categoryBreakdown = items.reduce((acc, item) => {
        const category = item.category?.name || item.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const categoryChartData = Object.entries(categoryBreakdown).map(([category, count]) => ({ category, count }));

      setData({
        stats: { totalItems, stockValue: Math.round(stockValue * 100) / 100, expiringSoon, totalSuppliers },
        items,
        lowStockItems,
        recentMovements,
        stockAlerts: lowStockItems.map(item => ({ id: item.id, type: 'low_stock', title: `Low stock: ${item.name}`, message: `${item.quantity || 0} remaining`, item })),
        charts: { stockTrend, categoryBreakdown: categoryChartData }
      });

    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err?.message || 'Failed to fetch inventory data');
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInventoryData(); }, [fetchInventoryData]);

  return { data, loading, error, refetch: fetchInventoryData };
};

// --------------------- UI Subcomponents -----------------------------------

const StatCard = ({ title, value, icon: Icon, accent = 'teal', loading }) => {
  const accentBg = {
    teal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-violet-50 text-violet-700 border-violet-200'
  }[accent] || 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-2xl p-5 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100">
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg border ${accentBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const LowStockTable = ({ items, loading, onCreatePO }) => {
  const lowStockItems = items.filter(item => (item.quantity || 0) <= (item.minQuantity || item.reorderLevel || 10));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/60 backdrop-blur p-4 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Low Stock</h3>
        <button onClick={onCreatePO} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
          <PlusCircle className="w-4 h-4" /> Create PO
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ) : lowStockItems.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-600">
          <AlertCircle className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          All items are healthy 🌿
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="py-2">Item</th>
                <th className="py-2">Category</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Min</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lowStockItems.map(it => (
                <tr key={it.id} className="hover:bg-white/40">
                  <td className="py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{it.name}</div>
                      <div className="text-xs text-gray-500">SKU: {it.sku || it.id}</div>
                    </div>
                  </td>
                  <td className="py-3">{it.category?.name || it.category || 'Uncategorized'}</td>
                  <td className="py-3">{it.quantity ?? 0}</td>
                  <td className="py-3">{it.minQuantity ?? it.reorderLevel ?? 10}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-emerald-600 hover:text-emerald-800"><Eye className="w-4 h-4" /></button>
                      <button className="text-blue-600 hover:text-blue-800"><PlusCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

const ModulesGrid = () => {
  const modules = [
    { href: '/admin/inventory/items', label: 'Items', icon: Package, color: 'emerald' },
    { href: '/admin/inventory/suppliers', label: 'Suppliers', icon: Users, color: 'indigo' },
    { href: '/admin/inventory/warehouses', label: 'Warehouses', icon: Settings, color: 'slate' },
    { href: '/admin/purchase-orders', label: 'Purchase Orders', icon: BarChart3, color: 'amber' },
    { href: '/admin/inventory/receipt', label: 'Goods Receipts', icon: Download, color: 'green' },
    { href: '/admin/inventory/transactions', label: 'Transactions', icon: ArrowRight, color: 'violet' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-4 bg-white/60 backdrop-blur border border-gray-100 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Modules</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {modules.map(m => (
          <a key={m.label} href={m.href} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:shadow-sm transition bg-white">
            <div className="p-2 rounded-md bg-emerald-50 border border-emerald-100">
              <m.icon className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-700">{m.label}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

// InventoryItemsTable removed; embedding existing InventoryItemList component instead

const QuickActions = () => {
  const actions = [
    { icon: Plus, label: 'Add Item', href: '/inventory/items/new' },
    { icon: Download, label: 'Import', href: '/inventory/import' },
    { icon: Upload, label: 'Export', href: '/inventory/export' },
    { icon: BarChart3, label: 'Reports', href: '/inventory/reports' },
    { icon: Users, label: 'Suppliers', href: '/inventory/suppliers' },
    { icon: Settings, label: 'Settings', href: '/inventory/settings' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-4 bg-white/60 backdrop-blur border border-gray-100 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map(a => (
          <motion.a key={a.label} href={a.href} whileHover={{ scale: 1.03 }} className="p-2 rounded-lg text-center bg-white border">
            <a.icon className="mx-auto w-5 h-5 text-emerald-600 mb-1" />
            <div className="text-xs text-gray-700">{a.label}</div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

const RecentMovements = ({ movements }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-4 bg-white/60 backdrop-blur border border-gray-100 shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Movements</h3>
    <div className="space-y-2">
      {movements.length === 0 ? (
        <div className="text-center text-gray-500 py-6"><Package className="mx-auto mb-2 text-gray-300 w-8 h-8" />No recent movements</div>
      ) : (
        movements.map(m => (
          <div key={m.id} className="flex items-center justify-between p-2 rounded hover:bg-white/40">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${m.type === 'Goods Receipt' ? 'bg-green-100 text-green-600' : 'bg-emerald-50 text-emerald-600'}`}><ArrowRight className="w-4 h-4" /></div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{m.item || m.description || 'Item'}</div>
                <div className="text-xs text-gray-500">{m.quantity || 0} units • {m.type}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{m.date ? new Date(m.date).toLocaleDateString() : '—'}</div>
          </div>
        ))
      )}
    </div>
  </motion.div>
);

const StockAlerts = ({ alerts }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-4 bg-white/60 backdrop-blur border border-gray-100 shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Alerts</h3>
    <div className="space-y-2">
      {alerts.length === 0 ? (
        <div className="text-center text-gray-500 py-6"><AlertTriangle className="mx-auto mb-2 text-gray-300 w-8 h-8" />No alerts</div>
      ) : (
        alerts.map(a => (
          <div key={a.id} className="p-3 rounded border-l-4 border-amber-300 bg-amber-50">
            <div className="text-sm font-medium text-gray-800">{a.title}</div>
            <div className="text-xs text-gray-600 mt-1">{a.message}</div>
          </div>
        ))
      )}
    </div>
  </motion.div>
);

// --------------------- Main Page ------------------------------------------
const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [sortOption, setSortOption] = useState('name_asc');
  const { data, loading, error, refetch } = useInventory();

  const handleSearch = useCallback((value) => { setSearchQuery(value); }, []);

  const categories = useMemo(() => {
    const all = (data?.items || []).map(i => i.category?.name || i.category || 'Uncategorized');
    return ['All', ...Array.from(new Set(all))];
  }, [data?.items]);

  const filteredData = useMemo(() => {
    if (!data?.items) return [];
    let items = [...data.items];
    const q = searchQuery.trim().toLowerCase();
    if (q) items = items.filter(it => (it.name || '').toLowerCase().includes(q) || (it.category?.name || it.category || '').toLowerCase().includes(q));

    if (selectedCategory !== 'All') items = items.filter(it => (it.category?.name || it.category || 'Uncategorized') === selectedCategory);
    if (onlyLowStock) items = items.filter(it => (it.quantity || 0) <= (it.minQuantity || it.reorderLevel || 10));

    switch (sortOption) {
      case 'name_asc': items.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      case 'name_desc': items.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
      case 'stock_asc': items.sort((a, b) => (a.quantity || 0) - (b.quantity || 0)); break;
      case 'stock_desc': items.sort((a, b) => (b.quantity || 0) - (a.quantity || 0)); break;
      default: break;
    }
    return items;
  }, [data?.items, searchQuery, selectedCategory, onlyLowStock, sortOption]);

  const handleCreatePO = useCallback(() => { toast.info('Navigate to Create PO'); }, []);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Error Loading Inventory</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <div className="mt-4"><button onClick={refetch} className="px-4 py-2 bg-emerald-600 text-white rounded">Retry</button></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* PAGE CONTENT */}
        <main className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Items" value={data?.stats?.totalItems ?? 0} icon={Package} accent="teal" loading={loading} />
            <StatCard title="Stock Value" value={`$${(data?.stats?.stockValue || 0).toLocaleString()}`} icon={DollarSign} accent="green" loading={loading} />
            <StatCard title="Expiring Soon" value={data?.stats?.expiringSoon ?? 0} icon={Clock} accent="amber" loading={loading} />
            <StatCard title="Suppliers" value={data?.stats?.totalSuppliers ?? 0} icon={Users} accent="purple" loading={loading} />
          </div>

          {/* Charts removed */}

          <ModulesGrid />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <InventoryItemList navigateBase="/admin/inventory/items" />
              <LowStockTable items={filteredData} loading={loading} onCreatePO={handleCreatePO} />
            </div>

            <div className="space-y-6">
              <QuickActions />
              <RecentMovements movements={data?.recentMovements || []} />
              <StockAlerts alerts={data?.stockAlerts || []} />
            </div>
          </div>
        </main>

        <footer className="mt-8 text-center text-gray-500">Made with 🌿 for Homeopathy Clinics — calm, clean & fast</footer>
      </div>
    </div>
  );
};

export default InventoryPage;
