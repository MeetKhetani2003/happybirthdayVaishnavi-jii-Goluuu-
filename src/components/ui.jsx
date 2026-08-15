import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { sfx } from "../audio/sound";

export const HEART_PATH =
  "M12 21s-6.7-4.35-9.33-8.02C.7 10.2 1.53 6.6 4.3 5.2c2.06-1.04 4.3-.3 5.7 1.4L12 8.6l2-2c1.4-1.7 3.64-2.44 5.7-1.4 2.77 1.4 3.6 5 1.63 7.78C18.7 16.65 12 21 12 21z";

export function Heart({ className = "", style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d={HEART_PATH} fill="currentColor" />
    </svg>
  );
}

/* ---------- Ambient floating hearts + confetti ---------- */
export function FloatingHearts({ count = 14 }) {
  const reduce = useReducedMotion();
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 16,
        delay: Math.random() * 10,
        dur: 12 + Math.random() * 12,
        rot: Math.random() * 40 - 20,
        opacity: 0.22 + Math.random() * 0.35,
        heart: Math.random() > 0.35,
        color: ["#f9a8c7", "#f472b6", "#fbcfe8", "#fda4af", "#e9d5ff"][i % 5],
      })),
    [count]
  );
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((it) => (
        <motion.div
          key={it.id}
          className="absolute bottom-[-40px]"
          style={{ left: `${it.left}%`, color: it.color, opacity: it.opacity }}
          animate={{ y: [0, -900], x: [0, it.rot, -it.rot, 0], rotate: [0, 180, 360] }}
          transition={{ duration: it.dur, delay: it.delay, repeat: Infinity, ease: "linear" }}
        >
          {it.heart ? (
            <Heart style={{ width: it.size, height: it.size }} />
          ) : (
            <div
              style={{
                width: it.size * 0.5,
                height: it.size * 0.8,
                background: "currentColor",
                borderRadius: 2,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- One-shot confetti / heart burst ---------- */
const BURST_COLORS = ["#ec4899", "#f9a8d4", "#c084fc", "#fcd34d", "#7dd3fc", "#86efac"];

export function Burst({ x = "50%", y = "50%", count = 24, hearts = true, spread = 150 }) {
  const reduce = useReducedMotion();
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const d = spread * (0.4 + Math.random() * 0.8);
        return {
          id: i,
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d - 30,
          color: BURST_COLORS[i % BURST_COLORS.length],
          size: 6 + Math.random() * 8,
          heart: hearts && i % 3 === 0,
          rot: Math.random() * 540 - 270,
        };
      }),
    [count, hearts, spread]
  );
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }} aria-hidden="true">
      {parts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ color: p.color }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={
            reduce
              ? { opacity: 0 }
              : { x: p.dx, y: p.dy, scale: [0.6, 1.1, 0.5], opacity: [1, 1, 0], rotate: p.rot }
          }
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          {p.heart ? (
            <Heart style={{ width: p.size + 4, height: p.size + 4 }} />
          ) : (
            <div
              style={{
                width: p.size * 0.6,
                height: p.size,
                background: "currentColor",
                borderRadius: 2,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Falling celebration confetti ---------- */
export function ConfettiRain({ count = 40 }) {
  const reduce = useReducedMotion();
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        dur: 4 + Math.random() * 5,
        color: BURST_COLORS[i % BURST_COLORS.length],
        size: 5 + Math.random() * 8,
        kind: i % 4,
      })),
    [count]
  );
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bits.map((b) => (
        <motion.div
          key={b.id}
          className="absolute -top-8"
          style={{ left: `${b.left}%`, color: b.color }}
          initial={{ y: -40, rotate: 0 }}
          animate={{ y: 1000, rotate: 720, x: [0, 20, -20, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" }}
        >
          {b.kind === 0 ? (
            <Heart style={{ width: b.size + 4, height: b.size + 4 }} />
          ) : b.kind === 1 ? (
            <span style={{ fontSize: b.size + 6 }}>✨</span>
          ) : b.kind === 2 ? (
            <span style={{ fontSize: b.size + 5 }}>⭐</span>
          ) : (
            <div
              style={{ width: b.size * 0.6, height: b.size, background: "currentColor", borderRadius: 2 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Buttons ---------- */
export function PinkButton({ children, onClick, className = "", type = "button", ...rest }) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      onClick={(e) => {
        sfx.click();
        onClick && onClick(e);
      }}
      className={
        "rounded-full bg-gradient-to-b from-pink-400 to-pink-500 px-7 py-3 font-semibold text-white shadow-lg shadow-pink-300/60 active:shadow-md " +
        className
      }
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function SoftButton({ children, onClick, className = "", ...rest }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      onClick={(e) => {
        sfx.click();
        onClick && onClick(e);
      }}
      className={
        "rounded-full border border-pink-200 bg-white/90 px-7 py-3 font-semibold text-pink-500 shadow-md shadow-pink-200/50 " +
        className
      }
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/* ---------- Bunting ---------- */
export function Bunting() {
  const flags = ["#f9a8d4", "#c4b5fd", "#a5d8ff", "#fcd6a5", "#b7f0c8", "#f9a8d4", "#c4b5fd"];
  return (
    <svg viewBox="0 0 320 46" className="w-full" aria-hidden="true">
      <path d="M2 8 Q160 40 318 8" stroke="#f0abcb" strokeWidth="2" fill="none" />
      {flags.map((c, i) => {
        const t = i / (flags.length - 1);
        const x = 2 + t * 316;
        const y = 8 + 32 * (1 - (2 * t - 1) ** 2) * 0.5;
        return (
          <motion.polygon
            key={i}
            points={`${x - 13},${y} ${x + 13},${y} ${x},${y + 24}`}
            fill={c}
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: `${x}px`, originY: `${y}px`, transformBox: "view-box" }}
          />
        );
      })}
    </svg>
  );
}
