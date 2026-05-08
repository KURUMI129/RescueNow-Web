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

/* ─── Background music (5 tracks, random each game) ─── */

let bgmInterval: ReturnType<typeof setInterval> | null = null;

// Track 1: Upbeat march
const TRACK_1 = {
  bpm: 160,
  melody: [523, 587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 523, 587],
  bass:   [131, 131, 165, 165, 196, 196, 165, 165, 131, 131, 196, 196, 220, 220, 196, 196],
};

// Track 2: Urgent siren feel
const TRACK_2 = {
  bpm: 180,
  melody: [659, 784, 659, 784, 523, 587, 523, 587, 880, 784, 659, 523, 587, 659, 784, 880],
  bass:   [165, 165, 196, 196, 131, 131, 147, 147, 220, 220, 165, 165, 147, 147, 196, 196],
};

// Track 3: Adventurous (wider intervals)
const TRACK_3 = {
  bpm: 150,
  melody: [440, 523, 659, 880, 784, 523, 440, 349, 440, 659, 784, 1047, 880, 659, 523, 440],
  bass:   [110, 110, 131, 131, 165, 165, 110, 110, 131, 131, 165, 165, 220, 220, 131, 131],
};

// Track 4: Funky bounce
const TRACK_4 = {
  bpm: 170,
  melody: [587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 587, 523, 659],
  bass:   [147, 147, 196, 196, 147, 147, 110, 110, 165, 165, 220, 220, 165, 165, 131, 131],
};

// Track 5: Dark chase
const TRACK_5 = {
  bpm: 185,
  melody: [392, 440, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440, 392, 349],
  bass:   [98, 98, 131, 131, 98, 98, 110, 110, 131, 131, 165, 165, 131, 131, 98, 98],
};

const TRACKS = [TRACK_1, TRACK_2, TRACK_3, TRACK_4, TRACK_5];

export function startBGM() {
  stopBGM();
  const ctx = getCtx();

  // Pick a random track
  const track = TRACKS[Math.floor(Math.random() * TRACKS.length)];
  let step = 0;
  const interval = (60 / track.bpm) * 1000;

  bgmInterval = setInterval(() => {
    const t = ctx.currentTime;

    // Melody (square wave)
    const melOsc = ctx.createOscillator();
    const melGain = ctx.createGain();
    melOsc.type = "square";
    melOsc.frequency.value = track.melody[step % track.melody.length];
    melGain.gain.setValueAtTime(0.06, t);
    melGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 0.8);
    melOsc.connect(melGain).connect(ctx.destination);
    melOsc.start(t);
    melOsc.stop(t + interval / 1000);

    // Bass (triangle wave)
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = "triangle";
    bassOsc.frequency.value = track.bass[step % track.bass.length];
    bassGain.gain.setValueAtTime(0.08, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 0.9);
    bassOsc.connect(bassGain).connect(ctx.destination);
    bassOsc.start(t);
    bassOsc.stop(t + interval / 1000);

    // Hi-hat (noise-like) on even steps
    if (step % 2 === 0) {
      const hatOsc = ctx.createOscillator();
      const hatGain = ctx.createGain();
      hatOsc.type = "square";
      hatOsc.frequency.value = 4000 + Math.random() * 2000;
      hatGain.gain.setValueAtTime(0.02, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      hatOsc.connect(hatGain).connect(ctx.destination);
      hatOsc.start(t);
      hatOsc.stop(t + 0.05);
    }

    step++;
  }, interval);
}

export function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}
