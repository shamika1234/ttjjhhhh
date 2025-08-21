import React from 'react';
import { Feature } from '../types';
import { APP_NAME } from '../constants';
import { ChatBubbleLeftRightIcon, PhotoIcon, CodeIcon, AcademicCapIcon, SparklesIcon, CloseIcon } from './Icons';

interface SidebarProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  label: Feature;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const baseClasses = "flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out cursor-pointer";
  const activeClasses = "bg-blue-500/20 text-blue-400";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200";

  return (
    <li onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {React.cloneElement(icon, { className: 'w-6 h-6' })}
      <span className="ml-4">{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeFeature, setActiveFeature, isOpen, setIsOpen }) => {
  return (
    <nav className={`absolute md:relative inset-y-0 left-0 z-30 w-64 h-full bg-gray-800/50 backdrop-blur-lg border-r border-gray-700/50 p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold ml-3 bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
            {APP_NAME}
            </h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white">
            <CloseIcon />
        </button>
      </div>
      <ul className="space-y-2">
        <NavItem
          icon={<ChatBubbleLeftRightIcon />}
          label={Feature.CHAT}
          isActive={activeFeature === Feature.CHAT}
          onClick={() => setActiveFeature(Feature.CHAT)}
        />
        <NavItem
          icon={<PhotoIcon />}
          label={Feature.IMAGE}
          isActive={activeFeature === Feature.IMAGE}
          onClick={() => setActiveFeature(Feature.IMAGE)}
        />
        <NavItem
          icon={<CodeIcon />}
          label={Feature.CODING}
          isActive={activeFeature === Feature.CODING}
          onClick={() => setActiveFeature(Feature.CODING)}
        />
        <NavItem
          icon={<AcademicCapIcon />}
          label={Feature.EDUCATION}
          isActive={activeFeature === Feature.EDUCATION}
          onClick={() => setActiveFeature(Feature.EDUCATION)}
        />
      </ul>
    </nav>
  );
};

export default Sidebar;