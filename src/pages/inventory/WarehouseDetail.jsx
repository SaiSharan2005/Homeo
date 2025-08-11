import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWarehouseById } from "../../services/inventory/warehouse";
import { getStockLevelsByWarehouse } from "../../services/inventory/stockLevel";
import { getBatchById } from "../../services/inventory/batch";
import { getInventoryItemById } from "../../services/inventory/inventoryItem";

export default function WarehouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [stockPage, setStockPage] = useState(0);
  const [stockSize, setStockSize] = useState(10);
  const [stock, setStock] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batchCache, setBatchCache] = useState({});
  const [itemCache, setItemCache] = useState({});

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [whRes, stockRes] = await Promise.all([
          getWarehouseById(id),
          getStockLevelsByWarehouse(id, stockPage, stockSize),
        ]);

        if (!active) return;
        setWarehouse(whRes);
        setStock(stockRes);

        // Preload batch info for visible rows
        const uniqueBatchIds = Array.from(new Set((stockRes?.content || []).map(r => r.batchId).filter(Boolean)));
        const missing = uniqueBatchIds.filter(bid => !batchCache[bid]);
        if (missing.length > 0) {
          const fetched = await Promise.all(missing.map(bid => getBatchById(bid).then(b => [bid, b]).catch(() => [bid, null])));
          const next = { ...batchCache };
          fetched.forEach(([bid, b]) => { next[bid] = b; });
          if (active) setBatchCache(next);

          // Preload inventory items for fetched batches
          const itemIds = Array.from(new Set(fetched.map(([, b]) => b?.inventoryItemId).filter(Boolean)));
          const missingItems = itemIds.filter(itemId => !itemCache[itemId]);
          if (missingItems.length > 0) {
            const itemFetched = await Promise.all(missingItems.map(itemId => getInventoryItemById(itemId).then(it => [itemId, it]).catch(() => [itemId, null])));
            const nextItems = { ...itemCache };
            itemFetched.forEach(([itemId, it]) => { nextItems[itemId] = it; });
            if (active) setItemCache(nextItems);
          }
        }
      } catch (e) {
        if (!active) return;
        setError(e?.message || "Failed to load warehouse details");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id, stockPage, stockSize]);

  const totals = useMemo(() => {
    const rows = stock?.content || [];
    return rows.reduce((acc, r) => {
      acc.quantityOnHand += r.quantityOnHand || 0;
      acc.reservedQuantity += r.reservedQuantity || 0;
      return acc;
    }, { quantityOnHand: 0, reservedQuantity: 0 });
  }, [stock]);

  if (loading) {
    return (
      <div className="p-4">
        <button className="text-sm text-gray-600 mb-3" onClick={() => navigate(-1)}>&larr; Back</button>
        <div className="animate-pulse h-6 w-40 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <button className="text-sm text-gray-600 mb-3" onClick={() => navigate(-1)}>&larr; Back</button>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!warehouse) return null;

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <button className="text-sm text-gray-600 mb-2" onClick={() => navigate(-1)}>&larr; Back</button>
          <h2 className="text-xl font-bold text-gray-800">Warehouse: {warehouse.name}</h2>
          <p className="text-sm text-gray-500">Location: {warehouse.location || "-"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded border">
          <div className="text-xs text-gray-500">Total Batches (visible page)</div>
          <div className="text-2xl font-semibold">{new Set((stock?.content||[]).map(r => r.batchId)).size}</div>
        </div>
        <div className="p-4 rounded border">
          <div className="text-xs text-gray-500">Quantity On Hand (page)</div>
          <div className="text-2xl font-semibold">{totals.quantityOnHand}</div>
        </div>
        <div className="p-4 rounded border">
          <div className="text-xs text-gray-500">Reserved (page)</div>
          <div className="text-2xl font-semibold">{totals.reservedQuantity}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Stock by Batch</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows:</label>
          <select
            value={stockSize}
            onChange={(e) => { setStockPage(0); setStockSize(Number(e.target.value)); }}
            className="border rounded p-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
      </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2 px-3 text-sm font-medium">Batch</th>
              <th className="py-2 px-3 text-sm font-medium">Item</th>
              <th className="py-2 px-3 text-sm font-medium">Expiry</th>
              <th className="py-2 px-3 text-sm font-medium">Status</th>
              <th className="py-2 px-3 text-sm font-medium">On Hand</th>
              <th className="py-2 px-3 text-sm font-medium">Reserved</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {(stock?.content || []).length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-3 text-center">No stock found for this warehouse.</td>
              </tr>
            ) : (
              stock.content.map((row) => {
                const batch = batchCache[row.batchId];
                const item = batch?.inventoryItemId ? itemCache[batch.inventoryItemId] : undefined;
                return (
                  <tr key={row.id} className="border-b">
                    <td className="py-2 px-3">{batch?.batchNumber || row.batchId}</td>
                    <td className="py-2 px-3">{item?.name || batch?.inventoryItemId || '-'}</td>
                    <td className="py-2 px-3">{batch?.expiryDate ?? '-'}</td>
                    <td className="py-2 px-3">{batch?.status ?? '-'}</td>
                    <td className="py-2 px-3">{row.quantityOnHand}</td>
                    <td className="py-2 px-3">{row.reservedQuantity}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {stockPage + 1} of {Math.max(stock?.totalPages || 0, 1)} • {stock?.totalElements || 0} rows
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setStockPage((p) => Math.max(p - 1, 0))}
            disabled={stockPage <= 0}
          >Prev</button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setStockPage((p) => (p + 1 < (stock?.totalPages || 0) ? p + 1 : p))}
            disabled={stockPage + 1 >= (stock?.totalPages || 0)}
          >Next</button>
        </div>
      </div>
    </div>
  );
}


