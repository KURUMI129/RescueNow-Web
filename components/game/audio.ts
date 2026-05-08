/**
 * Chiptune audio engine using Web Audio API.
 * No external files — all sounds generated programmatically.
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
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.12, t + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.08);
    osc.stop(t + i * 0.08 + 0.12);
  });
}

export function sfxHit() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

export function sfxGameOver() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  [400, 350, 280, 200].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, t + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.15);
    osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ─── Background music (looping chiptune) ─── */

let bgmNodes: { oscs: OscillatorNode[]; gains: GainNode[] } | null = null;
let bgmInterval: ReturnType<typeof setInterval> | null = null;

const MELODY = [
  523, 587, 659, 784, 659, 587, 523, 440,
  523, 659, 784, 880, 784, 659, 523, 587,
];

const BASS = [
  131, 131, 165, 165, 196, 196, 165, 165,
  131, 131, 196, 196, 220, 220, 196, 196,
];

export function startBGM() {
  stopBGM();
  const ctx = getCtx();

  let step = 0;
  const bpm = 160;
  const interval = (60 / bpm) * 1000;

  bgmInterval = setInterval(() => {
    const t = ctx.currentTime;

    // Melody
    const melOsc = ctx.createOscillator();
    const melGain = ctx.createGain();
    melOsc.type = "square";
    melOsc.frequency.value = MELODY[step % MELODY.length];
    melGain.gain.setValueAtTime(0.06, t);
    melGain.gain.exponentialRampToValueAtTime(0.001, t + interval / 1000 * 0.8);
    melOsc.connect(melGain).connect(ctx.destination);
    melOsc.start(t);
    melOsc.stop(t + interval / 1000);

    // Bass
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = "triangle";
    bassOsc.frequency.value = BASS[step % BASS.length];
    bassGain.gain.setValueAtTime(0.08, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + interval / 1000 * 0.9);
    bassOsc.connect(bassGain).connect(ctx.destination);
    bassOsc.start(t);
    bassOsc.stop(t + interval / 1000);

    step++;
  }, interval);
}

export function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (bgmNodes) {
    bgmNodes.oscs.forEach((o) => { try { o.stop(); } catch {} });
    bgmNodes = null;
  }
}
