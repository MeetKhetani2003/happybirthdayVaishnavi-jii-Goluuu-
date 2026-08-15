import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PinkButton } from "../components/ui";
import { sfx } from "../audio/sound";

function PhotoCard({ photo, offset, direction, onDragEnd }) {
  const isTop = offset === 0;
  const rotations = [-2, 3, -4, 5];
  return (
    <motion.div
      className="absolute inset-0 mx-auto flex w-[86%] cursor-grab flex-col rounded-[22px] bg-white p-3 pb-10 shadow-[0_18px_40px_-12px_rgba(236,72,153,0.45)] active:cursor-grabbing"
      style={{ zIndex: 10 - offset, touchAction: "pan-y" }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{
        scale: 1 - offset * 0.06,
        y: offset * 16,
        x: 0,
        rotate: isTop ? rotations[0] : rotations[offset % rotations.length],
        opacity: offset > 2 ? 0 : 1,
      }}
      exit={{
        x: direction > 0 ? -320 : 320,
        rotate: direction > 0 ? -22 : 22,
        scale: 0.7,
        opacity: 0,
        transition: { duration: 0.35 },
      }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
    >
      <div className="overflow-hidden rounded-[14px] bg-pink-50">
        <img
          src={photo.image}
          alt={photo.caption}
          draggable="false"
          className="aspect-square w-full select-none object-cover"
        />
      </div>
      <p className="mt-3 text-center font-hand text-2xl text-rose-500">{photo.caption}</p>
    </motion.div>
  );
}

export default function MemoryCarousel({ photos, onNext }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d) => {
    sfx.click();
    setDir(d);
    setIndex((i) => (i + d + photos.length) % photos.length);
  };

  const visible = [0, 1, 2].map((o) => ({ o, p: photos[(index + o) % photos.length] }));

  return (
    <div className="flex min-h-full flex-col items-center px-5 pb-10 pt-5 text-center">
      <h2 className="font-script text-4xl text-pink-500">Some Sweet Moments</h2>
      <p className="mt-1 font-hand text-xl text-rose-400">
        Swipe through our beautiful memories ❤️
      </p>

      <div className="relative mt-6 h-[390px] w-full max-w-[330px]">
        <AnimatePresence initial={false} custom={dir}>
          {visible
            .slice()
            .reverse()
            .map(({ o, p }) => (
              <PhotoCard
                key={`${p.image}-${index}-${o}`}
                photo={p}
                offset={o}
                direction={dir}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -70 || info.velocity.x < -450) go(1);
                  else if (info.offset.x > 70 || info.velocity.x > 450) go(-1);
                }}
              />
            ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-pink-400" : "w-2 bg-pink-200"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 font-hand text-lg text-pink-400/80">← drag the photo →</p>

      <PinkButton onClick={onNext} className="mt-5">
        Continue →
      </PinkButton>
    </div>
  );
}
