export function decodeJWT(token: string): any {
  try {
    // Dividir el token en sus partes
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decodificar la parte del payload (segunda parte)
    const payload = parts[1];
    
    // Agregar padding si es necesario
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decodificar base64
    const decodedPayload = atob(paddedPayload);
    
    // Parsear JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function logJWTClaims(token: string, label: string = 'JWT Claims'): void {
  const claims = decodeJWT(token);
  if (claims) {
    console.log(`${label}:`, {
      iss: claims.iss, // issuer
      sub: claims.sub, // subject (user ID)
      aud: claims.aud, // audience
      exp: claims.exp ? new Date(claims.exp * 1000) : undefined, // expiration
      iat: claims.iat ? new Date(claims.iat * 1000) : undefined, // issued at
      email: claims.email,
      email_verified: claims.email_verified,
      role: claims.role,
      roles: claims.roles,
      custom_claims: claims.custom_claims,
      // Mostrar todas las propiedades custom
      ...Object.keys(claims)
        .filter(key => !['iss', 'sub', 'aud', 'exp', 'iat', 'email', 'email_verified'].includes(key))
        .reduce((acc, key) => ({ ...acc, [key]: claims[key] }), {})
    });
  }
}