import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PinkButton, Heart } from "../components/ui";
import { sfx } from "../audio/sound";

export default function BirthdayLetter({ data, onNext }) {
  const paras = data.letterParagraphs;
  const [shown, setShown] = useState(0);
  const [hearted, setHearted] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (shown >= paras.length + 1) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 900 : 1500);
    return () => clearTimeout(t);
  }, [shown, paras.length]);

  useEffect(() => {
    if (endRef.current && shown > 1) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [shown]);

  const complete = shown >= paras.length + 1;

  return (
    <div className="flex min-h-full flex-col items-center px-4 pb-10 pt-5 text-center">
      <h2 className="font-script text-4xl text-pink-500">A Message From My Heart</h2>

      <motion.article
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1.2 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        className="relative mt-5 w-full max-w-[360px] rounded-[24px] border border-pink-100 bg-[#fffaf3] px-5 pb-14 pt-7 text-left shadow-[0_22px_45px_-18px_rgba(236,72,153,0.6)]"
      >
        <button
          type="button"
          aria-label="Send love"
          onClick={() => {
            setHearted(true);
            sfx.sparkle();
          }}
          className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-pink-400 to-pink-500 text-white shadow-lg shadow-pink-300"
        >
          <motion.span animate={hearted ? { scale: [1, 1.5, 1] } : {}}>
            <Heart style={{ width: 20, height: 20 }} />
          </motion.span>
        </button>

        <p className="font-script text-3xl text-rose-500">Dear {data.name},</p>

        <div className="mt-3 space-y-3">
          <AnimatePresence>
            {paras.slice(0, Math.max(0, shown - 1)).map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-[15px] leading-relaxed text-rose-900/75"
              >
                {p}
              </motion.p>
            ))}
          </AnimatePresence>

          {complete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <p className="text-[15px] font-semibold leading-relaxed text-rose-500">
                {data.letterClosing}
              </p>
              <p className="mt-5 font-hand text-2xl text-pink-500">{data.signature}</p>
              <p className="font-script text-3xl text-rose-400">{data.signatureName}</p>
            </motion.div>
          )}
        </div>

        {/* decorative illustration bottom-right */}
        <svg viewBox="0 0 60 50" className="absolute bottom-2 right-3 h-12 w-14 opacity-80" aria-hidden="true">
          <rect x="14" y="26" width="32" height="18" rx="5" fill="#8b5e3c" />
          <rect x="14" y="22" width="32" height="9" rx="4" fill="#fbcfe8" />
          <rect x="27" y="10" width="5" height="12" rx="2" fill="#f9a8d4" />
          <ellipse cx="29.5" cy="7" rx="3" ry="5" fill="#fbbf24" />
        </svg>
        <div ref={endRef} />
      </motion.article>

      <AnimatePresence>
        {complete && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <PinkButton onClick={onNext} className="mt-6">
              One last thing →
            </PinkButton>
          </motion.div>
        )}
      </AnimatePresence>
      {!complete && (
        <button
          type="button"
          onClick={() => setShown(paras.length + 1)}
          className="mt-4 font-hand text-lg text-pink-400 underline underline-offset-4"
        >
          show it all at once
        </button>
      )}
    </div>
  );
}
