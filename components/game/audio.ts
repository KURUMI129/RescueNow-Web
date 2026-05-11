/**
 * Chiptune audio engine v2 — multiple tracks + SFX.
 * All sounds generated with Web Audio API. Zero external files.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** Resume audio context (must be called from user gesture) */
export function resumeAudio() {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
}

/* ─── SFX ─── */

export function sfxPickup() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(520, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

export function sfxRescue() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.10, t + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.07);
    osc.stop(t + i * 0.07 + 0.1);
  });
}

export function sfxHit() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

export function sfxGameOver() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  [400, 350, 280, 200, 150].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.13, t + i * 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.22);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.18);
    osc.stop(t + i * 0.18 + 0.22);
  });
}

/* ─── Background music (12 tracks, dynamic per tier) ─── */

type Track = {
  bpm: number;
  melody: number[];
  bass: number[];
  tier: "calm" | "normal" | "intense";
};

const TRACKS: Track[] = [
  // 4 CALMAS (tier calm, <30 pts)
  { tier: "calm", bpm: 110, melody: [392, 440, 523, 440, 392, 349, 392, 440, 523, 587, 523, 440, 392, 349, 392, 440], bass: [98, 98, 131, 131, 98, 98, 110, 110, 131, 131, 147, 147, 131, 131, 98, 98] },
  { tier: "calm", bpm: 120, melody: [440, 523, 587, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440, 392], bass: [110, 110, 131, 131, 98, 98, 110, 110, 131, 131, 147, 147, 165, 165, 131, 131] },
  { tier: "calm", bpm: 105, melody: [349, 392, 440, 523, 440, 349, 392, 440, 392, 440, 523, 440, 392, 349, 330, 349], bass: [87, 87, 110, 110, 98, 98, 110, 110, 87, 87, 131, 131, 98, 98, 82, 82] },
  { tier: "calm", bpm: 115, melody: [392, 440, 523, 587, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440], bass: [98, 98, 131, 131, 110, 110, 98, 98, 110, 110, 131, 131, 165, 165, 131, 131] },

  // 4 NORMALES (30-80 pts)
  { tier: "normal", bpm: 160, melody: [523, 587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 523, 587], bass: [131, 131, 165, 165, 196, 196, 165, 165, 131, 131, 196, 196, 220, 220, 196, 196] },
  { tier: "normal", bpm: 170, melody: [587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 587, 523, 659], bass: [147, 147, 196, 196, 147, 147, 110, 110, 165, 165, 220, 220, 165, 165, 131, 131] },
  { tier: "normal", bpm: 155, melody: [440, 523, 659, 880, 784, 523, 440, 349, 440, 659, 784, 1047, 880, 659, 523, 440], bass: [110, 110, 131, 131, 165, 165, 110, 110, 131, 131, 165, 165, 220, 220, 131, 131] },
  { tier: "normal", bpm: 165, melody: [659, 587, 523, 587, 659, 784, 880, 784, 659, 523, 587, 659, 784, 880, 1047, 880], bass: [165, 165, 131, 131, 165, 165, 196, 196, 131, 131, 165, 165, 196, 196, 220, 220] },

  // 3 INTENSAS (80+ pts)
  { tier: "intense", bpm: 180, melody: [659, 784, 659, 784, 523, 587, 523, 587, 880, 784, 659, 523, 587, 659, 784, 880], bass: [165, 165, 196, 196, 131, 131, 147, 147, 220, 220, 165, 165, 147, 147, 196, 196] },
  { tier: "intense", bpm: 190, melody: [880, 784, 659, 587, 523, 587, 659, 784, 880, 1047, 1175, 1047, 880, 784, 659, 587], bass: [220, 220, 165, 165, 131, 131, 165, 165, 220, 220, 261, 261, 220, 220, 165, 165] },
  { tier: "intense", bpm: 185, melody: [392, 440, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440, 392, 349], bass: [98, 98, 131, 131, 98, 98, 110, 110, 131, 131, 165, 165, 131, 131, 98, 98] },

  // 1 VICTORY JINGLE (corto, usado en milestones)
  { tier: "intense", bpm: 220, melody: [523, 659, 784, 1047, 1175, 1047, 784, 659], bass: [131, 165, 196, 261, 294, 261, 196, 165] },
];

let bgmInterval: ReturnType<typeof setInterval> | null = null;
let bgmGain: GainNode | null = null;
let currentTrackIdx = -1;
let rotateTimer: ReturnType<typeof setTimeout> | null = null;

function tierForScore(score: number): "calm" | "normal" | "intense" {
  if (score < 30) return "calm";
  if (score < 80) return "normal";
  return "intense";
}

function pickTrack(tier: "calm" | "normal" | "intense"): number {
  const candidates = TRACKS
    .map((t, i) => ({ t, i }))
    .filter(({ t, i }) => t.tier === tier && i !== TRACKS.length - 1); // excluir jingle (último)
  const pool = candidates.filter(({ i }) => i !== currentTrackIdx);
  const pick = (pool.length ? pool : candidates)[Math.floor(Math.random() * (pool.length || candidates.length))];
  return pick.i;
}

function playTrack(trackIdx: number) {
  if (bgmInterval) clearInterval(bgmInterval);
  const ctx = getCtx();
  const track = TRACKS[trackIdx];
  let step = 0;
  const interval = (60 / track.bpm) * 1000;

  // Crossfade IN
  if (!bgmGain) {
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0;
    bgmGain.connect(ctx.destination);
  }
  bgmGain.gain.cancelScheduledValues(ctx.currentTime);
  bgmGain.gain.setValueAtTime(bgmGain.gain.value, ctx.currentTime);
  bgmGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.0);

  bgmInterval = setInterval(() => {
    const t = ctx.currentTime;
    const melOsc = ctx.createOscillator();
    const melGain = ctx.createGain();
    melOsc.type = "square";
    melOsc.frequency.value = track.melody[step % track.melody.length];
    melGain.gain.setValueAtTime(0.06, t);
    melGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 0.8);
    melOsc.connect(melGain).connect(bgmGain!);
    melOsc.start(t);
    melOsc.stop(t + interval / 1000);

    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = "triangle";
    bassOsc.frequency.value = track.bass[step % track.bass.length];
    bassGain.gain.setValueAtTime(0.08, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 0.9);
    bassOsc.connect(bassGain).connect(bgmGain!);
    bassOsc.start(t);
    bassOsc.stop(t + interval / 1000);

    if (step % 2 === 0) {
      const hatOsc = ctx.createOscillator();
      const hatGain = ctx.createGain();
      hatOsc.type = "square";
      hatOsc.frequency.value = 4000 + Math.random() * 2000;
      hatGain.gain.setValueAtTime(0.02, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      hatOsc.connect(hatGain).connect(bgmGain!);
      hatOsc.start(t);
      hatOsc.stop(t + 0.05);
    }

    step++;
  }, interval);

  currentTrackIdx = trackIdx;
}

export function startBGM(initialScore = 0) {
  stopBGM();
  const tier = tierForScore(initialScore);
  playTrack(pickTrack(tier));
  const scheduleRotate = () => {
    rotateTimer = setTimeout(() => {
      const cur = TRACKS[currentTrackIdx]?.tier ?? "normal";
      playTrack(pickTrack(cur));
      scheduleRotate();
    }, 25_000);
  };
  scheduleRotate();
}

export function updateBGMTier(score: number) {
  const desired = tierForScore(score);
  const cur = TRACKS[currentTrackIdx]?.tier;
  if (cur && cur !== desired) {
    playTrack(pickTrack(desired));
  }
}

export function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (rotateTimer) {
    clearTimeout(rotateTimer);
    rotateTimer = null;
  }
  if (bgmGain) {
    const ctx = getCtx();
    bgmGain.gain.cancelScheduledValues(ctx.currentTime);
    bgmGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  }
  currentTrackIdx = -1;
}

/* ─── Victory jingle (corto, sobre la BGM) ─── */

export function sfxVictoryJingle() {
  const ctx = getCtx();
  const jingle = TRACKS[TRACKS.length - 1]; // último: el jingle de victoria
  const stepInterval = (60 / jingle.bpm) / 1; // segundos por nota
  jingle.melody.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    const startT = ctx.currentTime + i * stepInterval;
    gain.gain.setValueAtTime(0.10, startT);
    gain.gain.exponentialRampToValueAtTime(0.001, startT + stepInterval * 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startT);
    osc.stop(startT + stepInterval);
  });
}
