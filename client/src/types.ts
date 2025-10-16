export type Category = { id: string; name: string };
export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  categoryId: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
