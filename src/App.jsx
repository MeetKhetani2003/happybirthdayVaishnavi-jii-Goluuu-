import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import birthdayData from "./data/birthdayData";
import { FloatingHearts } from "./components/ui";
import { setEnabled, startMusic, stopMusic, sfx } from "./audio/sound";
import WelcomeScreen from "./screens/WelcomeScreen";
import BalloonGame from "./screens/BalloonGame";
import BirthdayCake from "./screens/BirthdayCake";
import RoseBouquet from "./screens/RoseBouquet";
import MemoryCarousel from "./screens/MemoryCarousel";
import BirthdayLetter from "./screens/BirthdayLetter";
import GiftReveal from "./screens/GiftReveal";
import FinalCelebration from "./screens/FinalCelebration";

const SCREENS = [
  "welcome",
  "balloons",
  "cake",
  "bouquet",
  "memories",
  "letter",
  "gift",
  "final",
];

export default function App() {
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);
  const [music, setMusic] = useState(false);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, SCREENS.length - 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const toggleMusic = () => {
    const on = !music;
    setMusic(on);
    setEnabled(on);
    if (on) {
      startMusic();
      sfx.click();
    } else {
      stopMusic();
    }
  };

  const replay = () => {
    setRunId((r) => r + 1);
    setStep(0);
  };

  const key = SCREENS[step];

  const screens = {
    welcome: (
      <WelcomeScreen
        name={birthdayData.name}
        welcomeMessage={birthdayData.welcomeMessage}
        onNext={next}
      />
    ),
    balloons: <BalloonGame onNext={next} />,
    cake: <BirthdayCake name={birthdayData.name} onNext={next} />,
    bouquet: (
      <RoseBouquet name={birthdayData.name} messages={birthdayData.bouquetMessages} onNext={next} />
    ),
    memories: <MemoryCarousel photos={birthdayData.photos} onNext={next} />,
    letter: <BirthdayLetter data={birthdayData} onNext={next} />,
    gift: <GiftReveal onNext={next} />,
    final: <FinalCelebration data={birthdayData} onReplay={replay} />,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fde7ef] via-[#fdd9e8] to-[#fce4f0] py-0 sm:py-6">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col overflow-hidden bg-gradient-to-b from-[#fff1f6] via-[#fde3ee] to-[#fbd7e8] shadow-[0_30px_80px_-30px_rgba(236,72,153,0.55)] sm:min-h-[calc(100vh-3rem)] sm:rounded-[34px]">
        <FloatingHearts count={14} />

        {/* header */}
        <header className="relative z-20 flex items-center justify-between px-4 pt-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                sfx.click();
                back();
              }}
              className="rounded-full border border-pink-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-pink-500 shadow-sm"
            >
              ← Back
            </button>
          ) : (
            <span className="px-1 font-hand text-lg text-pink-400/70">🎀 for you</span>
          )}

          <button
            type="button"
            onClick={toggleMusic}
            aria-pressed={music}
            aria-label={music ? "Turn music off" : "Turn music on"}
            title={music ? "Music On" : "Music Off"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-200 bg-white/85 text-base shadow-sm"
          >
            {music ? "🔊" : "🔇"}
          </button>
        </header>

        {/* screens */}
        <main className="relative z-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.section
              key={`${key}-${runId}`}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -60, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="min-h-full"
            >
              {screens[key]}
            </motion.section>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
