import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  MicOff, 
  Settings,
  Heart,
  Brain,
  Smile,
  Zap,
  Phone,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import TavusVideoAgent from '../components/TavusVideoAgent'
import ChatMessage from '../components/ChatMessage'
import MoodSelector from '../components/MoodSelector'
import { useTavusConversation } from '../hooks/useTavusConversation'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  mood?: string
}

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [currentMood, setCurrentMood] = useState<string>('')
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [connectionError, setConnectionError] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Tavus conversation with a more generic replica ID
  // Note: Replace this with your actual replica ID from the Tavus dashboard
  const {
    conversation,
    messages: tavusMessages,
    isLoading,
    isConnected,
    error,
    isVideoEnabled,
    isAudioEnabled,
    startConversation,
    sendMessage,
    endConversation,
    getVideoStreamUrl,
    toggleVideo,
    toggleAudio,
    isConfigured,
  } = useTavusConversation({
    replicaId: process.env.VITE_TAVUS_REPLICA_ID || 'default-replica',
    autoStart: false,
    onMessage: (message) => {
      // Convert Tavus message to local message format
      const localMessage: Message = {
        id: message.id,
        type: message.speaker,
        content: message.content,
        timestamp: new Date(message.timestamp),
      }
      setLocalMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === localMessage.id)) return prev
        return [...prev, localMessage]
      })
    },
    onError: (error) => {
      console.error('Tavus conversation error:', error)
      let errorMessage = error.message || 'An error occurred with the conversation'
      
      // Provide more specific error messages based on common issues
      if (error.message?.includes('400')) {
        errorMessage = 'Invalid replica ID or API configuration. Please check your Tavus dashboard for the correct replica ID.'
      } else if (error.message?.includes('401')) {
        errorMessage = 'Invalid API key. Please check your VITE_TAVUS_API_KEY in the .env file.'
      } else if (error.message?.includes('404')) {
        errorMessage = 'Replica not found. Please verify the replica ID exists in your Tavus account.'
      }
      
      setConnectionError(errorMessage)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages])

  const handleStartConversation = async () => {
    if (!isConfigured) {
      setConnectionError('Tavus API is not configured. Please check your environment variables.')
      return
    }
    
    setConnectionError('')
    try {
      await startConversation()
    } catch (error: any) {
      let errorMessage = error.message || 'Failed to start conversation'
      
      // Provide more specific error messages
      if (error.message?.includes('400')) {
        errorMessage = 'Invalid replica ID. Please check that your replica ID exists in your Tavus dashboard and update the VITE_TAVUS_REPLICA_ID environment variable.'
      }
      
      setConnectionError(errorMessage)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversation) return

    try {
      await sendMessage(inputMessage, { mood: currentMood })
      setInputMessage('')
      setConnectionError('')
    } catch (error: any) {
      console.error('Error sending message:', error)
      setConnectionError(error.message || 'Failed to send message')
    }
  }

  const handleEndConversation = async () => {
    try {
      await endConversation()
      setLocalMessages([])
      setConnectionError('')
    } catch (error: any) {
      console.error('Error ending conversation:', error)
      setConnectionError(error.message || 'Failed to end conversation')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRetry = () => {
    setConnectionError('')
    handleStartConversation()
  }

  const moods = [
    { id: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-400' },
    { id: 'sad', label: 'Sad', icon: Heart, color: 'text-blue-400' },
    { id: 'anxious', label: 'Anxious', icon: Zap, color: 'text-red-400' },
    { id: 'calm', label: 'Calm', icon: Brain, color: 'text-green-400' },
  ]

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full grid lg:grid-cols-3 gap-6 p-4">
        {/* Video Agent Section */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-20"
          >
            <TavusVideoAgent
              videoStreamUrl={getVideoStreamUrl()}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              isConnected={isConnected}
              isLoading={isLoading}
              error={error}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
            />
            
            {/* Session Controls */}
            <div className="mt-4 glass-effect rounded-2xl p-4">
              <div className="flex justify-center space-x-4">
                {!conversation ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartConversation}
                    disabled={isLoading || !isConfigured}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Connecting...' : 'Start Conversation'}
                  </motion.button>
                ) : (
                  <>
                    {/* Microphone Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isRecording
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
                      onClick={handleEndConversation}
                      className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                    >
                      <Phone className="h-5 w-5 rotate-[135deg]" />
                    </motion.button>
                  </>
                )}
              </div>
              
              {/* Configuration Warning */}
              {!isConfigured && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <p className="text-yellow-300 text-sm">
                      Tavus API not configured. Please set VITE_TAVUS_API_KEY and VITE_TAVUS_REPLICA_ID in your environment.
                    </p>
                  </div>
                </div>
              )}

              {/* Connection Error */}
              {connectionError && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-red-300 text-sm mb-2">{connectionError}</p>
                      {connectionError.includes('replica ID') && (
                        <div className="text-red-200 text-xs space-y-1">
                          <p>To fix this:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Go to your Tavus dashboard at https://tavusapi.com/dashboard</li>
                            <li>Find your replica ID in the replicas section</li>
                            <li>Add VITE_TAVUS_REPLICA_ID=your-replica-id to your .env file</li>
                            <li>Restart the development server</li>
                          </ol>
                        </div>
                      )}
                      {connectionError.includes('Invalid Tavus API key') && (
                        <p className="text-red-200 text-xs">
                          Please check your API key in the .env file. You can get a valid API key from the Tavus dashboard.
                        </p>
                      )}
                      <button
                        onClick={handleRetry}
                        className="mt-2 flex items-center space-x-1 text-red-300 hover:text-red-200 text-xs transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-2 flex flex-col h-[calc(100vh-8rem)]">
          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <MoodSelector
              moods={moods}
              selectedMood={currentMood}
              onMoodSelect={setCurrentMood}
            />
          </motion.div>

          {/* Messages */}
          <div className="flex-1 glass-effect rounded-2xl p-6 overflow-y-auto mb-4">
            {localMessages.length === 0 && !conversation && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Heart className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Welcome to Live Life
                  </h3>
                  <p className="text-gray-300 max-w-md">
                    Start a conversation with your AI wellness companion to begin your journey 
                    toward better mental health and wellbeing.
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <AnimatePresence>
                {localMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {isLoading && conversation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 text-gray-400"
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">AI is responding...</span>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-effect rounded-2xl p-4"
          >
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={conversation ? "Share what's on your mind..." : "Start a conversation first..."}
                  disabled={!conversation}
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[60px] max-h-32 disabled:opacity-50"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !conversation || isLoading}
                  className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage