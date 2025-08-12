import React from 'react';
import { useParams } from 'react-router-dom';
import { getPaymentById } from '../../services/billing/payment';

const useAsync = (fn, deps) => {
  const [state, setState] = React.useState({ loading: true });
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fn();
        if (mounted) setState({ loading: false, data });
      } catch (error) {
        if (mounted) setState({ loading: false, error });
      }
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
};

const PaymentReceipt = () => {
  const { id } = useParams();
  const { loading, data, error } = useAsync(() => getPaymentById(id), [id]);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-receipt-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">Failed to load receipt</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Payment Receipt</h2>
        <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white rounded">Download</button>
      </div>
      <div className="space-y-2 text-sm">
        <div><strong>Payment ID:</strong> {data.paymentId}</div>
        <div><strong>Invoice ID:</strong> {data.invoiceId}</div>
        <div><strong>Method:</strong> {data.method}</div>
        <div><strong>Amount:</strong> {data.amount}</div>
        <div><strong>Date:</strong> {data.paymentDate ? new Date(data.paymentDate).toLocaleString() : 'N/A'}</div>
        {data.transactionRef && <div><strong>Transaction Ref:</strong> {data.transactionRef}</div>}
        {data.receiptImageUrl && (
          <div className="mt-4">
            <strong>Proof:</strong>
            <div className="mt-2">
              <img src={data.receiptImageUrl} alt="Payment Proof" className="max-h-64" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReceipt;


