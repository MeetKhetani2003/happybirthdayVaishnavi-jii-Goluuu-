import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BirthdayScene from "../components/BirthdayScene";
import { Bunting, Burst, PinkButton } from "../components/ui";
import { sfx } from "../audio/sound";

const NO_LINES = [
  "Are you sure? 🥺",
  "Think again… 🎈",
  "Pretty please? 💕",
  "That button is shy!",
  "Okay okay… try YES 😌",
];

export default function WelcomeScreen({ name, welcomeMessage, onNext }) {
  const [burst, setBurst] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(-1);

  const handleYes = () => {
    sfx.celebrate();
    setBurst(true);
    setTimeout(() => onNext(), 750);
  };

  const handleNo = () => {
    sfx.click();
    setNoCount((c) => (c + 1) % NO_LINES.length);
    setNoPos({ x: (Math.random() - 0.5) * 120, y: (Math.random() - 0.5) * 70 });
  };

  return (
    <div className="flex min-h-full flex-col items-center px-5 pb-10 pt-2 text-center">
      <div className="w-full opacity-90">
        <Bunting />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="font-script text-5xl leading-tight text-pink-500 drop-shadow-sm"
      >
        Happy Birthday,
        <br />
        <span className="text-rose-500">{name}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 16 }}
        className="mt-2 w-full"
      >
        <BirthdayScene className="w-full" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 font-hand text-2xl text-rose-400"
      >
        {welcomeMessage}
      </motion.p>

      <div className="relative mt-6 flex items-center justify-center gap-4">
        <div className="relative">
          <PinkButton onClick={handleYes} aria-label="Yes, I am excited">
            YES ❤️
          </PinkButton>
          {burst && <Burst x="50%" y="50%" count={26} />}
        </div>

        <motion.button
          type="button"
          onClick={handleNo}
          aria-label="No"
          animate={{ x: noPos.x, y: noPos.y, rotate: [0, -8, 8, -5, 0] }}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
          className="rounded-full border border-pink-200 bg-white px-7 py-3 font-semibold text-pink-400 shadow-md shadow-pink-200/50"
        >
          NO
        </motion.button>
      </div>

      <div className="mt-4 h-8">
        <AnimatePresence mode="wait">
          {noCount >= 0 && (
            <motion.p
              key={noCount}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-hand text-xl text-rose-400"
            >
              {NO_LINES[noCount]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
