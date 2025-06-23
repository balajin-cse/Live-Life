import axios from 'axios';

// Tavus API configuration
const TAVUS_API_BASE = 'https://tavusapi.com';
const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;
const TAVUS_PERSONA_ID = import.meta.env.VITE_TAVUS_PERSONA_ID;

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
  private personaId: string;
  private baseURL: string;

  constructor() {
    this.apiKey = TAVUS_API_KEY || '';
    this.personaId = TAVUS_PERSONA_ID || '';
    this.baseURL = TAVUS_API_BASE;
    
    if (!this.apiKey) {
      console.warn('Tavus API key not found. Please set VITE_TAVUS_API_KEY in your environment variables.');
    }
    if (!this.personaId) {
      console.warn('Tavus Persona ID not found. Please set VITE_TAVUS_PERSONA_ID in your environment variables.');
    }
  }

  private getHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // Get the configured persona details
  async getPersonaDetails(): Promise<TavusPersona | null> {
    if (!this.apiKey || !this.personaId || !this.isConfigured()) {
      console.warn('Tavus service is not fully configured.');
      return null;
    }

    try {
      console.log('Fetching persona details for ID:', this.personaId);
      const response = await axios.get(
        `${this.baseURL}/v2/personas/${this.personaId}`,
        { 
          headers: this.getHeaders(),
          timeout: 30000
        }
      );

      const persona = response.data;
      console.log('Fetched persona details:', persona);
      
      return {
        persona_id: persona.persona_id || persona.id || this.personaId,
        persona_name: persona.persona_name || persona.name || 'AI Therapy Companion',
        system_prompt: persona.system_prompt,
        context: persona.context,
        default_replica_id: persona.default_replica_id
      };
    } catch (error: any) {
      console.error('Error fetching persona details:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Tavus API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your Tavus API key permissions.');
      } else if (error.response?.status === 404) {
        throw new Error('Persona not found. Please check your VITE_TAVUS_PERSONA_ID in the .env file.');
      } else if (error.response?.data?.message) {
        console.error('API Error details:', error.response.data);
        throw new Error(`Tavus API error: ${error.response.data.message}`);
      } else {
        // Return a default persona if we can't fetch details but have the ID
        console.warn('Could not fetch persona details, using default');
        return {
          persona_id: this.personaId,
          persona_name: 'AI Therapy Companion',
          system_prompt: 'I am your AI therapy companion, here to provide support and guidance.',
          context: 'Therapy and mental wellness support'
        };
      }
    }
  }

  // Create a therapy conversation with the configured persona
  async createTherapyConversation(): Promise<TavusConversation> {
    if (!this.apiKey || !this.personaId || !this.isConfigured()) {
      throw new Error('Tavus service is not configured. Please check your API key and persona ID.');
    }

    try {
      const payload = {
        persona_id: this.personaId,
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

      console.log('Creating therapy conversation with persona:', this.personaId);

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
        persona_id: this.personaId
      };

      return conversation;
    } catch (error: any) {
      console.error('Error creating therapy conversation:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad request';
        console.error('Tavus 400 error details:', error.response?.data);
        
        if (errorMessage.toLowerCase().includes('persona')) {
          throw new Error('Invalid persona ID. Please check your VITE_TAVUS_PERSONA_ID in the .env file.');
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
        throw new Error('Persona not found. Please check your VITE_TAVUS_PERSONA_ID in the .env file.');
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
           !!this.personaId &&
           !this.apiKey.includes('your_tavus_api_key_here') && 
           !this.apiKey.includes('your_actual_tavus_api_key_here') &&
           !this.personaId.includes('your_persona_id_here') &&
           !this.personaId.includes('your_actual_persona_id_here') &&
           this.apiKey.length > 10 &&
           this.personaId.length > 10;
  }

  // Get the configured persona ID
  getPersonaId(): string {
    return this.personaId;
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    if (!this.apiKey || !this.isConfigured()) {
      return false;
    }

    try {
      await this.getPersonaDetails();
      return true;
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }
}

export const tavusService = new TavusService();