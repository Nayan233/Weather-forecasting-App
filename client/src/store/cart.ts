import { create } from 'zustand';
import type { CartItem, Product } from '../types';

export type CartState = {
  items: Record<string, CartItem>; // key by productId
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalCents: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: {},
  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items[product.id];
      const newQty = (existing?.quantity ?? 0) + quantity;
      return {
        items: {
          ...state.items,
          [product.id]: { product, quantity: newQty }
        }
      };
    }),
  removeItem: (productId) =>
    set((state) => {
      const clone = { ...state.items };
      delete clone[productId];
      return { items: clone };
    }),
  setQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const clone = { ...state.items };
        delete clone[productId];
        return { items: clone };
      }
      const existing = state.items[productId];
      if (!existing) return state;
      return { items: { ...state.items, [productId]: { ...existing, quantity } } };
    }),
  clear: () => set({ items: {} }),
  totalCents: () =>
    Object.values(get().items).reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0)
}));
