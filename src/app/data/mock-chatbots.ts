import { Chatbot } from '../interfaces';

export const MOCK_CHATBOTS: Chatbot[] = [
  {
    id: '1',
    name: 'Bot de Ventas',
    description: 'Asistente especializado en procesos de ventas y consultas comerciales. Ayuda a los clientes con información de productos, precios y promociones.',
    systemPrompt: 'Eres un asistente de ventas experto. Tu objetivo es ayudar a los clientes con sus consultas comerciales de manera amigable y profesional.',
    avatarUrl: '',
    llmProvider: 'openai',
    active: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    status: 'active',
    messagesCount: 1247,
    lastMessageAt: '2024-01-20T14:30:00Z',
    widget: {
      scriptUrl: 'http://localhost:3000/api/v1/embed/widget/1.js',
      previewUrl: 'http://localhost:3000/api/v1/embed/preview/1',
      configUrl: 'http://localhost:3000/api/v1/embed/config/1',
      embedCode: '<script src="http://localhost:3000/api/v1/embed/widget/1.js" async></script>'
    },
    openai: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1024,
      topP: 1,
      stream: true,
      streamOptions: {
        includeUsage: true
      },
      tools: []
    }
  },
  {
    id: '2',
    name: 'Bot de Soporte Técnico',
    description: 'Especialista en resolver problemas técnicos y proporcionar guías de troubleshooting paso a paso.',
    systemPrompt: 'Eres un técnico experto en soporte. Proporciona soluciones claras y paso a paso para problemas técnicos.',
    avatarUrl: '',
    llmProvider: 'anthropic',
    active: true,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-19T16:20:00Z',
    status: 'testing',
    messagesCount: 856,
    lastMessageAt: '2024-01-19T16:15:00Z',
    widget: {
      scriptUrl: 'http://localhost:3000/api/v1/embed/widget/2.js',
      previewUrl: 'http://localhost:3000/api/v1/embed/preview/2',
      configUrl: 'http://localhost:3000/api/v1/embed/config/2',
      embedCode: '<script src="http://localhost:3000/api/v1/embed/widget/2.js" async></script>'
    },
    anthropic: {
      model: 'claude-3-5-sonnet-20240620',
      temperature: 0.6,
      maxTokens: 1024,
      topP: 0.9,
      stream: false
    }
  },
  {
    id: '3',
    name: 'Asistente de RRHH',
    description: 'Bot especializado en recursos humanos, políticas de empresa y procedimientos administrativos.',
    systemPrompt: 'Eres un asistente de recursos humanos. Ayuda con consultas sobre políticas, beneficios y procedimientos de la empresa.',
    avatarUrl: '',
    llmProvider: 'gemini',
    active: false,
    createdAt: '2024-01-05T14:22:00Z',
    updatedAt: '2024-01-18T11:10:00Z',
    status: 'inactive',
    messagesCount: 423,
    lastMessageAt: '2024-01-18T11:05:00Z',
    widget: {
      scriptUrl: 'http://localhost:3000/api/v1/embed/widget/3.js',
      previewUrl: 'http://localhost:3000/api/v1/embed/preview/3',
      configUrl: 'http://localhost:3000/api/v1/embed/config/3',
      embedCode: '<script src="http://localhost:3000/api/v1/embed/widget/3.js" async></script>'
    },
    gemini: {
      model: 'gemini-1.5-pro',
      temperature: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
      stream: true,
      responseMimeType: 'application/json'
    }
  },
  {
    id: '4',
    name: 'Bot de Reservas',
    description: 'Gestiona reservas de citas, cancelaciones y reprogramaciones de manera eficiente.',
    systemPrompt: 'Eres un asistente de reservas. Ayuda a los usuarios a programar, modificar o cancelar sus citas de manera eficiente.',
    avatarUrl: '',
    llmProvider: 'openai',
    active: true,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-21T09:30:00Z',
    status: 'active',
    messagesCount: 2103,
    lastMessageAt: '2024-01-21T09:25:00Z',
    widget: {
      scriptUrl: 'http://localhost:3000/api/v1/embed/widget/4.js',
      previewUrl: 'http://localhost:3000/api/v1/embed/preview/4',
      configUrl: 'http://localhost:3000/api/v1/embed/config/4',
      embedCode: '<script src="http://localhost:3000/api/v1/embed/widget/4.js" async></script>'
    },
    openai: {
      model: 'gpt-4o-mini',
      temperature: 0.5,
      maxTokens: 512,
      topP: 1,
      stream: true,
      streamOptions: {
        includeUsage: true
      },
      tools: []
    }
  },
  {
    id: '5',
    name: 'Asistente de Marketing',
    description: 'Especialista en estrategias de marketing digital, contenido y análisis de campañas.',
    systemPrompt: 'Eres un especialista en marketing digital. Ayuda con estrategias de contenido, campañas y análisis de métricas.',
    avatarUrl: '',
    llmProvider: 'gemini',
    active: true,
    createdAt: '2024-01-08T12:15:00Z',
    updatedAt: '2024-01-20T17:40:00Z',
    status: 'testing',
    messagesCount: 731,
    lastMessageAt: '2024-01-20T17:35:00Z',
    widget: {
      scriptUrl: 'http://localhost:3000/api/v1/embed/widget/5.js',
      previewUrl: 'http://localhost:3000/api/v1/embed/preview/5',
      configUrl: 'http://localhost:3000/api/v1/embed/config/5',
      embedCode: '<script src="http://localhost:3000/api/v1/embed/widget/5.js" async></script>'
    },
    gemini: {
      model: 'gemini-1.5-flash',
      temperature: 0.9,
      topK: 50,
      maxOutputTokens: 1536,
      stream: true,
      responseMimeType: 'text/plain'
    }
  }
];
