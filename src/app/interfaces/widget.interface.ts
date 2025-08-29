export interface WidgetConfig {
  id?: string;
  chatbotId: string;
  
  // Configuración de apariencia
  appearance: WidgetAppearance;
  
  // Configuración de comportamiento
  behavior: WidgetBehavior;
  
  // Configuración de posición
  position: WidgetPosition;
  
  // Configuración del chat
  chat: ChatConfig;
  
  // Metadatos
  createdAt?: string;
  updatedAt?: string;
}

export interface WidgetAppearance {
  // Colores principales
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Colores de la burbuja
  bubbleBackgroundColor: string;
  bubbleIconColor: string;
  bubbleShadow: boolean;
  
  // Tipografía
  fontFamily: string;
  fontSize: number;
  
  // Bordes y formas
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  
  // Efectos visuales
  hasGradient: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  opacity: number;
}

export interface WidgetBehavior {
  // Comportamiento de apertura
  autoOpen: boolean;
  autoOpenDelay: number; // en segundos
  
  // Comportamiento de cierre
  allowClose: boolean;
  closeOnEscape: boolean;
  
  // Interacciones
  allowMinimize: boolean;
  allowResize: boolean;
  
  // Animaciones
  enableAnimations: boolean;
  animationType: 'fade' | 'slide' | 'bounce' | 'none';
  animationDuration: number; // en milisegundos
  
  // Sonidos
  enableSounds: boolean;
  
  // Persistencia
  rememberState: boolean;
}

export interface WidgetPosition {
  // Posición de la burbuja
  bubblePosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  bubbleMarginX: number; // en pixels
  bubbleMarginY: number; // en pixels
  bubbleSize: number; // tamaño de la burbuja en pixels
  
  // Posición de la ventana de chat
  chatPosition: 'corner' | 'center' | 'sidebar';
  chatWidth: number; // en pixels
  chatHeight: number; // en pixels
  
  // Responsive
  mobileBreakpoint: number; // en pixels
  mobileWidth: string; // porcentaje o pixels
  mobileHeight: string; // porcentaje o pixels
}

export interface ChatConfig {
  // Configuración del header
  showHeader: boolean;
  headerTitle: string;
  headerSubtitle: string;
  showAvatar: boolean;
  avatarUrl: string;
  
  // Configuración de mensajes
  welcomeMessage: string;
  placeholderText: string;
  
  // Configuración de entrada
  allowFileUpload: boolean;
  maxFileSize: number; // en MB
  allowedFileTypes: string[];
  
  // Configuración de visualización
  showTypingIndicator: boolean;
  showTimestamps: boolean;
  maxMessages: number; // límite de mensajes mostrados
  
  // Branding
  showPoweredBy: boolean;
  customBranding: string;
}

// Respuesta de la API para obtener la configuración
export interface WidgetConfigResponse {
  success: boolean;
  data: WidgetConfig;
  message?: string;
}

// Respuesta de la API para actualizar la configuración
export interface WidgetConfigUpdateResponse {
  success: boolean;
  data: WidgetConfig;
  message?: string;
}

// Respuesta de la API para generar el script del widget
export interface WidgetScriptResponse {
  success: boolean;
  data: {
    scriptUrl: string;
    embedCode: string;
    previewUrl: string;
  };
  message?: string;
}

// Configuración por defecto para nuevos widgets
export const DEFAULT_WIDGET_CONFIG: Omit<WidgetConfig, 'id' | 'chatbotId' | 'createdAt' | 'updatedAt'> = {
  appearance: {
    primaryColor: '#3B82F6',
    secondaryColor: '#EFF6FF',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    bubbleBackgroundColor: '#3B82F6',
    bubbleIconColor: '#FFFFFF',
    bubbleShadow: true,
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    hasGradient: false,
    gradientFrom: '#3B82F6',
    gradientTo: '#1D4ED8',
    opacity: 1
  },
  behavior: {
    autoOpen: false,
    autoOpenDelay: 3,
    allowClose: true,
    closeOnEscape: true,
    allowMinimize: true,
    allowResize: false,
    enableAnimations: true,
    animationType: 'slide',
    animationDuration: 300,
    enableSounds: false,
    rememberState: true
  },
  position: {
    bubblePosition: 'bottom-right',
    bubbleMarginX: 20,
    bubbleMarginY: 20,
    bubbleSize: 60,
    chatPosition: 'corner',
    chatWidth: 400,
    chatHeight: 600,
    mobileBreakpoint: 768,
    mobileWidth: '100%',
    mobileHeight: '100%'
  },
  chat: {
    showHeader: true,
    headerTitle: 'Chat de Soporte',
    headerSubtitle: 'Estamos aquí para ayudarte',
    showAvatar: true,
    avatarUrl: '',
    welcomeMessage: '¡Hola! ¿En qué puedo ayudarte hoy?',
    placeholderText: 'Escribe tu mensaje...',
    allowFileUpload: false,
    maxFileSize: 5,
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    showTypingIndicator: true,
    showTimestamps: false,
    maxMessages: 50,
    showPoweredBy: true,
    customBranding: ''
  }
};
