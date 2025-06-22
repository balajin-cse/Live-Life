import React from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, Settings, Phone } from 'lucide-react'

interface SessionControlsProps {
  isRecording: boolean
  isVideoEnabled: boolean
  onToggleRecording: () => void
  onToggleVideo: () => void
}

const SessionControls: React.FC<SessionControlsProps> = ({
  isRecording,
  isVideoEnabled,
  onToggleRecording,
  onToggleVideo,
}) => {
  return (
    <div className="mt-4 glass-effect rounded-2xl p-4">
      <div className="flex justify-center space-x-4">
        {/* Microphone Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleRecording}
          className={`p-3 rounded-full transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </motion.button>

        {/* Video Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleVideo}
          className={`p-3 rounded-full transition-all duration-200 ${
            isVideoEnabled
              ? 'bg-primary-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </motion.button>

        {/* End Session */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
        >
          <Phone className="h-5 w-5 rotate-[135deg]" />
        </motion.button>
      </div>
    </div>
  )
}

export default SessionControls