export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
  };
}

export interface OpenAIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  stream: boolean;
  streamOptions: {
    includeUsage: boolean;
  };
  tools: Tool[];
}

export interface GeminiConfig {
  model: string;
  temperature: number;
  topK: number;
  maxOutputTokens: number;
  stream: boolean;
  responseMimeType: string;
}

export interface AnthropicConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  stream: boolean;
}

// Interfaz para información del widget embebible
export interface ChatbotWidget {
  scriptUrl: string;
  previewUrl: string;
  configUrl: string;
  embedCode: string;
}

export interface ChatbotData {
  name: string;
  description?: string;
  systemPrompt: string;
  avatarUrl?: string;
  llmProvider: 'openai' | 'gemini' | 'anthropic';
  openai?: OpenAIConfig;
  gemini?: GeminiConfig;
  anthropic?: AnthropicConfig;
  vectorstore?: {
    enabled: boolean;
    collection: string;
    vectorSize: number;
  };
  active: boolean;
}

// Interfaz extendida para chatbots con información adicional del servidor
export interface Chatbot extends ChatbotData {
  id: string;
  createdAt: string;
  updatedAt: string;
  messagesCount?: number;
  lastMessageAt?: string;
  status: 'active' | 'inactive' | 'testing';
  widget?: ChatbotWidget;
}

// Respuesta de la API para obtener chatbots
export interface ChatbotsResponse {
  success: boolean;
  data: Chatbot[];
  message?: string;
}

// Respuesta de la API para crear/actualizar un chatbot
export interface ChatbotResponse {
  success: boolean;
  data: Chatbot;
  message?: string;
}
