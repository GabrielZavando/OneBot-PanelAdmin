/**
 * Modelo de Usuario del Sistema
 * 
 * Define la estructura de datos para los usuarios de la aplicación,
 * incluyendo información de autenticación, perfil y metadata.
 */

/**
 * Interface principal para el modelo de Usuario
 * 
 * @interface User
 * @description Representa un usuario autenticado en el sistema
 */
export interface User {
  /** Identificador único del usuario */
  uid: string;
  
  /** Dirección de correo electrónico del usuario */
  email: string;
  
  /** Nombre a mostrar del usuario */
  displayName: string;
  
  /** Indica si el email ha sido verificado */
  emailVerified: boolean;
  
  /** URL de la foto de perfil (opcional) */
  photoURL?: string | null;
  
  /** Rol del usuario en el sistema */
  role: string;
  
  /** Fecha de creación del usuario */
  createdAt: Date;
  
  /** Fecha de última actualización */
  updatedAt: Date;
}
