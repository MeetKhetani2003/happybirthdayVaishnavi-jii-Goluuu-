import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Burst, Heart } from "../components/ui";
import { sfx } from "../audio/sound";

export default function GiftReveal({ onNext }) {
  const [open, setOpen] = useState(false);

  const handle = () => {
    if (open) return;
    setOpen(true);
    sfx.sparkle();
    setTimeout(() => sfx.celebrate(), 350);
    setTimeout(onNext, 2400);
  };

  return (
    <div className="flex min-h-full flex-col items-center px-5 pb-10 pt-10 text-center">
      <h2 className="font-script text-5xl text-pink-500">One Last Thing…</h2>
      <p className="mt-1 font-hand text-2xl text-rose-400">Tap the gift 🎁</p>

      <div className="relative mt-10 flex h-[300px] w-full max-w-[320px] items-center justify-center">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute text-pink-300"
            style={{ left: `${12 + i * 12}%`, top: `${20 + ((i * 17) % 55)}%` }}
            animate={{ y: [0, -26, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
            aria-hidden="true"
          >
            <Heart style={{ width: 16, height: 16 }} />
          </motion.div>
        ))}

        <motion.button
          type="button"
          aria-label="Open your gift"
          onClick={handle}
          className="relative"
          animate={
            open
              ? { rotate: [0, -7, 7, -5, 5, 0], scale: [1, 1.12, 1] }
              : { y: [0, -10, 0] }
          }
          transition={
            open
              ? { duration: 0.6 }
              : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
          whileTap={{ scale: 0.92 }}
        >
          <svg viewBox="0 0 180 170" className="w-56 drop-shadow-xl" role="img" aria-label="Pink gift box">
            <motion.g
              animate={open ? { y: -46, rotate: -16, x: -18 } : { y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
            >
              <rect x="18" y="46" width="144" height="30" rx="8" fill="#f472b6" />
              <rect x="80" y="46" width="20" height="30" fill="#fbcfe8" />
              <path d="M90 46 C70 46 58 30 70 20 C82 12 90 32 90 46 Z" fill="#ec4899" />
              <path d="M90 46 C110 46 122 30 110 20 C98 12 90 32 90 46 Z" fill="#ec4899" />
              <circle cx="90" cy="42" r="9" fill="#fbcfe8" />
            </motion.g>
            <rect x="28" y="74" width="124" height="82" rx="10" fill="#f9a8d4" />
            <rect x="80" y="74" width="20" height="82" fill="#fbcfe8" />
            <rect x="28" y="106" width="124" height="14" fill="#fbcfe8" opacity="0.8" />
          </svg>

          {!open && (
            <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white shadow-lg">
              1
            </span>
          )}

          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-2xl"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: [0, 0.9, 0.5], scale: 1.4 }}
                  transition={{ duration: 1 }}
                />
                <Burst x="50%" y="35%" count={34} spread={200} />
                <motion.div
                  className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2"
                  initial={{ opacity: 0, scale: 0.3, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: -40, rotate: [-10, 10, -5, 5, 0] }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 160, damping: 12 }}
                >
                  <img src="/images/image5.jpeg" alt="Surprise!" className="w-28 h-28 rounded-xl object-cover shadow-xl border-4 border-white rotate-[-5deg]" />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {open && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-script text-3xl text-rose-500"
        >
          A wild Goluuuu appeared! 🐒
        </motion.p>
      )}
    </div>
  );
}
