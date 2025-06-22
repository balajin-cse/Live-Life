import { useState, useEffect, useCallback, useRef } from 'react';
import { tavusService, TavusConversation, TavusMessage } from '../services/tavusService';

interface UseTavusConversationOptions {
  personaId?: string; // Changed from replicaId to personaId
  autoStart?: boolean;
  onMessage?: (message: TavusMessage) => void;
  onError?: (error: string) => void;
}

export const useTavusConversation = (options: UseTavusConversationOptions = {}) => {
  const [conversation, setConversation] = useState<TavusConversation | null>(null);
  const [messages, setMessages] = useState<TavusMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  const conversationRef = useRef<TavusConversation | null>(null);
  const { 
    personaId = import.meta.env.VITE_TAVUS_PERSONA_ID || 'default-persona', // Changed from replicaId
    autoStart = false, 
    onMessage, 
    onError 
  } = options;

  // Start a new conversation
  const startConversation = useCallback(async () => {
    if (!tavusService.isConfigured()) {
      const errorMsg = 'Tavus service is not configured. Please check your API key.';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!personaId || personaId === 'default-persona') {
      const errorMsg = 'Please set a valid persona ID in your .env file (VITE_TAVUS_PERSONA_ID).';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting conversation with persona ID:', personaId);
      
      const newConversation = await tavusService.createConversation({
        persona_id: personaId, // Changed from replica_id to persona_id
        conversation_name: 'Live Life Wellness Session',
        properties: {
          max_call_duration: 3600, // 1 hour
          participant_left_timeout: 60,
          participant_absent_timeout: 300,
          enable_recording: false,
          apply_greenscreen: false,
          language: 'en', // Use language code
        },
      });

      console.log('Conversation created successfully:', newConversation);

      setConversation(newConversation);
      conversationRef.current = newConversation;
      setIsConnected(true);
      
      // Add initial AI greeting
      const initialMessage: TavusMessage = {
        id: 'initial-' + Date.now(),
        conversation_id: newConversation.conversation_id,
        speaker: 'ai',
        content: "Hello! I'm your AI wellness companion. I'm here to support you on your journey to better mental health and wellbeing. How are you feeling today?",
        timestamp: new Date().toISOString(),
      };
      
      setMessages([initialMessage]);
      onMessage?.(initialMessage);
      
    } catch (err) {
      console.error('Error starting conversation:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [personaId, onMessage, onError]);

  // Send a message to the AI
  const sendMessage = useCallback(async (content: string, context?: { mood?: string }) => {
    if (!conversation) {
      throw new Error('No active conversation');
    }

    setIsLoading(true);
    
    try {
      // Add user message immediately
      const userMessage: TavusMessage = {
        id: 'user-' + Date.now(),
        conversation_id: conversation.conversation_id,
        speaker: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      onMessage?.(userMessage);

      // For now, simulate AI response since Tavus messaging might work differently
      // In a real implementation, you would send to Tavus and get the actual response
      setTimeout(() => {
        const aiResponse: TavusMessage = {
          id: 'ai-' + Date.now(),
          conversation_id: conversation.conversation_id,
          speaker: 'ai',
          content: generateAIResponse(content, context?.mood),
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, aiResponse]);
        onMessage?.(aiResponse);
        setIsLoading(false);
      }, 1000 + Math.random() * 2000); // Simulate response delay

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsLoading(false);
      throw err;
    }
  }, [conversation, onMessage, onError]);

  // Generate AI response (placeholder for actual Tavus integration)
  const generateAIResponse = (userMessage: string, mood?: string) => {
    const responses = [
      "I understand how you're feeling. It's completely normal to experience these emotions, and I'm here to help you work through them.",
      "Thank you for sharing that with me. Your feelings are valid, and it takes courage to open up about what you're going through.",
      "I hear you, and I want you to know that you're not alone in this. Let's explore some strategies that might help you feel better.",
      "That sounds challenging. Remember that it's okay to take things one step at a time. What would feel most helpful for you right now?",
      "I appreciate you trusting me with your thoughts. Your mental wellbeing is important, and I'm here to support you through this journey."
    ];

    if (mood) {
      if (mood === 'sad') {
        return "I can sense that you're feeling sad right now. It's okay to feel this way - sadness is a natural human emotion. Would you like to talk about what's contributing to these feelings?";
      } else if (mood === 'anxious') {
        return "I notice you're feeling anxious. Anxiety can be overwhelming, but there are techniques we can use to help you feel more grounded. Let's start with some deep breathing exercises.";
      } else if (mood === 'happy') {
        return "It's wonderful to hear that you're feeling happy! I'd love to know what's bringing you joy today. Celebrating positive moments is so important for our wellbeing.";
      } else if (mood === 'calm') {
        return "I'm glad you're feeling calm. This is a great state of mind for reflection and growth. Is there anything specific you'd like to explore or discuss while you're feeling centered?";
      }
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  // End the conversation
  const endConversation = useCallback(async () => {
    if (!conversation) return;

    try {
      await tavusService.endConversation(conversation.conversation_id);
      setIsConnected(false);
      setConversation(null);
      conversationRef.current = null;
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Error ending conversation:', err);
    }
  }, [conversation]);

  // Get video stream URL
  const getVideoStreamUrl = useCallback(() => {
    if (!conversation) return null;
    return tavusService.getVideoStreamUrl(conversation.conversation_id);
  }, [conversation]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => !prev);
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  // Auto-start conversation if enabled
  useEffect(() => {
    if (autoStart && !conversation && !isLoading) {
      startConversation();
    }
  }, [autoStart, conversation, isLoading, startConversation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        tavusService.endConversation(conversationRef.current.conversation_id).catch(console.error);
      }
    };
  }, []);

  return {
    conversation,
    messages,
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
    isConfigured: tavusService.isConfigured(),
  };
};