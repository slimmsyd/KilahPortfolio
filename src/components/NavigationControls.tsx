import React from 'react';
import { motion } from 'framer-motion';

interface NavigationControlsProps {
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  total: number;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onNext,
  onPrevious,
  currentIndex,
  total
}) => {
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Navigation Previous clicked');
    onPrevious();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Navigation Next clicked');
    onNext();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Previous button */}
      <motion.button
        onClick={handlePrevious}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Enhanced progress indicator */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-1 h-16 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${((currentIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full bg-gradient-to-t from-purple-400 to-pink-400 rounded-full"
          />
        </div>
        <span className="text-white/70 text-xs font-medium tracking-wider">
          {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </motion.div>

      {/* Next button */}
      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default NavigationControls;
