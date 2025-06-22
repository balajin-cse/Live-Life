import React from 'react'
import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  mood?: string
}

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
          : 'bg-gradient-to-r from-accent-500 to-primary-500'
      }`}>
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-md ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
            : 'bg-white/10 text-white border border-white/20'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        <div className={`mt-1 text-xs text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.mood && (
            <span className="ml-2 px-2 py-1 bg-white/10 rounded-full text-xs">
              {message.mood}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage