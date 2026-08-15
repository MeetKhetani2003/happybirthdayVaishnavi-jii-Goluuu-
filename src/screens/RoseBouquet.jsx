import { motion } from "framer-motion";
import { PinkButton, Heart } from "../components/ui";

function Bouquet() {
  const roses = [
    [60, 46], [120, 34], [180, 46], [88, 74], [152, 74], [120, 96],
  ];
  return (
    <motion.svg
      viewBox="0 0 240 260"
      className="w-full drop-shadow-xl"
      role="img"
      aria-label="A bouquet of red roses wrapped in brown paper with a pink ribbon"
      animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* leaves */}
      {[[40, 80, -35], [200, 80, 35], [30, 120, -20], [210, 120, 20]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="13" ry="30" fill="#5fa871" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {/* stems */}
      {roses.map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} Q${120} ${150} ${120} ${196}`} stroke="#4f9560" strokeWidth="4" fill="none" />
      ))}
      {/* roses */}
      {roses.map(([x, y], i) => (
        <motion.g
          key={i}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: `${x}px`, originY: `${y}px`, transformBox: "view-box" }}
        >
          <circle cx={x} cy={y} r="24" fill="#c9243f" />

          <circle cx={x} cy={y} r="17" fill="#e0344c" />
          <circle cx={x} cy={y} r="10" fill="#f05068" />
          <path d={`M${x - 6} ${y} a6 6 0 1 1 12 0 a6 6 0 1 1 -12 0`} fill="#b91c37" />
        </motion.g>
      ))}
      {/* wrapping */}
      <path d="M64 176 L176 176 L150 250 L90 250 Z" fill="#c99368" />
      <path d="M64 176 L120 210 L176 176 L120 196 Z" fill="#b57f57" />
      <rect x="86" y="212" width="68" height="14" rx="7" fill="#f472b6" />
      <path d="M120 219 l-16 -12 v24 z" fill="#ec4899" />
      <path d="M120 219 l16 -12 v24 z" fill="#ec4899" />
      <circle cx="120" cy="219" r="6" fill="#fbcfe8" />
    </motion.svg>
  );
}

const POSITIONS = [
  { top: "2%", left: "-2%", rot: -8 },
  { top: "14%", right: "-2%", rot: 7 },
  { top: "44%", left: "-4%", rot: 5 },
  { top: "56%", right: "-3%", rot: -6 },
  { top: "80%", left: "8%", rot: -3 },
  { top: "88%", right: "6%", rot: 4 },
];

export default function RoseBouquet({ name, messages, onNext }) {
  const all = [...messages, `Happy Birthday ${name} ❤️`].slice(0, 6);
  return (
    <div className="flex min-h-full flex-col items-center px-5 pb-10 pt-5 text-center">
      <h2 className="font-script text-4xl text-pink-500">Your Rose Bouquet 🌹</h2>
      <p className="mt-1 font-hand text-xl text-rose-400">Every rose is a reason I adore you</p>

      <div className="relative mt-4 w-full max-w-[360px]">
        <div className="mx-auto w-[62%]">
          <Bouquet />
        </div>

        {all.map((m, i) => {
          const p = POSITIONS[i % POSITIONS.length];
          return (
            <motion.div
              key={m + i}
              className="absolute max-w-[46%] rounded-2xl border border-pink-100 bg-white px-3 py-2 text-[13px] font-medium text-rose-500 shadow-lg shadow-pink-200/60"
              style={{ top: p.top, left: p.left, right: p.right }}
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: p.rot, y: [0, -7, 0] }}
              transition={{
                opacity: { delay: 0.3 + i * 0.25, duration: 0.5 },
                scale: { delay: 0.3 + i * 0.25, type: "spring", stiffness: 220, damping: 13 },
                rotate: { delay: 0.3 + i * 0.25 },
                y: { duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
              }}
            >
              {m}
            </motion.div>
          );
        })}

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute text-pink-400"
            style={{ left: `${20 + (i * 9) % 60}%`, top: `${30 + ((i * 13) % 50)}%` }}
            animate={{ y: [0, -40], opacity: [0, 0.7, 0], scale: [0.5, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5 }}
            aria-hidden="true"
          >
            <Heart style={{ width: 12, height: 12 }} />
          </motion.div>
        ))}
      </div>

      <PinkButton onClick={onNext} className="mt-6">
        Continue →
      </PinkButton>
    </div>
  );
}
