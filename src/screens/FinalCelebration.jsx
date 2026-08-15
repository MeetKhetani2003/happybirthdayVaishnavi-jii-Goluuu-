import { useEffect } from "react";
import { motion } from "framer-motion";
import BirthdayScene from "../components/BirthdayScene";
import { ConfettiRain, PinkButton, SoftButton } from "../components/ui";
import { sfx } from "../audio/sound";

export default function FinalCelebration({ data, onReplay }) {
  useEffect(() => {
    sfx.celebrate();
  }, []);

  return (
    <div className="relative flex min-h-full flex-col items-center px-5 pb-12 pt-6 text-center">
      <ConfettiRain count={46} />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 15 }}
        className="w-full"
      >
        <BirthdayScene className="w-full" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 font-hand text-2xl text-rose-400"
      >
        Lots of love for you ❤️
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-1 font-script text-[42px] leading-tight text-pink-500"
      >
        Once again,
        <br />
        <span className="text-rose-500">Happy Birthday {data.name}!</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 max-w-[300px] text-[15px] leading-relaxed text-rose-900/60"
      >
        {data.finalMessage}
      </motion.p>

      <div className="mt-7 flex w-full max-w-[300px] flex-col gap-3">
        <PinkButton onClick={onReplay} className="w-full text-lg">
          ⟲ Replay
        </PinkButton>
      </div>
    </div>
  );
}
