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
  RefreshCw,
  ExternalLink,
  Play,
  Square
} from 'lucide-react'
import TherapyVideoAgent from '../components/TherapyVideoAgent'
import PersonaSelector from '../components/PersonaSelector'
import ChatMessage from '../components/ChatMessage'
import MoodSelector from '../components/MoodSelector'
import { useTherapySession } from '../hooks/useTherapySession'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize therapy session
  const {
    personas,
    selectedPersona,
    selectPersona,
    loadPersonas,
    conversation,
    messages: therapyMessages,
    isLoading,
    isConnected,
    error,
    sessionStatus,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    startTherapySession,
    sendMessage,
    endTherapySession,
    getConversationUrl,
    isConfigured,
  } = useTherapySession({
    onMessage: (message) => {
      // Convert therapy message to local message format
      const localMessage: Message = {
        id: message.id,
        type: message.type,
        content: message.content,
        timestamp: message.timestamp,
        mood: message.mood,
      }
      setLocalMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === localMessage.id)) return prev
        return [...prev, localMessage]
      })
    },
    onError: (error) => {
      console.error('Therapy session error:', error)
    },
    onSessionStart: (conversation) => {
      console.log('Therapy session started:', conversation)
    },
    onSessionEnd: () => {
      console.log('Therapy session ended')
      setLocalMessages([])
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages])

  const handleStartSession = async () => {
    if (!selectedPersona) {
      return
    }
    
    try {
      await startTherapySession(selectedPersona.persona_id)
    } catch (error: any) {
      console.error('Error starting therapy session:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversation) return

    try {
      await sendMessage(inputMessage, { mood: currentMood })
      setInputMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error)
    }
  }

  const handleEndSession = async () => {
    try {
      await endTherapySession()
    } catch (error: any) {
      console.error('Error ending therapy session:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRetryConnection = () => {
    if (personas.length === 0) {
      loadPersonas()
    } else if (selectedPersona) {
      handleStartSession()
    }
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
            className="sticky top-20 space-y-4"
          >
            {/* Persona Selector */}
            <PersonaSelector
              personas={personas}
              selectedPersona={selectedPersona}
              onPersonaSelect={selectPersona}
              isLoading={isLoading && personas.length === 0}
              error={error && personas.length === 0 ? error : null}
            />

            {/* Video Agent */}
            <TherapyVideoAgent
              conversationUrl={getConversationUrl()}
              selectedPersona={selectedPersona}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              isConnected={isConnected}
              isLoading={isLoading}
              sessionStatus={sessionStatus}
              error={error}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
            />
            
            {/* Session Controls */}
            <div className="glass-effect rounded-2xl p-4">
              <div className="flex justify-center space-x-4">
                {sessionStatus === 'idle' ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartSession}
                    disabled={isLoading || !isConfigured || !selectedPersona}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>{isLoading ? 'Starting...' : 'Start Therapy Session'}</span>
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
                      onClick={handleEndSession}
                      className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                    >
                      <Square className="h-5 w-5" />
                    </motion.button>
                  </>
                )}
              </div>
              
              {/* Configuration Warning */}
              {!isConfigured && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-yellow-300 text-sm mb-2">
                        Tavus API not configured. Please set up your credentials:
                      </p>
                      <div className="text-yellow-200 text-xs space-y-1">
                        <p>1. Go to <a href="https://tavusapi.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100 inline-flex items-center gap-1">Tavus Dashboard <ExternalLink className="h-3 w-3" /></a></p>
                        <p>2. Get your API key from the API section</p>
                        <p>3. Create therapy personas in the Personas section</p>
                        <p>4. Update your .env file with VITE_TAVUS_API_KEY</p>
                        <p>5. Restart the development server</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Connection Error */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-red-300 text-sm mb-2">{error}</p>
                      {error.includes('API key') && (
                        <div className="text-red-200 text-xs space-y-1">
                          <p>To fix this:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Go to <a href="https://tavusapi.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-100 inline-flex items-center gap-1">Tavus Dashboard <ExternalLink className="h-3 w-3" /></a></li>
                            <li>Get your API key from the API section</li>
                            <li>Update VITE_TAVUS_API_KEY in your .env file</li>
                            <li>Restart the development server</li>
                          </ol>
                        </div>
                      )}
                      <button
                        onClick={handleRetryConnection}
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
            {localMessages.length === 0 && sessionStatus === 'idle' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Welcome to Live Life Therapy
                  </h3>
                  <p className="text-gray-300 max-w-md">
                    Select a therapy persona and start your session to begin your journey 
                    toward better mental health and wellbeing with AI-powered support.
                  </p>
                </div>
              </div>
            )}

            {localMessages.length === 0 && sessionStatus === 'connecting' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Connecting to Your Therapy Session
                  </h3>
                  <p className="text-gray-300 max-w-md">
                    {selectedPersona ? `Connecting with ${selectedPersona.persona_name}...` : 'Establishing connection...'}
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
                  <span className="text-sm">Your therapist is responding...</span>
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
                  placeholder={conversation ? "Share what's on your mind..." : "Start a therapy session first..."}
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