import React from 'react';
import { SparklesIcon } from './Icons';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-700 text-blue-400">
        <SparklesIcon className="w-5 h-5"/>
      </div>
      <div className="max-w-xl px-5 py-4 rounded-2xl rounded-tl-none bg-gray-700/50">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;