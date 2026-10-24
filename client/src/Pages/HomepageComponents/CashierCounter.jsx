import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Lock, LogOut, Printer, Banknote, CreditCard, Smartphone, Trash2, Receipt, Tag } from 'lucide-react';
import { PRODUCTS, STAFF, lines, bump, money } from './data';
import { Stepper } from './ui';

export function StaffLogin({ onClose, onSuccess }) {
  const [id, setId] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const s = STAFF[id.trim().toLowerCase()];
    if (!s || s.pin !== pin) return setErr('Staff ID or PIN is incorrect. Try again or ask your manager to reset it.');
    onSuccess({ id, name: s.name });
  };
  const input = 'w-full h-12 px-4 mt-1 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#1F6B43]';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <motion.form onSubmit={submit} onClick={(e) => e.stopPropagation()} initial={{ y: 40 }} animate={{ y: 0 }}
        className="bg-white w-full sm:max-w-sm rounded-t-[2rem] sm:rounded-3xl p-6 fm-body text-[#10261C] fm-safe">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-full bg-[#10261C] text-[#F6D45A] flex items-center justify-center"><Lock className="w-5 h-5" /></div>
          <button type="button" aria-label="Close" onClick={onClose} className="w-11 h-11 -mr-2 -mt-2 flex items-center justify-center"><X className="w-6 h-6" /></button>
        </div>
        <h2 className="fm-display text-2xl font-extrabold mt-3">Cashier login</h2>
        <p className="text-sm text-gray-500 mb-4">Sign in to open your billing counter.</p>
        <label className="text-sm font-semibold" htmlFor="sid">Staff ID</label>
        <input id="sid" value={id} onChange={(e) => setId(e.target.value)} autoCapitalize="none" autoComplete="username" className={input + ' mb-3'} />
        <label className="text-sm font-semibold" htmlFor="pin">PIN</label>
        <input id="pin" type="password" inputMode="numeric" autoComplete="current-password" value={pin} onChange={(e) => setPin(e.target.value)} className={input} />
        {err && <p role="alert" className="text-sm text-[#E4472B] mt-3">{err}</p>}
        <button className="w-full h-14 mt-5 rounded-2xl bg-[#1F6B43] text-white font-bold text-lg">Log in</button>
        <p className="text-xs text-gray-400 mt-3 text-center">Demo: cashier01 / 1234</p>
      </motion.form>
    </motion.div>
  );
}

export default function CashierCounter({ user, onLogout, onExit }) {
  const [bill, setBill] = useState({});
  const [q, setQ] = useState('');
  const [pay, setPay] = useState('Cash');
  const [received, setReceived] = useState('');
  const [disc, setDisc] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [sales, setSales] = useState({ count: 0, total: 0 });
  const [sheet, setSheet] = useState(false);

  const items = lines(bill);
  const n = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = (subtotal * disc) / 100;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;
  const change = pay === 'Cash' && received ? Number(received) - total : 0;
  const canPay = items.length > 0 && (pay !== 'Cash' || Number(received) >= total);
  const shown = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const edit = (id, d) => setBill((b) => bump(b, id, d));

  const complete = () => {
    setReceipt({ no: 1000 + sales.count + 1, items, subtotal, discount, tax, total, pay, change, at: new Date().toLocaleString() });
    setSales((s) => ({ count: s.count + 1, total: s.total + total }));
    setBill({}); setReceived(''); setDisc(0); setSheet(false);
  };

  return (
    <div className="min-h-screen bg-[#EEF2EC] fm-body text-[#10261C] pb-24 lg:pb-0">
      <header className="bg-[#10261C] text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="fm-display text-lg font-extrabold leading-none">FreshMart counter</div>
            <div className="text-xs text-white/70 truncate">{user.name} · {sales.count} bills · {money(sales.total)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <button onClick={onExit} className="h-11 px-3 rounded-full hover:bg-white/10">Store</button>
            <button onClick={onLogout} aria-label="Log out" className="h-11 px-3 rounded-full bg-white/10 flex items-center gap-2"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Log out</span></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 grid lg:grid-cols-[1fr_400px] gap-4">
        <section>
          <div className="relative mb-3">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search item to add" className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {shown.map((p) => (
              <button key={p.id} onClick={() => edit(p.id, 1)} className="relative text-left bg-white rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
                {/* Changed to p.image */}
                <img src={p.image} alt="" className="w-full h-24 object-cover" />
                
                {bill[p.id] && <span className="absolute top-2 right-2 min-w-[1.75rem] h-7 px-2 rounded-full bg-[#E4472B] text-white text-sm font-bold flex items-center justify-center">{bill[p.id]}</span>}
                <div className="p-3">
                  <div className="font-semibold text-sm leading-tight">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.unit}</div>
                  <div className="font-extrabold mt-1">{money(p.price)}</div>
                </div>
              </button>
            ))}
            {!shown.length && <p className="col-span-full text-gray-500">No item matches “{q}”. Check the spelling or clear the search.</p>}
          </div>
        </section>

        <aside className={`${sheet ? 'fixed inset-0 z-40 overflow-auto bg-white' : 'hidden'} lg:block lg:static lg:rounded-3xl lg:bg-white lg:h-fit lg:sticky lg:top-20 p-4 fm-safe`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="fm-display text-xl font-extrabold flex items-center gap-2"><Receipt className="w-5 h-5" /> Current bill</h2>
            <button aria-label="Close bill" onClick={() => setSheet(false)} className="lg:hidden w-11 h-11 flex items-center justify-center"><X className="w-6 h-6" /></button>
          </div>
          {!items.length ? <p className="text-sm text-gray-500 py-8 text-center">Tap an item to start a bill.</p> : (
            <ul className="divide-y divide-gray-100 lg:max-h-64 lg:overflow-auto">
              {items.map((i) => (
                <li key={i.id} className="py-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{i.name}</div><div className="text-xs text-gray-500">{money(i.price)} each</div></div>
                  <Stepper small qty={i.qty} onAdd={() => edit(i.id, 1)} onSub={() => edit(i.id, -1)} />
                  <span className="w-16 text-right font-semibold text-sm">{money(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex items-center gap-2 text-sm"><Tag className="w-4 h-4" /> Discount
            {[0, 5, 10].map((d) => <button key={d} onClick={() => setDisc(d)} className={`h-10 px-4 rounded-full border ${disc === d ? 'bg-[#10261C] text-white border-[#10261C]' : 'border-gray-300'}`}>{d}%</button>)}
          </div>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Discount</dt><dd>-{money(discount)}</dd></div>
            <div className="flex justify-between"><dt>Tax (5%)</dt><dd>{money(tax)}</dd></div>
            <div className="flex justify-between text-2xl font-extrabold pt-2 border-t"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[['Cash', Banknote], ['Card', CreditCard], ['UPI', Smartphone]].map(([name, Icon]) => (
              <button key={name} onClick={() => setPay(name)} className={`flex flex-col items-center gap-1 py-3 rounded-2xl border text-sm ${pay === name ? 'border-[#1F6B43] bg-[#E3F1E8] font-semibold' : 'border-gray-300'}`}><Icon className="w-5 h-5" />{name}</button>
            ))}
          </div>
          {pay === 'Cash' && (
            <div className="mt-3">
              <label className="text-sm font-semibold" htmlFor="rec">Cash received</label>
              <input id="rec" type="number" inputMode="decimal" min="0" value={received} onChange={(e) => setReceived(e.target.value)} className="w-full h-12 px-4 mt-1 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#1F6B43]" />
              {received !== '' && <p className={`text-sm mt-1 font-semibold ${change >= 0 ? 'text-[#1F6B43]' : 'text-[#E4472B]'}`}>{change >= 0 ? `Give back ${money(change)}` : `Short by ${money(-change)}`}</p>}
            </div>
          )}
          <button disabled={!canPay} onClick={complete} className="w-full mt-4 h-14 rounded-2xl bg-[#1F6B43] text-white font-bold text-lg disabled:opacity-40">Complete sale</button>
          {!!items.length && <button onClick={() => setBill({})} className="w-full mt-2 h-11 text-sm text-gray-500 flex items-center justify-center gap-1"><Trash2 className="w-4 h-4" /> Clear bill</button>}
        </aside>
      </div>

      {!sheet && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#10261C] text-white p-3 fm-safe flex items-center justify-between">
          <div><div className="text-xs text-white/70">{n} item{n !== 1 && 's'}</div><div className="fm-display text-xl font-extrabold">{money(total)}</div></div>
          <button onClick={() => setSheet(true)} className="h-12 px-6 rounded-full bg-[#F6D45A] text-[#10261C] font-bold">View bill</button>
        </div>
      )}

      <AnimatePresence>
        {receipt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-sm rounded-t-[2rem] sm:rounded-3xl p-6 max-h-[92vh] overflow-auto fm-safe">
              <div id="fm-receipt" className="font-mono text-sm">
                <div className="text-center mb-3"><div className="fm-display text-xl font-extrabold">FreshMart</div><div className="text-xs text-gray-500">Bill #{receipt.no} · {receipt.at}</div><div className="text-xs text-gray-500">Cashier: {user.name}</div></div>
                {receipt.items.map((i) => <div key={i.id} className="flex justify-between gap-2"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
                <div className="border-t my-2" />
                <div className="flex justify-between"><span>Subtotal</span><span>{money(receipt.subtotal)}</span></div>
                <div className="flex justify-between"><span>Discount</span><span>-{money(receipt.discount)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{money(receipt.tax)}</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total ({receipt.pay})</span><span>{money(receipt.total)}</span></div>
                {receipt.pay === 'Cash' && <div className="flex justify-between"><span>Change</span><span>{money(Math.max(receipt.change, 0))}</span></div>}
                <p className="text-center mt-3 text-xs">Thank you for shopping with us.</p>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => window.print()} className="flex-1 h-12 rounded-2xl border border-gray-300 flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print</button>
                <button onClick={() => setReceipt(null)} className="flex-1 h-12 rounded-2xl bg-[#10261C] text-white font-semibold">New bill</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}