import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
// Removed `img` from imports since we are using local image paths now
import { lines, money, FREE_AT } from './data';
import { Stepper, useIsMobile } from './ui';

export default function CartDrawer({ open, onClose, cart, change, mode, setMode }) {
  const mobile = useIsMobile();
  const [promo, setPromo] = useState('');
  const [ok, setOk] = useState(false);
  
  const items = lines(cart);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const off = ok ? subtotal * 0.2 : 0;
  const net = subtotal - off;
  const fee = mode === 'Pickup' || net >= FREE_AT || !subtotal ? 0 : 3.99;
  const total = net + fee;
  const free = mode === 'Pickup' || net >= FREE_AT;

  const from = mobile ? { y: '100%' } : { x: '100%' };
  const to = mobile ? { y: 0 } : { x: 0 };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          
          <motion.aside role="dialog" aria-label="Your cart" initial={from} animate={to} exit={from} transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed z-50 bg-white fm-body text-[#10261C] flex flex-col inset-x-0 bottom-0 max-h-[92vh] rounded-t-[2rem] md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:rounded-none shadow-2xl">
            
            <div className="md:hidden mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-200" />
            
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="fm-display text-2xl font-extrabold">Your cart</h2>
              <button aria-label="Close cart" onClick={onClose} className="w-10 h-10 -mr-2 flex items-center justify-center rounded-full active:bg-gray-100 md:hover:bg-gray-100 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6">
              <div className="flex bg-[#EEF2EC] rounded-full p-1 mb-4" role="group" aria-label="Order type">
                {['Delivery', 'Pickup'].map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`flex-1 h-10 rounded-full text-sm font-semibold transition-colors ${mode === m ? 'bg-[#10261C] text-white shadow-sm' : 'text-gray-600 hover:text-[#10261C]'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-sm mb-2 text-gray-600">
                {free ? (mode === 'Pickup' ? 'No delivery fee for pickup.' : 'You get free delivery! 🎉') : `Add ${money(FREE_AT - net)} more for free delivery.`}
              </p>
              <div className="h-2 rounded-full bg-[#EEF2EC] overflow-hidden">
                {/* Math.min prevents the bar from exceeding 100% visually */}
                <div className="h-full rounded-full bg-[#1F6B43] transition-all duration-500 ease-out" style={{ width: `${Math.min(100, free ? 100 : (net / FREE_AT) * 100)}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-auto px-6 py-5 min-h-[120px]">
              {!items.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                  <p>Your cart is empty.</p>
                  <p className="text-sm mt-1">Add something fresh or try a Cook tonight dish.</p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3">
                      {/* Changed to use the direct public folder image path */}
                      <img src={i.image} alt={i.name} className="w-16 h-16 rounded-2xl object-cover bg-[#EEF2EC]" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[15px] truncate">{i.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{money(i.price)} {i.unit === 'each' ? 'each' : i.unit}</div>
                      </div>
                      <Stepper small qty={i.qty} onAdd={() => change(i.id, 1)} onSub={() => change(i.id, -1)} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-6 pt-5 border-t border-gray-100 space-y-4 fm-safe pb-5 bg-white">
              <div className="flex gap-2">
                <input 
                  value={promo} 
                  onChange={(e) => { setPromo(e.target.value); setOk(false); }} 
                  placeholder="Promo code" 
                  className="flex-1 h-12 px-4 rounded-xl border border-gray-200 text-base bg-gray-50 focus:bg-white focus:outline-none focus:border-[#1F6B43] focus:ring-1 focus:ring-[#1F6B43] transition-all" 
                />
                <button 
                  onClick={() => setOk(promo.trim().toUpperCase() === 'FRESH20')} 
                  className="px-6 rounded-xl bg-[#10261C] text-white text-sm font-semibold active:scale-95 transition-transform">
                  Apply
                </button>
              </div>
              
              {promo && (
                <p className={`text-xs -mt-2 ${ok ? 'text-[#1F6B43] font-semibold' : 'text-[#E4472B]'}`}>
                  {ok ? 'FRESH20 applied: 20% off.' : 'Press Apply to check your code.'}
                </p>
              )}
              
              <div className="text-sm space-y-2 pt-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#10261C]">{money(subtotal)}</span>
                </div>
                {ok && (
                  <div className="flex justify-between text-[#1F6B43]">
                    <span>Promo discount</span>
                    <span className="font-semibold">-{money(off)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>{mode} fee</span>
                  <span className="font-semibold text-[#10261C]">{fee ? money(fee) : 'Free'}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-3 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>
              
              <button 
                disabled={!items.length} 
                className="w-full h-14 mt-2 rounded-2xl bg-[#E4472B] text-white font-bold text-lg disabled:opacity-40 active:scale-[0.98] transition-transform shadow-[0_4px_14px_rgba(228,71,43,0.3)] disabled:shadow-none">
                Checkout · {money(total)}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}