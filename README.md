# Autocreativa Open CV Generator (MVP)

Generador de CV con editor visual, plantillas y funciones de IA (OpenRouter) para:

- Importar un CV desde PDF (extracción de texto + estructuración)
- Elegir una plantilla
- Editar todas las secciones del CV
- Mejorar textos con IA (5 sugerencias por campo)
- Generar carta de presentación y descargarla como PDF
- Exportar el CV como PDF

## Autor

- **autocreativa.com**

## Demo / Sitio

- Web: https://autocreativa.com
- Demo app: https://autocreativa.com/cv-generator
- Contacto: https://autocreativa.com/contacto
- Sugerencias: contacto@autocreativa.com

## Requisitos

- Node.js 18+ (recomendado)
- NPM (incluido con Node)

## Instalación

```bash
npm install
```

## Variables de entorno

Este proyecto usa OpenRouter desde el frontend (Vite). **No subas tu API key al repositorio**.

1. Copia el ejemplo:

```bash
cp .env.example .env
```

2. Completa los valores en `.env`:

- `VITE_OPENROUTER_API_KEY`
- `VITE_OPENROUTER_API_URL`
- `VITE_OPENROUTER_MODEL`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deploy (subdirectorio)

Este proyecto está configurado para funcionar en un subdirectorio (`/cv-generator/`). El build genera la carpeta `dist` lista para subir a `/cv-generator/` en tu servidor o GitHub Pages.

## Estructura del proyecto

- `src/pages/Import` Importación de PDF
- `src/pages/SelectTemplate` Selección de plantilla
- `src/pages/Editor` Editor + preview + export PDF
- `src/context/CVContext.jsx` Estado global del CV + persistencia en localStorage
- `src/services/openRouterService.js` Integración con OpenRouter
- `src/services/pdfService.js` Extracción de texto desde PDF (pdf.js)
- `src/templates` Plantillas del CV

## Seguridad

- `.env` está excluido por `.gitignore`.
- Evita exponer tu API key en deploys públicos. Para producción, lo ideal es mover el llamado a OpenRouter a un backend.

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama (`feature/nombre-feature`)
3. Envía un Pull Request

Si quieres proponer mejoras, escribe a **contacto@autocreativa.com**.

## Licencia

Este repositorio aún no incluye un archivo de licencia. Si deseas publicarlo como open source formalmente, recomienda agregar una licencia (por ejemplo MIT).
