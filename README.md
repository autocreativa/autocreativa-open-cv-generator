<p align="center">
  <img src="https://autocreativa.com/wp-content/uploads/2024/12/logo-autocreativa.png" alt="Autocreativa Logo" width="200"/>
</p>

<h1 align="center">🚀 Autocreativa Open CV Generator</h1>

<p align="center">
  <strong>Generador de CV inteligente con IA, plantillas profesionales y editor visual</strong>
</p>

<p align="center">
  <a href="https://github.com/autocreativa/autocreativa-open-cv-generator/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"/>
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node Version"/>
  <img src="https://img.shields.io/badge/react-19.2-61dafb.svg" alt="React Version"/>
  <img src="https://img.shields.io/badge/vite-7.2-646cff.svg" alt="Vite Version"/>
</p>

<p align="center">
  <a href="#-características">Características</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-tecnologías">Tecnologías</a> •
  <a href="#-contribuir">Contribuir</a>
</p>

---

## 📖 Descripción

**Autocreativa Open CV Generator** es una aplicación web moderna que permite crear currículums profesionales de manera rápida y sencilla. Combina un potente editor visual con inteligencia artificial para ayudarte a destacar en tu búsqueda de empleo.

### ¿Para quién es?

- 👨‍💼 **Profesionales** que buscan actualizar su CV
- 🎓 **Estudiantes** que ingresan al mercado laboral
- 🔄 **Personas en transición de carrera** que necesitan reinventar su perfil
- 🌍 **Freelancers** que desean presentarse profesionalmente

---

## ✨ Características

### 📄 Importación Inteligente
- **Importar desde PDF**: Extrae automáticamente el texto de tu CV existente
- **Estructuración con IA**: La IA organiza la información en secciones

### 🎨 Plantillas Profesionales
- **+10 plantillas** diseñadas por profesionales
- **Categorías**: Modernas, Clásicas, Creativas, Minimalistas
- **Personalización**: Colores, tipografías y estilos

### ✏️ Editor Visual Completo
- **Secciones editables**: Datos personales, experiencia, educación, habilidades, idiomas, certificaciones
- **Vista previa en tiempo real**: Ve los cambios mientras editas
- **Guardado automático**: Nunca pierdas tu progreso (localStorage)

### 🤖 Funciones de IA
- **Mejora de textos**: Recibe 5 sugerencias para mejorar cada campo
- **Generación de cartas de presentación**: Crea cartas personalizadas con IA
- **Optimización**: La IA te ayuda a destacar tus logros

### 📥 Exportación
- **PDF de alta calidad**: Exporta tu CV listo para enviar
- **Carta de presentación**: Genera y descarga cartas en PDF

---

## 🌐 Demo

| Recurso | URL |
|---------|-----|
| 🌍 Web principal | [autocreativa.com](https://autocreativa.com) |
| 🚀 Demo de la app | [autocreativa.com/cv-generator](https://autocreativa.com/cv-generator) |
| 📧 Contacto | [contacto@autocreativa.com](mailto:contacto@autocreativa.com) |

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react) | 19.2 | Biblioteca UI |
| ![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite) | 7.2 | Build tool |
| ![React Router](https://img.shields.io/badge/React_Router-7.13-ca4245?logo=reactrouter) | 7.13 | Navegación SPA |
| ![Lucide](https://img.shields.io/badge/Lucide-0.563-f56565) | 0.563 | Iconografía |

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express) | 5.1 | Servidor HTTP |
| ![Nodemailer](https://img.shields.io/badge/Nodemailer-6.10-22b573) | 6.10 | Envío de emails |

### Servicios IA
| Tecnología | Descripción |
|------------|-------------|
| **ApiFreeLLM** | API de modelos de IA utilizada para todas las funciones inteligentes |

### Utilidades
| Tecnología | Descripción |
|------------|-------------|
| **PDF.js** | Extracción de texto de PDFs |
| **Tesseract.js** | OCR para PDFs escaneados |
| **html2pdf.js** | Generación de PDFs |
| **reCAPTCHA** | Protección contra bots |

---

## 📦 Instalación

### Requisitos Previos

- **Node.js** 18.0 o superior
- **npm** (incluido con Node.js)
- **API Key en ApiFreeLLM** para funciones de IA (ver documentación en https://apifreellm.com/)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/autocreativa/autocreativa-open-cv-generator.git
cd autocreativa-open-cv-generator
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tu editor favorito
nano .env  # o vim, code, etc.
```

Completa las siguientes variables esenciales:

```env
# Backend: API de IA (requerido para funciones de IA)
APIFREELLM_API_KEY=tu_api_key_aqui
APIFREELLM_API_URL=https://apifreellm.com/api/v1/chat

# Servidor de correo (opcional, para formulario de contacto)
SMTP_USER=tu_usuario_smtp
SMTP_PASS=tu_contraseña_smtp
```

> ⚠️ **IMPORTANTE**: Nunca subas tu archivo `.env` al repositorio. Está excluido por `.gitignore`.

### Paso 4: Iniciar el servidor de desarrollo

```bash
# Solo frontend (sin envío de emails)
npm run dev

# Frontend + servidor de emails
npm run dev:all
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🖥️ Servidor Backend (server/)

El proyecto incluye un servidor **Express.js** opcional que proporciona funcionalidades adicionales que no pueden ejecutarse desde el frontend.

### ¿Para qué sirve?

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/support` | Recibe mensajes del formulario de soporte y los envía por email |
| `POST /api/track-download` | Registra descargas de CV y envía alertas con el PDF adjunto |
| `GET /api/health` | Health check para monitoreo |

### Características del servidor

- 📧 **Envío de emails** con Nodemailer (SMTP)
- 🛡️ **Rate limiting** para prevenir abuso
- 🔒 **Verificación reCAPTCHA** (v2 y Enterprise)
- 📬 **Confirmaciones automáticas** al usuario
- 🎨 **Emails HTML** con diseño profesional

### Configuración del servidor

Las siguientes variables de entorno son necesarias para el servidor:

```env
# Puerto del servidor (por defecto: 5174)
PORT=5174

# Orígenes permitidos (CORS)
CORS_ORIGINS=http://localhost:5173

# Configuración SMTP (requerido para envío de emails)
SMTP_HOST=mail.tu-dominio.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario@tu-dominio.com
SMTP_PASS=tu_contraseña

# Remitente y destinatario
MAIL_FROM=contacto@tu-dominio.com
SUPPORT_INBOX=soporte@tu-dominio.com

# Alertas de descarga (separados por coma)
DOWNLOAD_ALERT_RECIPIENTS=admin@tu-dominio.com

# reCAPTCHA (opcional pero recomendado)
RECAPTCHA_SECRET_KEY=tu_secret_key
# O para Enterprise:
# RECAPTCHA_PROJECT_ID=tu_project_id
# RECAPTCHA_SITE_KEY=tu_site_key
```

### Ejecutar Frontend y Backend juntos

#### Opción 1: Comando combinado (recomendado)

```bash
# Inicia frontend (puerto 5173) + servidor de emails (puerto 5174)
npm run dev:all
```

Esto ejecuta ambos servicios en paralelo usando `concurrently`.

#### Opción 2: En terminales separados

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Servidor de emails
npm run dev:server
```

#### Opción 3: Solo frontend (sin emails)

Si no necesitas el formulario de soporte ni tracking de descargas:

```bash
npm run dev
```

### Proxy en desarrollo

Vite está configurado para hacer proxy de las llamadas `/api/*` al servidor backend. Esto significa que:

- El frontend llama a `/api/support`
- Vite redirige la petición a `http://localhost:5174/api/support`

No necesitas configurar `VITE_API_BASE_URL` en desarrollo.

### Producción

En producción, configura `VITE_API_BASE_URL` con la URL de tu servidor backend:

```env
VITE_API_BASE_URL=https://api.tu-dominio.com
```

Y ejecuta el servidor con:

```bash
npm run start:server
```

---

## 🚀 Uso

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo (frontend) |
| `npm run dev:server` | Inicia solo el servidor de emails |
| `npm run dev:all` | Inicia frontend + servidor de emails |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Ejecuta el linter (ESLint) |
| `npm run start:server` | Inicia el servidor en modo producción |

### Flujo de Trabajo Típico

1. **Importar** → Sube tu CV actual en PDF o comienza desde cero
2. **Seleccionar plantilla** → Elige entre +10 diseños profesionales
3. **Editar** → Modifica cada sección con el editor visual
4. **Mejorar con IA** → Usa la IA para optimizar tus textos
5. **Exportar** → Descarga tu CV y carta de presentación en PDF

---

## 📁 Estructura del Proyecto

```
autocreativa-open-cv-generator/
├── 📂 public/                # Archivos estáticos
├── 📂 server/                # Backend Express (emails)
│   └── index.js              # Servidor de correo
├── 📂 src/
│   ├── 📂 assets/            # Recursos (imágenes, fuentes)
│   ├── 📂 components/        # Componentes React reutilizables
│   │   ├── 📂 common/        # Botones, inputs, modales
│   │   ├── 📂 editor/        # Componentes del editor
│   │   ├── 📂 layout/        # Header, Footer, Layout
│   │   └── 📂 onboarding/    # Flujo de bienvenida
│   ├── 📂 context/           # Context API (estado global)
│   │   └── CVContext.jsx     # Estado del CV + localStorage
│   ├── 📂 hooks/             # Custom hooks
│   ├── 📂 pages/             # Páginas de la aplicación
│   │   ├── 📂 Landing/       # Página principal
│   │   ├── 📂 Import/        # Importación de PDF
│   │   ├── 📂 SelectTemplate/# Selección de plantilla
│   │   ├── 📂 Editor/        # Editor principal
│   │   ├── 📂 CreateCV/      # Crear CV desde cero
│   │   └── ...               # Otras páginas
│   ├── 📂 services/          # Servicios externos
│   │   ├── apiFreeLLMService.js  # Integración IA
│   │   └── pdfService.js         # Extracción de PDF
│   ├── 📂 styles/            # Estilos globales
│   │   └── variables.css     # Variables CSS
│   ├── 📂 templates/         # Plantillas del CV
│   │   └── 📂 categories/    # Organizadas por categoría
│   ├── 📂 utils/             # Utilidades
│   ├── App.jsx               # Componente raíz
│   └── main.jsx              # Entry point
├── .env.example              # Variables de entorno (ejemplo)
├── .env.development          # Variables para desarrollo
├── .env.production           # Variables para producción
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
└── README.md                 # Este archivo
```

---

## 🔒 Seguridad

- **Variables de entorno**: Nunca expongas tus API keys
- **reCAPTCHA**: Protección contra bots en formularios
- **Rate Limiting**: Límites de peticiones para prevenir abuso
- **CORS**: Configurado para dominios autorizados

### Si expones accidentalmente tu API key:

1. **Rota la key inmediatamente** en el panel de ApiFreeLLM
2. Genera una nueva key y actualiza tu `.env`
3. Revisa el historial de git con `git log --all --full-history -- .env`

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí te explicamos cómo puedes ayudar:

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```
3. **Haz tus cambios** siguiendo las convenciones del proyecto
4. **Commit** con mensajes descriptivos:
   ```bash
   git commit -m "feat: agregar nueva plantilla minimalista"
   ```
5. **Push** a tu fork:
   ```bash
   git push origin feature/nombre-descriptivo
   ```
6. **Abre un Pull Request** describiendo tus cambios

### Convenciones de Commits

| Prefijo | Descripción |
|---------|-------------|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Documentación |
| `style:` | Estilos (CSS, formato) |
| `refactor:` | Refactorización |
| `test:` | Tests |
| `chore:` | Tareas de mantenimiento |

### Ideas para Contribuir

- 🎨 **Nuevas plantillas** de CV
- 🌍 **Traducciones** (i18n)
- 🐛 **Reportar bugs** en [Issues](https://github.com/autocreativa/autocreativa-open-cv-generator/issues)
- 📖 **Mejorar documentación**
- ⚡ **Optimizaciones** de rendimiento

### ¿Preguntas?

Escríbenos a **contacto@autocreativa.com** o abre un [Issue](https://github.com/autocreativa/autocreativa-open-cv-generator/issues).

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 👏 Agradecimientos

- ApiFreeLLM por la API de IA
- [Vite](https://vitejs.dev/) por el increíble tooling
- [React](https://react.dev/) por la biblioteca UI
- [Lucide](https://lucide.dev/) por los iconos

---

<p align="center">
  Hecho con ❤️ por <a href="https://autocreativa.com">Autocreativa</a>
</p>

<p align="center">
  <a href="https://autocreativa.com">
    <img src="https://img.shields.io/badge/Website-autocreativa.com-22b573?style=for-the-badge" alt="Website"/>
  </a>
</p>
