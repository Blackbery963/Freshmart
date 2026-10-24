import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Check } from 'lucide-react';
import { RECIPES, byId, money } from './data';

export default function Recipes({ onAddAll }) {
  const [i, setI] = useState(0);
  const [have, setHave] = useState({});
  const r = RECIPES[i];
  const need = r.items.filter((x) => !have[`${r.id}-${x.id}`]);
  const total = need.reduce((s, x) => s + byId[x.id].price * x.qty, 0);

  return (
    <section id="cook" className="max-w-7xl mx-auto px-3 sm:px-4 py-8 scroll-mt-28">
      <div className="bg-[#10261C] text-white rounded-[2rem] overflow-hidden">
        <div className="p-5 sm:p-8 pb-0">
          <h2 className="fm-display text-3xl sm:text-4xl font-extrabold">Cook tonight</h2>
          <p className="text-white/70 mt-1 max-w-md">Pick a dish, untick what you already have at home, and we add the rest to your cart.</p>
          <div className="flex gap-2 mt-4 overflow-x-auto fm-noscroll -mx-5 px-5 sm:mx-0 sm:px-0" role="tablist">
            {RECIPES.map((x, k) => (
              <button key={x.id} role="tab" aria-selected={k === i} onClick={() => setI(k)}
                className={`whitespace-nowrap h-11 px-5 rounded-full text-sm font-semibold ${k === i ? 'bg-[#F6D45A] text-[#10261C]' : 'bg-white/10 text-white'}`}>{x.name}</button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="grid md:grid-cols-2 gap-5 p-5 sm:p-8">
            <div className="relative rounded-3xl overflow-hidden h-56 sm:h-72 md:h-auto md:min-h-[360px]">
              {/* Changed to use r.image */}
              <img src={r.image} alt={r.name} className="absolute inset-0 w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2 text-sm font-semibold">
                <span className="flex items-center gap-1.5 bg-white text-[#10261C] rounded-full px-3 py-1.5"><Clock className="w-4 h-4" />{r.time}</span>
                <span className="flex items-center gap-1.5 bg-white text-[#10261C] rounded-full px-3 py-1.5"><Users className="w-4 h-4" />Serves {r.serves}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <ul className="space-y-2">
                {r.items.map((x) => {
                  const p = byId[x.id];
                  const owned = have[`${r.id}-${x.id}`];
                  return (
                    <li key={x.id}>
                      <button onClick={() => setHave((h) => ({ ...h, [`${r.id}-${x.id}`]: !owned }))} aria-pressed={!owned}
                        className={`w-full flex items-center gap-3 rounded-2xl p-2 pr-4 text-left min-h-[64px] transition-colors ${owned ? 'bg-white/5 text-white/50' : 'bg-white/10'}`}>
                        
                        {/* Changed to use p.image for ingredients list */}
                        <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        
                        <span className="flex-1 min-w-0">
                          <span className={`block font-semibold truncate ${owned ? 'line-through' : ''}`}>{p.name}</span>
                          <span className="block text-xs text-white/60">{x.qty} × {p.unit}</span>
                        </span>
                        <span className="text-sm font-semibold">{money(p.price * x.qty)}</span>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center ${owned ? 'border border-white/30' : 'bg-[#F6D45A] text-[#10261C]'}`}>{!owned && <Check className="w-4 h-4" />}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button disabled={!need.length} onClick={() => onAddAll(need, r.name)}
                className="mt-4 md:mt-auto h-14 rounded-2xl bg-[#E4472B] font-bold text-lg disabled:opacity-40 active:scale-[0.99]">
                {need.length ? `Add ${need.length} item${need.length > 1 ? 's' : ''} for ${money(total)}` : 'You have everything'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}