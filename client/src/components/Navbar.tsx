import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const count = Object.values(items).reduce((n, item) => n + item.quantity, 0);
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #eee' }}>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: 700 }}>Grocerify</Link>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link to="/checkout">Cart ({count})</Link>
      </div>
    </nav>
  );
}
