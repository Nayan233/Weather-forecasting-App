import { useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchProducts } from '../api';
import type { Category, Product } from '../types';
import { useCartStore } from '../store/cart';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [query, setQuery] = useState('');
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    fetchProducts({ categoryId: selectedCategory || undefined, q: query || undefined }).then(setProducts);
  }, [selectedCategory, query]);

  const grouped = useMemo(() => {
    const fmap: Record<string, Product[]> = {};
    for (const p of products) {
      fmap[p.categoryId] = fmap[p.categoryId] || [];
      fmap[p.categoryId].push(p);
    }
    return fmap;
  }, [products]);

  return (
    <div style={{ maxWidth: 1100, margin: '16px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {Object.entries(grouped).map(([catId, list]) => {
        const catName = categories.find((c) => c.id === catId)?.name || catId;
        return (
          <section key={catId} style={{ marginBottom: 24 }}>
            <h2 style={{ margin: '8px 0' }}>{catName}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {list.map((p) => (
                <div key={p.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: '#666', fontSize: 13 }}>{formatPrice(p.priceCents)}</div>
                    </div>
                    <button onClick={() => addItem(p, 1)}>Add</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
