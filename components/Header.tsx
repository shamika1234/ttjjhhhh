import React from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  icon: React.ReactNode;
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ icon, title, onMenuClick }) => {
  return (
    <header className="flex-shrink-0 flex items-center h-16 px-4 sm:px-6 border-b border-gray-700/50 bg-gray-900/70 backdrop-blur-sm">
      <button 
        onClick={onMenuClick} 
        className="md:hidden mr-4 p-2 text-gray-400 hover:text-white"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>
      <div className="w-6 h-6 text-gray-400 mr-4 hidden sm:block">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
    </header>
  );
};

export default Header;