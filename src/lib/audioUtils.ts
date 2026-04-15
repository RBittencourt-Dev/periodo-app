let sharedAudio: HTMLAudioElement | null = null;
let audioUnlocked = false;

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

// Generate a simple beep sound using Web Audio API
export function generateBeepSound(): Promise<string> {
  return new Promise((resolve) => {
    const AudioContextCtor =
      window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;

    if (!AudioContextCtor) {
      resolve("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==");
      return;
    }

    const audioContext = new AudioContextCtor();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Convert to data URL
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    resolve("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==");
  });
}

function getSharedAudio(soundUrl: string): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio(soundUrl);
    sharedAudio.preload = "auto";
  }

  if (sharedAudio.src !== new URL(soundUrl, window.location.origin).toString()) {
    sharedAudio.src = soundUrl;
  }

  return sharedAudio;
}

export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

export async function unlockAudio(soundUrl: string = "/notification.mp3"): Promise<void> {
  const audio = getSharedAudio(soundUrl);

  audio.muted = true;
  audio.volume = 0;

  try {
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audioUnlocked = true;
  } finally {
    audio.muted = false;
  }
}

// Play a sound
export async function playSound(soundUrl: string, volume: number = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const audio = getSharedAudio(soundUrl);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = Math.min(Math.max(volume / 100, 0), 1);
      audio.play().catch(reject);
      
      audio.onended = () => resolve();
      // Timeout fallback
      const timeout = setTimeout(resolve, 5000);
      audio.onended = () => {
        clearTimeout(timeout);
        resolve();
      };
    } catch (error) {
      reject(error);
    }
  });
}

// Get current time in HH:MM format
export function getCurrentTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// Parse time string to minutes since midnight
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Check if current time is within a period
export function isCurrentTimeBetween(startTime: string, endTime: string): boolean {
  const currentMinutes = timeToMinutes(getCurrentTimeString());
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Period spans midnight
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

// Check if period changed (transitioned at a specific minute)
export function didPeriodChange(previousTime: string | null, currentTime: string): boolean {
  if (!previousTime) return false;
  return previousTime !== currentTime;
}
