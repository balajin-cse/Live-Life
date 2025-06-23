import axios from 'axios';

// Tavus API configuration
const TAVUS_API_BASE = 'https://tavusapi.com';
const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;

export interface TavusPersona {
  persona_id: string;
  persona_name: string;
  system_prompt?: string;
  context?: string;
  default_replica_id?: string;
}

export interface TavusConversation {
  conversation_id: string;
  conversation_url: string;
  status: 'active' | 'ended' | 'error';
  participant_count?: number;
  created_at: string;
  persona_id: string;
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

  // Get available therapy personas
  async getTherapyPersonas(): Promise<TavusPersona[]> {
    if (!this.apiKey || !this.isConfigured()) {
      console.warn('Tavus API key is not configured.');
      return [];
    }

    try {
      console.log('Fetching therapy personas from Tavus...');
      const response = await axios.get(
        `${this.baseURL}/v2/personas`,
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );

      const personas = response.data.data || response.data.personas || response.data || [];
      console.log('Fetched personas:', personas);
      
      // Filter for therapy-related personas or return all if none specified
      return personas.map((persona: any) => ({
        persona_id: persona.persona_id || persona.id,
        persona_name: persona.persona_name || persona.name || `Persona ${persona.persona_id}`,
        system_prompt: persona.system_prompt,
        context: persona.context,
        default_replica_id: persona.default_replica_id
      }));
    } catch (error: any) {
      console.error('Error fetching therapy personas:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your Tavus API key permissions.');
      } else if (error.response?.data?.message) {
        console.error('API Error details:', error.response.data);
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to fetch therapy personas. Please check your internet connection.');
      }
    }
  }

  // Create a therapy conversation with selected persona
  async createTherapyConversation(personaId: string): Promise<TavusConversation> {
    if (!this.apiKey || !this.isConfigured()) {
      throw new Error('Tavus API key is not configured. Please set VITE_TAVUS_API_KEY in your environment variables.');
    }

    if (!personaId) {
      throw new Error('Please select a therapy persona to start the session.');
    }

    try {
      const payload = {
        persona_id: personaId,
        conversation_name: 'Live Life Therapy Session',
        properties: {
          max_call_duration: 3600, // 1 hour
          participant_left_timeout: 120,
          participant_absent_timeout: 300,
          enable_recording: false,
          apply_greenscreen: false,
          language: 'English',
        }
      };

      console.log('Creating therapy conversation with persona:', personaId);

      const response = await axios.post(
        `${this.baseURL}/v2/conversations`,
        payload,
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );

      console.log('Therapy conversation created successfully:', response.data);
      
      const conversation = {
        ...response.data,
        persona_id: personaId
      };

      return conversation;
    } catch (error: any) {
      console.error('Error creating therapy conversation:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad request';
        console.error('Tavus 400 error details:', error.response?.data);
        
        if (errorMessage.toLowerCase().includes('persona')) {
          throw new Error('Invalid persona selected. Please try selecting a different therapy persona.');
        } else if (errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('limit')) {
          throw new Error('API quota exceeded. Please check your Tavus account limits.');
        } else {
          throw new Error(`Tavus API error: ${errorMessage}`);
        }
      } else if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your Tavus API key permissions.');
      } else if (error.response?.status === 404) {
        throw new Error('Persona not found. Please select a valid therapy persona.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        throw new Error('Failed to create therapy session. Please check your internet connection and try again.');
      }
    }
  }

  // End a therapy conversation
  async endConversation(conversationId: string): Promise<void> {
    if (!this.apiKey || !this.isConfigured()) {
      throw new Error('Tavus API key is not configured.');
    }

    try {
      console.log('Ending conversation:', conversationId);
      await axios.post(
        `${this.baseURL}/v2/conversations/${conversationId}/end`,
        {},
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );
      console.log('Conversation ended successfully');
    } catch (error: any) {
      console.error('Error ending therapy conversation:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key.');
      } else if (error.response?.status === 404) {
        console.warn('Conversation not found - may already be ended');
        // Don't throw error for 404 as conversation might already be ended
      } else if (error.response?.data?.message) {
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        console.warn('Failed to end conversation, but continuing...');
      }
    }
  }

  // Get conversation status
  async getConversationStatus(conversationId: string): Promise<TavusConversation | null> {
    if (!this.apiKey || !this.isConfigured()) {
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
      console.error('Error fetching conversation status:', error);
      
      if (error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return !!this.apiKey && 
           !this.apiKey.includes('your_tavus_api_key_here') && 
           !this.apiKey.includes('your_actual_tavus_api_key_here') &&
           this.apiKey.length > 10;
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    if (!this.apiKey || !this.isConfigured()) {
      return false;
    }

    try {
      await this.getTherapyPersonas();
      return true;
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }
}

export const tavusService = new TavusService();