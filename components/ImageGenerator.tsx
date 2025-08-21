import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { PhotoIcon, PaperAirplaneIcon, SparklesIcon, DownloadIcon } from './Icons';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setImageUrl('');
    setError('');
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    // Create a filename from the prompt or use a default
    const filename = prompt.trim().toLowerCase().replace(/\s+/g, '-').substring(0, 50) || 'sinhala-gpt-image';
    link.download = `${filename}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center justify-center min-h-full p-4 sm:p-6 text-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center mb-4 text-3xl font-bold">
              <SparklesIcon className="w-8 h-8 mr-3 text-blue-400"/>
              <h1 className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
                  AI Image Generator
              </h1>
          </div>
          <p className="text-gray-400 mb-8">Bring your creative ideas to life with a simple text prompt.</p>

          <div className="mb-8 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="relative">
              {isLoading ? (
                <div className="w-full aspect-square flex flex-col items-center justify-center bg-gray-800 rounded-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-400">Generating your masterpiece...</p>
                </div>
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} alt={prompt} className="w-full h-auto rounded-lg shadow-2xl shadow-black/50" />
                  <button
                    onClick={handleDownload}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/75 transition-colors"
                    aria-label="Download image"
                  >
                    <DownloadIcon className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <div className="w-full aspect-square flex flex-col items-center justify-center bg-gray-800/80 border-2 border-dashed border-gray-700 rounded-lg">
                  <PhotoIcon className="w-24 h-24 text-gray-600 mb-4" />
                  <p className="text-gray-400">Your generated image will appear here</p>
                </div>
              )}
            </div>
          </div>
          
          {error && <p className="text-red-400 mb-4 animate-shake">{error}</p>}
          
          <form onSubmit={handleGenerate} className="flex items-center space-x-2 sm:space-x-4 bg-gray-800 border border-gray-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow duration-200">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none px-4 py-3"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-blue-600 text-white rounded-lg p-3 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
              aria-label="Generate Image"
            >
              {isLoading ? <LoadingSpinner size="h-6 w-6" /> : <PaperAirplaneIcon />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;