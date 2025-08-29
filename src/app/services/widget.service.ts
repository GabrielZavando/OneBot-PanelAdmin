import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  WidgetConfig, 
  WidgetConfigResponse, 
  WidgetConfigUpdateResponse, 
  WidgetScriptResponse,
  DEFAULT_WIDGET_CONFIG 
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private readonly baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la configuración del widget para un chatbot específico
   */
  getWidgetConfig(chatbotId: string): Observable<WidgetConfigResponse> {
    return this.http.get<WidgetConfigResponse>(`${this.baseUrl}/embed/config/${chatbotId}`);
  }

  /**
   * Actualiza la configuración del widget para un chatbot específico
   */
  updateWidgetConfig(chatbotId: string, config: WidgetConfig): Observable<WidgetConfigUpdateResponse> {
    return this.http.put<WidgetConfigUpdateResponse>(`${this.baseUrl}/embed/config/${chatbotId}`, config);
  }

  /**
   * Obtiene la URL del script del widget y el código de embebido
   */
  getWidgetScript(chatbotId: string): Observable<WidgetScriptResponse> {
    return this.http.get<WidgetScriptResponse>(`${this.baseUrl}/embed/widget/${chatbotId}.js`);
  }

  /**
   * Crea una configuración de widget por defecto para un chatbot
   */
  createDefaultWidgetConfig(chatbotId: string): WidgetConfig {
    return {
      chatbotId,
      ...DEFAULT_WIDGET_CONFIG
    };
  }

  /**
   * Valida una configuración de widget
   */
  validateWidgetConfig(config: WidgetConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validaciones básicas
    if (!config.chatbotId) {
      errors.push('ID del chatbot es requerido');
    }

    // Validaciones de apariencia
    if (!this.isValidColor(config.appearance.primaryColor)) {
      errors.push('Color primario debe ser un color hexadecimal válido');
    }

    if (!this.isValidColor(config.appearance.backgroundColor)) {
      errors.push('Color de fondo debe ser un color hexadecimal válido');
    }

    // Validaciones de posición
    if (config.position.bubbleSize < 40 || config.position.bubbleSize > 100) {
      errors.push('Tamaño de la burbuja debe estar entre 40 y 100 pixels');
    }

    if (config.position.chatWidth < 300 || config.position.chatWidth > 800) {
      errors.push('Ancho del chat debe estar entre 300 y 800 pixels');
    }

    if (config.position.chatHeight < 400 || config.position.chatHeight > 800) {
      errors.push('Alto del chat debe estar entre 400 y 800 pixels');
    }

    // Validaciones de comportamiento
    if (config.behavior.autoOpenDelay < 0 || config.behavior.autoOpenDelay > 60) {
      errors.push('Retraso de apertura automática debe estar entre 0 y 60 segundos');
    }

    // Validaciones de chat
    if (!config.chat.headerTitle.trim()) {
      errors.push('Título del header es requerido');
    }

    if (!config.chat.welcomeMessage.trim()) {
      errors.push('Mensaje de bienvenida es requerido');
    }

    if (config.chat.maxFileSize < 1 || config.chat.maxFileSize > 50) {
      errors.push('Tamaño máximo de archivo debe estar entre 1 y 50 MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Genera el código de embebido para un chatbot
   */
  generateEmbedCode(chatbotId: string): string {
    const scriptUrl = `${this.baseUrl}/embed/widget/${chatbotId}.js`;
    return `<script src="${scriptUrl}" async></script>`;
  }

  /**
   * Genera la URL de preview del widget
   */
  generatePreviewUrl(chatbotId: string): string {
    return `${this.baseUrl}/embed/preview/${chatbotId}`;
  }

  /**
   * Valida si una cadena es un color hexadecimal válido
   */
  private isValidColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }

  /**
   * Convierte valores de configuración para el formato esperado por la API
   */
  formatConfigForAPI(config: WidgetConfig): WidgetConfig {
    return {
      ...config,
      appearance: {
        ...config.appearance,
        fontSize: Math.round(config.appearance.fontSize),
        borderRadius: Math.round(config.appearance.borderRadius),
        borderWidth: Math.round(config.appearance.borderWidth),
        opacity: Math.round(config.appearance.opacity * 100) / 100
      },
      position: {
        ...config.position,
        bubbleMarginX: Math.round(config.position.bubbleMarginX),
        bubbleMarginY: Math.round(config.position.bubbleMarginY),
        bubbleSize: Math.round(config.position.bubbleSize),
        chatWidth: Math.round(config.position.chatWidth),
        chatHeight: Math.round(config.position.chatHeight),
        mobileBreakpoint: Math.round(config.position.mobileBreakpoint)
      },
      behavior: {
        ...config.behavior,
        autoOpenDelay: Math.round(config.behavior.autoOpenDelay),
        animationDuration: Math.round(config.behavior.animationDuration)
      },
      chat: {
        ...config.chat,
        maxFileSize: Math.round(config.chat.maxFileSize),
        maxMessages: Math.round(config.chat.maxMessages)
      }
    };
  }
}
