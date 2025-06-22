import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Loader2,
  AlertCircle,
  Settings
} from 'lucide-react';

interface TavusVideoAgentProps {
  videoStreamUrl?: string | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error?: string | null;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onSettings?: () => void;
}

const TavusVideoAgent: React.FC<TavusVideoAgentProps> = ({
  videoStreamUrl,
  isVideoEnabled,
  isAudioEnabled,
  isConnected,
  isLoading,
  error,
  onToggleVideo,
  onToggleAudio,
  onSettings,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideoStream, setShowVideoStream] = useState(false);

  // Handle video stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoStreamUrl || !isVideoEnabled || !isConnected) {
      setVideoError(null);
      setIsVideoLoaded(false);
      setShowVideoStream(false);
      return;
    }

    const loadVideo = async () => {
      try {
        setVideoError(null);
        setIsVideoLoaded(false);
        
        console.log('Attempting to load video stream:', videoStreamUrl);
        
        video.src = videoStreamUrl;
        video.muted = !isAudioEnabled;
        video.autoplay = true;
        video.playsInline = true;
        
        // Add event listeners
        video.onloadeddata = () => {
          console.log('Video data loaded successfully');
          setIsVideoLoaded(true);
          setShowVideoStream(true);
        };
        
        video.oncanplay = () => {
          console.log('Video can start playing');
          video.play().catch(console.error);
        };
        
        video.onerror = (e) => {
          console.error('Video error event:', e);
          setVideoError('Video stream unavailable');
          setShowVideoStream(false);
        };
        
        // Try to load the video
        await video.load();
        
      } catch (err) {
        console.error('Error loading video stream:', err);
        setVideoError('Video stream not available');
        setShowVideoStream(false);
      }
    };

    // Add a delay to allow the conversation to fully establish
    const timer = setTimeout(loadVideo, 2000);

    return () => {
      clearTimeout(timer);
      if (video) {
        video.pause();
        video.src = '';
        video.onloadeddata = null;
        video.oncanplay = null;
        video.onerror = null;
      }
    };
  }, [videoStreamUrl, isVideoEnabled, isAudioEnabled, isConnected]);

  // Handle audio toggle
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isAudioEnabled;
    }
  }, [isAudioEnabled]);

  const renderVideoContent = () => {
    if (error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="text-center p-6">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Connection Error</h3>
            <p className="text-gray-400 text-sm max-w-xs">{error}</p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-primary-400 mx-auto mb-4 animate-spin" />
            <p className="text-white font-medium">Connecting to AI Agent...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we establish the connection</p>
          </div>
        </div>
      );
    }

    if (!isVideoEnabled) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="text-center">
            <CameraOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Video Disabled</p>
            <p className="text-gray-500 text-sm mt-2">
              Enable video to see your AI companion
            </p>
          </div>
        </div>
      );
    }

    // Show video stream if available and loaded, otherwise show AI avatar
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Video Stream */}
        {showVideoStream && isVideoLoaded && videoStreamUrl && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            playsInline
            muted={!isAudioEnabled}
          />
        )}

        {/* AI Avatar Placeholder - shown when video is not available */}
        {(!showVideoStream || !isVideoLoaded || !videoStreamUrl) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center"
              >
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/40"></div>
                  </div>
                </div>
              </motion.div>

              {/* Animated Rings */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-primary-400/30"
              />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 rounded-full border-2 border-secondary-400/20"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-effect rounded-2xl overflow-hidden relative">
      <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-800 to-slate-900">
        {renderVideoContent()}

        {/* Status Indicators */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}></div>
          <span className="text-white text-sm font-medium">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {isAudioEnabled ? (
            <Volume2 className="h-4 w-4 text-white/70" />
          ) : (
            <VolumeX className="h-4 w-4 text-white/70" />
          )}
          {isVideoEnabled ? (
            <Camera className="h-4 w-4 text-white/70" />
          ) : (
            <CameraOff className="h-4 w-4 text-white/70" />
          )}
        </div>

        {/* AI Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-effect rounded-lg p-3">
            <h3 className="text-white font-semibold text-sm">AI Wellness Companion</h3>
            <p className="text-white/70 text-xs mt-1">
              {isLoading ? 'Connecting...' : 
               isConnected ? (showVideoStream ? 'Video Active' : 'Ready to help') : 
               'Disconnected'}
            </p>
          </div>
        </div>

        {/* Video Status */}
        {isConnected && videoError && (
          <div className="absolute bottom-16 left-4 right-4">
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2">
              <p className="text-yellow-300 text-xs">
                {videoError} - Using AI avatar visualization
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="p-4 glass-effect border-t border-white/10">
        <div className="flex justify-center space-x-4">
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
            {isVideoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </motion.button>

          {/* Audio Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleAudio}
            className={`p-3 rounded-full transition-all duration-200 ${
              isAudioEnabled
                ? 'bg-primary-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </motion.button>

          {/* Settings */}
          {onSettings && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettings}
              className="p-3 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TavusVideoAgent;