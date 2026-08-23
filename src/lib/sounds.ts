/**
 * Glass-004 style chime sounds using Web Audio API.
 * No external audio files needed — generates sounds programmatically.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Glass chime — bright, crystalline, satisfying.
 * Used for: login success, signup complete, transformation done.
 */
export function playGlassChime() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Three harmonic tones for a glass-like chord
    const frequencies = [1318.51, 1567.98, 2093.00]; // E6, G6, C7
    const durations = [0.8, 0.6, 0.5];
    const volumes = [0.15, 0.12, 0.1];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Glass-like filter
      filter.type = "highpass";
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(2, now);

      // Envelope: quick attack, long decay
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volumes[i], now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durations[i]);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08); // Stagger for shimmer effect
      osc.stop(now + durations[i] + 0.1);
    });

    // Add a subtle high-frequency sparkle
    const sparkle = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkle.type = "sine";
    sparkle.frequency.setValueAtTime(4186.01, now); // C8
    sparkleGain.gain.setValueAtTime(0, now);
    sparkleGain.gain.linearRampToValueAtTime(0.04, now + 0.01);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    sparkle.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkle.start(now + 0.05);
    sparkle.stop(now + 0.4);
  } catch {
    // Audio not available — silent fallback
  }
}

/**
 * Subtle click — for button interactions.
 */
export function playClick() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Silent fallback
  }
}

/**
 * Completion fanfare — for transformation complete.
 * More elaborate than the glass chime.
 */
export function playCompletionFanfare() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.7);
    });

    // Final chord sustain
    const chordFreqs = [523.25, 659.25, 783.99, 1046.50];
    chordFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + 0.4);

      gain.gain.setValueAtTime(0, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.4);
      osc.stop(now + 1.3);
    });
  } catch {
    // Silent fallback
  }
}
