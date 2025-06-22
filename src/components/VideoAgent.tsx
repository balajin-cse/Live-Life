import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react'

interface VideoAgentProps {
  isEnabled: boolean
}

const VideoAgent: React.FC<VideoAgentProps> = ({ isEnabled }) => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    // Simulate AI speaking patterns
    const speakingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsSpeaking(true)
        setTimeout(() => setIsSpeaking(false), 2000 + Math.random() * 3000)
      }
    }, 5000)

    return () => clearInterval(speakingInterval)
  }, [])

  return (
    <div className="glass-effect rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-800 to-slate-900">
        <AnimatePresence>
          {isEnabled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* AI Avatar */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isSpeaking ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isSpeaking ? Infinity : 0,
                  }}
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center"
                >
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/40"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Speaking Animation */}
                <AnimatePresence>
                  {isSpeaking && (
                    <>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.3 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                        className="absolute inset-0 rounded-full border-2 border-primary-400"
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.8, opacity: 0.2 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: 0.1 }}
                        className="absolute inset-0 rounded-full border-2 border-secondary-400"
                      />
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Indicators */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-white text-xs font-medium">Live</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Mic className="h-4 w-4 text-white/70" />
                <Camera className="h-4 w-4 text-white/70" />
              </div>

              {/* AI Name */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="text-white font-semibold">AI Wellness Companion</h3>
                <p className="text-white/70 text-sm">
                  {isSpeaking ? 'Speaking...' : 'Listening...'}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-slate-800"
            >
              <div className="text-center">
                <CameraOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Video Disabled</p>
                <p className="text-gray-500 text-sm mt-2">
                  Enable video to see your AI companion
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default VideoAgent