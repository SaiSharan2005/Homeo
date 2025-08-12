import React, { useEffect, useState } from 'react';
import { getPayments } from '../../services/billing/payment';
import Button from '../../components/common/Button';

const PaymentHistory = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);

  const load = async (p = page, s = size) => {
    setLoading(true);
    try {
      const res = await getPayments(p, s);
      setData({
        content: res.content || [],
        totalPages: res.totalPages ?? 1,
        totalElements: res.totalElements ?? (res.content ? res.content.length : 0)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const next = () => {
    if (page + 1 < data.totalPages) {
      const np = page + 1;
      setPage(np);
      load(np, size);
    }
  };

  const prev = () => {
    if (page > 0) {
      const pp = page - 1;
      setPage(pp);
      load(pp, size);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payment History</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Page {page + 1} / {Math.max(1, data.totalPages)}</span>
          <Button disabled={page === 0 || loading} onClick={prev}>Prev</Button>
          <Button disabled={page + 1 >= data.totalPages || loading} onClick={next}>Next</Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Payment ID</th>
              <th className="px-4 py-2 text-left">Invoice ID</th>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4" colSpan={5}>Loading…</td></tr>
            ) : (
              (data.content || []).map(p => (
                <tr key={p.paymentId} className="border-t">
                  <td className="px-4 py-2">#{p.paymentId}</td>
                  <td className="px-4 py-2">{p.invoiceId}</td>
                  <td className="px-4 py-2">{p.method}</td>
                  <td className="px-4 py-2">{p.amount}</td>
                  <td className="px-4 py-2">{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;


