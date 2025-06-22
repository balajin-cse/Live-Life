import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Settings,
  Heart,
  Brain,
  Smile,
  Zap
} from 'lucide-react'
import VideoAgent from '../components/VideoAgent'
import ChatMessage from '../components/ChatMessage'
import MoodSelector from '../components/MoodSelector'
import SessionControls from '../components/SessionControls'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  mood?: string
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm here to support you on your journey to better mental wellness. How are you feeling today?",
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [currentMood, setCurrentMood] = useState<string>('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      mood: currentMood
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage, currentMood),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userInput: string, mood: string): string => {
    const responses = {
      happy: [
        "I'm so glad to hear you're feeling positive! Let's explore what's bringing you joy today and how we can build on these good feelings.",
        "Your happiness is wonderful to see! What activities or thoughts are contributing to this positive mood?",
      ],
      sad: [
        "I understand you're going through a difficult time. Remember that it's okay to feel sad, and I'm here to support you through this.",
        "Thank you for sharing how you're feeling. Let's work together to find some gentle ways to care for yourself right now.",
      ],
      anxious: [
        "I hear that you're feeling anxious. Let's try some breathing exercises together, or we can talk about what's on your mind.",
        "Anxiety can feel overwhelming, but you're not alone. Would you like to explore some grounding techniques that might help?",
      ],
      neutral: [
        "I appreciate you sharing with me. Sometimes feeling neutral is exactly where we need to be. How can I best support you today?",
        "Thank you for being here. What would be most helpful for you in this moment?",
      ]
    }

    const moodResponses = responses[mood as keyof typeof responses] || responses.neutral
    return moodResponses[Math.floor(Math.random() * moodResponses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
            className="sticky top-20"
          >
            <VideoAgent isEnabled={isVideoEnabled} />
            <SessionControls
              isRecording={isRecording}
              isVideoEnabled={isVideoEnabled}
              onToggleRecording={() => setIsRecording(!isRecording)}
              onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
            />
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
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {isTyping && (
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
                  <span className="text-sm">AI is typing...</span>
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
                  placeholder="Share what's on your mind..."
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[60px] max-h-32"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
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