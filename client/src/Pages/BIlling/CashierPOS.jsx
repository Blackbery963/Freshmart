import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Minus, Trash2, Box, Pause, BarChart3, Volume2, VolumeX, UserPlus, Flame, X, ShoppingBag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PRODUCTS, money } from '../HomepageComponents/data.js';
import PaymentSheet from './PaymentSheet';
import ShiftPanel from './ShiftPanel';

const LOW = 10;
const START = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const sum = (b) => Object.entries(b).reduce((s, [id, q]) => s + byId[id].price * q, 0);
const cats = ['All', 'Low stock', ...new Set(PRODUCTS.map((p) => p.cat).filter(Boolean))];

let ctx;
const beep = (f = 880) => {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = f; g.gain.value = 0.04; o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.07);
  } catch (e) { /* audio blocked */ }
};

export default function CashierPOS({ cashierName = 'Anita Rao', onExit }) {
  const [inventory, setInventory] = useState({ ...START });
  const [bill, setBill] = useState({});
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [discount, setDiscount] = useState(0);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [custOpen, setCustOpen] = useState(false);
  const [held, setHeld] = useState([]);
  const [sales, setSales] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [viewing, setViewing] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [shift, setShift] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [sound, setSound] = useState(true);
  const [pop, setPop] = useState(null);
  const [now, setNow] = useState(new Date());
  const searchRef = useRef(null);

  const billItems = Object.entries(bill).map(([id, qty]) => ({ ...byId[id], qty }));
  const subtotal = sum(bill);
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.05;
  const total = subtotal - discountAmount + tax;
  const itemCount = billItems.reduce((s, i) => s + i.qty, 0);
  const revenue = sales.reduce((s, r) => s + r.total, 0);

  const filtered = useMemo(() => PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) &&
    (cat === 'All' || (cat === 'Low stock' ? inventory[p.id] <= LOW : p.cat === cat))), [query, cat, inventory]);

  const hot = useMemo(() => {
    const c = {};
    sales.forEach((r) => r.items.forEach((i) => { c[i.id] = (c[i.id] || 0) + i.qty; }));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id, q]) => ({ ...byId[id], sold: q }));
  }, [sales]);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const h = (e) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if ((e.key === '/' && !typing) || e.key === 'F2') { e.preventDefault(); searchRef.current?.focus(); }
      else if (e.key === 'F9' && billItems.length) { e.preventDefault(); setPayOpen(true); }
      else if (e.key === 'Escape') { setQuery(''); setShift(false); setSheet(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [billItems.length]);

  const updateBill = (id, d) => {
    const q = (bill[id] || 0) + d;
    if ((d > 0 && inventory[id] <= 0) || q < 0) return;
    setBill((b) => { const n = { ...b }; if (q === 0) delete n[id]; else n[id] = q; return n; });
    setInventory((s) => ({ ...s, [id]: s[id] - d }));
    if (d > 0) { setPop({ id, k: Date.now() }); if (sound) beep(); }
  };

  const resetBill = () => { setBill({}); setDiscount(0); setCustomer({ name: '', phone: '' }); setCustOpen(false); setSheet(false); };
  const clearBill = () => {
    setInventory((s) => { const r = { ...s }; Object.entries(bill).forEach(([id, q]) => { r[id] += q; }); return r; });
    resetBill();
  };
  const holdBill = () => { if (!billItems.length) return; setHeld((h) => [...h, { id: Date.now(), bill, discount, customer }]); resetBill(); };
  const resume = (id) => {
    const h = held.find((x) => x.id === id);
    if (!h) return;
    setHeld((l) => { const rest = l.filter((x) => x.id !== id); return billItems.length ? [...rest, { id: Date.now(), bill, discount, customer }] : rest; });
    setBill(h.bill); setDiscount(h.discount); setCustomer(h.customer);
  };

  const complete = (info) => {
    const r = { no: 1000 + sales.length + 1, at: new Date().toLocaleString(), items: billItems, subtotal, discount, discountAmount, tax, total, customer, points: Math.floor(total), cashier: cashierName, ...info };
    setSales((s) => [...s, r]); setReceipt(r); setViewing(false); resetBill(); setQuery('');
  };
  const closePay = () => { setReceipt(null); setViewing(false); setPayOpen(false); };
  const openReceipt = (r) => { setReceipt(r); setViewing(true); setPayOpen(true); setShift(false); };

  const onSearchKey = (e) => {
    if (e.key === 'Enter' && filtered[0]) { updateBill(filtered[0].id, 1); setQuery(''); }
  };

  return (
    <div className="h-screen flex flex-col bg-[#EEF2EC] fm-body text-[#10261C] print:h-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');
        .fm-display{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.02em}
        .fm-body{font-family:'Figtree',system-ui,sans-serif;-webkit-tap-highlight-color:transparent}
        .fm-noscroll{scrollbar-width:none}.fm-noscroll::-webkit-scrollbar{display:none}
        .fm-safe{padding-bottom:env(safe-area-inset-bottom,0)}
        @media print{body *{visibility:hidden}#fm-receipt,#fm-receipt *{visibility:visible}#fm-receipt{position:absolute;left:0;top:0;width:100%}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      {/* header */}
      <header className="bg-[#10261C] text-white shrink-0 print:hidden">
        <div className="px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-3">
            <Link to={'/'} className="fm-display text-xl font-extrabold text-[#F6D45A]">FreshMart</Link>
            <span className="hidden sm:flex items-center gap-2 text-sm text-white/80"><i className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />Register 1 · {cashierName}</span>
          </div>
          <div className="hidden md:block text-sm text-white/70 tabular-nums">{now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })} · {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShift(true)} className="h-11 px-4 rounded-full bg-white/10 flex items-center gap-2 text-sm font-semibold"><BarChart3 className="w-4 h-4" /><span className="tabular-nums">{money(revenue)}</span><span className="hidden sm:inline text-white/60">today</span></button>
            <button onClick={() => setSound((s) => !s)} aria-label={sound ? 'Mute beep' : 'Unmute beep'} className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center">{sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}</button>
            <button onClick={onExit} className="h-11 px-3 text-sm font-semibold hover:text-[#F6D45A]">Exit</button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 print:hidden">
        {/* catalogue */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="px-3 sm:px-6 pt-3 sm:pt-5 shrink-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onSearchKey} autoFocus aria-label="Search products"
                placeholder="Search or scan, press Enter to add" className="w-full h-14 pl-12 pr-14 rounded-2xl bg-white text-base sm:text-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-[#1F6B43]/20" />
              {query ? <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"><X className="w-5 h-5" /></button>
                : <kbd className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 text-xs border border-gray-300 rounded-md px-2 py-0.5 text-gray-400">/</kbd>}
            </div>
            {cats.length > 2 && (
              <div className="flex gap-2 mt-3 overflow-x-auto fm-noscroll -mx-3 px-3 sm:mx-0 sm:px-0">
                {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap h-10 px-4 rounded-full text-sm font-semibold ${cat === c ? 'bg-[#10261C] text-white' : 'bg-white'}`}>{c}</button>)}
              </div>
            )}
            {!!hot.length && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto fm-noscroll -mx-3 px-3 sm:mx-0 sm:px-0">
                <span className="flex items-center gap-1 text-xs font-bold text-[#E4472B] shrink-0"><Flame className="w-4 h-4" />Hot today</span>
                {hot.map((p) => <button key={p.id} disabled={inventory[p.id] === 0} onClick={() => updateBill(p.id, 1)} className="shrink-0 flex items-center gap-2 h-11 pl-1 pr-3 rounded-full bg-white disabled:opacity-40"><img src={p.image} alt="" className="w-9 h-9 rounded-full object-cover" /><span className="text-sm font-semibold">{p.name}</span><span className="text-xs text-gray-400">{p.sold} sold</span></button>)}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto px-3 sm:px-6 py-3 pb-28 lg:pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4">
              {filtered.map((p) => {
                const left = inventory[p.id]; const out = left === 0; const q = bill[p.id] || 0;
                const pct = Math.max(0, Math.min(100, (left / START[p.id]) * 100));
                return (
                  <button key={p.id} disabled={out} onClick={() => updateBill(p.id, 1)}
                    className={`relative text-left bg-white rounded-3xl p-2.5 transition-transform active:scale-[0.97] disabled:active:scale-100 ${q ? 'ring-2 ring-[#1F6B43]' : ''}`}>
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
                      <img src={p.image} alt={p.name} className={`w-full h-full object-cover ${out ? 'grayscale opacity-50' : ''}`} />
                      <AnimatePresence>{pop?.id === p.id && <motion.span key={pop.k} initial={{ y: 0, opacity: 1, scale: 1 }} animate={{ y: -34, opacity: 0, scale: 1.3 }} transition={{ duration: 0.6 }} className="pointer-events-none absolute inset-0 m-auto w-fit h-fit bg-[#F6D45A] rounded-full px-3 py-1 font-black">+1</motion.span>}</AnimatePresence>
                      {q > 0 && <span className="absolute top-2 right-2 min-w-[1.75rem] h-7 px-2 rounded-full bg-[#E4472B] text-white text-sm font-bold flex items-center justify-center">{q}</span>}
                      {out && <span className="absolute inset-0 flex items-center justify-center font-black text-[#E4472B]">Sold out</span>}
                    </div>
                    <div className="px-1 pt-2.5">
                      <div className="font-bold text-sm leading-tight min-h-[2.25rem]">{p.name}</div>
                      <div className="flex items-baseline justify-between mt-1"><span className="fm-display text-lg font-extrabold">{money(p.price)}</span><span className="text-xs text-gray-500">{p.unit}</span></div>
                      <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className={`h-full rounded-full ${left <= LOW ? 'bg-[#E4472B]' : 'bg-[#1F6B43]'}`} style={{ width: `${pct}%` }} /></div>
                      <div className={`mt-1 text-[11px] font-semibold flex items-center gap-1 ${left <= LOW ? 'text-[#E4472B]' : 'text-gray-500'}`}><Box className="w-3 h-3" />{left} left</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {!filtered.length && <p className="text-center text-gray-500 py-16">No product matches. Check the spelling or pick another filter.</p>}
          </div>
        </main>

        {/* order panel: sidebar on desktop, full-screen sheet on phones */}
        <aside className={`${sheet ? 'fixed inset-0 z-40' : 'hidden'} lg:flex lg:static lg:w-[420px] shrink-0 bg-white flex-col fm-safe`}>
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100">
            <h2 className="fm-display text-xl font-extrabold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-[#1F6B43]" />Current order<span className="text-sm font-bold bg-gray-100 rounded-full px-2.5 py-0.5">{itemCount}</span></h2>
            <button onClick={() => setSheet(false)} aria-label="Close order" className="lg:hidden w-11 h-11 -mr-2 flex items-center justify-center"><X className="w-6 h-6" /></button>
          </div>

          {!!held.length && (
            <div className="px-4 pt-3 flex gap-2 overflow-x-auto fm-noscroll">
              {held.map((h, k) => <button key={h.id} onClick={() => resume(h.id)} className="shrink-0 h-11 px-4 rounded-full bg-[#F6D45A] text-sm font-bold flex items-center gap-2"><Pause className="w-4 h-4" />Held {k + 1} · {money(sum(h.bill))}<ChevronRight className="w-4 h-4" /></button>)}
            </div>
          )}

          <div className="px-4 pt-3">
            {custOpen || customer.name ? (
              <div className="grid grid-cols-2 gap-2">
                <input value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} placeholder="Customer name" aria-label="Customer name" className="h-11 px-3 rounded-xl bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
                <input value={customer.phone} onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))} placeholder="Phone" inputMode="tel" aria-label="Customer phone" className="h-11 px-3 rounded-xl bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
              </div>
            ) : <button onClick={() => setCustOpen(true)} className="h-11 text-sm font-semibold text-[#1F6B43] flex items-center gap-2"><UserPlus className="w-4 h-4" />Add customer to earn points</button>}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {!billItems.length ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-gray-400 text-center gap-2"><ShoppingBag className="w-14 h-14 opacity-25" /><p>Tap a product, or type a name and press Enter.</p></div>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {billItems.map((i) => (
                    <motion.li layout key={i.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="flex items-center gap-3 p-2 rounded-2xl bg-[#F4F7F2]">
                      <img src={i.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{i.name}</div><div className="text-xs text-gray-500">{money(i.price)} · {i.unit}</div></div>
                      <div className="flex items-center bg-white rounded-full h-10">
                        <button onClick={() => updateBill(i.id, -1)} aria-label={`Remove one ${i.name}`} className="w-10 h-full flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                        <span className="w-6 text-center font-bold text-sm tabular-nums">{i.qty}</span>
                        <button onClick={() => updateBill(i.id, 1)} disabled={inventory[i.id] === 0} aria-label={`Add one ${i.name}`} className="w-10 h-full flex items-center justify-center disabled:opacity-30"><Plus className="w-4 h-4" /></button>
                      </div>
                      <span className="w-14 text-right font-bold text-sm tabular-nums">{money(i.price * i.qty)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2 mb-3">
              {[0, 5, 10, 20].map((d) => <button key={d} onClick={() => setDiscount(d)} className={`flex-1 h-10 rounded-xl text-sm font-bold border ${discount === d ? 'bg-[#10261C] text-[#F6D45A] border-[#10261C]' : 'border-gray-200 text-gray-600'}`}>{d ? `${d}% off` : 'No discount'}</button>)}
            </div>
            <div className="text-sm space-y-1 pb-3 border-b border-dashed border-gray-300">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="tabular-nums">{money(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-[#1F6B43] font-semibold"><span>Discount ({discount}%)</span><span className="tabular-nums">-{money(discountAmount)}</span></div>}
              <div className="flex justify-between text-gray-500"><span>Tax (5%)</span><span className="tabular-nums">{money(tax)}</span></div>
              {customer.name && total > 0 && <div className="flex justify-between text-[#1F6B43] font-semibold"><span>{customer.name} earns</span><span>{Math.floor(total)} points</span></div>}
            </div>
            <div className="flex justify-between items-end py-3"><span className="text-gray-500 font-medium">Total</span>
              <motion.span key={total.toFixed(2)} initial={{ y: -8, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="fm-display text-4xl font-extrabold tabular-nums">{money(total)}</motion.span></div>
            <div className="flex gap-2">
              <button onClick={holdBill} disabled={!billItems.length} aria-label="Hold this bill" className="h-14 px-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold flex items-center gap-2 disabled:opacity-40"><Pause className="w-5 h-5" /><span className="hidden sm:inline">Hold</span></button>
              <button onClick={clearBill} disabled={!billItems.length} aria-label="Clear bill" className="w-14 h-14 rounded-2xl border-2 border-gray-200 text-gray-500 hover:text-[#E4472B] flex items-center justify-center disabled:opacity-40"><Trash2 className="w-5 h-5" /></button>
              <button onClick={() => setPayOpen(true)} disabled={!billItems.length} className="flex-1 h-14 rounded-2xl bg-[#E4472B] text-white font-bold text-lg disabled:opacity-40 active:scale-[0.98] transition-transform">Charge {money(total)} <kbd className="hidden xl:inline ml-2 text-xs bg-white/20 rounded px-1.5 py-0.5">F9</kbd></button>
            </div>
          </div>
        </aside>
      </div>

      {/* phone bottom bar */}
      {!sheet && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#10261C] text-white px-4 pt-3 fm-safe flex items-center justify-between print:hidden">
          <div><div className="text-xs text-white/70">{itemCount} item{itemCount !== 1 && 's'}{held.length ? ` · ${held.length} held` : ''}</div><div className="fm-display text-2xl font-extrabold tabular-nums">{money(total)}</div></div>
          <button onClick={() => setSheet(true)} className="h-12 px-6 mb-3 rounded-full bg-[#F6D45A] text-[#10261C] font-bold">Review order</button>
        </div>
      )}

      <AnimatePresence>
        {payOpen && <PaymentSheet total={total} receipt={receipt} viewing={viewing} cashier={cashierName} onConfirm={complete} onClose={closePay} onDone={closePay} />}
        {shift && <ShiftPanel sales={sales} inventory={inventory} low={LOW} onOpenReceipt={openReceipt} onClose={() => setShift(false)} />}
      </AnimatePresence>
    </div>
  );
}