import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import NavigationControls from '../components/NavigationControls';
import ProjectInfo from '../components/ProjectInfo';
import ChatBot from '../components/ChatBot';

// Kilah Oliver's Creative Portfolio Data
const portfolioItems = [
  {
    id: 1,
    title: "TGI Intro",
    date: "2024 - Featured",
    description: "Dynamic introduction showcasing creative vision and brand identity through compelling visual storytelling",
    videoUrl: "/TGINtro.mp4",
    category: "Brand Identity"
  },
  {
    id: 2,
    title: "Raleigh Event",
    date: "2024 - Live Coverage",
    description: "Professional event documentation capturing the energy and atmosphere of live experiences",
    videoUrl: "/Raleigh Event.mov",
    category: "Event Coverage"
  },
  {
    id: 3,
    title: "Open Butterfly Jewelry",
    date: "2024 - Commercial",
    description: "Elegant jewelry showcase highlighting craftsmanship and beauty through artistic cinematography",
    videoUrl: "/Open Butterfly Jewelry .mov",
    category: "Product Showcase"
  },
  {
    id: 4,
    title: "Lucy Lu's Boutique",
    date: "2024 - Fashion",
    description: "Fashion boutique presentation featuring style, elegance, and contemporary retail experience",
    videoUrl: "/Lucy Lu's Boutique.mov",
    category: "Fashion & Retail"
  },
  {
    id: 5,
    title: "Juicy Vybz",
    date: "2024 - Lifestyle",
    description: "Vibrant lifestyle content capturing energy, culture, and authentic brand personality",
    videoUrl: "/Juicy Vybz.mov",
    category: "Lifestyle Brand"
  },
  {
    id: 6,
    title: "Calming Candles Aromatherapy",
    date: "2024 - Wellness",
    description: "Serene wellness brand showcase emphasizing relaxation, mindfulness, and therapeutic experiences",
    videoUrl: "/Calming Candles Aromatherapy.mov",
    category: "Wellness & Lifestyle"
  },
  {
    id: 7,
    title: "A Great Day Candle Company",
    date: "2024 - Artisan",
    description: "Artisan candle craftsmanship highlighting quality, ambiance, and handmade excellence",
    videoUrl: "/A Great Day Candle Company.mov",
    category: "Artisan Craft"
  }
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    console.log('Next button clicked, current index:', currentIndex);
    setDirection(1);
    if (currentIndex < portfolioItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to first
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked, current index:', currentIndex);
    setDirection(-1);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(portfolioItems.length - 1); // Loop to last
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key);
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const currentItem = portfolioItems[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Enhanced background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-purple-900/30 to-black/60 z-10"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
        
        {/* Top navigation bar - Enhanced for Kilah Oliver */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <div className="text-white font-bold text-xl tracking-wide">
            Kilah Oliver
            <span className="block text-sm font-light text-purple-300 tracking-wider">Creative Portfolio</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 font-medium">
              View Gallery
            </button>
            <div className="relative">
              <img 
                src="/Photo.jpeg" 
                alt="Kilah Oliver Profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/50 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 hover:border-purple-400"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 hover:opacity-75 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Navigation controls - positioned prominently */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-30">
          <NavigationControls 
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentIndex={currentIndex}
            total={portfolioItems.length}
          />
        </div>

        {/* Main video container */}
        <div className="flex-1 flex items-center justify-center w-full max-w-6xl">
          <VideoPlayer 
            item={currentItem}
            onNext={handleNext}
            onPrevious={handlePrevious}
            direction={direction}
          />
        </div>

        {/* Bottom project info */}
        <div className="absolute bottom-6 left-6 right-6">
          <ProjectInfo 
            item={currentItem}
            currentIndex={currentIndex}
            total={portfolioItems.length}
          />
        </div>

        {/* Enhanced navigation dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-3">
            {portfolioItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log('Dot clicked, setting index to:', index);
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-125 shadow-lg shadow-purple-400/50' 
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI ChatBot */}
      <ChatBot currentItem={currentItem} />
    </div>
  );
};

export default Index;
