import { useMemo, useState } from 'react';
import { useCartStore } from '../store/cart';
import { createCheckoutSession } from '../api';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalCents = useMemo(
    () => Object.values(items).reduce((sum, it) => sum + it.product.priceCents * it.quantity, 0),
    [items]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = Object.values(items).map((it) => ({ productId: it.product.id, quantity: it.quantity }));
      if (payload.length === 0) return;
      const { url } = await createCheckoutSession(payload);
      window.location.href = url;
    } catch (e) {
      setError('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '16px auto', padding: '0 16px' }}>
      <h2>Checkout</h2>
      {Object.values(items).length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.values(items).map(({ product, quantity }) => (
                <tr key={product.id}>
                  <td style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src={product.imageUrl} alt={product.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{product.name}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{formatPrice(product.priceCents)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(product.id, Math.max(1, Number(e.target.value)))}
                      style={{ width: 64 }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>{formatPrice(product.priceCents * quantity)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => removeItem(product.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button onClick={() => clear()}>Clear cart</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontWeight: 700 }}>Total: {formatPrice(totalCents)}</div>
              <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing…' : 'Pay with Stripe'}
              </button>
            </div>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </>
      )}
    </div>
  );
}
