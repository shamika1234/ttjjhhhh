import React, { useState, useEffect } from 'react';
import { ChatMessage, Role } from '../types';
import { UserIcon, SparklesIcon, CopyIcon, CheckIcon, CloseIcon, ArrowsPointingOutIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
  isCodingChat?: boolean;
}

const CodeBlock: React.FC<{ language: string, code: string }> = ({ language, code }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopyCode = (source: 'inline' | 'modal') => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            // Ensure we reset body overflow on component unmount if modal was open
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const copyButton = (source: 'inline' | 'modal') => (
      <button 
          onClick={() => handleCopyCode(source)} 
          className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          aria-label={isCopied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      >
          {isCopied ? (
              <>
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
              </>
          ) : (
              <>
                  <CopyIcon className="w-4 h-4" />
                  <span>Copy code</span>
              </>
          )}
      </button>
    );

    return (
      <>
        <div className="bg-black/50 rounded-lg my-2 overflow-hidden border border-blue-900/30">
            <div className="flex justify-between items-center px-4 py-1.5 bg-gray-800/60 text-xs text-gray-400">
                <div className="flex items-center gap-3">
                    <span className="font-sans font-semibold uppercase tracking-wider">{language || 'code'}</span>
                    {copyButton('inline')}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="p-1 hover:bg-gray-700/50 rounded" aria-label="View full code">
                  <ArrowsPointingOutIcon className="w-4 h-4 text-gray-400" />
                </button>
            </div>
            <pre className="p-4 overflow-x-auto code-block-scrollbar whitespace-pre">
                <code className="text-sm font-mono text-cyan-300">{code}</code>
            </pre>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col bg-gray-900/90 border border-gray-700 rounded-lg shadow-2xl">
              <div className="flex-shrink-0 flex justify-between items-center px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-semibold uppercase tracking-wider text-gray-400 text-sm">{language || 'code'}</span>
                    {copyButton('modal')}
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full" aria-label="Close code view">
                    <CloseIcon />
                  </button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <pre className="whitespace-pre">
                  <code className="text-sm font-mono text-cyan-300">{code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </>
    );
};

const Message: React.FC<MessageProps> = ({ message, isCodingChat }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isModel = message.role === Role.MODEL;
  const hasCode = /```/.test(message.content);

  const containerClasses = `flex items-start gap-3 sm:gap-4 animate-fade-in group relative`;
  const messageClasses = `px-4 sm:px-5 py-3 rounded-2xl ${
    isModel
      ? 'bg-gray-700/50 text-gray-300 rounded-tl-none max-w-xl sm:max-w-2xl md:max-w-3xl'
      : 'bg-blue-600 text-white rounded-br-none ml-auto max-w-xl'
  }`;

  const iconClasses = `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
    isModel ? 'bg-gray-700 text-blue-400' : 'bg-blue-600 text-white'
  }`;

  const handleCopy = () => {
    if (isModel && message.content) {
      navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  const renderContent = () => {
    if (message.isImage) {
        return <img src={message.content} alt="Generated" className="rounded-lg max-w-full h-auto" />;
    }
    
    // Regex to handle language identifiers with various characters
    const codeBlockRegex = /```(\S*)\n([\s\S]*?)```/g;
    const parts = message.content.split(codeBlockRegex);

    if (parts.length <= 1) {
        return <p className="whitespace-pre-wrap">{message.content}</p>;
    }

    return parts.map((part, index) => {
        // Based on split's behavior with capturing groups, language is at index 1, 4, 7... and code is at 2, 5, 8...
        if ((index - 1) % 3 === 0) { // language
            const language = part;
            const codeContent = parts[index + 1] || '';
            return <CodeBlock key={index} language={language} code={codeContent.trim()} />;
        }
        if ((index - 2) % 3 === 0) { // code, already rendered with language
            return null;
        }
        if (part) { // plain text
            return <p key={index} className="whitespace-pre-wrap">{part}</p>;
        }
        return null;
    });
  };
  
  // In coding chat, AI messages are always full-width to prevent resizing during streaming.
  // In other chats, apply w-fit for non-code text for compactness.
  const modelWidthClass = isCodingChat || hasCode ? '' : 'w-fit';

  return (
    <div className={`${containerClasses} ${isModel ? '' : 'flex-row-reverse'}`}>
      <div className={iconClasses}>
        {isModel ? <SparklesIcon className="w-5 h-5"/> : <UserIcon className="w-5 h-5"/>}
      </div>
      <div className={`${messageClasses} ${isModel ? modelWidthClass : ''}`}>
        <div className="prose prose-invert prose-sm max-w-none">
          {renderContent()}
        </div>
      </div>
      {isModel && !message.isImage && message.content && !hasCode && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-0 md:opacity-0 md:group-hover:opacity-100 p-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/80 transition-opacity text-gray-400 hover:text-gray-200"
          aria-label={isCopied ? 'Copied' : 'Copy text'}
        >
          {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
};

export default Message;