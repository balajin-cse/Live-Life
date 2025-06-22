import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2 } from 'lucide-react'

const VideoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative video-container bg-gradient-to-br from-primary-500/20 to-secondary-500/20 aspect-[4/3] max-w-lg mx-auto"
    >
      {/* Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
        {/* AI Avatar Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center animate-pulse-slow">
            <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>

        {/* Animated Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-64 h-64 rounded-full border-2 border-primary-400/30"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute w-80 h-80 rounded-full border-2 border-secondary-400/20"
          />
        </div>

        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </motion.button>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-white text-sm font-medium">AI Agent Active</span>
        </div>

        <div className="absolute top-4 right-4">
          <Volume2 className="h-5 w-5 text-white/70" />
        </div>

        {/* Bottom Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
          <h3 className="text-white font-semibold text-lg mb-1">Meet Your AI Companion</h3>
          <p className="text-white/80 text-sm">
            Experience face-to-face conversations with empathetic AI
          </p>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-xl animate-glow"></div>
    </motion.div>
  )
}

export default VideoPreview