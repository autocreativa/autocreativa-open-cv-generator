/**
 * CV Magic - Constantes de la aplicación
 */

// Keys de LocalStorage
export const STORAGE_KEYS = {
    CV_DATA: 'cvmagic_cv_data',
    SELECTED_TEMPLATE: 'cvmagic_template',
    USER_PREFERENCES: 'cvmagic_prefs',
    ONBOARDING_PROGRESS: 'cvmagic_onboarding',
    PROFILE_IMAGE: 'cvmagic_profile_img',
};

// Secciones del CV
export const CV_SECTIONS = {
    // Obligatorias
    CONTACT_INFO: {
        id: 'contactInfo',
        name: 'Datos de Contacto',
        required: true,
        icon: 'User',
        fields: ['fullName', 'email', 'phone', 'address', 'city', 'country'],
    },
    WORK_EXPERIENCE: {
        id: 'workExperience',
        name: 'Experiencia Laboral',
        required: true,
        icon: 'Briefcase',
        isArray: true,
        fields: ['company', 'position', 'startDate', 'endDate', 'isCurrent', 'description', 'location'],
    },
    EDUCATION: {
        id: 'education',
        name: 'Estudios',
        required: true,
        icon: 'GraduationCap',
        isArray: true,
        fields: ['institution', 'degree', 'field', 'startDate', 'endDate', 'description'],
    },

    // Opcionales
    PROFESSIONAL_SUMMARY: {
        id: 'professionalSummary',
        name: 'Perfil Profesional',
        required: false,
        icon: 'FileText',
        fields: ['summary'],
    },
    TECHNICAL_SKILLS: {
        id: 'technicalSkills',
        name: 'Habilidades Técnicas',
        required: false,
        icon: 'Code',
        isArray: true,
        fields: ['name', 'level'],
    },
    SOFT_SKILLS: {
        id: 'softSkills',
        name: 'Habilidades Blandas',
        required: false,
        icon: 'Heart',
        isArray: true,
        fields: ['name'],
    },
    LANGUAGES: {
        id: 'languages',
        name: 'Idiomas',
        required: false,
        icon: 'Globe',
        isArray: true,
        fields: ['language', 'level'],
    },
    CERTIFICATIONS: {
        id: 'certifications',
        name: 'Certificaciones',
        required: false,
        icon: 'Award',
        isArray: true,
        fields: ['name', 'institution', 'date', 'url'],
    },
    PROJECTS: {
        id: 'projects',
        name: 'Proyectos',
        required: false,
        icon: 'FolderOpen',
        isArray: true,
        fields: ['name', 'description', 'technologies', 'url'],
    },
    AWARDS: {
        id: 'awards',
        name: 'Premios y Reconocimientos',
        required: false,
        icon: 'Trophy',
        isArray: true,
        fields: ['name', 'institution', 'date', 'description'],
    },
    PUBLICATIONS: {
        id: 'publications',
        name: 'Publicaciones',
        required: false,
        icon: 'BookOpen',
        isArray: true,
        fields: ['title', 'publisher', 'date', 'url'],
    },
    VOLUNTEERING: {
        id: 'volunteering',
        name: 'Voluntariado',
        required: false,
        icon: 'HeartHandshake',
        isArray: true,
        fields: ['organization', 'role', 'startDate', 'endDate', 'description'],
    },
    AFFILIATIONS: {
        id: 'affiliations',
        name: 'Afiliaciones Profesionales',
        required: false,
        icon: 'Users',
        isArray: true,
        fields: ['organization', 'role', 'startDate'],
    },
    COURSES: {
        id: 'courses',
        name: 'Cursos y Formación',
        required: false,
        icon: 'BookMarked',
        isArray: true,
        fields: ['name', 'institution', 'date', 'hours'],
    },
    REFERENCES: {
        id: 'references',
        name: 'Referencias',
        required: false,
        icon: 'UserCheck',
        isArray: true,
        fields: ['name', 'position', 'company', 'phone', 'email'],
    },
    HOBBIES: {
        id: 'hobbies',
        name: 'Hobbies e Intereses',
        required: false,
        icon: 'Smile',
        isArray: true,
        fields: ['name'],
    },
    SOCIAL_LINKS: {
        id: 'socialLinks',
        name: 'Redes Sociales / Portafolio',
        required: false,
        icon: 'Link',
        isArray: true,
        fields: ['platform', 'url'],
    },
    CONFERENCES: {
        id: 'conferences',
        name: 'Conferencias y Seminarios',
        required: false,
        icon: 'Presentation',
        isArray: true,
        fields: ['name', 'role', 'location', 'date'],
    },
};

export const REQUIRED_SECTIONS = ['contactInfo', 'workExperience', 'education'];

export const SECTIONS_ORDER = [
    'contactInfo',
    'professionalSummary',
    'workExperience',
    'education',
    'technicalSkills',
    'softSkills',
    'languages',
    'certifications',
    'projects',
    'awards',
    'publications',
    'volunteering',
    'affiliations',
    'courses',
    'references',
    'hobbies',
    'socialLinks',
    'conferences',
];

// Categorías de plantillas
export const TEMPLATE_CATEGORIES = [
    { id: 'all', name: 'Todas', icon: 'LayoutGrid' },
    { id: 'tech', name: 'Tecnología', icon: 'Code' },
    { id: 'creative', name: 'Creativo', icon: 'Palette' },
    { id: 'business', name: 'Negocios', icon: 'Briefcase' },
    { id: 'healthcare', name: 'Salud', icon: 'Heart' },
    { id: 'education', name: 'Educación', icon: 'GraduationCap' },
    { id: 'marketing', name: 'Marketing', icon: 'TrendingUp' },
    { id: 'engineering', name: 'Ingeniería', icon: 'Wrench' },
    { id: 'legal', name: 'Legal', icon: 'Scale' },
    { id: 'finance', name: 'Finanzas', icon: 'DollarSign' },
    { id: 'general', name: 'General', icon: 'FileText' },
];

// Niveles de idioma
export const LANGUAGE_LEVELS = [
    { value: 'A1', label: 'A1 - Principiante' },
    { value: 'A2', label: 'A2 - Elemental' },
    { value: 'B1', label: 'B1 - Intermedio' },
    { value: 'B2', label: 'B2 - Intermedio Alto' },
    { value: 'C1', label: 'C1 - Avanzado' },
    { value: 'C2', label: 'C2 - Nativo/Bilingüe' },
];

// Niveles de habilidad
export const SKILL_LEVELS = [
    { value: 1, label: 'Básico' },
    { value: 2, label: 'Elemental' },
    { value: 3, label: 'Intermedio' },
    { value: 4, label: 'Avanzado' },
    { value: 5, label: 'Experto' },
];

// Plataformas de redes sociales
export const SOCIAL_PLATFORMS = [
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', placeholder: 'https://linkedin.com/in/usuario' },
    { id: 'github', name: 'GitHub', icon: 'Github', placeholder: 'https://github.com/usuario' },
    { id: 'portfolio', name: 'Portafolio', icon: 'Globe', placeholder: 'https://miportafolio.com' },
    { id: 'twitter', name: 'Twitter/X', icon: 'Twitter', placeholder: 'https://twitter.com/usuario' },
    { id: 'behance', name: 'Behance', icon: 'Palette', placeholder: 'https://behance.net/usuario' },
    { id: 'dribbble', name: 'Dribbble', icon: 'Dribbble', placeholder: 'https://dribbble.com/usuario' },
];

// Estado inicial del CV
export const INITIAL_CV_DATA = {
    id: null,
    createdAt: null,
    updatedAt: null,
    selectedTemplate: null,
    selectedSections: ['contactInfo', 'workExperience', 'education'],
    profileImage: null,

    contactInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
    },

    workExperience: [],
    education: [],
    professionalSummary: '',
    technicalSkills: [],
    softSkills: [],
    languages: [],
    certifications: [],
    projects: [],
    awards: [],
    publications: [],
    volunteering: [],
    affiliations: [],
    courses: [],
    references: [],
    hobbies: [],
    socialLinks: [],
    conferences: [],
};

export default {
    STORAGE_KEYS,
    CV_SECTIONS,
    REQUIRED_SECTIONS,
    SECTIONS_ORDER,
    TEMPLATE_CATEGORIES,
    LANGUAGE_LEVELS,
    SKILL_LEVELS,
    SOCIAL_PLATFORMS,
    INITIAL_CV_DATA,
};
