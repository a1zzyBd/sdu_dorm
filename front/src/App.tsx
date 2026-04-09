import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { BuildingImage } from './components/BuildingImage';
import { GallerySection } from './components/GallerySection';
import { Services } from './components/Services';
import { DetailsSection } from './components/DetailsSection';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { storage } from './utils/storage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    // Check if user is logged in on mount (check both localStorage and sessionStorage)
    const token = storage.getItem('access_token');
    const user = storage.getItem('user');
    return (token && user) ? 'homepage' : 'home';
  });

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  if (currentPage === 'login') {
    return (
      <AuthProvider>
        <LoginPage onNavigate={navigate} />
      </AuthProvider>
    );
  }

  if (currentPage === 'homepage') {
    return (
      <AuthProvider>
        <HomePage onNavigate={navigate} />
      </AuthProvider>
    );
  }
  
  return (
    <AuthProvider>
      <div className="text-[#2C3E50] font-sans">
        <Header onNavigate={navigate} />
        <main>
          <Hero />
          <About />
          <BuildingImage />
          <Services />
          <div className="mt-12">
            <GallerySection />
          </div>
          <DetailsSection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;