import React from 'react';
import { motion } from 'framer-motion';

interface PortfolioItem {
  id: number;
  title: string;
  date: string;
  description: string;
  videoUrl: string;
  category: string;
}

interface ProjectInfoProps {
  item: PortfolioItem;
  currentIndex: number;
  total: number;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ item, currentIndex, total }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-end justify-between"
    >
      {/* Project details */}
      <div className="flex-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-purple-300 text-sm font-medium mb-2 tracking-wider uppercase"
        >
          {item.date}
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white text-3xl font-bold mb-3 tracking-tight"
        >
          {item.title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-white/90 text-base max-w-lg leading-relaxed"
        >
          {item.description}
        </motion.p>
        
        {/* Progress indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 flex items-center gap-3"
        >
          <span className="text-white/60 text-sm font-medium">
            {currentIndex + 1} of {total}
          </span>
          <div className="flex-1 max-w-32 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Enhanced action buttons */}
      <div className="ml-8 flex flex-col gap-3">
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 text-white font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </motion.button>
        
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProjectInfo;
