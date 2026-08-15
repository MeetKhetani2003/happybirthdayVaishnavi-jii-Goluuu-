import { motion } from "framer-motion";

/* Cute teddy bear + bunny + cake illustration (pure SVG) */
export default function BirthdayScene({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label="A teddy bear and a bunny celebrating with a birthday cake"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* banner */}
      <path d="M20 26 Q160 6 300 26" stroke="#f4a7c8" strokeWidth="2" fill="none" />
      <rect x="104" y="12" width="112" height="26" rx="13" fill="#fff0f6" stroke="#f7bcd6" />
      <text x="160" y="30" textAnchor="middle" fontSize="13" fill="#e05c92" fontFamily="Caveat, cursive">
        Happy Birthday!
      </text>

      {/* confetti dots */}
      {[
        [40, 60, "#f9a8d4"], [285, 55, "#c4b5fd"], [60, 100, "#a5d8ff"],
        [270, 110, "#fcd34d"], [30, 140, "#b7f0c8"], [295, 150, "#f9a8d4"],
      ].map(([x, y, c], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4" fill={c}
          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
        />
      ))}

      {/* ground */}
      <ellipse cx="160" cy="182" rx="130" ry="12" fill="#fbd5e5" opacity="0.7" />

      {/* --- Teddy bear (left) --- */}
      <g>
        <circle cx="74" cy="112" r="12" fill="#c99368" />
        <circle cx="112" cy="112" r="12" fill="#c99368" />
        <ellipse cx="93" cy="150" rx="27" ry="26" fill="#d7a678" />
        <ellipse cx="93" cy="156" rx="16" ry="15" fill="#f3dcc4" />
        <circle cx="93" cy="112" r="26" fill="#d7a678" />
        <ellipse cx="93" cy="120" rx="13" ry="10" fill="#f3dcc4" />
        <circle cx="85" cy="108" r="3" fill="#5b3a24" />
        <circle cx="101" cy="108" r="3" fill="#5b3a24" />
        <ellipse cx="93" cy="117" rx="4" ry="3" fill="#5b3a24" />
        <path d="M89 122 q4 4 8 0" stroke="#5b3a24" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="78" cy="124" r="4" fill="#f7a8c4" opacity="0.7" />
        <circle cx="108" cy="124" r="4" fill="#f7a8c4" opacity="0.7" />
        {/* party hat */}
        <polygon points="93,74 80,95 106,95" fill="#f472b6" />
        <circle cx="93" cy="72" r="4" fill="#fcd34d" />
      </g>

      {/* --- Bunny (right) --- */}
      <g>
        <ellipse cx="222" cy="80" rx="7" ry="20" fill="#fdfdfd" stroke="#f0d5e2" />
        <ellipse cx="244" cy="80" rx="7" ry="20" fill="#fdfdfd" stroke="#f0d5e2" />
        <ellipse cx="222" cy="80" rx="3" ry="13" fill="#fbcfe8" />
        <ellipse cx="244" cy="80" rx="3" ry="13" fill="#fbcfe8" />
        <ellipse cx="233" cy="152" rx="26" ry="25" fill="#ffffff" stroke="#f0d5e2" />
        <circle cx="233" cy="114" r="25" fill="#ffffff" stroke="#f0d5e2" />
        <circle cx="225" cy="111" r="3" fill="#6b4b5b" />
        <circle cx="241" cy="111" r="3" fill="#6b4b5b" />
        <path d="M233 118 l-3 3 h6 z" fill="#f472b6" />
        <path d="M229 123 q4 4 8 0" stroke="#6b4b5b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="219" cy="122" r="4" fill="#f7a8c4" opacity="0.7" />
        <circle cx="247" cy="122" r="4" fill="#f7a8c4" opacity="0.7" />
        <path d="M233 140 l-6 -6 a4 4 0 1 1 6 -4 a4 4 0 1 1 6 4 z" fill="#f472b6" />
      </g>

      {/* --- Cake (center) --- */}
      <g>
        <rect x="132" y="140" width="56" height="30" rx="8" fill="#8b5e3c" />
        <rect x="132" y="132" width="56" height="16" rx="8" fill="#fff5f8" />
        <path d="M132 144 q7 10 14 0 q7 10 14 0 q7 10 14 0 q7 10 14 0" fill="#f9a8d4" />
        <rect x="126" y="168" width="68" height="10" rx="5" fill="#f7bcd6" />
        {[142, 160, 178].map((x, i) => (
          <circle key={i} cx={x} cy={137} r="3" fill="#f472b6" />
        ))}
        <rect x="157" y="112" width="6" height="22" rx="3" fill="#fbcfe8" stroke="#f0abcb" />
        <motion.ellipse
          cx="160" cy="106" rx="5" ry="9" fill="#fbbf24"
          animate={{ scaleY: [1, 1.2, 0.9, 1], opacity: [0.9, 1, 0.85, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{ originX: "160px", originY: "112px", transformBox: "view-box" }}
        />
        <ellipse cx="160" cy="108" rx="2.4" ry="4.6" fill="#fff7cd" />
      </g>
    </motion.svg>
  );
}
