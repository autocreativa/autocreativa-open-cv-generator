import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_CV_DATA, STORAGE_KEYS } from '../utils/constants';

// Contexto
const CVContext = createContext(null);

// Acciones
const ACTIONS = {
    SET_CV_DATA: 'SET_CV_DATA',
    UPDATE_CONTACT_INFO: 'UPDATE_CONTACT_INFO',
    ADD_WORK_EXPERIENCE: 'ADD_WORK_EXPERIENCE',
    UPDATE_WORK_EXPERIENCE: 'UPDATE_WORK_EXPERIENCE',
    REMOVE_WORK_EXPERIENCE: 'REMOVE_WORK_EXPERIENCE',
    ADD_EDUCATION: 'ADD_EDUCATION',
    UPDATE_EDUCATION: 'UPDATE_EDUCATION',
    REMOVE_EDUCATION: 'REMOVE_EDUCATION',
    SET_PROFESSIONAL_SUMMARY: 'SET_PROFESSIONAL_SUMMARY',
    ADD_ARRAY_ITEM: 'ADD_ARRAY_ITEM',
    UPDATE_ARRAY_ITEM: 'UPDATE_ARRAY_ITEM',
    REMOVE_ARRAY_ITEM: 'REMOVE_ARRAY_ITEM',
    SET_SELECTED_SECTIONS: 'SET_SELECTED_SECTIONS',
    SET_SELECTED_TEMPLATE: 'SET_SELECTED_TEMPLATE',
    SET_PROFILE_IMAGE: 'SET_PROFILE_IMAGE',
    RESET_CV: 'RESET_CV',
};

// Reducer
const cvReducer = (state, action) => {
    const now = new Date().toISOString();

    switch (action.type) {
        case ACTIONS.SET_CV_DATA:
            return { ...action.payload, updatedAt: now };

        case ACTIONS.UPDATE_CONTACT_INFO:
            return {
                ...state,
                contactInfo: { ...state.contactInfo, ...action.payload },
                updatedAt: now,
            };

        case ACTIONS.ADD_WORK_EXPERIENCE:
            return {
                ...state,
                workExperience: [...state.workExperience, { id: uuidv4(), ...action.payload }],
                updatedAt: now,
            };

        case ACTIONS.UPDATE_WORK_EXPERIENCE:
            return {
                ...state,
                workExperience: state.workExperience.map((item) =>
                    item.id === action.payload.id ? { ...item, ...action.payload.data } : item
                ),
                updatedAt: now,
            };

        case ACTIONS.REMOVE_WORK_EXPERIENCE:
            return {
                ...state,
                workExperience: state.workExperience.filter((item) => item.id !== action.payload),
                updatedAt: now,
            };

        case ACTIONS.ADD_EDUCATION:
            return {
                ...state,
                education: [...state.education, { id: uuidv4(), ...action.payload }],
                updatedAt: now,
            };

        case ACTIONS.UPDATE_EDUCATION:
            return {
                ...state,
                education: state.education.map((item) =>
                    item.id === action.payload.id ? { ...item, ...action.payload.data } : item
                ),
                updatedAt: now,
            };

        case ACTIONS.REMOVE_EDUCATION:
            return {
                ...state,
                education: state.education.filter((item) => item.id !== action.payload),
                updatedAt: now,
            };

        case ACTIONS.SET_PROFESSIONAL_SUMMARY:
            return {
                ...state,
                professionalSummary: action.payload,
                updatedAt: now,
            };

        case ACTIONS.ADD_ARRAY_ITEM:
            return {
                ...state,
                [action.payload.field]: [
                    ...state[action.payload.field],
                    { id: uuidv4(), ...action.payload.item },
                ],
                updatedAt: now,
            };

        case ACTIONS.UPDATE_ARRAY_ITEM:
            return {
                ...state,
                [action.payload.field]: state[action.payload.field].map((item) =>
                    item.id === action.payload.id ? { ...item, ...action.payload.data } : item
                ),
                updatedAt: now,
            };

        case ACTIONS.REMOVE_ARRAY_ITEM:
            return {
                ...state,
                [action.payload.field]: state[action.payload.field].filter(
                    (item) => item.id !== action.payload.id
                ),
                updatedAt: now,
            };

        case ACTIONS.SET_SELECTED_SECTIONS:
            return {
                ...state,
                selectedSections: action.payload,
                updatedAt: now,
            };

        case ACTIONS.SET_SELECTED_TEMPLATE:
            return {
                ...state,
                selectedTemplate: action.payload,
                updatedAt: now,
            };

        case ACTIONS.SET_PROFILE_IMAGE:
            return {
                ...state,
                profileImage: action.payload,
                updatedAt: now,
            };

        case ACTIONS.RESET_CV:
            return {
                ...INITIAL_CV_DATA,
                id: uuidv4(),
                createdAt: now,
                updatedAt: now,
            };

        default:
            return state;
    }
};

// Provider
export const CVProvider = ({ children }) => {
    const sanitizeCvData = useCallback((data) => {
        const next = data && typeof data === 'object' ? { ...data } : { ...INITIAL_CV_DATA };

        const contactInfo = next.contactInfo && typeof next.contactInfo === 'object' ? next.contactInfo : {};
        next.contactInfo = { ...INITIAL_CV_DATA.contactInfo, ...contactInfo };

        if (next.professionalSummary && typeof next.professionalSummary === 'object') {
            next.professionalSummary = String(next.professionalSummary?.summary || '');
        } else {
            next.professionalSummary = String(next.professionalSummary || '');
        }

        const ensureArray = (value) => (Array.isArray(value) ? value : (value ? [value] : []));

        next.workExperience = ensureArray(next.workExperience).filter(Boolean);
        next.education = ensureArray(next.education).filter(Boolean);

        next.technicalSkills = Array.isArray(next.technicalSkills) ? next.technicalSkills : [];
        next.softSkills = Array.isArray(next.softSkills) ? next.softSkills : [];
        next.languages = Array.isArray(next.languages) ? next.languages : [];
        next.certifications = Array.isArray(next.certifications) ? next.certifications : [];
        next.projects = Array.isArray(next.projects) ? next.projects : [];
        next.awards = Array.isArray(next.awards) ? next.awards : [];
        next.publications = Array.isArray(next.publications) ? next.publications : [];
        next.volunteering = Array.isArray(next.volunteering) ? next.volunteering : [];
        next.affiliations = Array.isArray(next.affiliations) ? next.affiliations : [];
        next.courses = Array.isArray(next.courses) ? next.courses : [];
        next.references = Array.isArray(next.references) ? next.references : [];
        next.hobbies = Array.isArray(next.hobbies) ? next.hobbies : [];
        next.socialLinks = Array.isArray(next.socialLinks) ? next.socialLinks : [];
        next.conferences = Array.isArray(next.conferences) ? next.conferences : [];

        next.selectedSections = Array.isArray(next.selectedSections)
            ? next.selectedSections
            : INITIAL_CV_DATA.selectedSections;

        return next;
    }, []);
    // Cargar datos de localStorage al iniciar
    const getInitialState = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.CV_DATA);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading CV from localStorage:', error);
        }

        return {
            ...INITIAL_CV_DATA,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    };

    const [state, dispatch] = useReducer(cvReducer, null, getInitialState);

    // Guardar en localStorage cuando cambie el estado
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(state));
        } catch (error) {
            console.error('Error saving CV to localStorage:', error);
        }
    }, [state]);

    // Acciones
    const setCVData = useCallback((data) => {
        const nextData = typeof data === 'function' ? data(state) : data;
        dispatch({ type: ACTIONS.SET_CV_DATA, payload: sanitizeCvData(nextData) });
    }, [state, sanitizeCvData]);

    const saveCVData = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(state));
        } catch (error) {
            console.error('Error saving CV to localStorage:', error);
        }
    }, [state]);

    const updateContactInfo = useCallback((data) => {
        dispatch({ type: ACTIONS.UPDATE_CONTACT_INFO, payload: data });
    }, []);

    const addWorkExperience = useCallback((data) => {
        dispatch({ type: ACTIONS.ADD_WORK_EXPERIENCE, payload: data });
    }, []);

    const updateWorkExperience = useCallback((id, data) => {
        dispatch({ type: ACTIONS.UPDATE_WORK_EXPERIENCE, payload: { id, data } });
    }, []);

    const removeWorkExperience = useCallback((id) => {
        dispatch({ type: ACTIONS.REMOVE_WORK_EXPERIENCE, payload: id });
    }, []);

    const addEducation = useCallback((data) => {
        dispatch({ type: ACTIONS.ADD_EDUCATION, payload: data });
    }, []);

    const updateEducation = useCallback((id, data) => {
        dispatch({ type: ACTIONS.UPDATE_EDUCATION, payload: { id, data } });
    }, []);

    const removeEducation = useCallback((id) => {
        dispatch({ type: ACTIONS.REMOVE_EDUCATION, payload: id });
    }, []);

    const setProfessionalSummary = useCallback((summary) => {
        dispatch({ type: ACTIONS.SET_PROFESSIONAL_SUMMARY, payload: summary });
    }, []);

    const addArrayItem = useCallback((field, item) => {
        dispatch({ type: ACTIONS.ADD_ARRAY_ITEM, payload: { field, item } });
    }, []);

    const updateArrayItem = useCallback((field, id, data) => {
        dispatch({ type: ACTIONS.UPDATE_ARRAY_ITEM, payload: { field, id, data } });
    }, []);

    const removeArrayItem = useCallback((field, id) => {
        dispatch({ type: ACTIONS.REMOVE_ARRAY_ITEM, payload: { field, id } });
    }, []);

    const setSelectedSections = useCallback((sections) => {
        dispatch({ type: ACTIONS.SET_SELECTED_SECTIONS, payload: sections });
    }, []);

    const setSelectedTemplate = useCallback((templateId) => {
        dispatch({ type: ACTIONS.SET_SELECTED_TEMPLATE, payload: templateId });
    }, []);

    const setProfileImage = useCallback((imageBase64) => {
        dispatch({ type: ACTIONS.SET_PROFILE_IMAGE, payload: imageBase64 });
        // También guardar en localStorage separadamente (puede ser grande)
        try {
            localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE, imageBase64 || '');
        } catch (error) {
            console.error('Error saving profile image:', error);
        }
    }, []);

    const resetCV = useCallback(() => {
        dispatch({ type: ACTIONS.RESET_CV });
        localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
    }, []);

    const value = {
        cvData: state,
        setCVData,
        setCvData: setCVData,
        saveCVData,
        selectedSections: state?.selectedSections || INITIAL_CV_DATA.selectedSections,
        selectedTemplate: state?.selectedTemplate || null,
        updateContactInfo,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        addEducation,
        updateEducation,
        removeEducation,
        setProfessionalSummary,
        addArrayItem,
        updateArrayItem,
        removeArrayItem,
        setSelectedSections,
        setSelectedTemplate,
        setProfileImage,
        resetCV,
    };

    return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

// Hook personalizado
export const useCV = () => {
    const context = useContext(CVContext);
    if (!context) {
        throw new Error('useCV must be used within a CVProvider');
    }
    return context;
};

export default CVContext;
