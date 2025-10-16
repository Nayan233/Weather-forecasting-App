export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number; // stored in smallest currency unit
  categoryId: string;
};

export const categories: Category[] = [
  { id: "fruits", name: "Fruits" },
  { id: "vegetables", name: "Vegetables" },
  { id: "dairy", name: "Dairy" },
  { id: "bakery", name: "Bakery" },
  { id: "beverages", name: "Beverages" }
];

export const products: Product[] = [
  {
    id: "apple",
    name: "Apple",
    description: "Fresh red apples",
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=640",
    priceCents: 149,
    categoryId: "fruits"
  },
  {
    id: "banana",
    name: "Banana",
    description: "Sweet ripe bananas",
    imageUrl: "https://images.unsplash.com/photo-1571772805064-207c8435df79?w=640",
    priceCents: 99,
    categoryId: "fruits"
  },
  {
    id: "spinach",
    name: "Spinach",
    description: "Organic baby spinach",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=640",
    priceCents: 249,
    categoryId: "vegetables"
  },
  {
    id: "milk",
    name: "Milk (1L)",
    description: "Whole milk, 1 liter",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=640",
    priceCents: 299,
    categoryId: "dairy"
  },
  {
    id: "bread",
    name: "Sourdough Bread",
    description: "Freshly baked sourdough loaf",
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=640",
    priceCents: 399,
    categoryId: "bakery"
  },
  {
    id: "coffee",
    name: "Ground Coffee (250g)",
    description: "Medium roast arabica",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=640",
    priceCents: 799,
    categoryId: "beverages"
  }
];
