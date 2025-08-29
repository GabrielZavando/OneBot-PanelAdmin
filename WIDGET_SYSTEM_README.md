# Sistema de Widgets Embebibles - OneBot Panel Admin

## 🎉 Implementación Completada

Se ha implementado exitosamente el sistema completo de widgets embebibles para OneBot. El sistema permite a los usuarios:

### ✅ Funcionalidades Implementadas

#### 1. **Lista de Chatbots Dinámica**
- Visualización de todos los chatbots creados en formato de tarjetas
- Información detallada: nombre, descripción, estado, proveedor LLM, estadísticas
- Estados visuales: Activo (verde), En pruebas (amarillo), Inactivo (rojo)
- Datos de ejemplo incluidos para demostración

#### 2. **Configuración de Widgets Embebibles**
- **Apariencia**: Colores personalizables, tipografía, bordes, gradientes, opacidad
- **Posición**: Ubicación de burbuja (4 esquinas), posición de chat (esquina/centro/sidebar)
- **Comportamiento**: Animaciones, auto-apertura, sonidos, persistencia
- **Chat**: Header personalizable, mensajes de bienvenida, configuración de archivos

#### 3. **Vista Previa en Tiempo Real**
- Simulación visual del widget en un sitio web
- Actualización instantánea al cambiar configuraciones
- Burbuja de chat interactiva con animaciones
- Vista previa completa del chat con todos los elementos

#### 4. **Generación de Código Embebible**
- Código JavaScript automático: `<script src="..."></script>`
- Funcionalidad de copiar al portapapeles
- URLs únicas por chatbot: `/api/v1/embed/widget/{chatbotId}.js`

#### 5. **Gestión Completa de Chatbots**
- Crear nuevos chatbots (multi-proveedor: OpenAI, Gemini, Anthropic)
- Editar configuración de widgets
- Eliminar chatbots con confirmación
- Formularios dinámicos según el proveedor LLM

### 🛠️ Arquitectura Técnica

#### **Servicios**
- `WidgetService`: Gestión de configuraciones de widgets
- `ChatbotService`: CRUD de chatbots
- APIs RESTful con tipado TypeScript

#### **Componentes**
- `ChatbotsComponent`: Lista principal y gestión
- `WidgetConfigComponent`: Configuración avanzada de widgets
- `WidgetPreviewComponent`: Vista previa en tiempo real

#### **Interfaces TypeScript**
- `WidgetConfig`: Configuración completa del widget
- `WidgetAppearance`: Personalización visual
- `WidgetBehavior`: Comportamiento y animaciones
- `WidgetPosition`: Posicionamiento y dimensiones
- `ChatConfig`: Configuración del chat

### 🎨 Características de UX/UI

#### **Diseño Responsivo**
- Adaptable a móviles y tablets
- Modal full-screen en dispositivos pequeños
- Grid responsive para lista de chatbots

#### **Animaciones y Transiciones**
- Efectos hover en tarjetas
- Animaciones de entrada escalonadas
- Transiciones suaves en formularios
- Vista previa con animaciones reales del widget

#### **Validación de Formularios**
- Validación en tiempo real
- Mensajes de error contextuales
- Validación específica por proveedor LLM
- Rangos y límites apropiados

### 📋 Configuraciones Disponibles

#### **Apariencia**
- ✅ Colores: Primario, secundario, fondo, texto, burbuja
- ✅ Tipografía: 5 familias de fuentes, tamaño ajustable
- ✅ Bordes: Radio, grosor, color
- ✅ Efectos: Gradientes, sombras, opacidad

#### **Posición y Tamaño**
- ✅ Posición de burbuja: 4 esquinas configurables
- ✅ Posición de chat: Esquina, centro o sidebar
- ✅ Dimensiones: Ancho, alto, márgenes personalizables
- ✅ Responsive: Breakpoints y dimensiones móviles

#### **Comportamiento**
- ✅ Auto-apertura con retraso configurable
- ✅ Animaciones: 4 tipos (fade, slide, bounce, none)
- ✅ Controles: Cerrar, minimizar, redimensionar
- ✅ Persistencia de estado

#### **Chat**
- ✅ Header personalizable con avatar
- ✅ Mensajes de bienvenida
- ✅ Subida de archivos opcional
- ✅ Indicadores de escritura y timestamps
- ✅ Branding personalizable

### 🚀 Próximos Pasos

#### **Backend Integration**
El sistema está listo para conectarse con las siguientes APIs:

```typescript
// Configuración de widgets
GET    /api/v1/embed/config/{chatbotId}
PUT    /api/v1/embed/config/{chatbotId}

// Script del widget
GET    /api/v1/embed/widget/{chatbotId}.js

// Gestión de chatbots
GET    /api/v1/chatbots
POST   /api/v1/chatbots
PUT    /api/v1/chatbots/{id}
DELETE /api/v1/chatbots/{id}
```

#### **Características Avanzadas Futuras**
- [ ] Editor de temas visuales
- [ ] Plantillas de widgets predefinidas
- [ ] Analytics de uso del widget
- [ ] A/B testing de configuraciones
- [ ] Integración con Google Analytics
- [ ] Webhook notifications

### 📖 Cómo Usar

1. **Crear un Chatbot**: Usa el botón "Nuevo Chatbot" desde el sidebar o la página principal
2. **Configurar Widget**: Click en "Widget" en cualquier chatbot para abrir la configuración
3. **Personalizar**: Ajusta apariencia, posición y comportamiento en tiempo real
4. **Vista Previa**: Usa el botón "Abrir Chat" para ver cómo se verá el widget
5. **Embebir**: Copia el código generado y pégalo en cualquier sitio web

### 🎯 Estado Actual

- ✅ **Frontend**: 100% implementado y funcional
- ✅ **Vista Previa**: Completamente interactive
- ✅ **Formularios**: Validación completa
- ✅ **UI/UX**: Diseño profesional y responsivo
- ⏳ **Backend**: Listo para integración
- ⏳ **Testing**: Pendiente testing en sitios reales

El sistema está completamente funcional en el frontend y listo para integración con el backend. Todos los componentes, servicios e interfaces están implementados según las mejores prácticas de Angular y TypeScript.
