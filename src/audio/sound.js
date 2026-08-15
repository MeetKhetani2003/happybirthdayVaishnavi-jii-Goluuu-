let ctx = null;
let musicGain = null;
let melodyTimer = null;
let enabled = false;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function setEnabled(v) {
  enabled = v;
  if (!v) stopMusic();
}
export function isEnabled() {
  return enabled;
}

function tone({ freq = 440, dur = 0.2, type = "sine", vol = 0.15, slideTo = null, delay = 0 }) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise({ dur = 0.18, vol = 0.25 }) {
  const c = ac();
  if (!c) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = vol;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 2200;
  src.connect(f).connect(g).connect(c.destination);
  src.start();
}

export const sfx = {
  click() {
    if (!enabled) return;
    tone({ freq: 700, slideTo: 1100, dur: 0.1, type: "triangle", vol: 0.08 });
  },
  pop() {
    if (!enabled) return;
    tone({ freq: 900, slideTo: 180, dur: 0.14, type: "square", vol: 0.12 });
    noise({ dur: 0.12, vol: 0.15 });
  },
  blow() {
    if (!enabled) return;
    noise({ dur: 0.6, vol: 0.18 });
  },
  sparkle() {
    if (!enabled) return;
    [880, 1174, 1568, 2093].forEach((f, i) =>
      tone({ freq: f, dur: 0.25, type: "sine", vol: 0.08, delay: i * 0.07 })
    );
  },
  celebrate() {
    if (!enabled) return;
    [523, 659, 784, 1046, 1318].forEach((f, i) =>
      tone({ freq: f, dur: 0.35, type: "triangle", vol: 0.1, delay: i * 0.09 })
    );
    noise({ dur: 0.4, vol: 0.12 });
  },
};

// Happy-birthday-ish gentle melody loop
const MELODY = [
  [392, 0.35], [392, 0.25], [440, 0.6], [392, 0.6], [523, 0.6], [494, 1.0],
  [392, 0.35], [392, 0.25], [440, 0.6], [392, 0.6], [587, 0.6], [523, 1.0],
];

export function startMusic() {
  const c = ac();
  if (!c || melodyTimer) return;
  musicGain = c.createGain();
  musicGain.gain.value = 0.06;
  musicGain.connect(c.destination);

  const playLoop = () => {
    if (!enabled) return;
    let t = c.currentTime + 0.1;
    MELODY.forEach(([f, d]) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.95);
      osc.connect(g).connect(musicGain);
      osc.start(t);
      osc.stop(t + d);
      t += d;
    });
  };
  playLoop();
  const total = MELODY.reduce((a, [, d]) => a + d, 0) * 1000 + 900;
  melodyTimer = setInterval(playLoop, total);
}

export function stopMusic() {
  if (melodyTimer) clearInterval(melodyTimer);
  melodyTimer = null;
  if (musicGain) {
    try {
      musicGain.gain.value = 0;
      musicGain.disconnect();
    } catch (e) {}
    musicGain = null;
  }
}
