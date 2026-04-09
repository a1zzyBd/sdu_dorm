import React from 'react';
import { Instagram, Send, MessageCircle, Phone, Mail } from 'lucide-react';

// Custom SVG component for the filled, ringing phone icon
const FilledPhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        {/* Ringing waves */}
        <path d="M18 8.01c0-1.3-.49-2.48-1.32-3.32a.75.75 0 00-1.06 1.06A3.49 3.49 0 0117.25 8a.75.75 0 001.5 0z" />
        <path d="M20.75 8.01c0-2.84-1.1-5.38-2.9-7.18a.75.75 0 10-1.06 1.06c1.56 1.56 2.41 3.7 2.41 5.92a.75.75 0 001.5 0z" />
        {/* Filled Phone Body */}
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.279-.087.431l4.108 7.394c.077.152.23.256.43.179l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C6.55 22.5 1.5 17.45 1.5 10.75V4.5z" clipRule="evenodd" />
    </svg>
);


export const Footer = () => (
  <footer className="bg-[#2C3E50] text-white py-12 rounded-t-[90px]">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap md:flex-nowrap justify-between items-center gap-y-10 gap-x-8">
      
      {/* Left Section: Logo and Info */}
      <div className="space-y-4 text-base max-w-xs">
        <img src="/sduLogoWhite.png" alt="SDU University Logo" className="h-16" />
        <p className="pt-4">&copy; 2025 All rights reserved</p>
        <p>Almaty region, Karasai district.<br/>040900, city of Kaskelen, st. Abylai Khan 1/1</p>
      </div>

      {/* Middle Section: Follow Us & Contacts */}
      <div className="shrink-0">
        <h4 className="font-bold tracking-widest text-base mb-4">FOLLOW US</h4>
        <div className="flex space-x-4 mb-6">
            <a href="#" aria-label="Instagram" className="p-1 hover:opacity-75"><Instagram size={24} /></a>
            <a href="#" aria-label="Telegram" className="p-1 hover:opacity-75"><Send size={24} /></a>
            <a href="#" aria-label="WhatsApp" className="p-1 hover:opacity-75"><MessageCircle size={24} /></a>
        </div>
        <div className="space-y-2 text-base">
          <p className="flex items-center space-x-3">
            <Phone size={16} className="shrink-0" />
            <a href="tel:+77273079565" className="hover:opacity-75 underline underline-offset-4">+7 (727) 307 95 65</a>
          </p>
          <p className="flex items-center space-x-3">
            <Mail size={16} className="shrink-0" />
            <a href="mailto:info@sdu.dorm.kz" className="hover:opacity-75 underline underline-offset-4">info@sdu.dorm.kz</a>
          </p>
        </div>
      </div>

      {/* Right Section: Call Button */}
      <div>
         <a 
            href="tel:+77273079565" 
            aria-label="Call us" 
            className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[#2C3E50] transition-colors duration-300"
        >
            <FilledPhoneIcon className="h-7 w-7"/>
         </a>
      </div>

    </div>
  </footer>
);