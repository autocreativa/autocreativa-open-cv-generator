/**
 * CV Magic - Plantillas de CV
 * Registro centralizado de todas las plantillas disponibles
 */

// Importar plantillas por categoría
import ModernMinimal from './categories/tech/ModernMinimal';
import ClassicProfessional from './categories/business/ClassicProfessional';
import CreativeDesigner from './categories/creative/CreativeDesigner';
import CleanSimple from './categories/general/CleanSimple';
import TechDetails from './categories/engineering/TechDetails';
import CareClean from './categories/healthcare/CareClean';

// Lista de todas las plantillas disponibles
export const templates = [
    // Tech Templates
    {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        category: 'tech',
        tags: ['developer', 'frontend', 'backend', 'minimal', 'clean'],
        hasProfileImage: true,
        description: 'Diseño minimalista perfecto para desarrolladores y profesionales tech.',
        component: ModernMinimal,
    },
    {
        id: 'tech-developer',
        name: 'Tech Developer',
        category: 'tech',
        tags: ['developer', 'software', 'engineering'],
        hasProfileImage: true,
        description: 'Enfocado en habilidades técnicas y proyectos.',
        component: ModernMinimal,
    },
    {
        id: 'tech-details',
        name: 'Tech Details',
        category: 'engineering',
        tags: ['engineering', 'technical', 'detailed'],
        hasProfileImage: false,
        description: 'Diseño técnico enfocado en habilidades y proyectos complejos.',
        component: TechDetails,
    },

    // Business Templates
    {
        id: 'classic-professional',
        name: 'Classic Professional',
        category: 'business',
        tags: ['corporate', 'executive', 'traditional'],
        hasProfileImage: true,
        description: 'Elegante y tradicional para entornos corporativos.',
        component: ClassicProfessional,
    },
    {
        id: 'executive-suite',
        name: 'Executive Suite',
        category: 'business',
        tags: ['executive', 'manager', 'director'],
        hasProfileImage: true,
        description: 'Diseño ejecutivo para puestos de liderazgo.',
        component: ClassicProfessional,
    },

    // Creative Templates
    {
        id: 'creative-designer',
        name: 'Creative Designer',
        category: 'creative',
        tags: ['design', 'art', 'visual', 'portfolio'],
        hasProfileImage: true,
        description: 'Colorido y expresivo para diseñadores creativos.',
        component: CreativeDesigner,
    },
    {
        id: 'portfolio-artist',
        name: 'Portfolio Artist',
        category: 'creative',
        tags: ['artist', 'illustrator', 'creative'],
        hasProfileImage: true,
        description: 'Ideal para artistas visuales y creativos.',
        component: CreativeDesigner,
    },

    // Healthcare Templates
    {
        id: 'care-clean',
        name: 'Care Clean',
        category: 'healthcare',
        tags: ['health', 'medical', 'nurse', 'clean'],
        hasProfileImage: false,
        description: 'Limpio y confiable, ideal para profesionales de la salud.',
        component: CareClean,
    },

    // General Templates
    {
        id: 'clean-simple',
        name: 'Clean Simple',
        category: 'general',
        tags: ['simple', 'clean', 'versatile'],
        hasProfileImage: true,
        description: 'Versátil y limpio para cualquier industria.',
        component: CleanSimple,
    },
    {
        id: 'universal-pro',
        name: 'Universal Pro',
        category: 'general',
        tags: ['universal', 'professional', 'adaptable'],
        hasProfileImage: false,
        description: 'Profesional y adaptable a cualquier sector.',
        component: CleanSimple,
    },
];

/**
 * Obtener plantilla por ID
 * @param {string} id - ID de la plantilla
 * @returns {Object|undefined} - Plantilla encontrada
 */
export const getTemplateById = (id) => {
    return templates.find((template) => template.id === id);
};

/**
 * Obtener componente de la plantilla por ID
 * @param {string} id - ID de la plantilla
 * @returns {React.Component|null} - Componente de la plantilla
 */
export const getTemplateComponent = (id) => {
    const template = templates.find((t) => t.id === id);
    return template ? template.component : null;
};

/**
 * Obtener plantillas por categoría
 * @param {string} category - Categoría de plantillas
 * @returns {Array} - Plantillas de la categoría
 */
export const getTemplatesByCategory = (category) => {
    if (category === 'all') return templates;
    return templates.filter((template) => template.category === category);
};

/**
 * Buscar plantillas por tags
 * @param {string} tag - Tag a buscar
 * @returns {Array} - Plantillas con el tag
 */
export const searchTemplatesByTag = (tag) => {
    return templates.filter((template) =>
        template.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );
};

export default templates;
