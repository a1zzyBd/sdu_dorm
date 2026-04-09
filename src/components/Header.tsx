import React, { useState, useEffect } from 'react';
import {GlobeIcon } from './Icons';
import { PageNav } from './PageNav';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-b-2xl' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex justify-between items-center text-xs font-medium">
          <button onClick={() => onNavigate('home')}>
            <img src="/sduLogo.png" alt="SDU Logo" className="h-16 sm:h-20" />
          </button>
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('login')} className="hover:text-[#ED9A71] text-base">Log in</button>
            <button className="flex items-center space-x-1 border border-[#2C3E50] rounded-full px-2 py-1 text-base hover:bg-[#2C3E50] hover:text-white">
              <GlobeIcon className="h-3 w-3" />
              <span>EN</span>
            </button>
          </div>
        </div>
        <div className="-mt-4">
          <PageNav />
        </div>
      </div>
    </header>
  );
};