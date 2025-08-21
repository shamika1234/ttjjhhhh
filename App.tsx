import React, { useState, useCallback, useEffect } from 'react';
import { Feature } from './types';
import { SYSTEM_INSTRUCTION_CODING, SYSTEM_INSTRUCTION_EDUCATION, SYSTEM_INSTRUCTION_GENERAL } from './constants';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ImageGenerator from './components/ImageGenerator';
import Header from './components/Header';
import { CodeIcon, ChatBubbleLeftRightIcon, AcademicCapIcon, PhotoIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
          splash.style.display = 'none';
        }, 500); // Match CSS transition duration
      }, 500); // Minimum splash screen time
    }
  }, []);

  const renderFeature = useCallback(() => {
    switch (activeFeature) {
      case Feature.CHAT:
        return <ChatWindow key={Feature.CHAT} systemInstruction={SYSTEM_INSTRUCTION_GENERAL} placeholder="Ask me anything in Sinhala, Tamil, or English..." />;
      case Feature.IMAGE:
        return <ImageGenerator />;
      case Feature.CODING:
        return <ChatWindow key={Feature.CODING} systemInstruction={SYSTEM_INSTRUCTION_CODING} placeholder="Ask me a coding question..." />;
      case Feature.EDUCATION:
        return <ChatWindow key={Feature.EDUCATION} systemInstruction={SYSTEM_INSTRUCTION_EDUCATION} placeholder="Ask me an educational question..." />;
      default:
        return <ChatWindow key="default" systemInstruction={SYSTEM_INSTRUCTION_GENERAL} placeholder="Ask me anything..." />;
    }
  }, [activeFeature]);

  const getHeaderInfo = useCallback(() => {
    switch(activeFeature) {
      case Feature.CHAT:
        return { icon: <ChatBubbleLeftRightIcon />, title: "General Chat" };
      case Feature.IMAGE:
        return { icon: <PhotoIcon />, title: "Image Generator" };
      case Feature.CODING:
        return { icon: <CodeIcon />, title: "Coding Assistant" };
      case Feature.EDUCATION:
        return { icon: <AcademicCapIcon />, title: "Education Assistant" };
      default:
        return { icon: <ChatBubbleLeftRightIcon />, title: "Sinhala GPT" };
    }
  }, [activeFeature]);

  const { icon, title } = getHeaderInfo();

  const handleFeatureSelect = (feature: Feature) => {
    setActiveFeature(feature);
    setIsSidebarOpen(false); // Close sidebar on selection
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      <Sidebar 
        activeFeature={activeFeature} 
        setActiveFeature={handleFeatureSelect}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col h-full transition-all duration-300">
        <Header icon={icon} title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-hidden">
          {renderFeature()}
        </div>
      </main>
    </div>
  );
};

export default App;