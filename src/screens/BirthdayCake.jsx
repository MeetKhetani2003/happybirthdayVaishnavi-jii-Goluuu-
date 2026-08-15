import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Burst, PinkButton, SoftButton } from "../components/ui";
import { sfx } from "../audio/sound";

export default function BirthdayCake({ name, onNext }) {
  const [out, setOut] = useState(false);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [level, setLevel] = useState(0);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };
  useEffect(() => cleanup, []);

  const extinguish = () => {
    if (out) return;
    setOut(true);
    sfx.blow();
    setTimeout(() => sfx.celebrate(), 400);
    cleanup();
    setListening(false);
    setTimeout(onNext, 2600);
  };

  const startMic = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const data = new Uint8Array(an.frequencyBinCount);
      setListening(true);
      const loop = () => {
        an.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setLevel(Math.min(1, rms * 6));
        if (rms > 0.16) {
          extinguish();
          ctx.close().catch(() => {});
          return;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      setMicError("Mic unavailable — just tap the candle 🕯️");
      setListening(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center px-5 pb-10 pt-6 text-center">
      <h2 className="font-script text-4xl text-pink-500">Blow the candle, {name.split(' (')[0]}</h2>
      <p className="mt-1 font-hand text-xl text-rose-400">Make a wish first ✨</p>

      <button
        type="button"
        onClick={extinguish}
        aria-label="Tap the candle to blow it out"
        className="relative mt-6 w-full max-w-[300px]"
      >
        <motion.svg
          viewBox="0 0 240 230"
          className="w-full drop-shadow-xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          role="img"
          aria-label="Birthday cake with a candle"
        >
          {/* candle */}
          <rect x="112" y="66" width="16" height="46" rx="8" fill="#fbcfe8" stroke="#f0abcb" />
          <rect x="112" y="76" width="16" height="8" fill="#f472b6" opacity="0.5" />
          <rect x="112" y="94" width="16" height="8" fill="#f472b6" opacity="0.5" />
          <line x1="120" y1="60" x2="120" y2="66" stroke="#8b5e3c" strokeWidth="2" />
          <AnimatePresence>
            {!out && (
              <motion.g
                key="flame"
                exit={{ scaleY: 0.1, scale: 0.2, opacity: 0, transition: { duration: 0.45 } }}
                style={{ originX: "120px", originY: "62px", transformBox: "view-box" }}
              >
                <motion.ellipse
                  cx="120" cy="48" rx={9 - level * 3} ry={16 - level * 5} fill="#fbbf24"
                  animate={{ scaleY: [1, 1.15, 0.92, 1], x: [0, 1.5, -1.5, 0] }}
                  transition={{ duration: 0.55, repeat: Infinity }}
                />
                <ellipse cx="120" cy="52" rx="4" ry="8" fill="#fff8d6" />
                <circle cx="120" cy="48" r="26" fill="#fde68a" opacity="0.25" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* smoke */}
          <AnimatePresence>
            {out &&
              [0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={120 + (i - 1) * 5}
                  cy="56"
                  r={5 + i}
                  fill="#cbd5e1"
                  initial={{ opacity: 0.6, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -60 - i * 12, scale: 1.8 }}
                  transition={{ duration: 2, delay: i * 0.25 }}
                />
              ))}
          </AnimatePresence>

          {/* cake */}
          <rect x="66" y="110" width="108" height="26" rx="10" fill="#fff5f8" />
          <path d="M66 122 q13.5 14 27 0 q13.5 14 27 0 q13.5 14 27 0 q13.5 14 27 0 v14 h-108z" fill="#f9a8d4" />
          <rect x="66" y="132" width="108" height="42" rx="10" fill="#8b5e3c" />
          <rect x="56" y="168" width="128" height="20" rx="10" fill="#fff5f8" />
          <path d="M56 176 q16 14 32 0 q16 14 32 0 q16 14 32 0 q16 14 32 0" fill="none" stroke="#f7bcd6" strokeWidth="3" />
          <rect x="46" y="186" width="148" height="14" rx="7" fill="#f7bcd6" />
          <ellipse cx="120" cy="208" rx="86" ry="10" fill="#fbd5e5" opacity="0.6" />
          {[80, 104, 128, 152].map((x, i) => (
            <circle key={i} cx={x} cy={116} r="4" fill="#f472b6" />
          ))}
        </motion.svg>
        {out && <Burst x="50%" y="35%" count={26} spread={150} />}
      </button>

      <div className="mt-6 flex w-full max-w-[320px] flex-col items-center gap-3">
        {!out ? (
          <>
            <PinkButton onClick={startMic} className="w-full text-lg">
              {listening ? "🎤 Listening… blow now!" : "💨 Blow into the mic"}
            </PinkButton>
            {listening && (
              <div className="h-2 w-40 overflow-hidden rounded-full bg-pink-100">
                <motion.div className="h-full bg-pink-400" animate={{ width: `${level * 100}%` }} />
              </div>
            )}
            <SoftButton onClick={extinguish} className="w-full">
              Tap the candle 🕯️
            </SoftButton>
            {micError && <p className="font-hand text-lg text-rose-400">{micError}</p>}
          </>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-script text-3xl text-rose-500"
          >
            Your wish is on its way ✨
          </motion.p>
        )}
      </div>
    </div>
  );
}
