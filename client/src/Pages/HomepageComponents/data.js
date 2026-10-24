export const CUR = '$';
export const FREE_AT = 35;
export const money = (n) => `${CUR}${n.toFixed(2)}`;

export const PRODUCTS = [
  { id: 1, name: 'Organic bananas', unit: 'per lb', price: 2.99, rating: 4.8, reviews: 212, stock: 45, cat: 'Produce', image: '/images/bananas.jpg', tag: 'Picked today' },
  { id: 2, name: 'Ripe avocados', unit: 'each', price: 1.5, was: 1.95, rating: 4.7, reviews: 148, stock:12, cat: 'Produce', image: '/images/avocado.jpg', tag: 'Local farm' },
  { id: 3, name: 'Vine tomatoes', unit: 'per lb', price: 3.29, rating: 4.6, reviews: 96, stock: 10, cat: 'Produce', image: '/images/tomatoes.jpg', tag: 'Picked today' },
  { id: 4, name: 'Whole milk', unit: '1 gallon', price: 3.49, was: 4.29, rating: 4.9, reviews: 530, stock: 10, cat: 'Dairy & eggs', image: '/images/milk.jpg', tag: 'Cold chain' },
  { id: 5, name: 'Free-range eggs', unit: 'dozen', price: 4.25, rating: 4.8, reviews: 301, stock: 30, cat: 'Dairy & eggs', image: '/images/eggs.jpg', tag: 'Local farm' },
  { id: 6, name: 'Sourdough loaf', unit: 'each', price: 5.99, rating: 5.0, reviews: 417, stock: 10, cat: 'Bakery', image: '/images/sourdough.jpg', tag: 'Baked 6 AM' },
  { id: 7, name: 'Butter croissants', unit: 'pack of 4', price: 4.5, rating: 4.7, reviews: 188, stock: 12, cat: 'Bakery', image: '/images/croissant.jpg', tag: 'Baked 6 AM' },
  { id: 8, name: 'Atlantic salmon', unit: 'per lb', price: 12.99, was: 14.99, rating: 4.9, reviews: 267, stock: 5, cat: 'Meat & seafood', image: '/images/salmon.jpg', tag: 'Caught Monday' },
  { id: 9, name: 'Chicken breast', unit: 'per lb', price: 6.49, rating: 4.5, reviews: 154, stock: 5, cat: 'Meat & seafood', image: '/images/chicken.jpg', tag: 'Fresh cut' },
  { id: 10, name: 'Olive oil', unit: '500 ml', price: 9.8, rating: 4.8, reviews: 89, stock: 10, cat: 'Pantry', image: '/images/olive-oil.jpg' },
  { id: 11, name: 'Penne pasta', unit: '500 g', price: 1.99, rating: 4.4, reviews: 73, stock: 8, cat: 'Pantry', image: '/images/pasta.jpg' },
  { id: 12, name: 'Mixed berries', unit: '12 oz bag', price: 5.49, was: 6.49, rating: 4.6, stock: 6, reviews: 120, cat: 'Frozen', image: '/images/berries.jpg' },
];

export const CATS = ['All', 'Produce', 'Dairy & eggs', 'Bakery', 'Meat & seafood', 'Pantry', 'Frozen'];

export const RECIPES = [
  { id: 'shak', name: 'Tomato and egg skillet', time: '25 min', serves: 2, image: '/images/skillet-eggs.jpg', items: [{ id: 3, qty: 2 }, { id: 5, qty: 1 }, { id: 6, qty: 1 }, { id: 10, qty: 1 }] },
  { id: 'salm', name: 'Salmon pasta', time: '30 min', serves: 3, image: '/images/salmon-pasta.jpg', items: [{ id: 8, qty: 1 }, { id: 11, qty: 2 }, { id: 3, qty: 1 }, { id: 10, qty: 1 }] },
  { id: 'berr', name: 'Berry breakfast bowl', time: '10 min', serves: 2, image: '/images/berry-bowl.jpg', items: [{ id: 12, qty: 1 }, { id: 1, qty: 1 }, { id: 4, qty: 1 }, { id: 7, qty: 1 }] },
];

export const STAFF = { cashier01: { pin: '1234', name: 'Anita Rao' }, cashier02: { pin: '4321', name: 'Meera Das' } };
export const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const lines = (cart) => Object.entries(cart).map(([id, q]) => ({ ...byId[id], qty: q }));
export const bump = (cart, id, d) => {
  const n = (cart[id] || 0) + d;
  const c = { ...cart };
  if (n <= 0) delete c[id]; else c[id] = n;
  return c;
};