import axios from 'axios';

// Tavus API configuration
const TAVUS_API_BASE = 'https://tavusapi.com';
const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;

export interface TavusConversation {
  conversation_id: string;
  status: 'active' | 'ended' | 'error';
  participant_count: number;
  created_at: string;
}

export interface TavusMessage {
  id: string;
  conversation_id: string;
  speaker: 'user' | 'ai';
  content: string;
  timestamp: string;
  audio_url?: string;
  video_url?: string;
}

export interface CreateConversationRequest {
  replica_id: string;
  conversation_name?: string;
  properties?: {
    max_duration?: number;
    language?: string;
    voice_settings?: {
      stability: number;
      similarity_boost: number;
    };
  };
}

export interface SendMessageRequest {
  conversation_id: string;
  message: string;
  context?: {
    mood?: string;
    previous_messages?: string[];
  };
}

class TavusService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = TAVUS_API_KEY || '';
    this.baseURL = TAVUS_API_BASE;
    
    if (!this.apiKey) {
      console.warn('Tavus API key not found. Please set VITE_TAVUS_API_KEY in your environment variables.');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Create a new conversation with AI replica
  async createConversation(request: CreateConversationRequest): Promise<TavusConversation> {
    try {
      const response = await axios.post(
        `${this.baseURL}/v2/conversations`,
        request,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating Tavus conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }

  // Send a message to the AI and get response
  async sendMessage(request: SendMessageRequest): Promise<TavusMessage> {
    try {
      const response = await axios.post(
        `${this.baseURL}/v2/conversations/${request.conversation_id}/messages`,
        {
          message: request.message,
          context: request.context,
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message to Tavus:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<TavusMessage[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/v2/conversations/${conversationId}/messages`,
        { headers: this.getHeaders() }
      );
      return response.data.messages || [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw new Error('Failed to fetch conversation history');
    }
  }

  // End a conversation
  async endConversation(conversationId: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseURL}/v2/conversations/${conversationId}/end`,
        {},
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('Error ending Tavus conversation:', error);
      throw new Error('Failed to end conversation');
    }
  }

  // Get available AI replicas
  async getReplicas(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/v2/replicas`,
        { headers: this.getHeaders() }
      );
      return response.data.replicas || [];
    } catch (error) {
      console.error('Error fetching Tavus replicas:', error);
      return [];
    }
  }

  // Generate video URL for conversation
  getVideoStreamUrl(conversationId: string): string {
    return `${this.baseURL}/v2/conversations/${conversationId}/video/stream`;
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const tavusService = new TavusService();