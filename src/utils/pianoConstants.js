export const PIANO_KEYS = [
  // Octave 3
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  // Octave 4  
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  // Octave 5
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5'
];

export const NOTE_FREQUENCIES = {
  // Octave 3
  'C3': 130.81,
  'C#3': 138.59,
  'D3': 146.83,
  'D#3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'G3': 196.00,
  'G#3': 207.65,
  'A3': 220.00,
  'A#3': 233.08,
  'B3': 246.94,
  
  // Octave 4
  'C4': 261.63,
  'C#4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'A4': 440.00,
  'A#4': 466.16,
  'B4': 493.88,
  
  // Octave 5
  'C5': 523.25,
  'C#5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'E5': 659.25,
  'F5': 698.46,
  'F#5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'A5': 880.00,
  'A#5': 932.33,
  'B5': 987.77
};

export const KEY_MAPPINGS = {
  // Octave 3 - Top row (white keys)
  'KeyQ': 'C3',
  'KeyW': 'D3', 
  'KeyE': 'E3',
  'KeyR': 'F3',
  'KeyT': 'G3',
  'KeyY': 'A3',
  'KeyU': 'B3',
  
  // Octave 3 - Number row (black keys)
  'Digit1': 'C#3',
  'Digit2': 'D#3',
  'Digit3': 'F#3',
  'Digit4': 'G#3',
  'Digit5': 'A#3',
  
  // Octave 4 - Home row (white keys)
  'KeyA': 'C4',
  'KeyS': 'D4',
  'KeyD': 'E4',
  'KeyF': 'F4',
  'KeyG': 'G4',
  'KeyH': 'A4',
  'KeyJ': 'B4',
  
  // Octave 4 - Number row (black keys)
  'Digit6': 'C#4',
  'Digit7': 'D#4',
  'Digit8': 'F#4',
  'Digit9': 'G#4',
  'Digit0': 'A#4',
  
  // Octave 5 - Bottom row (white keys)
  'KeyZ': 'C5',
  'KeyX': 'D5',
  'KeyC': 'E5',
  'KeyV': 'F5',
  'KeyB': 'G5',
  'KeyN': 'A5',
  'KeyM': 'B5',
  
  // Octave 5 - Top right (black keys)
  'KeyI': 'C#5',
  'KeyO': 'D#5',
  'KeyP': 'F#5',
  'KeyK': 'G#5',
  'KeyL': 'A#5'
};

// Reverse mapping for easy lookup
export const NOTE_TO_KEY = Object.fromEntries(
  Object.entries(KEY_MAPPINGS).map(([key, note]) => [note, key])
);

// Octave information
export const OCTAVE_INFO = {
  3: {
    name: 'Low Octave',
    color: '#ef4444',
    range: ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
  },
  4: {
    name: 'Middle Octave',
    color: '#3b82f6', 
    range: ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4']
  },
  5: {
    name: 'High Octave',
    color: '#10b981',
    range: ['C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5']
  }
};

// Music theory helpers
export const NOTE_NAMES = {
  'C': 'Do',
  'C#': 'Do#',
  'D': 'Re', 
  'D#': 'Re#',
  'E': 'Mi',
  'F': 'Fa',
  'F#': 'Fa#',
  'G': 'Sol',
  'G#': 'Sol#',
  'A': 'La',
  'A#': 'La#',
  'B': 'Si'
};

export const CHORD_PATTERNS = {
  'major': [0, 4, 7],
  'minor': [0, 3, 7],
  'diminished': [0, 3, 6],
  'augmented': [0, 4, 8],
  'sus2': [0, 2, 7],
  'sus4': [0, 5, 7],
  'major7': [0, 4, 7, 11],
  'minor7': [0, 3, 7, 10],
  'dominant7': [0, 4, 7, 10]
};

export const SCALE_PATTERNS = {
  'major': [0, 2, 4, 5, 7, 9, 11],
  'minor': [0, 2, 3, 5, 7, 8, 10],
  'pentatonic': [0, 2, 4, 7, 9],
  'blues': [0, 3, 5, 6, 7, 10],
  'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

// Visual settings for different octaves
export const OCTAVE_VISUAL_CONFIG = {
  3: {
    whiteKeyGradient: 'from-red-50 to-red-100',
    whiteKeyPressedGradient: 'from-red-500 to-red-600',
    blackKeyGradient: 'from-red-900 to-red-800',
    blackKeyPressedGradient: 'from-red-600 to-red-700',
    indicatorColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)'
  },
  4: {
    whiteKeyGradient: 'from-blue-50 to-blue-100', 
    whiteKeyPressedGradient: 'from-blue-500 to-blue-600',
    blackKeyGradient: 'from-blue-900 to-blue-800',
    blackKeyPressedGradient: 'from-blue-600 to-blue-700',
    indicatorColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.6)'
  },
  5: {
    whiteKeyGradient: 'from-green-50 to-green-100',
    whiteKeyPressedGradient: 'from-green-500 to-green-600', 
    blackKeyGradient: 'from-green-900 to-green-800',
    blackKeyPressedGradient: 'from-green-600 to-green-700',
    indicatorColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)'
  }
};

// Audio settings
export const AUDIO_CONFIG = {
  defaultVolume: 0.7,
  attackTime: 0.01,
  decayTime: 0.1,
  sustainLevel: 0.3,
  releaseTime: 0.8,
  reverbWetness: 0.2,
  reverbDecay: 2.0
};

// Game scoring
export const SCORING_CONFIG = {
  basePointsPerKey: 10,
  perfectAccuracyBonus: 50,
  goodAccuracyBonus: 25,
  comboMultiplier: 1.1,
  octaveMultipliers: {
    3: 1.0,  // Base multiplier for low octave
    4: 1.2,  // Slightly higher for middle octave
    5: 1.5   // Highest for high octave
  }
};

// Utility functions
export const getOctaveFromNote = (note) => {
  const match = note.match(/(\d+)$/);
  return match ? parseInt(match[1]) : 4;
};

export const getNoteNameFromNote = (note) => {
  return note.replace(/\d+$/, '');
};

export const getFrequencyFromNote = (note) => {
  return NOTE_FREQUENCIES[note] || 440;
};

export const isBlackKey = (note) => {
  return note.includes('#') || note.includes('b');
};

export const getNextNote = (note) => {
  const noteIndex = PIANO_KEYS.indexOf(note);
  return noteIndex < PIANO_KEYS.length - 1 ? PIANO_KEYS[noteIndex + 1] : note;
};

export const getPreviousNote = (note) => {
  const noteIndex = PIANO_KEYS.indexOf(note);
  return noteIndex > 0 ? PIANO_KEYS[noteIndex - 1] : note;
};

export const getNotesInOctave = (octave) => {
  return PIANO_KEYS.filter(note => getOctaveFromNote(note) === octave);
};

export const getKeyboardKeyForNote = (note) => {
  const keyCode = NOTE_TO_KEY[note];
  return keyCode ? keyCode.replace('Key', '').replace('Digit', '') : null;
};

// Staff position calculations for music notation
export const getStaffPosition = (note) => {
  const positions = {
    // Octave 3 - below staff
    'C3': 95, 'C#3': 92, 'D3': 90, 'D#3': 87, 'E3': 85, 'F3': 82,
    'F#3': 80, 'G3': 77, 'G#3': 75, 'A3': 72, 'A#3': 70, 'B3': 67,
    
    // Octave 4 - on staff
    'C4': 65, 'C#4': 62, 'D4': 60, 'D#4': 57, 'E4': 55, 'F4': 52,
    'F#4': 50, 'G4': 47, 'G#4': 45, 'A4': 42, 'A#4': 40, 'B4': 37,
    
    // Octave 5 - above staff
    'C5': 35, 'C#5': 32, 'D5': 30, 'D#5': 27, 'E5': 25, 'F5': 22,
    'F#5': 20, 'G5': 17, 'G#5': 15, 'A5': 12, 'A#5': 10, 'B5': 7
  };
  
  return positions[note] || 50;
};

// MIDI note numbers for advanced features
export const MIDI_NOTES = {
  'C3': 48, 'C#3': 49, 'D3': 50, 'D#3': 51, 'E3': 52, 'F3': 53,
  'F#3': 54, 'G3': 55, 'G#3': 56, 'A3': 57, 'A#3': 58, 'B3': 59,
  'C4': 60, 'C#4': 61, 'D4': 62, 'D#4': 63, 'E4': 64, 'F4': 65,
  'F#4': 66, 'G4': 67, 'G#4': 68, 'A4': 69, 'A#4': 70, 'B4': 71,
  'C5': 72, 'C#5': 73, 'D5': 74, 'D#5': 75, 'E5': 76, 'F5': 77,
  'F#5': 78, 'G5': 79, 'G#5': 80, 'A5': 81, 'A#5': 82, 'B5': 83
};

// Reverse MIDI mapping
export const MIDI_TO_NOTE = Object.fromEntries(
  Object.entries(MIDI_NOTES).map(([note, midi]) => [midi, note])
);

// Validation functions
export const isValidNote = (note) => {
  return PIANO_KEYS.includes(note);
};

export const isValidOctave = (octave) => {
  return [3, 4, 5].includes(octave);
};

export const isValidKeyCode = (keyCode) => {
  return Object.keys(KEY_MAPPINGS).includes(keyCode);
}; 