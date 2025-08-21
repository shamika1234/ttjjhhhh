import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateChatStream } from '../services/geminiService';
import { ChatMessage, Role } from '../types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import VoiceInput from './VoiceInput';
import { PaperAirplaneIcon } from './Icons';
import { SYSTEM_INSTRUCTION_CODING } from '../constants';

interface ChatWindowProps {
  systemInstruction: string;
  placeholder: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ systemInstruction, placeholder }) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isCodingChat = systemInstruction === SYSTEM_INSTRUCTION_CODING;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: Role.USER, content: message };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInputValue('');
    setIsLoading(true);

    let fullResponse = '';
    const botMessage: ChatMessage = { role: Role.MODEL, content: '' };
    setHistory(prev => [...prev, botMessage]);

    try {
      const stream = generateChatStream(newHistory, message, systemInstruction);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setHistory(prev =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, content: fullResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        role: Role.MODEL,
        content: "Sorry, I couldn't process that. Please try again.",
      };
      setHistory(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [history, isLoading, systemInstruction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };
  
  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript);
    handleSendMessage(transcript);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 space-y-6">
        {history.map((msg, index) => (
          <Message key={index} message={msg} isCodingChat={isCodingChat} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 sm:p-4 bg-gray-900/70 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-4 bg-gray-800 border border-gray-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow duration-200">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none px-3 sm:px-4 py-2 max-h-40"
          />
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 text-white rounded-lg p-3 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 flex-shrink-0"
            aria-label="Send message"
          >
            <PaperAirplaneIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;