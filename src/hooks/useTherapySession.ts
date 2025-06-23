import { useState, useEffect, useCallback, useRef } from 'react';
import { tavusService, TavusConversation, TavusPersona } from '../services/tavusService';

interface TherapyMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mood?: string;
}

interface UseTherapySessionOptions {
  onMessage?: (message: TherapyMessage) => void;
  onError?: (error: string) => void;
  onSessionStart?: (conversation: TavusConversation) => void;
  onSessionEnd?: () => void;
}

export const useTherapySession = (options: UseTherapySessionOptions = {}) => {
  const [persona, setPersona] = useState<TavusPersona | null>(null);
  const [conversation, setConversation] = useState<TavusConversation | null>(null);
  const [messages, setMessages] = useState<TherapyMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
  
  const conversationRef = useRef<TavusConversation | null>(null);
  const { onMessage, onError, onSessionStart, onSessionEnd } = options;

  // Load persona details
  const loadPersona = useCallback(async () => {
    if (!tavusService.isConfigured()) {
      const errorMsg = 'Tavus service is not configured. Please check your API key and persona ID.';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Loading persona details...');
      const personaDetails = await tavusService.getPersonaDetails();
      console.log('Loaded persona:', personaDetails);
      
      if (personaDetails) {
        setPersona(personaDetails);
      } else {
        // Create a default persona if we can't fetch details
        setPersona({
          persona_id: tavusService.getPersonaId(),
          persona_name: 'AI Therapy Companion',
          system_prompt: 'I am your AI therapy companion, here to provide support and guidance.',
          context: 'Therapy and mental wellness support'
        });
      }
    } catch (err: any) {
      console.error('Error loading persona:', err);
      const errorMsg = err.message || 'Failed to load therapy persona';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Start therapy session
  const startTherapySession = useCallback(async () => {
    if (!tavusService.isConfigured()) {
      const errorMsg = 'Tavus service is not configured. Please check your API key and persona ID.';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setSessionStatus('connecting');
    setError(null);

    try {
      console.log('Starting therapy session...');
      
      const newConversation = await tavusService.createTherapyConversation();
      console.log('Therapy session created:', newConversation);

      setConversation(newConversation);
      conversationRef.current = newConversation;
      setIsConnected(true);
      setSessionStatus('active');
      
      // Notify parent component
      onSessionStart?.(newConversation);
      
      // Add initial AI greeting
      const initialMessage: TherapyMessage = {
        id: 'initial-' + Date.now(),
        type: 'ai',
        content: `Hello, I'm your AI therapy companion${persona?.persona_name ? ` ${persona.persona_name}` : ''}. I'm here to provide you with a safe, supportive space to explore your thoughts and feelings. How are you doing today, and what would you like to talk about?`,
        timestamp: new Date(),
      };
      
      setMessages([initialMessage]);
      onMessage?.(initialMessage);
      
    } catch (err: any) {
      console.error('Error starting therapy session:', err);
      const errorMsg = err.message || 'Failed to start therapy session';
      setError(errorMsg);
      setSessionStatus('idle');
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [persona, onMessage, onError, onSessionStart]);

  // Send message in therapy session
  const sendMessage = useCallback(async (content: string, context?: { mood?: string }) => {
    if (!conversation) {
      throw new Error('No active therapy session');
    }

    setIsLoading(true);
    
    try {
      // Add user message immediately
      const userMessage: TherapyMessage = {
        id: 'user-' + Date.now(),
        type: 'user',
        content,
        timestamp: new Date(),
        mood: context?.mood,
      };
      
      setMessages(prev => [...prev, userMessage]);
      onMessage?.(userMessage);

      // Simulate AI therapy response (in real implementation, this would be handled by Tavus WebRTC)
      setTimeout(() => {
        const aiResponse: TherapyMessage = {
          id: 'ai-' + Date.now(),
          type: 'ai',
          content: generateTherapyResponse(content, context?.mood, persona),
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
        onMessage?.(aiResponse);
        setIsLoading(false);
      }, 1500 + Math.random() * 2000);

    } catch (err: any) {
      const errorMsg = err.message || 'Failed to send message';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsLoading(false);
      throw err;
    }
  }, [conversation, persona, onMessage, onError]);

  // Generate therapy-focused AI response
  const generateTherapyResponse = (userMessage: string, mood?: string, persona?: TavusPersona | null) => {
    const therapyResponses = [
      "I hear what you're saying, and I want you to know that your feelings are completely valid. It takes courage to share these thoughts with me.",
      "Thank you for trusting me with this. Let's explore this together - what do you think might be contributing to these feelings?",
      "That sounds really challenging. You're not alone in feeling this way. Many people experience similar struggles, and there are ways we can work through this.",
      "I can sense the weight of what you're carrying. It's important that we take this one step at a time. What feels most pressing for you right now?",
      "Your awareness of these patterns is actually a strength. Recognition is often the first step toward positive change. How long have you been noticing this?",
      "I appreciate your openness. In therapy, we often find that understanding the 'why' behind our feelings can be very helpful. What comes to mind when you think about what might be underneath this?",
      "It's completely normal to feel overwhelmed sometimes. Let's break this down into smaller, more manageable pieces. What aspect of this feels most important to address first?"
    ];

    // Mood-specific responses
    if (mood) {
      if (mood === 'sad') {
        return "I can hear the sadness in what you're sharing. Sadness is a natural response to loss, disappointment, or difficult circumstances. It's okay to sit with these feelings. Can you tell me more about what's been weighing on your heart?";
      } else if (mood === 'anxious') {
        return "I notice you're feeling anxious, and that can be really uncomfortable. Anxiety often tries to protect us, but sometimes it can feel overwhelming. Let's work together to understand what your anxiety might be trying to tell you. What thoughts are going through your mind right now?";
      } else if (mood === 'happy') {
        return "It's wonderful to hear some positivity in your voice! I'm curious about what's bringing you joy today. Sometimes exploring our positive experiences can give us insights into what supports our wellbeing.";
      } else if (mood === 'calm') {
        return "I'm glad you're feeling centered right now. This calm state can be a great foundation for deeper reflection. Is there something you've been wanting to explore or understand better about yourself?";
      }
    }

    // Check for specific therapy-related keywords
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "Anxiety can feel overwhelming, but you're taking a positive step by talking about it. Let's explore what situations or thoughts tend to trigger your anxiety. Understanding these patterns can help us develop coping strategies together.";
    } else if (lowerMessage.includes('depressed') || lowerMessage.includes('depression')) {
      return "Depression can make everything feel more difficult, and I want you to know that reaching out shows real strength. You don't have to face this alone. Can you help me understand what depression feels like for you day-to-day?";
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) {
      return "Stress affects all of us, and it sounds like you're dealing with quite a bit right now. Let's identify what's contributing most to your stress levels. Sometimes just naming these stressors can help us feel more in control.";
    } else if (lowerMessage.includes('relationship') || lowerMessage.includes('family')) {
      return "Relationships can be both our greatest source of joy and our biggest challenge. It sounds like there's something important happening in your relationships. Would you like to share more about what's been on your mind?";
    }

    return therapyResponses[Math.floor(Math.random() * therapyResponses.length)];
  };

  // End therapy session
  const endTherapySession = useCallback(async () => {
    if (!conversation) return;

    setIsLoading(true);
    setSessionStatus('ended');

    try {
      await tavusService.endConversation(conversation.conversation_id);
      setIsConnected(false);
      setConversation(null);
      conversationRef.current = null;
      setMessages([]);
      setError(null);
      setSessionStatus('idle');
      onSessionEnd?.();
    } catch (err: any) {
      console.error('Error ending therapy session:', err);
      // Don't show error to user for ending session
      setIsConnected(false);
      setConversation(null);
      conversationRef.current = null;
      setMessages([]);
      setSessionStatus('idle');
      onSessionEnd?.();
    } finally {
      setIsLoading(false);
    }
  }, [conversation, onSessionEnd]);

  // Get conversation URL for iframe embedding
  const getConversationUrl = useCallback(() => {
    if (!conversation) return null;
    return conversation.conversation_url;
  }, [conversation]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => !prev);
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  // Load persona on mount
  useEffect(() => {
    if (tavusService.isConfigured() && !persona) {
      loadPersona();
    }
  }, [loadPersona, persona]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        tavusService.endConversation(conversationRef.current.conversation_id).catch(console.error);
      }
    };
  }, []);

  return {
    // Persona
    persona,
    loadPersona,
    
    // Session
    conversation,
    messages,
    isLoading,
    isConnected,
    error,
    sessionStatus,
    
    // Controls
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    
    // Actions
    startTherapySession,
    sendMessage,
    endTherapySession,
    getConversationUrl,
    
    // Status
    isConfigured: tavusService.isConfigured(),
  };
};