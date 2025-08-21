import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon } from './Icons';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled: boolean;
}

// Check for SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'si-LK'; // Default to Sinhala, but can be changed
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(recognition);

  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    const handleResult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    const handleError = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    const handleEnd = () => {
        setIsListening(false);
    }

    rec.addEventListener('result', handleResult);
    rec.addEventListener('error', handleError);
    rec.addEventListener('end', handleEnd);

    return () => {
      rec.removeEventListener('result', handleResult);
      rec.removeEventListener('error', handleError);
      rec.removeEventListener('end', handleEnd);
    };
  }, [onTranscript]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
        alert("Sorry, your browser doesn't support voice recognition.");
        return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return null;
  }

  const buttonClasses = `p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
    isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-gray-700'
  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`;

  return (
    <button
      type="button"
      onClick={handleToggleListening}
      disabled={disabled}
      className={buttonClasses}
    >
      <MicrophoneIcon />
    </button>
  );
};

export default VoiceInput;