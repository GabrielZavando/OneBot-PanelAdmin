/**
 * Modelo de Bot del Sistema
 * 
 * Define la estructura de datos para los bots/chatbots de la aplicación,
 * incluyendo configuración, perfiles y ajustes.
 */

/**
 * Configuraciones del bot
 */
export interface BotSettings {
  /** Mensaje de bienvenida del bot */
  welcomeMessage: string;
  
  /** Configuraciones adicionales del bot */
  [key: string]: any;
}

/**
 * Interface principal para el modelo de Bot
 * 
 * @interface Bot
 * @description Representa un bot/chatbot en el sistema
 */
export interface Bot {
  /** Nombre del bot */
  name: string;
  
  /** Descripción del bot */
  description: string;
  
  /** ID del propietario del bot */
  ownerId: string;
  
  /** ID del perfil LLM asociado */
  llmProfileId: string;
  
  /** ID del perfil de vectorstore asociado */
  vectorstoreProfileId: string;
  
  /** ID del perfil de UI asociado */
  uiProfileId: string;
  
  /** Indica si el bot utiliza vectorstore */
  useVectorstore: boolean;
  
  /** Indica si el bot está activo */
  isActive: boolean;
  
  /** Configuraciones del bot */
  settings: BotSettings;
}

/**
 * Type guard para verificar si un objeto es un Bot válido
 * 
 * @param obj - Objeto a verificar
 * @returns true si el objeto es un Bot válido
 */
export function isBot(obj: any): obj is Bot {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj['name'] === 'string' &&
    typeof obj['description'] === 'string' &&
    typeof obj['ownerId'] === 'string' &&
    typeof obj['llmProfileId'] === 'string' &&
    typeof obj['vectorstoreProfileId'] === 'string' &&
    typeof obj['uiProfileId'] === 'string' &&
    typeof obj['useVectorstore'] === 'boolean' &&
    typeof obj['isActive'] === 'boolean' &&
    obj['settings'] &&
    typeof obj['settings'] === 'object' &&
    typeof obj['settings']['welcomeMessage'] === 'string'
  );
}