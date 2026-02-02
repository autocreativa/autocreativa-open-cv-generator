/**
 * CV Magic - OpenRouter AI Service
 * Servicio para comunicación con la API de OpenRouter
 */

const OPENROUTER_CONFIG = {
    apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    model: import.meta.env.VITE_OPENROUTER_MODEL || 'x-ai/grok-code-fast-1',
};

/**
 * Llamada base a OpenRouter API
 * @param {Array} messages - Array de mensajes {role, content}
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const callOpenRouter = async (messages, options = {}) => {
    if (!OPENROUTER_CONFIG.apiKey) {
        throw new Error('API key de OpenRouter no configurada');
    }

    try {
        const response = await fetch(OPENROUTER_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'CV Magic Generator'
            },
            body: JSON.stringify({
                model: options.model || OPENROUTER_CONFIG.model,
                messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens || 2000,
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Error de OpenRouter: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('OpenRouter API error:', error);
        throw error;
    }
};

export const cleanOnboardingCvData = async (cvData) => {
    const systemPrompt = `Eres un experto en normalización de datos de currículum.

Devuelve SOLO un JSON válido (sin markdown, sin explicaciones) con la siguiente estructura:
{
  "contactInfo": {
    "address": "",
    "city": "",
    "country": ""
  }
}

Reglas:
- No inventes calle y número si no están.
- Si el usuario dice "en Talca" o similar, elimina el "en" y devuelve ciudad/país normalizados.
- Si es posible, completa país y región/estado dentro de "address" usando el formato: "País, Región/Estado, Ciudad".
- Mantén la información original si no puedes mejorarla.
- Responde en español.`;

    const payload = {
        contactInfo: {
            address: cvData?.contactInfo?.address || '',
            city: cvData?.contactInfo?.city || '',
            country: cvData?.contactInfo?.country || '',
        },
    };

    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Normaliza estos datos:\n${JSON.stringify(payload, null, 2)}` },
        ];

        const response = await callOpenRouter(messages, { temperature: 0.2, maxTokens: 250 });
        const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        return {
            ...cvData,
            contactInfo: {
                ...(cvData?.contactInfo || {}),
                ...(parsed?.contactInfo || {}),
            },
        };
    } catch (error) {
        console.error('Error cleaning onboarding CV data:', error);
        return cvData;
    }
};

/**
 * Extraer datos estructurados de un CV en texto
 * @param {string} pdfText - Texto extraído del PDF
 * @returns {Promise<Object>} - Datos del CV estructurados
 */
export const extractCVFromText = async (pdfText) => {
    const systemPrompt = `Eres un experto en análisis de currículums. Tu tarea es extraer y estructurar la información del siguiente texto extraído de un CV en PDF.

Devuelve SOLO un JSON válido (sin markdown, sin explicaciones) con la siguiente estructura:
{
  "contactInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "address": "",
    "city": "",
    "country": ""
  },
  "workExperience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "isCurrent": false,
      "description": "",
      "location": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "technicalSkills": [{ "name": "", "level": 3 }],
  "softSkills": [{ "name": "" }],
  "languages": [{ "language": "", "level": "" }],
  "certifications": [{ "name": "", "institution": "", "date": "" }],
  "professionalSummary": ""
}

Extrae toda la información disponible. Si algún campo no está disponible, déjalo vacío pero mantén la estructura.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analiza y extrae los datos del siguiente CV:\n\n${pdfText}` }
    ];

    const response = await callOpenRouter(messages, { temperature: 0.3 });

    try {
        // Limpiar la respuesta de posibles caracteres extra
        const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Error parsing CV extraction response:', error);
        throw new Error('No se pudo procesar la información del CV');
    }
};

/**
 * Mejorar un texto del CV con sugerencias de IA
 * @param {string} text - Texto a mejorar
 * @param {string} sectionType - Tipo de sección (workExperience, education, etc.)
 * @param {Object} cvData - CV completo para contexto
 * @returns {Promise<string[]>} - Array de 5 sugerencias
 */
export const improveText = async (text, sectionType, cvData) => {
    const systemPrompt = `Eres un experto en redacción de currículums profesionales. 
Genera 5 versiones mejoradas del texto proporcionado.

Las mejoras deben:
- Ser más impactantes y profesionales
- Incluir métricas cuando sea posible
- Usar verbos de acción
- Mantener la veracidad del contenido original
- Estar en el mismo idioma que el texto original

Devuelve SOLO un JSON con formato:
{
  "suggestions": [
    "sugerencia 1",
    "sugerencia 2",
    "sugerencia 3",
    "sugerencia 4",
    "sugerencia 5"
  ]
}`;

    const safeCvData = cvData
        ? {
            ...cvData,
            profileImage: cvData.profileImage ? '[omitted]' : null,
        }
        : null;

    const context = `
CV del usuario (para contexto):
${JSON.stringify(safeCvData, null, 2)}

Reglas adicionales:
- Mantén el mismo idioma del texto original.
- No inventes datos que no estén en el CV.
- Mejora SOLO el texto objetivo.

Sección/Contexto del texto: ${sectionType}
Texto objetivo a mejorar:
"""
${text}
"""`;

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: context }
    ];

    const response = await callOpenRouter(messages, { temperature: 0.8 });

    try {
        const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return parsed.suggestions || [];
    } catch (error) {
        console.error('Error parsing improvement suggestions:', error);
        throw new Error('No se pudieron generar sugerencias');
    }
};

export const improveTextWithAI = async (text, sectionType, cvData) => {
    const suggestions = await improveText(text, sectionType, cvData);
    return suggestions?.[0] || text;
};

export const getImprovementSuggestions = async (text, sectionType, cvData) => {
    return await improveText(text, sectionType, cvData);
};

/**
 * Generar carta de presentación basada en el CV
 * @param {Object} cvData - Datos del CV
 * @param {string} jobPosition - Puesto al que aplica (opcional)
 * @returns {Promise<string>} - Carta de presentación generada
 */
export const generateCoverLetter = async (cvData, jobPosition = '') => {
    const systemPrompt = `Eres un experto en redacción profesional. Genera una carta de presentación profesional basándote en el CV proporcionado.

La carta debe:
- Tener un tono profesional pero cercano
- Destacar las fortalezas principales del candidato
- Ser concisa (3-4 párrafos)
- Incluir saludo y despedida apropiados
- Estar en español
- NO incluir marcadores de posición como [Empresa] o [Fecha]

Genera la carta directamente, sin explicaciones previas ni posteriores.`;

    const cvSummary = `
Datos del candidato:
- Nombre: ${cvData?.contactInfo?.fullName || 'Candidato'}
- Email: ${cvData?.contactInfo?.email || ''}
- Teléfono: ${cvData?.contactInfo?.phone || ''}

Experiencia laboral:
${cvData?.workExperience?.map(exp =>
        `- ${exp.position} en ${exp.company} (${exp.startDate} - ${exp.isCurrent ? 'Actualidad' : exp.endDate}): ${exp.description}`
    ).join('\n') || 'No especificada'}

Educación:
${cvData?.education?.map(edu =>
        `- ${edu.degree} en ${edu.institution} (${edu.endDate})`
    ).join('\n') || 'No especificada'}

Habilidades:
${cvData?.technicalSkills?.map(skill => skill.name).join(', ') || 'No especificadas'}

${jobPosition ? `Puesto al que aplica: ${jobPosition}` : ''}`;

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Genera una carta de presentación para:\n\n${cvSummary}` }
    ];

    return await callOpenRouter(messages, { temperature: 0.7, maxTokens: 1500 });
};

/**
 * Generar respuesta del asistente de chat para onboarding
 * @param {Array} chatHistory - Historial de la conversación
 * @param {string} currentSection - Sección actual
 * @param {Object} collectedData - Datos recopilados hasta ahora
 * @param {Array} sections - Secciones a completar
 * @returns {Promise<string>} - Respuesta del asistente
 */
export const getChatResponse = async (chatHistory, currentSection, collectedData, sections) => {
    const systemPrompt = `Eres un asistente amigable que ayuda a los usuarios a crear su CV paso a paso.
Tu tarea es hacer preguntas para completar cada sección del CV.

Secciones a completar: ${sections.join(', ')}
Sección actual: ${currentSection}

Reglas:
- Haz UNA pregunta a la vez
- Sé breve y claro
- Si el usuario da información incompleta, pide más detalles amablemente
- Cuando termines una sección, avisa que pasarás a la siguiente
- Usa un tono amigable y profesional
- Responde en español
- Si el usuario dice que no tiene algo, respétalo y pasa al siguiente campo

Datos recopilados hasta ahora:
${JSON.stringify(collectedData, null, 2)}`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory
    ];

    return await callOpenRouter(messages, { temperature: 0.7, maxTokens: 500 });
};

export default {
    callOpenRouter,
    extractCVFromText,
    cleanOnboardingCvData,
    improveTextWithAI,
    getImprovementSuggestions,
    generateCoverLetter,
    getChatResponse,
};
