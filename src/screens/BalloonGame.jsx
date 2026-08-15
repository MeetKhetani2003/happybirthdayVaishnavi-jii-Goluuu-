import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Burst } from "../components/ui";
import { sfx } from "../audio/sound";

const BALLOONS = [
  { id: 1, color: "#f9a8d4", dark: "#ec7fb4", left: "10%", top: "6%", delay: 0, message: "Hey Goluuuu! ✨" },
  { id: 2, color: "#c4b5fd", dark: "#a58ffb", left: "58%", top: "0%", delay: 0.6, message: "You're annoying 🙄" },
  { id: 3, color: "#a5d8ff", dark: "#7cc2fb", left: "6%", top: "48%", delay: 1.1, message: "But I care ❤️" },
  { id: 4, color: "#a7e8c0", dark: "#7ddaa4", left: "60%", top: "54%", delay: 0.3, message: "Happy Birthday! 🎉" },
];

function Balloon({ b, onPop }) {
  return (
    <motion.button
      type="button"
      aria-label={`Pop balloon ${b.id}`}
      onClick={onPop}
      className="absolute h-32 w-24"
      style={{ left: b.left, top: b.top }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, y: [0, -12, 0], rotate: [-4, 4, -4] }}
      exit={{ scale: [0.85, 1.5], opacity: 0, transition: { duration: 0.22 } }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { type: "spring", stiffness: 200, damping: 14 },
        y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: b.delay },
        rotate: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: b.delay },
      }}
      whileTap={{ scale: 0.85 }}
    >
      <svg viewBox="0 0 90 130" className="h-full w-full drop-shadow-lg">
        <ellipse cx="45" cy="48" rx="34" ry="43" fill={b.color} />
        <ellipse cx="34" cy="34" rx="9" ry="13" fill="#ffffff" opacity="0.55" />
        <polygon points="45,89 39,99 51,99" fill={b.dark} />
        <path d="M45 99 q10 14 -2 24 q-11 10 2 20" stroke={b.dark} strokeWidth="2" fill="none" />
      </svg>
    </motion.button>
  );
}

export default function BalloonGame({ onNext }) {
  const [popped, setPopped] = useState([]);
  const [bursts, setBursts] = useState([]);
  const done = popped.length === BALLOONS.length;

  const pop = (b, e) => {
    if (popped.includes(b.id)) return;
    sfx.pop();
    const rect = e.currentTarget.getBoundingClientRect();
    const host = e.currentTarget.parentElement.getBoundingClientRect();
    setBursts((prev) => [
      ...prev,
      { id: b.id, x: rect.left - host.left + rect.width / 2, y: rect.top - host.top + rect.height / 3, message: b.message },
    ]);
    setPopped((p) => [...p, b.id]);
  };

  useEffect(() => {
    if (!done) return;
    sfx.celebrate();
    const t = setTimeout(onNext, 3400);
    return () => clearTimeout(t);
  }, [done, onNext]);

  const words = ["Happy", "Birthday", "Vaishnavijii", "❤️"];

  return (
    <div className="flex min-h-full flex-col items-center px-5 pb-10 pt-4 text-center">
      <h2 className="font-script text-4xl text-pink-500">Pop all 4 balloons 🎈</h2>
      <p className="mt-1 font-hand text-xl text-rose-400">
        {popped.length} / {BALLOONS.length} balloons
      </p>
      <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-pink-100">
        <motion.div
          className="h-full rounded-full bg-pink-400"
          animate={{ width: `${(popped.length / BALLOONS.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>

      <div className="relative mt-6 h-[330px] w-full max-w-[340px]">
        <AnimatePresence>
          {BALLOONS.filter((b) => !popped.includes(b.id)).map((b) => (
            <Balloon key={b.id} b={b} onPop={(e) => pop(b, e)} />
          ))}
        </AnimatePresence>
        {bursts.map((bu) => (
          <div key={bu.id}>
            <Burst x={bu.x} y={bu.y} count={18} spread={110} />
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.9], y: "-150%" }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute font-script text-3xl text-rose-600 drop-shadow-md z-10 w-max"
              style={{ left: bu.x, top: bu.y, pointerEvents: "none" }}
            >
              {bu.message}
            </motion.div>
          </div>
        ))}

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4"
            >
              {words.map((w, i) => (
                <motion.span
                  key={w + i}
                  initial={{ opacity: 0, y: 24, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.18, type: "spring", stiffness: 200, damping: 14 }}
                  className="font-script text-4xl text-rose-500"
                >
                  {w}
                </motion.span>
              ))}
              <Burst x="50%" y="50%" count={30} spread={170} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2 font-hand text-lg text-pink-400/80">
        {done ? "Getting your next surprise ready…" : "Tap each balloon to pop it!"}
      </p>
    </div>
  );
}
