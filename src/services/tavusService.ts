import axios from 'axios';

// Tavus API configuration
const TAVUS_API_BASE = 'https://tavusapi.com';
const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;

export interface TavusConversation {
  conversation_id: string;
  conversation_url: string;
  status: 'active' | 'ended' | 'error';
  participant_count?: number;
  created_at: string;
}

export interface TavusMessage {
  id: string;
  conversation_id: string;
  speaker: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface CreateConversationRequest {
  persona_id: string;
  conversation_name?: string;
  callback_url?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    apply_greenscreen?: boolean;
    language?: string;
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
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // Create a new conversation with AI persona
  async createConversation(request: CreateConversationRequest): Promise<TavusConversation> {
    if (!this.apiKey) {
      throw new Error('Tavus API key is not configured. Please set VITE_TAVUS_API_KEY in your environment variables.');
    }

    // Check for placeholder values
    if (this.apiKey.includes('your_tavus_api_key_here') || this.apiKey.includes('your_actual_tavus_api_key_here')) {
      throw new Error('Please replace the placeholder API key in your .env file with your actual Tavus API key from https://tavusapi.com/dashboard');
    }

    if (!request.persona_id || request.persona_id.includes('your_actual_persona_id_here') || request.persona_id === 'default-persona') {
      throw new Error('Please set a valid persona ID in your .env file. Get your persona ID from your Tavus dashboard.');
    }

    try {
      const payload = {
        persona_id: request.persona_id,
        conversation_name: request.conversation_name || 'Live Life Wellness Session',
        callback_url: request.callback_url,
        properties: {
          max_call_duration: 3600, // 1 hour in seconds
          participant_left_timeout: 60,
          participant_absent_timeout: 300,
          enable_recording: false,
          apply_greenscreen: false,
          language: 'English',
          ...request.properties
        }
      };

      console.log('Creating Tavus conversation with persona ID:', request.persona_id);

      const response = await axios.post(
        `${this.baseURL}/v2/conversations`,
        payload,
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );

      console.log('Tavus conversation created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating Tavus conversation:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad request';
        console.error('Tavus 400 error details:', error.response?.data);
        
        if (errorMessage.toLowerCase().includes('persona') || errorMessage.toLowerCase().includes('not found')) {
          throw new Error('Invalid persona ID. Please check that your persona ID exists in your Tavus dashboard and update the VITE_TAVUS_PERSONA_ID environment variable.');
        } else if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('authentication')) {
          throw new Error('Invalid API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
        } else if (errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('limit')) {
          throw new Error('API quota exceeded. Please check your Tavus account limits.');
        } else {
          throw new Error(`Tavus API error (400): ${errorMessage}. Please verify your API key and persona ID are correct.`);
        }
      } else if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your Tavus API key permissions.');
      } else if (error.response?.status === 404) {
        throw new Error('Persona not found. Please verify the persona ID exists in your Tavus account.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to create conversation. Please check your internet connection and try again.');
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
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );
    } catch (error: any) {
      console.error('Error ending Tavus conversation:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key.');
      } else if (error.response?.status === 404) {
        throw new Error('Conversation not found.');
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to end conversation');
      }
    }
  }

  // Get available AI personas
  async getPersonas(): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('Tavus API key is not configured.');
      return [];
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/v2/personas`,
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );
      return response.data.personas || response.data || [];
    } catch (error: any) {
      console.error('Error fetching Tavus personas:', error);
      return [];
    }
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return !!this.apiKey && 
           !this.apiKey.includes('your_tavus_api_key_here') && 
           !this.apiKey.includes('your_actual_tavus_api_key_here');
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      await this.getPersonas();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get conversation details
  async getConversation(conversationId: string): Promise<TavusConversation | null> {
    if (!this.apiKey) {
      throw new Error('Tavus API key is not configured.');
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/v2/conversations/${conversationId}`,
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversation details:', error);
      
      if (error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  }
}

export const tavusService = new TavusService();