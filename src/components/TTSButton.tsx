import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { ttsService } from '../services/supabase';

interface TTSButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

const TTSButton: React.FC<TTSButtonProps> = ({ 
  text, 
  className = '', 
  size = 'sm',
  variant = 'minimal'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleTTS = async () => {
    if (isPlaying && audio) {
      // Stop current playback
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    if (!text.trim()) {
      setError('No text to convert');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const audioUrl = await ttsService.textToSpeech(text, {
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      });

      const newAudio = new Audio(audioUrl);
      
      newAudio.addEventListener('loadstart', () => {
        setIsLoading(true);
      });

      newAudio.addEventListener('canplay', () => {
        setIsLoading(false);
        setIsPlaying(true);
        newAudio.play();
      });

      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudio(null);
      });

      newAudio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setError('Playback failed');
        setIsLoading(false);
        setIsPlaying(false);
      });

      setAudio(newAudio);

    } catch (error) {
      console.error('TTS error:', error);
      setError(error instanceof Error ? error.message : 'TTS failed');
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={iconSizes[size]} />
        </motion.div>
      );
    }

    if (isPlaying) {
      return <VolumeX className={iconSizes[size]} />;
    }

    return <Volume2 className={iconSizes[size]} />;
  };

  const baseClasses = variant === 'minimal' 
    ? `${sizeClasses[size]} rounded-md hover:bg-white/60 transition-all duration-200 flex items-center justify-center`
    : `${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border border-blue-200 transition-all duration-200 flex items-center justify-center`;

  return (
    <div className="relative">
      <motion.button
        onClick={handleTTS}
        disabled={isLoading}
        className={`${baseClasses} ${className} ${
          error ? 'text-red-600' : isPlaying ? 'text-cyan-600' : 'text-slate-700 hover:text-slate-900'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={
          error ? error : 
          isPlaying ? 'Stop audio' : 
          isLoading ? 'Converting to speech...' : 
          'Listen to this text'
        }
      >
        {getButtonContent()}
      </motion.button>

      {/* Loading pulse animation */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Playing pulse animation */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.3, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Error indicator */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default TTSButton;