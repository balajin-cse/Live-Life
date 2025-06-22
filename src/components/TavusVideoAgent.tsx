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
  Maximize2
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
  const [iframeError, setIframeError] = useState<string | null>(null);

  // Reset iframe state when conversation URL changes
  useEffect(() => {
    if (conversationUrl) {
      setIframeLoaded(false);
      setIframeError(null);
      console.log('Loading Tavus conversation URL:', conversationUrl);
    }
  }, [conversationUrl]);

  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log('Tavus iframe loaded successfully');
    setIframeLoaded(true);
    setIframeError(null);
  };

  const handleIframeError = () => {
    console.error('Tavus iframe failed to load');
    setIframeError('Failed to load video interface');
    setIframeLoaded(false);
  };

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

    // Show embedded Tavus iframe when available
    if (conversationUrl && isConnected) {
      return (
        <div className="absolute inset-0 bg-black">
          {/* Tavus Video Iframe - Embedded directly */}
          <iframe
            ref={iframeRef}
            src={conversationUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="camera; microphone; autoplay; encrypted-media; fullscreen; display-capture"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation-by-user-activation"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              backgroundColor: '#1e293b',
              minHeight: '100%',
              minWidth: '100%'
            }}
          />

          {/* Loading overlay for iframe */}
          {!iframeLoaded && !iframeError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-primary-400 mx-auto mb-3 animate-spin" />
                <p className="text-white text-sm">Loading video interface...</p>
                <p className="text-gray-400 text-xs mt-1">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* Error overlay for iframe */}
          {iframeError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
              <div className="text-center p-6">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <p className="text-white text-sm mb-2">Video Interface Error</p>
                <p className="text-gray-400 text-xs">{iframeError}</p>
                <button
                  onClick={() => {
                    setIframeError(null);
                    setIframeLoaded(false);
                    if (iframeRef.current) {
                      iframeRef.current.src = conversationUrl;
                    }
                  }}
                  className="mt-3 px-4 py-2 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Fallback AI Avatar when no conversation URL
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
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
    );
  };

  return (
    <div className="glass-effect rounded-2xl overflow-hidden relative">
      <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-800 to-slate-900">
        {renderVideoContent()}

        {/* Status Indicators - Only show when not using iframe or iframe has loaded */}
        {(!conversationUrl || !isConnected || iframeError) && (
          <>
            <div className="absolute top-4 left-4 flex items-center space-x-2 z-20">
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>

            <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
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
          </>
        )}

        {/* AI Info - Only show when not using iframe or iframe has error */}
        {(!conversationUrl || !isConnected || iframeError || !iframeLoaded) && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="glass-effect rounded-lg p-3">
              <h3 className="text-white font-semibold text-sm">AI Wellness Companion</h3>
              <p className="text-white/70 text-xs mt-1">
                {isLoading ? 'Connecting...' : 
                 isConnected ? (conversationUrl ? 'Video Loading...' : 'Ready to help') : 
                 'Disconnected'}
              </p>
            </div>
          </div>
        )}

        {/* Fullscreen button for iframe */}
        {conversationUrl && isConnected && iframeLoaded && !iframeError && (
          <button
            onClick={() => {
              if (iframeRef.current) {
                iframeRef.current.requestFullscreen?.();
              }
            }}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white/70 hover:text-white hover:bg-black/70 rounded transition-all duration-200"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
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