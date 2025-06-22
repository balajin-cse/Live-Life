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
      'x-api-key': this.apiKey, // Tavus uses x-api-key header, not Bearer token
      'Content-Type': 'application/json',
    };
  }

  // Create a new conversation with AI replica
  async createConversation(request: CreateConversationRequest): Promise<TavusConversation> {
    if (!this.apiKey) {
      throw new Error('Tavus API key is not configured. Please set VITE_TAVUS_API_KEY in your environment variables.');
    }

    // Check for placeholder values
    if (this.apiKey.includes('your_actual_tavus_api_key_here') || this.apiKey.includes('fb72ce32593f4a149618d2a77ed6e233')) {
      throw new Error('Please replace the placeholder API key in your .env file with your actual Tavus API key from https://tavusapi.com/dashboard');
    }

    if (request.replica_id.includes('your_actual_replica_id_here') || request.replica_id === 'r9d30b0e55ac') {
      throw new Error('Please replace the placeholder replica ID in your .env file with your actual replica ID from your Tavus dashboard.');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/v2/conversations`,
        request,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating Tavus conversation:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Bad request';
        if (errorMessage.toLowerCase().includes('replica')) {
          throw new Error('Invalid replica ID. Please check that your replica ID exists in your Tavus dashboard and update the VITE_TAVUS_REPLICA_ID environment variable.');
        } else if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('authentication')) {
          throw new Error('Invalid API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
        } else {
          throw new Error(`Tavus API error (400): ${errorMessage}. Please verify your API key and replica ID are correct.`);
        }
      } else if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your Tavus API key permissions.');
      } else if (error.response?.status === 404) {
        throw new Error('Replica not found. Please verify the replica ID exists in your Tavus account.');
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to create conversation. Please check your internet connection and try again.');
      }
    }
  }

  // Send a message to the AI and get response
  async sendMessage(request: SendMessageRequest): Promise<TavusMessage> {
    if (!this.apiKey) {
      throw new Error('Tavus API key is not configured.');
    }

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
    } catch (error: any) {
      console.error('Error sending message to Tavus:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key.');
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to send message');
      }
    }
  }

  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<TavusMessage[]> {
    if (!this.apiKey) {
      throw new Error('Tavus API key is not configured.');
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/v2/conversations/${conversationId}/messages`,
        { headers: this.getHeaders() }
      );
      return response.data.messages || [];
    } catch (error: any) {
      console.error('Error fetching conversation history:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key.');
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to fetch conversation history');
      }
    }
  }

  // End a conversation
  async endConversation(conversationId: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Tavus API key is not configured.');
    }

    try {
      await axios.post(
        `${this.baseURL}/v2/conversations/${conversationId}/end`,
        {},
        { headers: this.getHeaders() }
      );
    } catch (error: any) {
      console.error('Error ending Tavus conversation:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key.');
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to end conversation');
      }
    }
  }

  // Get available AI replicas
  async getReplicas(): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('Tavus API key is not configured.');
      return [];
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/v2/replicas`,
        { headers: this.getHeaders() }
      );
      return response.data.replicas || [];
    } catch (error: any) {
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
    return !!this.apiKey && 
           !this.apiKey.includes('your_actual_tavus_api_key_here') && 
           !this.apiKey.includes('fb72ce32593f4a149618d2a77ed6e233');
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      await this.getReplicas();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const tavusService = new TavusService();