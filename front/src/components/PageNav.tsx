import { useState, useEffect } from 'react';

export const PageNav = () => {
  const [activeLink, setActiveLink] = useState('Welcome');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'welcome', name: 'Welcome' },
        { id: 'about', name: 'About' },
        { id: 'services', name: 'Services' },
        { id: 'contacts', name: 'Contacts' },
      ];

      // Get current scroll position with offset for header
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Find which section we're currently in
      let currentSection = 'Welcome';
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          
          if (scrollPosition >= absoluteTop) {
            currentSection = section.name;
          }
        }
      }

      if (activeLink !== currentSection) {
        setActiveLink(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeLink]);

  const getLinkClass = (name: string) => {
    return activeLink === name
      ? 'bg-[#ED9A71] text-white px-4 py-1.5 rounded-full text-sm'
      : 'hover:text-[#ED9A71] text-sm';
  };

  return (
    <nav className="flex justify-end items-center space-x-8 text-base font-bold">
        <a href="#welcome" className={getLinkClass('Welcome')}>Welcome</a>
        <a href="#about" className={getLinkClass('About')}>About</a>
        <a href="#services" className={getLinkClass('Services')}>Services</a>
        <a href="#contacts" className={getLinkClass('Contacts')}>Contacts</a>
    </nav>
  );
};