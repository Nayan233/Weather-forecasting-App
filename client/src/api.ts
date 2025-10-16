import axios from 'axios';
import type { Category, Product } from './types';

const apiBase = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchCategories(): Promise<Category[]> {
  const res = await axios.get(`${apiBase}/api/categories`);
  return res.data.categories;
}

export async function fetchProducts(params?: { categoryId?: string; q?: string }): Promise<Product[]> {
  const res = await axios.get(`${apiBase}/api/products`, { params });
  return res.data.products;
}

export async function createCheckoutSession(items: Array<{ productId: string; quantity: number }>): Promise<{ url: string }>{
  const res = await axios.post(`${apiBase}/api/create-checkout-session`, { items });
  return res.data;
}
