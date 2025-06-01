import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioItem {
  id: number;
  title: string;
  date: string;
  description: string;
  videoUrl: string;
  category: string;
}

interface VideoPlayerProps {
  item: PortfolioItem;
  onNext: () => void;
  onPrevious: () => void;
  direction: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onNext, onPrevious, direction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Video Player Previous clicked');
    onPrevious();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Video Player Next clicked');
    onNext();
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      // Auto-play the video when it loads
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1200 : -1200,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1200 : -1200,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  const expandedVariants = {
    normal: {
      scale: 1,
      zIndex: 1,
      width: "100%",
      height: "100%",
      x: 0,
      y: 0
    },
    expanded: {
      scale: 1,
      zIndex: 50,
      width: "60vh",
      height: "90vh",
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <>
      {isExpanded && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleExpanded}
            variants={expandedVariants}
            animate="expanded"
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={item.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.4 }
                }}
                className="absolute inset-0"
              >
                {/* Video container with enhanced styling */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-3xl overflow-hidden">
                  <video 
                    ref={videoRef}
                    src={item.videoUrl}
                    className="w-full h-full object-contain"
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                  />
                  
                  {/* Enhanced gradient overlay - lighter when expanded */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-pink-900/10"></div>
                  
                  {/* Close button when expanded */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={toggleExpanded}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-300 z-20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>

                  {/* Play/Pause button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button 
                      onClick={togglePlay}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-500 opacity-0 hover:opacity-100 hover:bg-white/20 hover:border-white/50 shadow-2xl"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </motion.button>
                  </div>

                  {/* Enhanced category badge */}
                  <div className="absolute top-6 left-6">
                    <motion.span 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium shadow-lg"
                    >
                      {item.category}
                    </motion.span>
                  </div>

                  {/* Video duration and progress */}
                  {videoDuration > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-6 right-6"
                    >
                      <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3">
                        <span className="text-white text-sm font-medium">
                          {formatTime(currentTime)} / {formatTime(videoDuration)}
                        </span>
                        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                            style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {!isExpanded && (
        <motion.div 
          className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer perspective-1000"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={toggleExpanded}
          variants={expandedVariants}
          animate="normal"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={item.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.4 },
                rotateY: { duration: 0.4 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  handleNext(e as any);
                } else if (swipe > swipeConfidenceThreshold) {
                  handlePrevious(e as any);
                }
              }}
              className="absolute inset-0"
            >
              {/* Video container with enhanced styling */}
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-3xl overflow-hidden">
                <video 
                  ref={videoRef}
                  src={item.videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                />
                
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20"></div>
                
                {/* Hover overlay with expand hint */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/20 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 text-white font-medium"
                      >
                        Click to expand
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Play/Pause button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button 
                    onClick={togglePlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-500 ${
                      isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                    } hover:bg-white/20 hover:border-white/50 shadow-2xl`}
                  >
                    {isPlaying ? (
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </motion.button>
                </div>

                {/* Enhanced category badge */}
                <div className="absolute top-6 left-6">
                  <motion.span 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium shadow-lg"
                  >
                    {item.category}
                  </motion.span>
                </div>

                {/* Video duration and progress - shown when hovered */}
                <AnimatePresence>
                  {isHovered && videoDuration > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-6 right-6"
                    >
                      <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3">
                        <span className="text-white text-sm font-medium">
                          {formatTime(currentTime)} / {formatTime(videoDuration)}
                        </span>
                        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                            style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Creative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full"></div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced navigation arrows */}
          {isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={handlePrevious}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-300 shadow-xl z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-300 shadow-xl z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}
        </motion.div>
      )}

      {/* Backdrop overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleExpanded}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoPlayer;
