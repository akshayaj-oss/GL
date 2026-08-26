let audioCtx: AudioContext | null = null;
let isMuted = false;

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};
export const getIsMuted = () => isMuted;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
  if (isMuted) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Very subtle envelope
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

export const playAmbientLoad = () => playTone(200, 'sine', 1.0, 0.03);
export const playClick = () => playTone(800, 'sine', 0.1, 0.05);
export const playTick = () => playTone(400, 'triangle', 0.1, 0.03);
export const playTransition = () => {
  if (isMuted) return;
  playTone(300, 'sine', 0.3, 0.03);
  setTimeout(() => playTone(400, 'sine', 0.4, 0.03), 100);
};
export const playAnticipation = () => playTone(150, 'sine', 2.0, 0.08);
export const playReveal = () => {
  if (isMuted) return;
  try {
    initAudio();
    if (!audioCtx) return;

    // 1. Triumphant Fanfare (A Major Arpeggio)
    const chord = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    chord.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx!.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx!.destination);
      
      gain.gain.setValueAtTime(0, audioCtx!.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx!.currentTime + 0.1 + (i * 0.1));
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx!.currentTime + 3.0);
      
      osc.start(audioCtx!.currentTime);
      osc.stop(audioCtx!.currentTime + 3.0);
    });

    // 2. Crowd Cheer (Filtered White Noise)
    const bufferSize = audioCtx.sampleRate * 2.5; // 2.5 seconds of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // White noise
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
    noiseFilter.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 1.0);
    noiseFilter.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 2.5);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.5); // swell up
    noiseGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 2.5); // fade out
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noiseSource.start(audioCtx.currentTime);
  } catch (e) {
    console.error('Cheer sound failed', e);
  }
};
