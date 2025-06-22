import { useState, useEffect, useCallback, useRef } from 'react';
import { tavusService, TavusConversation, TavusMessage } from '../services/tavusService';

interface UseTavusConversationOptions {
  replicaId?: string;
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
  const { replicaId = 'default-wellness-replica', autoStart = false, onMessage, onError } = options;

  // Start a new conversation
  const startConversation = useCallback(async () => {
    if (!tavusService.isConfigured()) {
      const errorMsg = 'Tavus service is not configured. Please check your API key.';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newConversation = await tavusService.createConversation({
        replica_id: replicaId,
        conversation_name: 'Live Life Wellness Session',
        properties: {
          max_duration: 3600, // 1 hour
          language: 'en',
          voice_settings: {
            stability: 0.8,
            similarity_boost: 0.7,
          },
        },
      });

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
      const errorMsg = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [replicaId, onMessage, onError]);

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

      // Send to Tavus and get AI response
      const aiResponse = await tavusService.sendMessage({
        conversation_id: conversation.conversation_id,
        message: content,
        context: {
          mood: context?.mood,
          previous_messages: messages.slice(-5).map(m => `${m.speaker}: ${m.content}`),
        },
      });

      setMessages(prev => [...prev, aiResponse]);
      onMessage?.(aiResponse);
      
      return aiResponse;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMsg);
      onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversation, messages, onMessage, onError]);

  // End the conversation
  const endConversation = useCallback(async () => {
    if (!conversation) return;

    try {
      await tavusService.endConversation(conversation.conversation_id);
      setIsConnected(false);
      setConversation(null);
      conversationRef.current = null;
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