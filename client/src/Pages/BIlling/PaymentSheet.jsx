import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, CreditCard, Smartphone, Printer, Check, Delete, X, Loader2 } from 'lucide-react';
import { money } from '../HomepageComponents/data.js';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

function FakeQR({ seed }) {
  const n = 11;
  const finder = (i, j) => (i < 3 || i > n - 4) && (j < 3 || j > n - 4) && !(i > n - 4 && j > n - 4);
  const s = Math.floor(seed * 100);
  return (
    <div className="grid gap-[2px] p-3 bg-white rounded-2xl border border-gray-200 w-44 h-44 mx-auto" style={{ gridTemplateColumns: `repeat(${n},1fr)` }} aria-label="UPI QR code">
      {Array.from({ length: n * n }, (_, k) => {
        const i = Math.floor(k / n), j = k % n;
        return <div key={k} className={finder(i, j) || (s + i * 7 + j * 13) % 5 < 2 ? 'bg-[#10261C]' : 'bg-transparent'} />;
      })}
    </div>
  );
}

export default function PaymentSheet({ total, receipt, viewing, cashier, onConfirm, onClose, onDone }) {
  const [mode, setMode] = useState('Cash');
  const [keys, setKeys] = useState('');
  const [busy, setBusy] = useState(false);
  const tendered = Number(keys || 0);
  const change = tendered - total;
  const ups = [...new Set([5, 10, 20, 50, 100].map((n) => Math.ceil(total / n) * n))].filter((v) => v > total).slice(0, 3);

  const press = (k) => setKeys((s) => {
    if (k === 'del') return s.slice(0, -1);
    if (k === '.' && (s.includes('.') || !s)) return k === '.' && !s ? '0.' : s;
    if (s.includes('.') && s.split('.')[1].length >= 2) return s;
    return s.length < 8 ? s + k : s;
  });

  const charge = () => {
    if (mode === 'Cash') return onConfirm({ mode, tendered, change });
    setBusy(true);
    setTimeout(() => { setBusy(false); onConfirm({ mode, tendered: total, change: 0 }); }, 1300);
  };

  const shell = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center print:bg-white print:static';
  const card = 'bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] max-h-[96vh] overflow-auto shadow-2xl print:shadow-none print:max-h-none';

  if (receipt) {
    const r = receipt;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={shell}>
        <motion.div initial={{ y: 40 }} animate={{ y: 0 }} className={card}>
          <div className="p-6 pb-3 text-center print:hidden">
            {!viewing && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="w-16 h-16 mx-auto rounded-full bg-[#1F6B43] text-white flex items-center justify-center"><Check className="w-9 h-9" /></motion.div>
            )}
            <h2 className="fm-display text-2xl font-extrabold mt-3">{viewing ? `Bill #${r.no}` : 'Payment received'}</h2>
            {!viewing && r.mode === 'Cash' && r.change > 0 && <p className="mt-2 text-lg">Give back <b className="text-[#E4472B] text-2xl">{money(r.change)}</b></p>}
            {r.customer?.name && <p className="text-sm text-[#1F6B43] font-semibold mt-1">{r.customer.name} earned {r.points} points</p>}
          </div>

          <div id="fm-receipt" className="mx-6 mb-4 p-4 rounded-2xl bg-[#F4F7F2] font-mono text-xs text-black print:bg-white print:m-0">
            <div className="text-center mb-3"><div className="fm-display text-2xl font-extrabold">FreshMart</div><div className="text-gray-500">Bill #{r.no} · {r.at}</div><div className="text-gray-500">Cashier: {r.cashier}</div>{r.customer?.name && <div className="text-gray-500">Customer: {r.customer.name}</div>}</div>
            <div className="border-t-2 border-dashed border-gray-300 my-2" />
            {r.items.map((i) => (
              <div key={i.id} className="flex justify-between gap-3 py-0.5"><span>{i.name} <span className="text-gray-500">× {i.qty}</span></span><b>{money(i.price * i.qty)}</b></div>
            ))}
            <div className="border-t-2 border-dashed border-gray-300 my-2" />
            <div className="flex justify-between"><span>Subtotal</span><span>{money(r.subtotal)}</span></div>
            {r.discountAmount > 0 && <div className="flex justify-between"><span>Discount ({r.discount}%)</span><span>-{money(r.discountAmount)}</span></div>}
            <div className="flex justify-between"><span>Tax (5%)</span><span>{money(r.tax)}</span></div>
            <div className="flex justify-between text-base font-black mt-1"><span>Total</span><span>{money(r.total)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Paid by {r.mode}</span><span>{money(r.tendered)}</span></div>
            {r.mode === 'Cash' && <div className="flex justify-between text-gray-500"><span>Change</span><span>{money(Math.max(r.change, 0))}</span></div>}
            <p className="text-center mt-4 text-gray-600">Thank you for shopping with us. Returns accepted within 7 days.</p>
          </div>

          <div className="flex gap-3 p-6 pt-2 print:hidden">
            <button onClick={() => window.print()} className="flex-1 h-14 rounded-2xl border-2 border-gray-200 font-bold flex items-center justify-center gap-2"><Printer className="w-5 h-5" /> Print</button>
            <button onClick={onDone} className="flex-1 h-14 rounded-2xl bg-[#10261C] text-white font-bold">{viewing ? 'Close' : 'Next customer'}</button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const canCharge = !busy && (mode !== 'Cash' || tendered >= total);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={shell} onClick={onClose}>
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className={card}>
        <div className="p-6 pb-2 flex items-start justify-between">
          <div><div className="text-sm text-gray-500">Amount to collect</div><div className="fm-display text-5xl font-extrabold">{money(total)}</div></div>
          <button onClick={onClose} aria-label="Close payment" className="w-11 h-11 -mr-2 flex items-center justify-center"><X className="w-6 h-6" /></button>
        </div>

        <div className="px-6 grid grid-cols-3 gap-2">
          {[['Cash', Banknote], ['Card', CreditCard], ['UPI', Smartphone]].map(([n, Icon]) => (
            <button key={n} onClick={() => setMode(n)} className={`h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-sm font-bold ${mode === n ? 'border-[#1F6B43] bg-[#E3F1E8] text-[#1F6B43]' : 'border-gray-200 text-gray-500'}`}><Icon className="w-5 h-5" />{n}</button>
          ))}
        </div>

        <div className="p-6">
          {mode === 'Cash' && (
            <>
              <div className="flex items-end justify-between rounded-2xl bg-[#F4F7F2] px-4 py-3">
                <div><div className="text-xs text-gray-500">Cash received</div><div className="fm-display text-3xl font-extrabold">{keys ? money(tendered) : '$0.00'}</div></div>
                {keys && <div className={`text-right font-bold ${change >= 0 ? 'text-[#1F6B43]' : 'text-[#E4472B]'}`}><div className="text-xs font-semibold">{change >= 0 ? 'Change due' : 'Still needed'}</div><div className="text-xl">{money(Math.abs(change))}</div></div>}
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {[total, ...ups].map((v, k) => <button key={v} onClick={() => setKeys(v.toFixed(2).replace(/\.00$/, ''))} className="h-11 px-4 rounded-full bg-[#10261C] text-white text-sm font-semibold whitespace-nowrap">{k === 0 ? 'Exact' : money(v).replace('.00', '')}</button>)}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {KEYS.map((k) => (
                  <button key={k} onClick={() => press(k)} aria-label={k === 'del' ? 'Backspace' : k} className="h-14 rounded-2xl bg-gray-100 active:bg-gray-200 text-xl font-bold flex items-center justify-center">{k === 'del' ? <Delete className="w-6 h-6" /> : k}</button>
                ))}
              </div>
            </>
          )}
          {mode === 'Card' && <div className="py-8 text-center text-gray-600"><CreditCard className="w-14 h-14 mx-auto text-[#1F6B43]" /><p className="mt-3 font-semibold">Tap, insert or swipe the card on the terminal.</p><p className="text-sm">Press Charge when the terminal is ready.</p></div>}
          {mode === 'UPI' && <div className="py-2 text-center"><FakeQR seed={total} /><p className="mt-3 text-sm text-gray-600">Ask the customer to scan, then press Charge once it shows paid.</p></div>}

          <button disabled={!canCharge} onClick={charge} className="w-full h-16 mt-4 rounded-2xl bg-[#E4472B] text-white font-bold text-xl disabled:opacity-40 flex items-center justify-center gap-2">
            {busy ? <><Loader2 className="w-6 h-6 animate-spin" /> Processing</> : `Charge ${money(total)}`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}