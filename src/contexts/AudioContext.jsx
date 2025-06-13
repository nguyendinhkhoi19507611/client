//  Audio management context
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { NOTE_FREQUENCIES } from '../utils/pianoConstants';

// Audio Context
const AudioContext = createContext();

// Audio Actions
const AUDIO_ACTIONS = {
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  SET_PLAYING: 'SET_PLAYING',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED',
  SET_BACKGROUND_MUSIC: 'SET_BACKGROUND_MUSIC'
};

// Initial State
const initialState = {
  volume: 70,
  isMuted: false,
  isPlaying: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  currentNotes: new Set(),
  backgroundMusic: null
};

// Audio Reducer
const audioReducer = (state, action) => {
  switch (action.type) {
    case AUDIO_ACTIONS.SET_VOLUME:
      return {
        ...state,
        volume: action.payload
      };

    case AUDIO_ACTIONS.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted
      };

    case AUDIO_ACTIONS.SET_PLAYING:
      return {
        ...state,
        isPlaying: action.payload
      };

    case AUDIO_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case AUDIO_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case AUDIO_ACTIONS.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload,
        isLoading: false
      };

    case AUDIO_ACTIONS.SET_BACKGROUND_MUSIC:
      return {
        ...state,
        backgroundMusic: action.payload
      };

    default:
      return state;
  }
};

// Audio Provider Component
export const AudioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  
  // Audio engine refs
  const synthRef = React.useRef(null);
  const reverbRef = React.useRef(null);
  const activeNotesRef = React.useRef(new Map());
  const backgroundPlayerRef = React.useRef(null);

  // Initialize audio engine
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        dispatch({ type: AUDIO_ACTIONS.SET_LOADING, payload: true });

        // Create reverb effect
        reverbRef.current = new Tone.Reverb({
          decay: 2,
          wet: 0.3
        }).toDestination();

        // Create piano synth
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'triangle'
          },
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1
          }
        }).connect(reverbRef.current);

        // Create background music player
        backgroundPlayerRef.current = new Tone.Player().toDestination();

        // Set initial volume
        synthRef.current.volume.value = Tone.gainToDb(state.volume / 100);
        backgroundPlayerRef.current.volume.value = Tone.gainToDb(state.volume / 100);

        dispatch({ type: AUDIO_ACTIONS.SET_INITIALIZED, payload: true });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        dispatch({ type: AUDIO_ACTIONS.SET_ERROR, payload: error.message });
      }
    };

    initializeAudio();

    return () => {
      // Cleanup
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      if (backgroundPlayerRef.current) {
        backgroundPlayerRef.current.dispose();
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (synthRef.current) {
      const volumeValue = state.isMuted ? -Infinity : Tone.gainToDb(state.volume / 100);
      synthRef.current.volume.value = volumeValue;
    }
    if (backgroundPlayerRef.current) {
      const volumeValue = state.isMuted ? -Infinity : Tone.gainToDb(state.volume / 100);
      backgroundPlayerRef.current.volume.value = volumeValue;
    }
  }, [state.volume, state.isMuted]);

  // Play note function
  const playNote = useCallback(async (note, velocity = 0.8, duration = '8n') => {
    if (!state.isInitialized || !synthRef.current) return;

    try {
      // Start Tone.js context if needed
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      const frequency = NOTE_FREQUENCIES[note];
      if (!frequency) {
        console.warn(`Unknown note: ${note}`);
        return;
      }

      // Stop any existing note
      if (activeNotesRef.current.has(note)) {
        const existingNote = activeNotesRef.current.get(note);
        synthRef.current.triggerRelease(existingNote.frequency);
        activeNotesRef.current.delete(note);
      }

      // Play new note
      synthRef.current.triggerAttack(frequency, undefined, velocity);
      
      // Store active note
      activeNotesRef.current.set(note, {
        frequency,
        startTime: Tone.now()
      });

      dispatch({ type: AUDIO_ACTIONS.SET_PLAYING, payload: true });

    } catch (error) {
      console.error('Failed to play note:', error);
    }
  }, [state.isInitialized]);

  // Stop note function
  const stopNote = useCallback((note) => {
    if (!state.isInitialized || !synthRef.current) return;

    try {
      const activeNote = activeNotesRef.current.get(note);
      if (activeNote) {
        synthRef.current.triggerRelease(activeNote.frequency);
        activeNotesRef.current.delete(note);
      }

      // Update playing state
      if (activeNotesRef.current.size === 0) {
        dispatch({ type: AUDIO_ACTIONS.SET_PLAYING, payload: false });
      }
    } catch (error) {
      console.error('Failed to stop note:', error);
    }
  }, [state.isInitialized]);

  // Stop all notes
  const stopAllNotes = useCallback(() => {
    if (!state.isInitialized || !synthRef.current) return;

    try {
      synthRef.current.releaseAll();
      activeNotesRef.current.clear();
      dispatch({ type: AUDIO_ACTIONS.SET_PLAYING, payload: false });
    } catch (error) {
      console.error('Failed to stop all notes:', error);
    }
  }, [state.isInitialized]);

  // Set volume
  const setVolume = useCallback((volume) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    dispatch({ type: AUDIO_ACTIONS.SET_VOLUME, payload: clampedVolume });
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    dispatch({ type: AUDIO_ACTIONS.TOGGLE_MUTE });
  }, []);

  // Play chord
  const playChord = useCallback(async (notes, velocity = 0.8) => {
    if (!Array.isArray(notes)) return;

    try {
      await Promise.all(notes.map(note => playNote(note, velocity)));
    } catch (error) {
      console.error('Failed to play chord:', error);
    }
  }, [playNote]);

  // Play melody
  const playMelody = useCallback(async (melody, tempo = 120) => {
    if (!Array.isArray(melody)) return;

    const noteLength = 60 / tempo; // seconds per beat

    for (const item of melody) {
      if (typeof item === 'string') {
        // Simple note
        await playNote(item);
        await new Promise(resolve => setTimeout(resolve, noteLength * 1000));
        stopNote(item);
      } else if (item.note) {
        // Note with duration
        const duration = item.duration || 1;
        await playNote(item.note, item.velocity);
        await new Promise(resolve => setTimeout(resolve, noteLength * duration * 1000));
        stopNote(item.note);
      } else if (item.rest) {
        // Rest
        await new Promise(resolve => setTimeout(resolve, noteLength * item.rest * 1000));
      }
    }
  }, [playNote, stopNote]);

  // Load and play audio file
  const loadAudioFile = useCallback(async (url) => {
    try {
      dispatch({ type: AUDIO_ACTIONS.SET_LOADING, payload: true });
      
      const player = new Tone.Player(url).toDestination();
      await Tone.loaded();
      
      dispatch({ type: AUDIO_ACTIONS.SET_LOADING, payload: false });
      return player;
    } catch (error) {
      console.error('Failed to load audio file:', error);
      dispatch({ type: AUDIO_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Apply effects
  const applyEffect = useCallback((effectType, parameters = {}) => {
    if (!synthRef.current) return;

    try {
      switch (effectType) {
        case 'reverb':
          if (reverbRef.current) {
            reverbRef.current.set(parameters);
          }
          break;
        case 'distortion':
          const distortion = new Tone.Distortion(parameters.amount || 0.4);
          synthRef.current.connect(distortion);
          distortion.toDestination();
          break;
        case 'delay':
          const delay = new Tone.PingPongDelay(parameters.time || '8n', parameters.feedback || 0.3);
          synthRef.current.connect(delay);
          delay.toDestination();
          break;
        default:
          console.warn(`Unknown effect type: ${effectType}`);
      }
    } catch (error) {
      console.error('Failed to apply effect:', error);
    }
  }, []);

  // Get audio context info
  const getAudioInfo = useCallback(() => {
    return {
      isInitialized: state.isInitialized,
      isPlaying: state.isPlaying,
      volume: state.volume,
      isMuted: state.isMuted,
      activeNotes: Array.from(activeNotesRef.current.keys()),
      contextState: Tone.context.state
    };
  }, [state]);

  // Play background music
  const playBackgroundMusic = useCallback(async (url) => {
    if (!state.isInitialized || !backgroundPlayerRef.current) return;

    try {
      // Start Tone.js context if needed
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // Stop current music if playing
      if (backgroundPlayerRef.current.state === 'started') {
        backgroundPlayerRef.current.stop();
      }

      // Load and play new music
      await backgroundPlayerRef.current.load(url);
      backgroundPlayerRef.current.start();
      dispatch({ type: AUDIO_ACTIONS.SET_BACKGROUND_MUSIC, payload: url });

    } catch (error) {
      console.error('Failed to play background music:', error);
      dispatch({ type: AUDIO_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.isInitialized]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundPlayerRef.current) {
      backgroundPlayerRef.current.stop();
      dispatch({ type: AUDIO_ACTIONS.SET_BACKGROUND_MUSIC, payload: null });
    }
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    playNote,
    stopNote,
    stopAllNotes,
    setVolume,
    toggleMute,
    playChord,
    playMelody,
    loadAudioFile,
    applyEffect,
    playBackgroundMusic,
    stopBackgroundMusic,
    
    // Getters
    getAudioInfo,
    
    // Refs (for advanced usage)
    synthRef: synthRef.current,
    reverbRef: reverbRef.current
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

// Custom Hook
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;