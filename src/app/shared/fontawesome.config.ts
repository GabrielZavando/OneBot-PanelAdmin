import { FaIconLibrary, FaConfig } from '@fortawesome/angular-fontawesome';
import {
  faRobot,
  faSearch,
  faEye,
  faEyeSlash,
  faEnvelope,
  faExclamationTriangle,
  faTimes,
  faUser,
  faCog,
  faSignOutAlt,
  faBars,
  faChevronDown,
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons';

/**
 * Configuración de FontAwesome para la aplicación
 * Centraliza la configuración de iconos y temas
 */
export function configureFontAwesome(library: FaIconLibrary): void {
  // Agregar iconos que usaremos en la aplicación
  library.addIcons(
    faRobot,        // 🤖 - Logo/bot
    faSearch,       // 🔍 - Búsqueda
    faEye,          // 👁️ - Mostrar contraseña
    faEyeSlash,     // 🙈 - Ocultar contraseña
    faEnvelope,     // 📧 - Email
    faExclamationTriangle, // ⚠️ - Advertencias/errores
    faTimes,        // × - Cerrar
    faUser,         // 👤 - Usuario
    faCog,          // ⚙️ - Configuración
    faSignOutAlt,   // 🚪 - Salir
    faBars,         // ☰ - Menú hamburguesa
    faChevronDown,  // ▼ - Flecha abajo
    faSun,          // ☀️ - Tema claro
    faMoon          // 🌙 - Tema oscuro
  );
}

/**
 * Configuración de FontAwesome para providers
 */
export const fontAwesomeConfig = {
  provide: FaConfig,
  useValue: {
    // Configuración adicional si es necesaria
    defaultPrefix: 'fas'
  }
};