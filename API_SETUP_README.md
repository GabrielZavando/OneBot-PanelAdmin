# APIs Reales vs Datos Mock - OneBot AdminWeb

## 🔧 **Cambios Implementados**

Se ha actualizado el proyecto para usar **APIs reales** en lugar de datos mock:

### ✅ **APIs Reales Configuradas**

#### 1. **Servicio de Chatbots (`ChatbotService`)**
- **GET** `/api/v1/chatbots` - Obtener lista de chatbots
- **POST** `/api/v1/chatbots` - Crear nuevo chatbot
- **GET** `/api/v1/chatbots/{id}` - Obtener chatbot por ID
- **PUT** `/api/v1/chatbots/{id}` - Actualizar chatbot
- **DELETE** `/api/v1/chatbots/{id}` - Eliminar chatbot

#### 2. **Servicio de Widgets (`WidgetService`)**
- **GET** `/api/v1/embed/config/{chatbotId}` - Obtener configuración de widget
- **PUT** `/api/v1/embed/config/{chatbotId}` - Actualizar configuración de widget
- **GET** `/api/v1/embed/widget/{chatbotId}.js` - Obtener script del widget

### 🔄 **Interceptors HTTP Implementados**

#### **AuthInterceptor**
- Agrega automáticamente el token Bearer a todas las peticiones al backend
- Solo se aplica a URLs que coincidan con `environment.apiBaseUrl`

#### **ErrorInterceptor**
- Manejo centralizado de errores HTTP
- Redirección automática en caso de tokens expirados (401)
- Mensajes de error descriptivos para diferentes códigos de estado

### 🌐 **Configuración de Variables de Entorno**

Las URLs del backend se configuran desde `environment.apiBaseUrl`:

```typescript
// Desarrollo
apiBaseUrl: 'http://localhost:3000/api/v1'

// Producción  
apiBaseUrl: 'https://api.yourproductiondomain.com/api/v1'
```

## 🚀 **Cómo Usar**

### **1. Configurar Backend**
Asegúrate de que tu backend esté ejecutándose en la URL configurada en `environment.apiBaseUrl`.

### **2. Autenticación**
El sistema enviará automáticamente el token JWT en el header `Authorization: Bearer <token>` para todas las peticiones al backend.

### **3. Manejo de Errores**
Los errores HTTP se manejan automáticamente:
- **401**: Redirección a login
- **403**: Sin permisos
- **404**: Recurso no encontrado
- **500**: Error del servidor
- **0**: Error de conexión

### **4. Testing con Backend Real**
Para probar con un backend real:

1. Configura la variable `NG_APP_API_BASE_URL` en tu `.env`:
   ```bash
   NG_APP_API_BASE_URL=http://localhost:3000/api/v1
   ```

2. Asegúrate de que el backend implemente los endpoints esperados

3. Inicia la aplicación:
   ```bash
   npm start
   ```

## 📋 **Estructura de Respuestas Esperadas**

### **ChatbotsResponse**
```typescript
interface ChatbotsResponse {
  success: boolean;
  data: Chatbot[];
  message?: string;
}
```

### **ChatbotResponse**
```typescript
interface ChatbotResponse {
  success: boolean;
  data: Chatbot;
  message?: string;
}
```

### **WidgetConfigResponse**
```typescript
interface WidgetConfigResponse {
  success: boolean;
  data: WidgetConfig;
  message?: string;
}
```

## ⚠️ **Notas Importantes**

1. **Token Expiration**: Los tokens expirados se manejan automáticamente redirigiendo al login
2. **Network Errors**: Los errores de red muestran mensajes descriptivos
3. **CORS**: Asegúrate de que tu backend tenga CORS configurado correctamente
4. **Headers**: Todas las peticiones incluyen automáticamente `Content-Type: application/json`

## 🔍 **Debugging**

Para debuggear problemas con las APIs:

1. Abre las DevTools del navegador
2. Ve a la pestaña **Network**
3. Filtra por XHR/Fetch
4. Verifica que las peticiones se envíen con:
   - URL correcta (`environment.apiBaseUrl`)
   - Header `Authorization: Bearer <token>`
   - Payload correcto en el body

Los logs de errores aparecerán en la consola con información detallada.
