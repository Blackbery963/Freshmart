import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, Receipt } from 'lucide-react';
import { PRODUCTS, money } from '../HomepageComponents/data.js';

const COLORS = { Cash: '#1F6B43', Card: '#10261C', UPI: '#F6D45A' };

export default function ShiftPanel({ sales, inventory, low, onOpenReceipt, onClose }) {
  const revenue = sales.reduce((s, r) => s + r.total, 0);
  const items = sales.reduce((s, r) => s + r.items.reduce((a, i) => a + i.qty, 0), 0);
  const split = ['Cash', 'Card', 'UPI'].map((m) => ({ m, v: sales.filter((r) => r.mode === m).reduce((s, r) => s + r.total, 0) }));
  const alerts = PRODUCTS.filter((p) => inventory[p.id] <= low).sort((a, b) => inventory[a.id] - inventory[b.id]);
  const stats = [['Revenue', money(revenue)], ['Bills', sales.length], ['Average bill', sales.length ? money(revenue / sales.length) : '-'], ['Items sold', items]];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }} onClick={(e) => e.stopPropagation()}
        className="absolute right-0 inset-y-0 w-full sm:w-[440px] bg-[#EEF2EC] overflow-auto p-5 fm-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="fm-display text-2xl font-extrabold">Shift summary</h2>
          <button onClick={onClose} aria-label="Close summary" className="w-11 h-11 -mr-2 flex items-center justify-center"><X className="w-6 h-6" /></button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {stats.map(([l, v]) => <div key={l} className="bg-white rounded-2xl p-4"><div className="text-xs text-gray-500">{l}</div><div className="fm-display text-2xl font-extrabold">{v}</div></div>)}
        </div>

        <div className="bg-white rounded-2xl p-4 mt-2.5">
          <div className="text-sm font-bold mb-2">How customers paid</div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
            {split.map(({ m, v }) => v > 0 && <div key={m} style={{ width: `${(v / revenue) * 100}%`, background: COLORS[m] }} />)}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            {split.map(({ m, v }) => <span key={m} className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[m] }} />{m} {money(v)}</span>)}
          </div>
        </div>

        <h3 className="font-bold mt-5 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[#E4472B]" /> Restock soon</h3>
        {!alerts.length ? <p className="text-sm text-gray-500">Every item has enough stock.</p> : (
          <ul className="bg-white rounded-2xl divide-y divide-gray-100">
            {alerts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-3">
                <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <span className="flex-1 text-sm font-semibold truncate">{p.name}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${inventory[p.id] === 0 ? 'bg-[#E4472B] text-white' : 'bg-[#F6D45A]'}`}>{inventory[p.id] === 0 ? 'Sold out' : `${inventory[p.id]} left`}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-bold mt-5 mb-2 flex items-center gap-2"><Receipt className="w-4 h-4" /> Recent bills</h3>
        {!sales.length ? <p className="text-sm text-gray-500">No bills yet. Completed sales show up here so you can reopen or reprint them.</p> : (
          <ul className="bg-white rounded-2xl divide-y divide-gray-100">
            {[...sales].reverse().slice(0, 8).map((r) => (
              <li key={r.no}><button onClick={() => onOpenReceipt(r)} className="w-full flex items-center justify-between p-3 text-left min-h-[56px] active:bg-gray-50">
                <span><span className="block font-semibold text-sm">Bill #{r.no}{r.customer?.name ? ` · ${r.customer.name}` : ''}</span><span className="block text-xs text-gray-500">{r.items.length} line{r.items.length > 1 && 's'} · {r.mode}</span></span>
                <b>{money(r.total)}</b></button></li>
            ))}
          </ul>
        )}
      </motion.aside>
    </motion.div>
  );
}