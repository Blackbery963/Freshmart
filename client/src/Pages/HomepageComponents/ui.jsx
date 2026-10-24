import React, { useEffect, useState } from 'react';
import { Star, Heart, Plus, Minus, Leaf } from 'lucide-react';
import { money } from './data';

export const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');
    .fm-display{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.02em}
    .fm-body{font-family:'Figtree',system-ui,sans-serif;-webkit-tap-highlight-color:transparent}
    .fm-noscroll{scrollbar-width:none}.fm-noscroll::-webkit-scrollbar{display:none}
    .fm-safe{padding-bottom:env(safe-area-inset-bottom,0)}
    @media print{body *{visibility:hidden}#fm-receipt,#fm-receipt *{visibility:visible}#fm-receipt{position:absolute;left:0;top:0;width:100%}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  `}</style>
);

export const useIsMobile = () => {
  const q = '(max-width: 767px)';
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const h = (e) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return m;
};

export const Stepper = ({ qty, onAdd, onSub, small }) => (
  <div className={`inline-flex items-center rounded-full bg-[#10261C] text-white ${small ? 'h-9' : 'h-11'}`}>
    <button aria-label="Remove one" onClick={onSub} className={`h-full ${small ? 'w-9' : 'w-11'} flex items-center justify-center rounded-full active:bg-white/20`}><Minus className="w-4 h-4" /></button>
    <span className="min-w-[1.25rem] text-center text-sm font-bold tabular-nums">{qty}</span>
    <button aria-label="Add one" onClick={onAdd} className={`h-full ${small ? 'w-9' : 'w-11'} flex items-center justify-center rounded-full active:bg-white/20`}><Plus className="w-4 h-4" /></button>
  </div>
);

export function ProductCard({ p, qty, onAdd, onSub, wished, onWish }) {
  const save = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
  return (
    <article className="bg-white rounded-3xl p-2 sm:p-3 flex flex-col shadow-[0_1px_0_rgba(16,38,28,0.08)]">
      <div className="relative rounded-2xl overflow-hidden bg-[#E9EFE6]">
        {/* Changed to use p.image */}
        <img src={p.image} alt={p.name} loading="lazy" className="w-full aspect-square object-cover" />
        
        {save > 0 && <span className="absolute top-2 left-2 bg-[#E4472B] text-white text-[11px] font-bold px-2 py-1 rounded-full">Save {save}%</span>}
        <button onClick={onWish} aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={wished}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform">
          <Heart className={`w-[18px] h-[18px] ${wished ? 'fill-[#E4472B] text-[#E4472B]' : 'text-[#10261C]'}`} />
        </button>
        <div className="absolute bottom-2 right-2">
          {qty ? <Stepper small qty={qty} onAdd={onAdd} onSub={onSub} />
            : <button onClick={onAdd} aria-label={`Add ${p.name}`} className="w-11 h-11 rounded-full bg-[#F6D45A] text-[#10261C] flex items-center justify-center shadow-md active:scale-90 transition-transform"><Plus className="w-5 h-5" /></button>}
        </div>
      </div>
      <div className="px-1.5 pt-3 pb-1.5 flex-1 flex flex-col">
        {p.tag && <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1F6B43] mb-1"><Leaf className="w-3 h-3" />{p.tag}</span>}
        <h3 className="font-bold leading-tight min-h-[2.5rem] text-[15px]">{p.name}</h3>
        <p className="text-xs text-[#5B7365] mt-0.5">{p.unit}</p>
        <div className="flex items-center gap-1 text-xs mt-1 text-[#5B7365]"><Star className="w-3.5 h-3.5 fill-[#F6D45A] text-[#F6D45A]" /><b className="text-[#10261C]">{p.rating}</b>({p.reviews})</div>
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="fm-display text-xl font-extrabold">{money(p.price)}</span>
          {p.was && <span className="text-xs text-gray-400 line-through">{money(p.was)}</span>}
        </div>
      </div>
    </article>
  );
}