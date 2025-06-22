import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX,
  Loader2,
  AlertCircle,
  Settings,
  ExternalLink
} from 'lucide-react';

interface TavusVideoAgentProps {
  conversationUrl?: string | null;
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
  conversationUrl,
  isVideoEnabled,
  isAudioEnabled,
  isConnected,
  isLoading,
  error,
  onToggleVideo,
  onToggleAudio,
  onSettings,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  // Handle iframe loading
  useEffect(() => {
    if (!conversationUrl || !isVideoEnabled || !isConnected) {
      setIframeLoaded(false);
      setShowIframe(false);
      return;
    }

    console.log('Loading Tavus conversation URL:', conversationUrl);
    setShowIframe(true);
    
    // Add a delay to show the iframe after connection is established
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [conversationUrl, isVideoEnabled, isConnected]);

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

    // Show Tavus iframe if available, otherwise show AI avatar
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Tavus Video Iframe */}
        {showIframe && conversationUrl && isConnected && (
          <iframe
            ref={iframeRef}
            src={conversationUrl}
            className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-500 ${
              iframeLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            allow="camera; microphone; autoplay; encrypted-media; fullscreen"
            onLoad={() => {
              console.log('Tavus iframe loaded successfully');
              setIframeLoaded(true);
            }}
            onError={(e) => {
              console.error('Tavus iframe error:', e);
              setIframeLoaded(false);
            }}
          />
        )}

        {/* AI Avatar Placeholder - shown when iframe is not available or loading */}
        {(!showIframe || !iframeLoaded || !conversationUrl || !isConnected) && (
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
        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}></div>
          <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          {isAudioEnabled ? (
            <Volume2 className="h-4 w-4 text-white/70 bg-black/50 p-1 rounded" />
          ) : (
            <VolumeX className="h-4 w-4 text-white/70 bg-black/50 p-1 rounded" />
          )}
          {isVideoEnabled ? (
            <Camera className="h-4 w-4 text-white/70 bg-black/50 p-1 rounded" />
          ) : (
            <CameraOff className="h-4 w-4 text-white/70 bg-black/50 p-1 rounded" />
          )}
        </div>

        {/* AI Info */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="glass-effect rounded-lg p-3">
            <h3 className="text-white font-semibold text-sm">AI Wellness Companion</h3>
            <p className="text-white/70 text-xs mt-1">
              {isLoading ? 'Connecting...' : 
               isConnected ? (showIframe && iframeLoaded ? 'Video Active' : 'Ready to help') : 
               'Disconnected'}
            </p>
            {conversationUrl && isConnected && (
              <a
                href={conversationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-primary-300 hover:text-primary-200 text-xs mt-1 transition-colors"
              >
                <span>Open in new tab</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Loading overlay for iframe */}
        {showIframe && !iframeLoaded && isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-primary-400 mx-auto mb-3 animate-spin" />
              <p className="text-white text-sm">Loading video interface...</p>
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