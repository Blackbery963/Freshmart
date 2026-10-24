// // import React, {useState, useMemo} from 'react';
// // import {
// //   ShoppingCart, Search, User, ChevronRight, Star, Heart, Plus, Minus, X, Truck,
// //   Store, BadgeCheck, Clock, Leaf, Lock, LogOut, Printer, Banknote, CreditCard,
// //   Smartphone, Trash2, Receipt, Tag,
// // } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';




// // /* ---------- data ---------- */
// // const CUR = '$';
// // const img = (seed, w = 400, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
// // const money = (n) => `${CUR}${n.toFixed(2)}`;

// // const CATEGORIES = [
// //   { name: 'Produce', seed: 'veg-market' },
// //   { name: 'Meat & Seafood', seed: 'fish-counter' },
// //   { name: 'Dairy & Eggs', seed: 'dairy-fresh' },
// //   { name: 'Bakery', seed: 'bakery-loaf' },
// //   { name: 'Pantry', seed: 'pantry-jars' },
// //   { name: 'Frozen', seed: 'frozen-aisle' },
// // ];

// // const PRODUCTS = [
// //   { id: 1, name: 'Organic Bananas', unit: 'per lb', price: 2.99, rating: 4.8, cat: 'Produce', seed: 'bananas', badge: 'Organic' },
// //   { id: 2, name: 'Fresh Avocados', unit: 'each', price: 1.5, rating: 4.7, cat: 'Produce', seed: 'avocado', badge: 'Local' },
// //   { id: 3, name: 'Vine Tomatoes', unit: 'per lb', price: 3.29, rating: 4.6, cat: 'Produce', seed: 'tomatoes' },
// //   { id: 4, name: 'Whole Milk', unit: '1 gallon', price: 3.49, rating: 4.9, cat: 'Dairy & Eggs', seed: 'milk-bottle', badge: 'Sale' },
// //   { id: 5, name: 'Free-range Eggs', unit: 'dozen', price: 4.25, rating: 4.8, cat: 'Dairy & Eggs', seed: 'eggs-carton' },
// //   { id: 6, name: 'Artisan Sourdough', unit: 'loaf', price: 5.99, rating: 5.0, cat: 'Bakery', seed: 'sourdough', badge: 'Baked today' },
// //   { id: 7, name: 'Butter Croissants', unit: 'pack of 4', price: 4.5, rating: 4.7, cat: 'Bakery', seed: 'croissant' },
// //   { id: 8, name: 'Atlantic Salmon', unit: 'per lb', price: 12.99, rating: 4.9, cat: 'Meat & Seafood', seed: 'salmon-fillet' },
// //   { id: 9, name: 'Chicken Breast', unit: 'per lb', price: 6.49, rating: 4.5, cat: 'Meat & Seafood', seed: 'chicken-raw', badge: 'Sale' },
// //   { id: 10, name: 'Extra Virgin Olive Oil', unit: '500 ml', price: 9.8, rating: 4.8, cat: 'Pantry', seed: 'olive-oil' },
// //   { id: 11, name: 'Penne Pasta', unit: '500 g', price: 1.99, rating: 4.4, cat: 'Pantry', seed: 'pasta-dry' },
// //   { id: 12, name: 'Mixed Berry Mix', unit: '12 oz bag', price: 5.49, rating: 4.6, cat: 'Frozen', seed: 'berries-frozen' },
// // ];

// // const STAFF = { cashier01: { pin: '1234', name: 'Anita Rao' }, cashier02: { pin: '4321', name: 'Meera Das' } };
// // const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
// // const lines = (cart) => Object.entries(cart).map(([id, q]) => ({ ...byId[id], qty: q }));

// // /* ---------- small helpers ---------- */
// // const Fonts = () => (
// //   <style>{`
// //     @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');
// //     .fm-display{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.02em}
// //     .fm-body{font-family:'Figtree',system-ui,sans-serif}
// //     @media print{body *{visibility:hidden}#fm-receipt,#fm-receipt *{visibility:visible}#fm-receipt{position:absolute;left:0;top:0;width:100%}}
// //   `}</style>
// // );

// // const Stepper = ({ qty, onAdd, onSub, small }) => (
// //   <div className={`flex items-center rounded-full bg-[#10261C] text-white ${small ? 'h-8' : 'h-10'}`}>
// //     <button aria-label="Remove one" onClick={onSub} className="px-2.5 h-full hover:text-[#F6D45A] focus-visible:outline focus-visible:outline-2 rounded-full"><Minus className="w-4 h-4" /></button>
// //     <span className="w-6 text-center text-sm font-semibold tabular-nums">{qty}</span>
// //     <button aria-label="Add one" onClick={onAdd} className="px-2.5 h-full hover:text-[#F6D45A] focus-visible:outline focus-visible:outline-2 rounded-full"><Plus className="w-4 h-4" /></button>
// //   </div>
// // );

// // /* ---------- cashier counter ---------- */
// // function CashierCounter({ user, onLogout, onExit }) {
// //   const [bill, setBill] = useState({});
// //   const [q, setQ] = useState('');
// //   const [pay, setPay] = useState('Cash');
// //   const [received, setReceived] = useState('');
// //   const [disc, setDisc] = useState(0);
// //   const [receipt, setReceipt] = useState(null);
// //   const [sales, setSales] = useState({ count: 0, total: 0 });

// //   const items = lines(bill);
// //   const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
// //   const discount = (subtotal * disc) / 100;
// //   const tax = (subtotal - discount) * 0.05;
// //   const total = subtotal - discount + tax;
// //   const change = pay === 'Cash' && received ? Number(received) - total : 0;
// //   const canPay = items.length > 0 && (pay !== 'Cash' || Number(received) >= total);
// //   const shown = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
// //   const change1 = (id, d) => setBill((b) => { const n = (b[id] || 0) + d; const c = { ...b }; if (n <= 0) delete c[id]; else c[id] = n; return c; });

// //   const complete = () => {
// //     setReceipt({ no: 1000 + sales.count + 1, items, subtotal, discount, tax, total, pay, change, at: new Date().toLocaleString() });
// //     setSales((s) => ({ count: s.count + 1, total: s.total + total }));
// //     setBill({}); setReceived(''); setDisc(0);
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#EEF2EC] fm-body text-[#10261C]">
// //       <header className="bg-[#10261C] text-white">
// //         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <span className="fm-display text-xl font-extrabold">FreshMart</span>
// //             <span className="text-sm bg-white/10 rounded-full px-3 py-1">Billing counter</span>
// //           </div>
// //           <div className="flex items-center gap-4 text-sm">
// //             <span className="hidden sm:block text-white/70">Today: {sales.count} bills, {money(sales.total)}</span>
// //             <span className="font-semibold">{user.name}</span>
// //             <button onClick={onExit} className="hover:text-[#F6D45A]">View store</button>
// //             <button onClick={onLogout} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5"><LogOut className="w-4 h-4" /> Log out</button>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-[1fr_400px] gap-4">
// //         <section>
// //           <div className="relative mb-4">
// //             <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
// //             <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search item name to add to the bill"
// //               className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
// //           </div>
// //           <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
// //             {shown.map((p) => (
// //               <button key={p.id} onClick={() => change1(p.id, 1)} className="text-left bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#1F6B43] focus-visible:outline focus-visible:outline-2">
// //                 <img src={img(p.seed, 300, 200)} alt="" className="w-full h-24 object-cover" />
// //                 <div className="p-3">
// //                   <div className="font-semibold text-sm leading-tight">{p.name}</div>
// //                   <div className="text-xs text-gray-500">{p.unit}</div>
// //                   <div className="font-bold mt-1">{money(p.price)}</div>
// //                 </div>
// //               </button>
// //             ))}
// //             {!shown.length && <p className="col-span-full text-gray-500">No item matches “{q}”. Check the spelling or clear the search.</p>}
// //           </div>
// //         </section>

// //         <aside className="bg-white rounded-2xl border border-gray-200 p-4 h-fit lg:sticky lg:top-4">
// //           <h2 className="fm-display text-xl font-extrabold mb-3 flex items-center gap-2"><Receipt className="w-5 h-5" /> Current bill</h2>
// //           {!items.length ? (
// //             <p className="text-sm text-gray-500 py-8 text-center">Tap an item on the left to start a bill.</p>
// //           ) : (
// //             <ul className="divide-y divide-gray-100 max-h-72 overflow-auto">
// //               {items.map((i) => (
// //                 <li key={i.id} className="py-2 flex items-center gap-3">
// //                   <div className="flex-1 min-w-0">
// //                     <div className="text-sm font-semibold truncate">{i.name}</div>
// //                     <div className="text-xs text-gray-500">{money(i.price)} × {i.qty}</div>
// //                   </div>
// //                   <Stepper small qty={i.qty} onAdd={() => change1(i.id, 1)} onSub={() => change1(i.id, -1)} />
// //                   <span className="w-16 text-right font-semibold text-sm">{money(i.price * i.qty)}</span>
// //                 </li>
// //               ))}
// //             </ul>
// //           )}

// //           <div className="mt-3 flex items-center gap-2 text-sm">
// //             <Tag className="w-4 h-4" /> Discount
// //             {[0, 5, 10].map((d) => (
// //               <button key={d} onClick={() => setDisc(d)} className={`px-3 py-1 rounded-full border ${disc === d ? 'bg-[#10261C] text-white border-[#10261C]' : 'border-gray-300'}`}>{d}%</button>
// //             ))}
// //           </div>

// //           <dl className="mt-4 space-y-1 text-sm">
// //             <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
// //             <div className="flex justify-between"><dt>Discount</dt><dd>-{money(discount)}</dd></div>
// //             <div className="flex justify-between"><dt>Tax (5%)</dt><dd>{money(tax)}</dd></div>
// //             <div className="flex justify-between text-xl font-extrabold pt-2 border-t"><dt>Total</dt><dd>{money(total)}</dd></div>
// //           </dl>

// //           <div className="grid grid-cols-3 gap-2 mt-4">
// //             {[['Cash', Banknote], ['Card', CreditCard], ['UPI', Smartphone]].map(([n, Icon]) => (
// //               <button key={n} onClick={() => setPay(n)} className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-sm ${pay === n ? 'border-[#1F6B43] bg-[#E3F1E8] font-semibold' : 'border-gray-300'}`}>
// //                 <Icon className="w-5 h-5" />{n}
// //               </button>
// //             ))}
// //           </div>

// //           {pay === 'Cash' && (
// //             <div className="mt-3">
// //               <label className="text-sm font-semibold" htmlFor="rec">Cash received</label>
// //               <input id="rec" type="number" min="0" value={received} onChange={(e) => setReceived(e.target.value)}
// //                 className="w-full h-11 px-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
// //               {received !== '' && (
// //                 <p className={`text-sm mt-1 font-semibold ${change >= 0 ? 'text-[#1F6B43]' : 'text-[#E4472B]'}`}>
// //                   {change >= 0 ? `Give back ${money(change)}` : `Short by ${money(-change)}`}
// //                 </p>
// //               )}
// //             </div>
// //           )}

// //           <button disabled={!canPay} onClick={complete}
// //             className="w-full mt-4 h-12 rounded-xl bg-[#1F6B43] text-white font-bold disabled:opacity-40 hover:bg-[#185637]">
// //             Complete sale
// //           </button>
// //           {!!items.length && <button onClick={() => setBill({})} className="w-full mt-2 text-sm text-gray-500 hover:text-[#E4472B] flex items-center justify-center gap-1"><Trash2 className="w-4 h-4" /> Clear bill</button>}
// //         </aside>
// //       </div>

// //       <AnimatePresence>
// //         {receipt && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
// //             <motion.div initial={{ y: 24 }} animate={{ y: 0 }} className="bg-white rounded-2xl w-full max-w-sm p-6">
// //               <div id="fm-receipt" className="font-mono text-sm">
// //                 <div className="text-center mb-3"><div className="fm-display text-xl font-extrabold">FreshMart</div><div className="text-xs text-gray-500">Bill #{receipt.no} · {receipt.at}</div><div className="text-xs text-gray-500">Cashier: {user.name}</div></div>
// //                 {receipt.items.map((i) => (<div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>))}
// //                 <div className="border-t my-2" />
// //                 <div className="flex justify-between"><span>Subtotal</span><span>{money(receipt.subtotal)}</span></div>
// //                 <div className="flex justify-between"><span>Discount</span><span>-{money(receipt.discount)}</span></div>
// //                 <div className="flex justify-between"><span>Tax</span><span>{money(receipt.tax)}</span></div>
// //                 <div className="flex justify-between font-bold text-base"><span>Total ({receipt.pay})</span><span>{money(receipt.total)}</span></div>
// //                 {receipt.pay === 'Cash' && <div className="flex justify-between"><span>Change</span><span>{money(Math.max(receipt.change, 0))}</span></div>}
// //                 <p className="text-center mt-3 text-xs">Thank you for shopping with us.</p>
// //               </div>
// //               <div className="flex gap-2 mt-5">
// //                 <button onClick={() => window.print()} className="flex-1 h-11 rounded-xl border border-gray-300 flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print</button>
// //                 <button onClick={() => setReceipt(null)} className="flex-1 h-11 rounded-xl bg-[#10261C] text-white font-semibold">New bill</button>
// //               </div>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }

// // /* ---------- staff login ---------- */
// // function StaffLogin({ onClose, onSuccess }) {
// //   const [id, setId] = useState('');
// //   const [pin, setPin] = useState('');
// //   const [err, setErr] = useState('');
// //   const submit = (e) => {
// //     e.preventDefault();
// //     const s = STAFF[id.trim().toLowerCase()];
// //     if (!s || s.pin !== pin) return setErr('Staff ID or PIN is incorrect. Try again or ask your manager to reset it.');
// //     onSuccess({ id, name: s.name });
// //   };
// //   return (
// //     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
// //       <motion.form onSubmit={submit} onClick={(e) => e.stopPropagation()} initial={{ y: 24 }} animate={{ y: 0 }} className="bg-white rounded-2xl w-full max-w-sm p-6 fm-body">
// //         <div className="flex justify-between items-start">
// //           <div className="w-11 h-11 rounded-full bg-[#10261C] text-[#F6D45A] flex items-center justify-center"><Lock className="w-5 h-5" /></div>
// //           <button type="button" aria-label="Close" onClick={onClose}><X className="w-5 h-5" /></button>
// //         </div>
// //         <h2 className="fm-display text-2xl font-extrabold mt-4">Cashier login</h2>
// //         <p className="text-sm text-gray-500 mb-4">Sign in to open your billing counter.</p>
// //         <label className="text-sm font-semibold" htmlFor="sid">Staff ID</label>
// //         <input id="sid" value={id} onChange={(e) => setId(e.target.value)} autoFocus className="w-full h-11 px-3 mt-1 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
// //         <label className="text-sm font-semibold" htmlFor="pin">PIN</label>
// //         <input id="pin" type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full h-11 px-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
// //         {err && <p role="alert" className="text-sm text-[#E4472B] mt-3">{err}</p>}
// //         <button className="w-full h-12 mt-5 rounded-xl bg-[#1F6B43] text-white font-bold hover:bg-[#185637]">Log in</button>
// //         <p className="text-xs text-gray-400 mt-3 text-center">Demo: cashier01 / 1234</p>
// //       </motion.form>
// //     </motion.div>
// //   );
// // }

// // /* ---------- main page ---------- */
// // export default function Homepage() {
// //   const [view, setView] = useState('shop');
// //   const [staff, setStaff] = useState(null);
// //   const [loginOpen, setLoginOpen] = useState(false);
// //   const [cart, setCart] = useState({});
// //   const [drawer, setDrawer] = useState(false);
// //   const [wish, setWish] = useState(new Set());
// //   const [query, setQuery] = useState('');
// //   const [cat, setCat] = useState('All');
// //   const [mode, setMode] = useState('Delivery');
// //   const [promo, setPromo] = useState('');
// //   const [promoOk, setPromoOk] = useState(false);
// //   const [toast, setToast] = useState('');

// //   const count = Object.values(cart).reduce((a, b) => a + b, 0);
// //   const items = lines(cart);
// //   const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
// //   const off = promoOk ? subtotal * 0.2 : 0;
// //   const FREE_AT = 35;
// //   const fee = mode === 'Pickup' || subtotal - off >= FREE_AT || !subtotal ? 0 : 3.99;
// //   const total = subtotal - off + fee;

// //   const change = (id, d) => {
// //     setCart((c) => { const n = (c[id] || 0) + d; const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });
// //     if (d > 0) { setToast(`${byId[id].name} added to cart`); setTimeout(() => setToast(''), 1600); }
// //   };
// //   const toggleWish = (id) => setWish((w) => { const n = new Set(w); n.has(id) ? n.delete(id) : n.add(id); return n; });

// //   const results = useMemo(() => PRODUCTS.filter((p) =>
// //     (cat === 'All' || p.cat === cat) && p.name.toLowerCase().includes(query.toLowerCase())), [cat, query]);
// //   const suggestions = query.length > 1 ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];

// //   if (view === 'cashier' && staff)
// //     return (<><Fonts /><CashierCounter user={staff} onLogout={() => { setStaff(null); setView('shop'); }} onExit={() => setView('shop')} /></>);

// //   return (
// //     <div className="min-h-screen bg-[#F3F6F1] fm-body text-[#10261C]">
// //       <Fonts />
// //       <div className="bg-[#10261C] text-white text-sm text-center py-2 px-4">Free delivery on orders over {money(FREE_AT)}. Use code <b className="text-[#F6D45A]">FRESH20</b> for 20% off your first order.</div>

// //       {/* header */}
// //       <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b border-gray-200">
// //         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
// //           <a href="#top" className="fm-display text-2xl font-extrabold text-[#1F6B43] flex items-center gap-1"><Leaf className="w-6 h-6 text-[#E4472B]" />FreshMart</a>
// //           <div className="relative flex-1 max-w-xl hidden md:block">
// //             <Search className="w-5 h-5 absolute left-4 top-2.5 text-gray-400" />
// //             <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bananas, sourdough, salmon…"
// //               className="w-full h-10 pl-12 pr-4 rounded-full bg-[#F3F6F1] border border-transparent focus:bg-white focus:border-[#1F6B43] focus:outline-none" />
// //             {!!suggestions.length && (
// //               <ul className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
// //                 {suggestions.map((s) => (
// //                   <li key={s.id}><button onClick={() => { setQuery(s.name); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F3F6F1] text-left">
// //                     <img src={img(s.seed, 60, 60)} alt="" className="w-9 h-9 rounded-lg object-cover" /><span className="text-sm font-semibold">{s.name}</span><span className="ml-auto text-sm text-gray-500">{money(s.price)}</span></button></li>
// //                 ))}
// //               </ul>
// //             )}
// //           </div>
// //           <div className="ml-auto flex items-center gap-2">
// //             <button onClick={() => (staff ? setView('cashier') : setLoginOpen(true))} className="hidden sm:flex items-center gap-2 text-sm font-semibold border border-[#10261C] rounded-full px-4 h-10 hover:bg-[#10261C] hover:text-white transition-colors">
// //               <Store className="w-4 h-4" /> {staff ? 'Open counter' : 'Cashier login'}
// //             </button>
// //             <button className="flex items-center gap-1 text-sm font-semibold px-3 h-10 rounded-full hover:bg-gray-100"><User className="w-5 h-5" /><span className="hidden lg:block">Sign in</span></button>
// //             <button onClick={() => setDrawer(true)} aria-label="Open cart" className="relative flex items-center gap-2 bg-[#1F6B43] text-white rounded-full px-4 h-10 font-semibold hover:bg-[#185637]">
// //               <ShoppingCart className="w-5 h-5" /><span className="hidden sm:block">{money(subtotal)}</span>
// //               {count > 0 && <span className="absolute -top-1 -right-1 bg-[#E4472B] text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
// //             </button>
// //           </div>
// //         </div>
// //         <div className="md:hidden px-4 pb-3">
// //           <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search groceries" className="w-full h-10 px-4 rounded-full bg-[#F3F6F1] focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
// //         </div>
// //       </header>

// //       {/* hero */}
// //       <section id="top" className="max-w-7xl mx-auto px-4 pt-10 pb-6 grid lg:grid-cols-2 gap-10 items-center">
// //         <div>
// //           <h1 className="fm-display text-5xl md:text-6xl font-extrabold leading-[1.02]">Dinner starts at the market, not the checkout line.</h1>
// //           <p className="mt-5 text-lg text-[#3F5A4B] max-w-md">Fresh produce, bakery and dairy from local growers, at your door in hours or ready at the curb.</p>
// //           <div className="mt-7 flex flex-wrap items-center gap-3">
// //             <a href="#shop" className="bg-[#E4472B] text-white font-bold rounded-full px-7 h-12 flex items-center hover:bg-[#c93a21]">Start shopping <ChevronRight className="w-5 h-5 ml-1" /></a>
// //             <div className="flex bg-white rounded-full p-1 border border-gray-200" role="group" aria-label="Order type">
// //               {['Delivery', 'Pickup'].map((m) => (
// //                 <button key={m} onClick={() => setMode(m)} className={`px-5 h-10 rounded-full text-sm font-semibold ${mode === m ? 'bg-[#10261C] text-white' : 'text-gray-600'}`}>{m}</button>
// //               ))}
// //             </div>
// //           </div>
// //           <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#3F5A4B]">
// //             <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Same-day delivery before 2 PM</span>
// //             <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Satisfaction guaranteed</span>
// //             <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Pickup in 30 minutes</span>
// //           </div>
// //         </div>
// //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h-[380px] md:h-[460px]">
// //           <img src={img('farm-table', 700, 800)} alt="Fresh vegetables on a table" className="absolute right-0 top-0 w-[62%] h-[85%] object-cover rounded-[2rem]" />
// //           <img src={img('bread-basket', 500, 500)} alt="Bread in a basket" className="absolute left-0 top-10 w-[42%] aspect-square object-cover rounded-[2rem] -rotate-3 border-4 border-[#F3F6F1]" />
// //           <img src={img('fruit-bowl', 500, 400)} alt="Bowl of fruit" className="absolute left-[18%] bottom-0 w-[44%] h-[34%] object-cover rounded-[2rem] rotate-2 border-4 border-[#F3F6F1]" />
// //           <div className="absolute right-3 bottom-6 bg-[#F6D45A] text-[#10261C] rounded-2xl px-4 py-3 shadow-lg">
// //             <div className="fm-display text-2xl font-extrabold">20% off</div><div className="text-xs font-semibold">first order, code FRESH20</div>
// //           </div>
// //         </motion.div>
// //       </section>

// //       {/* categories */}
// //       <section className="max-w-7xl mx-auto px-4 py-8">
// //         <h2 className="fm-display text-3xl font-extrabold mb-5">Shop by aisle</h2>
// //         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
// //           {CATEGORIES.map((c) => (
// //             <button key={c.name} onClick={() => { setCat(c.name); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
// //               <img src={img(c.seed, 300, 380)} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
// //               <div className="absolute inset-0 bg-gradient-to-t from-[#10261C]/85 to-transparent" />
// //               <span className="absolute bottom-3 left-3 right-3 text-white font-bold leading-tight">{c.name}</span>
// //             </button>
// //           ))}
// //         </div>
// //       </section>

// //       {/* products */}
// //       <section id="shop" className="max-w-7xl mx-auto px-4 py-8 scroll-mt-24">
// //         <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
// //           <h2 className="fm-display text-3xl font-extrabold">Fresh this week</h2>
// //           <div className="flex gap-2 overflow-x-auto pb-1">
// //             {['All', ...CATEGORIES.map((c) => c.name)].map((n) => (
// //               <button key={n} onClick={() => setCat(n)} className={`whitespace-nowrap px-4 h-9 rounded-full text-sm font-semibold border ${cat === n ? 'bg-[#10261C] text-white border-[#10261C]' : 'bg-white border-gray-300 hover:border-[#10261C]'}`}>{n}</button>
// //             ))}
// //           </div>
// //         </div>
// //         {query && <p className="text-sm text-gray-500 mb-3">{results.length} result{results.length !== 1 && 's'} for “{query}”. <button className="underline" onClick={() => setQuery('')}>Clear search</button></p>}
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
// //           {results.map((p) => (
// //             <article key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col">
// //               <div className="relative">
// //                 <img src={img(p.seed, 400, 300)} alt={p.name} loading="lazy" className="w-full aspect-[4/3] object-cover" />
// //                 {p.badge && <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.badge === 'Sale' ? 'bg-[#E4472B] text-white' : 'bg-[#F6D45A]'}`}>{p.badge}</span>}
// //                 <button onClick={() => toggleWish(p.id)} aria-label="Save to wishlist" aria-pressed={wish.has(p.id)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
// //                   <Heart className={`w-5 h-5 ${wish.has(p.id) ? 'fill-[#E4472B] text-[#E4472B]' : 'text-gray-600'}`} />
// //                 </button>
// //               </div>
// //               <div className="p-4 flex flex-col flex-1">
// //                 <h3 className="font-bold leading-tight">{p.name}</h3>
// //                 <p className="text-sm text-gray-500">{p.unit}</p>
// //                 <div className="flex items-center gap-1 text-sm mt-1"><Star className="w-4 h-4 fill-[#F6D45A] text-[#F6D45A]" />{p.rating}</div>
// //                 <div className="flex items-center justify-between mt-auto pt-4">
// //                   <span className="fm-display text-xl font-extrabold">{money(p.price)}</span>
// //                   {cart[p.id] ? <Stepper qty={cart[p.id]} onAdd={() => change(p.id, 1)} onSub={() => change(p.id, -1)} />
// //                     : <button onClick={() => change(p.id, 1)} className="h-10 px-4 rounded-full bg-[#1F6B43] text-white text-sm font-bold hover:bg-[#185637] flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>}
// //                 </div>
// //               </div>
// //             </article>
// //           ))}
// //         </div>
// //         {!results.length && <p className="text-center text-gray-500 py-16">Nothing found here. Try another aisle or clear your search.</p>}
// //       </section>

// //       <footer className="bg-[#10261C] text-white/70 mt-10 text-sm">
// //         <div className="max-w-7xl mx-auto px-4 py-10 flex flex-wrap justify-between gap-4">
// //           <span className="fm-display text-xl font-extrabold text-white">FreshMart</span>
// //           <span>Open daily, 7 AM to 10 PM</span>
// //           <button onClick={() => setLoginOpen(true)} className="hover:text-[#F6D45A]">Staff and cashier login</button>
// //         </div>
// //       </footer>

// //       {/* cart drawer */}
// //       <AnimatePresence>
// //         {drawer && (
// //           <>
// //             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 bg-black/40 z-50" />
// //             <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col fm-body" role="dialog" aria-label="Your cart">
// //               <div className="flex items-center justify-between p-5 border-b"><h2 className="fm-display text-2xl font-extrabold">Your cart</h2><button aria-label="Close cart" onClick={() => setDrawer(false)}><X className="w-6 h-6" /></button></div>
// //               <div className="px-5 pt-4">
// //                 <p className="text-sm mb-1">{subtotal - off >= FREE_AT || mode === 'Pickup' ? 'You get free delivery.' : `Add ${money(FREE_AT - (subtotal - off))} more for free delivery.`}</p>
// //                 <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-[#1F6B43] transition-all" style={{ width: `${Math.min(100, ((subtotal - off) / FREE_AT) * 100)}%` }} /></div>
// //               </div>
// //               <div className="flex-1 overflow-auto p-5">
// //                 {!items.length ? <p className="text-gray-500 text-center mt-16">Your cart is empty. Add something fresh from the shop.</p> : (
// //                   <ul className="space-y-4">
// //                     {items.map((i) => (
// //                       <li key={i.id} className="flex items-center gap-3">
// //                         <img src={img(i.seed, 100, 100)} alt="" className="w-16 h-16 rounded-xl object-cover" />
// //                         <div className="flex-1 min-w-0"><div className="font-semibold truncate">{i.name}</div><div className="text-sm text-gray-500">{money(i.price)} · {i.unit}</div></div>
// //                         <Stepper small qty={i.qty} onAdd={() => change(i.id, 1)} onSub={() => change(i.id, -1)} />
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 )}
// //               </div>
// //               <div className="p-5 border-t space-y-3">
// //                 <div className="flex gap-2">
// //                   <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" className="flex-1 h-10 px-3 rounded-lg border border-gray-300" />
// //                   <button onClick={() => setPromoOk(promo.trim().toUpperCase() === 'FRESH20')} className="px-4 rounded-lg bg-[#10261C] text-white text-sm font-semibold">Apply</button>
// //                 </div>
// //                 {promo && <p className={`text-xs ${promoOk ? 'text-[#1F6B43]' : 'text-gray-500'}`}>{promoOk ? 'FRESH20 applied: 20% off.' : 'Press Apply to check your code.'}</p>}
// //                 <div className="text-sm space-y-1">
// //                   <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
// //                   {promoOk && <div className="flex justify-between text-[#1F6B43]"><span>Promo</span><span>-{money(off)}</span></div>}
// //                   <div className="flex justify-between"><span>{mode}</span><span>{fee ? money(fee) : 'Free'}</span></div>
// //                   <div className="flex justify-between text-lg font-extrabold pt-1"><span>Total</span><span>{money(total)}</span></div>
// //                 </div>
// //                 <button disabled={!items.length} className="w-full h-12 rounded-xl bg-[#E4472B] text-white font-bold disabled:opacity-40">Checkout</button>
// //               </div>
// //             </motion.aside>
// //           </>
// //         )}
// //       </AnimatePresence>

// //       <AnimatePresence>{loginOpen && <StaffLogin onClose={() => setLoginOpen(false)} onSuccess={(u) => { setStaff(u); setLoginOpen(false); setView('cashier'); }} />}</AnimatePresence>

// //       <AnimatePresence>
// //         {toast && <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#10261C] text-white text-sm px-5 py-3 rounded-full z-[70]" role="status">{toast}</motion.div>}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }



// import React, { useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, ShoppingBag, Home, ChefHat, Store, ChevronRight, Truck, BadgeCheck, Clock, Leaf, User } from 'lucide-react';
// import { PRODUCTS, CATS, FREE_AT, byId, bump, img, money } from './data';
// import { Fonts, ProductCard } from './ui.jsx';
// import Recipes from './Recipes.jsx';
// import CartDrawer from './CartDrawer.jsx';
// import CashierCounter, { StaffLogin } from './CashierCounter.jsx';

// const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// export default function Homepage() {
//   const [view, setView] = useState('shop');
//   const [staff, setStaff] = useState(null);
//   const [loginOpen, setLoginOpen] = useState(false);
//   const [cart, setCart] = useState({});
//   const [drawer, setDrawer] = useState(false);
//   const [wish, setWish] = useState(new Set());
//   const [query, setQuery] = useState('');
//   const [cat, setCat] = useState('All');
//   const [sort, setSort] = useState('popular');
//   const [mode, setMode] = useState('Delivery');
//   const [toast, setToast] = useState('');

//   const count = Object.values(cart).reduce((a, b) => a + b, 0);
//   const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + byId[id].price * q, 0);

//   const say = (m) => { setToast(m); setTimeout(() => setToast(''), 1800); };
//   const change = (id, d) => { setCart((c) => bump(c, id, d)); if (d > 0) say(`${byId[id].name} added`); };
//   const addAll = (list, name) => {
//     setCart((c) => list.reduce((acc, x) => bump(acc, x.id, x.qty), c));
//     say(`${name} ingredients added`);
//   };
//   const toggleWish = (id) => setWish((w) => { const n = new Set(w); n.has(id) ? n.delete(id) : n.add(id); return n; });
//   const openCashier = () => (staff ? setView('cashier') : setLoginOpen(true));

//   const results = useMemo(() => {
//     const r = PRODUCTS.filter((p) => (cat === 'All' || p.cat === cat) && p.name.toLowerCase().includes(query.toLowerCase()));
//     if (sort === 'low') return [...r].sort((a, b) => a.price - b.price);
//     if (sort === 'high') return [...r].sort((a, b) => b.price - a.price);
//     return [...r].sort((a, b) => b.reviews - a.reviews);
//   }, [cat, query, sort]);
//   const suggestions = query.length > 1 ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];

//   if (view === 'cashier' && staff)
//     return (<><Fonts /><CashierCounter user={staff} onLogout={() => { setStaff(null); setView('shop'); }} onExit={() => setView('shop')} /></>);

//   return (
//     <div className="min-h-screen bg-[#EEF2EC] fm-body text-[#10261C] pb-24 md:pb-0">
//       <Fonts />
//       <div className="bg-[#10261C] text-white text-xs sm:text-sm text-center py-2 px-4">Free delivery over {money(FREE_AT)}. Code <b className="text-[#F6D45A]">FRESH20</b> takes 20% off your first order.</div>

//       <header className="bg-white/95 backdrop-blur sticky top-0 z-40 border-b border-[#10261C]/10">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
//           <a href="#top" className="order-1 fm-display text-2xl font-extrabold text-[#1F6B43] flex items-center gap-1"><Leaf className="w-6 h-6 text-[#E4472B]" />FreshMart</a>
//           <div className="order-2 ml-auto md:order-3 md:ml-0 flex items-center gap-2">
//             <button onClick={openCashier} className="hidden md:flex items-center gap-2 text-sm font-semibold border border-[#10261C] rounded-full px-4 h-11 hover:bg-[#10261C] hover:text-white transition-colors"><Store className="w-4 h-4" />{staff ? 'Open counter' : 'Cashier login'}</button>
//             <button aria-label="Account" className="hidden md:flex w-11 h-11 rounded-full hover:bg-gray-100 items-center justify-center"><User className="w-5 h-5" /></button>
//             <button onClick={() => setDrawer(true)} aria-label={`Open cart, ${count} items`} className="relative flex items-center gap-2 bg-[#1F6B43] text-white rounded-full px-4 h-11 font-semibold">
//               <ShoppingBag className="w-5 h-5" /><span className="hidden sm:block">{money(subtotal)}</span>
//               {count > 0 && <span className="absolute -top-1 -right-1 bg-[#E4472B] text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-bold">{count}</span>}
//             </button>
//           </div>
//           <div className="order-3 md:order-2 relative w-full md:w-auto md:flex-1 md:max-w-xl md:mx-auto">
//             <Search className="w-5 h-5 absolute left-4 top-3 text-gray-400" />
//             <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bananas, sourdough, salmon" aria-label="Search products"
//               className="w-full h-11 pl-12 pr-4 rounded-full bg-[#EEF2EC] text-base border border-transparent focus:bg-white focus:border-[#1F6B43] focus:outline-none" />
//             {!!suggestions.length && (
//               <ul className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10">
//                 {suggestions.map((s) => (
//                   <li key={s.id}><button onClick={() => { setQuery(s.name); go('shop'); }} className="w-full flex items-center gap-3 px-3 py-2.5 active:bg-[#EEF2EC] text-left">
//                     <img src={img(s.seed, 60, 60)} alt="" className="w-10 h-10 rounded-xl object-cover" /><span className="text-sm font-semibold">{s.name}</span><span className="ml-auto text-sm text-gray-500">{money(s.price)}</span></button></li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </header>

//       <section id="top" className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 md:pt-10 pb-4 grid lg:grid-cols-2 gap-8 items-center">
//         <div>
//           <h1 className="fm-display text-[2.6rem] sm:text-6xl font-extrabold leading-[1.02]">Dinner starts at the market, not the checkout line.</h1>
//           <p className="mt-4 text-lg text-[#3F5A4B] max-w-md">Fresh produce, bakery and dairy from local growers, at your door in hours or ready at the curb.</p>
//           <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
//             <a href="#shop" className="bg-[#E4472B] text-white font-bold rounded-full px-7 h-14 flex items-center justify-center text-lg">Start shopping <ChevronRight className="w-5 h-5 ml-1" /></a>
//             <div className="flex bg-white rounded-full p-1" role="group" aria-label="Order type">
//               {['Delivery', 'Pickup'].map((m) => <button key={m} onClick={() => setMode(m)} className={`flex-1 sm:flex-none px-6 h-12 rounded-full text-sm font-semibold ${mode === m ? 'bg-[#10261C] text-white' : 'text-gray-600'}`}>{m}</button>)}
//             </div>
//           </div>
//           <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#3F5A4B]">
//             <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Same-day before 2 PM</span>
//             <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Satisfaction guaranteed</span>
//             <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Pickup in 30 min</span>
//           </div>
//         </div>
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h-[300px] sm:h-[420px] lg:h-[460px]">
//           <img src="/images/heroimage1" alt="Fresh vegetables on a table" className="absolute right-0 top-0 w-[62%] h-[85%] object-cover rounded-[2rem]" />
//           <img src="/images/heroimage2" alt="Bread in a basket" className="absolute left-0 top-8 w-[42%] aspect-square object-cover rounded-[2rem] -rotate-3 border-4 border-[#EEF2EC]" />
//           <img src="/images/heroimaege3" alt="Bowl of fruit" className="absolute left-[16%] bottom-0 w-[46%] h-[34%] object-cover rounded-[2rem] rotate-2 border-4 border-[#EEF2EC]" />
//           <div className="absolute right-2 bottom-4 bg-[#F6D45A] rounded-2xl px-4 py-3 shadow-lg"><div className="fm-display text-2xl font-extrabold leading-none">20% off</div><div className="text-xs font-semibold mt-1">first order, FRESH20</div></div>
//         </motion.div>
//       </section>

//       <Recipes onAddAll={addAll} />

//       <section id="shop" className="max-w-7xl mx-auto px-3 sm:px-4 py-6 scroll-mt-28">
//         <div className="flex items-end justify-between gap-3 mb-3">
//           <h2 className="fm-display text-3xl font-extrabold">Fresh this week</h2>
//           <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="h-11 rounded-full bg-white px-4 text-sm font-semibold border-0">
//             <option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
//           </select>
//         </div>
//         <div className="flex gap-2 overflow-x-auto fm-noscroll -mx-3 px-3 sm:mx-0 sm:px-0 pb-3">
//           {CATS.map((n) => <button key={n} onClick={() => setCat(n)} className={`whitespace-nowrap px-5 h-11 rounded-full text-sm font-semibold ${cat === n ? 'bg-[#10261C] text-white' : 'bg-white'}`}>{n}</button>)}
//         </div>
//         {query && <p className="text-sm text-gray-500 mb-3">{results.length} result{results.length !== 1 && 's'} for “{query}”. <button className="underline" onClick={() => setQuery('')}>Clear search</button></p>}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
//           {results.map((p) => <ProductCard key={p.id} p={p} qty={cart[p.id]} onAdd={() => change(p.id, 1)} onSub={() => change(p.id, -1)} wished={wish.has(p.id)} onWish={() => toggleWish(p.id)} />)}
//         </div>
//         {!results.length && <p className="text-center text-gray-500 py-16">Nothing found here. Try another category or clear your search.</p>}
//       </section>

//       <footer className="bg-[#10261C] text-white/70 mt-8 text-sm">
//         <div className="max-w-7xl mx-auto px-4 py-8 flex flex-wrap justify-between gap-3">
//           <span className="fm-display text-xl font-extrabold text-white">FreshMart</span>
//           <span>Open daily, 7 AM to 10 PM</span>
//           <button onClick={() => setLoginOpen(true)} className="min-h-[44px] hover:text-[#F6D45A]">Staff and cashier login</button>
//         </div>
//       </footer>

//       <nav aria-label="Main" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#10261C]/10 grid grid-cols-4 fm-safe">
//         {[['Home', Home, () => go('top')], ['Cook', ChefHat, () => go('cook')], ['Cart', ShoppingBag, () => setDrawer(true)], ['Cashier', Store, openCashier]].map(([label, Icon, fn]) => (
//           <button key={label} onClick={fn} className="relative h-16 flex flex-col items-center justify-center gap-1 text-xs font-semibold active:bg-[#EEF2EC]">
//             <Icon className="w-5 h-5" />{label}
//             {label === 'Cart' && count > 0 && <span className="absolute top-2 left-1/2 ml-1.5 bg-[#E4472B] text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{count}</span>}
//           </button>
//         ))}
//       </nav>

//       <CartDrawer open={drawer} onClose={() => setDrawer(false)} cart={cart} change={change} mode={mode} setMode={setMode} />
//       <AnimatePresence>{loginOpen && <StaffLogin onClose={() => setLoginOpen(false)} onSuccess={(u) => { setStaff(u); setLoginOpen(false); setView('cashier'); }} />}</AnimatePresence>
//       <AnimatePresence>
//         {toast && <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} role="status" className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-[#10261C] text-white text-sm px-5 py-3 rounded-full z-[80] shadow-lg whitespace-nowrap">{toast}</motion.div>}
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Home, ChefHat, Store, ChevronRight, Truck, BadgeCheck, Clock, Leaf, User } from 'lucide-react';
import { PRODUCTS, CATS, FREE_AT, byId, bump, money } from './data';
import { Fonts, ProductCard } from './ui.jsx';
import Recipes from './Recipes.jsx';
import CartDrawer from './CartDrawer.jsx';
import CashierCounter, { StaffLogin } from './CashierCounter.jsx';

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Homepage() {
  const [view, setView] = useState('shop');
  const [staff, setStaff] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [drawer, setDrawer] = useState(false);
  const [wish, setWish] = useState(new Set());
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('popular');
  const [mode, setMode] = useState('Delivery');
  const [toast, setToast] = useState('');

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + byId[id].price * q, 0);

  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 1800); };
  const change = (id, d) => { setCart((c) => bump(c, id, d)); if (d > 0) say(`${byId[id].name} added`); };
  const addAll = (list, name) => {
    setCart((c) => list.reduce((acc, x) => bump(acc, x.id, x.qty), c));
    say(`${name} ingredients added`);
  };
  const toggleWish = (id) => setWish((w) => { const n = new Set(w); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const openCashier = () => (staff ? setView('cashier') : setLoginOpen(true));

  const results = useMemo(() => {
    const r = PRODUCTS.filter((p) => (cat === 'All' || p.cat === cat) && p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'low') return [...r].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...r].sort((a, b) => b.price - a.price);
    return [...r].sort((a, b) => b.reviews - a.reviews);
  }, [cat, query, sort]);
  const suggestions = query.length > 1 ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];

  if (view === 'cashier' && staff)
    return (<><Fonts /><CashierCounter user={staff} onLogout={() => { setStaff(null); setView('shop'); }} onExit={() => setView('shop')} /></>);

  return (
    <div className="min-h-screen bg-[#EEF2EC] fm-body text-[#10261C] pb-24 md:pb-0">
      <Fonts />
      <div className="bg-[#10261C] text-white text-xs sm:text-sm text-center py-2 px-4">Free delivery over {money(FREE_AT)}. Code <b className="text-[#F6D45A]">FRESH20</b> takes 20% off your first order.</div>

      <header className="bg-white/95 backdrop-blur sticky top-0 z-40 border-b border-[#10261C]/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <a href="#top" className="order-1 fm-display text-2xl font-extrabold text-[#1F6B43] flex items-center gap-1"><Leaf className="w-6 h-6 text-[#E4472B]" />FreshMart</a>
          <div className="order-2 ml-auto md:order-3 md:ml-0 flex items-center gap-2">
            <button onClick={openCashier} className="hidden md:flex items-center gap-2 text-sm font-semibold border border-[#10261C] rounded-full px-4 h-11 hover:bg-[#10261C] hover:text-white transition-colors"><Store className="w-4 h-4" />{staff ? 'Open counter' : 'Cashier login'}</button>
            <button aria-label="Account" className="hidden md:flex w-11 h-11 rounded-full hover:bg-gray-100 items-center justify-center"><User className="w-5 h-5" /></button>
            <button onClick={() => setDrawer(true)} aria-label={`Open cart, ${count} items`} className="relative flex items-center gap-2 bg-[#1F6B43] text-white rounded-full px-4 h-11 font-semibold">
              <ShoppingBag className="w-5 h-5" /><span className="hidden sm:block">{money(subtotal)}</span>
              {count > 0 && <span className="absolute -top-1 -right-1 bg-[#E4472B] text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-bold">{count}</span>}
            </button>
          </div>
          <div className="order-3 md:order-2 relative w-full md:w-auto md:flex-1 md:max-w-xl md:mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-3 text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bananas, sourdough, salmon" aria-label="Search products"
              className="w-full h-11 pl-12 pr-4 rounded-full bg-[#EEF2EC] text-base border border-transparent focus:bg-white focus:border-[#1F6B43] focus:outline-none" />
            {!!suggestions.length && (
              <ul className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10">
                {suggestions.map((s) => (
                  <li key={s.id}><button onClick={() => { setQuery(s.name); go('shop'); }} className="w-full flex items-center gap-3 px-3 py-2.5 active:bg-[#EEF2EC] text-left">
                    <img src={s.image} alt="" className="w-10 h-10 rounded-xl object-cover" /><span className="text-sm font-semibold">{s.name}</span><span className="ml-auto text-sm text-gray-500">{money(s.price)}</span></button></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <section id="top" className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 md:pt-10 pb-4 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="fm-display text-[2.6rem] sm:text-6xl font-extrabold leading-[1.02]">Dinner starts at the market, not the checkout line.</h1>
          <p className="mt-4 text-lg text-[#3F5A4B] max-w-md">Fresh produce, bakery and dairy from local growers, at your door in hours or ready at the curb.</p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <a href="#shop" className="bg-[#E4472B] text-white font-bold rounded-full px-7 h-14 flex items-center justify-center text-lg">Start shopping <ChevronRight className="w-5 h-5 ml-1" /></a>
            <div className="flex bg-white rounded-full p-1" role="group" aria-label="Order type">
              {['Delivery', 'Pickup'].map((m) => <button key={m} onClick={() => setMode(m)} className={`flex-1 sm:flex-none px-6 h-12 rounded-full text-sm font-semibold ${mode === m ? 'bg-[#10261C] text-white' : 'text-gray-600'}`}>{m}</button>)}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#3F5A4B]">
            <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Same-day before 2 PM</span>
            <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Satisfaction guaranteed</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Pickup in 30 min</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h-[300px] sm:h-[420px] lg:h-[460px]">
          {/* Replaced with direct public folder paths */}
          <img src="/images/heroimage1.jpg" alt="Fresh vegetables on a table" className="absolute right-0 top-0 w-[62%] h-[85%] object-cover rounded-[2rem]" />
          <img src="/images/heroimage2.jpg" alt="Bread in a basket" className="absolute left-0 top-8 w-[42%] aspect-square object-cover rounded-[2rem] -rotate-3 border-4 border-[#EEF2EC]" />
          <img src="/images/heroimage3.jpg" alt="Bowl of fruit" className="absolute left-[16%] bottom-0 w-[46%] h-[34%] object-cover rounded-[2rem] rotate-2 border-4 border-[#EEF2EC]" />
          <div className="absolute right-2 bottom-4 bg-[#F6D45A] rounded-2xl px-4 py-3 shadow-lg"><div className="fm-display text-2xl font-extrabold leading-none">20% off</div><div className="text-xs font-semibold mt-1">first order, FRESH20</div></div>
        </motion.div>
      </section>

      <Recipes onAddAll={addAll} />

      <section id="shop" className="max-w-7xl mx-auto px-3 sm:px-4 py-6 scroll-mt-28">
        <div className="flex items-end justify-between gap-3 mb-3">
          <h2 className="fm-display text-3xl font-extrabold">Fresh this week</h2>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="h-11 rounded-full bg-white px-4 text-sm font-semibold border-0">
            <option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </div>
        <div className="flex gap-2 overflow-x-auto fm-noscroll -mx-3 px-3 sm:mx-0 sm:px-0 pb-3">
          {CATS.map((n) => <button key={n} onClick={() => setCat(n)} className={`whitespace-nowrap px-5 h-11 rounded-full text-sm font-semibold ${cat === n ? 'bg-[#10261C] text-white' : 'bg-white'}`}>{n}</button>)}
        </div>
        {query && <p className="text-sm text-gray-500 mb-3">{results.length} result{results.length !== 1 && 's'} for “{query}”. <button className="underline" onClick={() => setQuery('')}>Clear search</button></p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {results.map((p) => <ProductCard key={p.id} p={p} qty={cart[p.id]} onAdd={() => change(p.id, 1)} onSub={() => change(p.id, -1)} wished={wish.has(p.id)} onWish={() => toggleWish(p.id)} />)}
        </div>
        {!results.length && <p className="text-center text-gray-500 py-16">Nothing found here. Try another category or clear your search.</p>}
      </section>

      <footer className="bg-[#10261C] text-white/70 mt-8 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-wrap justify-between gap-3">
          <span className="fm-display text-xl font-extrabold text-white">FreshMart</span>
          <span>Open daily, 7 AM to 10 PM</span>
          <button onClick={() => setLoginOpen(true)} className="min-h-[44px] hover:text-[#F6D45A]">Staff and cashier login</button>
        </div>
      </footer>

      <nav aria-label="Main" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#10261C]/10 grid grid-cols-4 fm-safe">
        {[['Home', Home, () => go('top')], ['Cook', ChefHat, () => go('cook')], ['Cart', ShoppingBag, () => setDrawer(true)], ['Cashier', Store, openCashier]].map(([label, Icon, fn]) => (
          <button key={label} onClick={fn} className="relative h-16 flex flex-col items-center justify-center gap-1 text-xs font-semibold active:bg-[#EEF2EC]">
            <Icon className="w-5 h-5" />{label}
            {label === 'Cart' && count > 0 && <span className="absolute top-2 left-1/2 ml-1.5 bg-[#E4472B] text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{count}</span>}
          </button>
        ))}
      </nav>

      <CartDrawer open={drawer} onClose={() => setDrawer(false)} cart={cart} change={change} mode={mode} setMode={setMode} />
      <AnimatePresence>{loginOpen && <StaffLogin onClose={() => setLoginOpen(false)} onSuccess={(u) => { setStaff(u); setLoginOpen(false); setView('cashier'); }} />}</AnimatePresence>
      <AnimatePresence>
        {toast && <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} role="status" className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-[#10261C] text-white text-sm px-5 py-3 rounded-full z-[80] shadow-lg whitespace-nowrap">{toast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}