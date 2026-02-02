import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Square, Loader2, Bot, User, LayoutTemplate } from 'lucide-react';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import './ChatInterface.css';

/**
 * Interfaz de chat conversacional para recopilar datos del CV
 * @param {Object} props
 * @param {Array} props.sections - Secciones a completar
 * @param {Function} props.onComplete - Callback cuando se completa
 * @param {Object} props.initialData - Datos iniciales del CV
 */
const ChatInterface = ({ sections, onComplete, initialData = {}, onStartWithSampleTemplate }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentSection, setCurrentSection] = useState(0);
    const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
    const [cvData, setCvData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [isVoiceTooltipOpen, setIsVoiceTooltipOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const messageIdRef = useRef(Date.now());
    const lastAskedRef = useRef(null);
    const nextMessageId = () => {
        messageIdRef.current += 1;
        return messageIdRef.current;
    };

    const currentSectionRef = useRef(currentSection);
    const currentFieldIndexRef = useRef(currentFieldIndex);
    const cvDataRef = useRef(cvData);

    const hasStartedRef = useRef(false);
    const hasCompletedRef = useRef(false);
    const startConversationTimeoutRef = useRef(null);
    const askQuestionTimeoutRef = useRef(null);
    const nextQuestionTimeoutRef = useRef(null);

    const {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        isSupported,
        error: speechError
    } = useSpeechRecognition();

    const normalizeEmail = useCallback((value) => {
        return String(value || '')
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase();
    }, []);

    const parseMonthYearToISO = useCallback((value) => {
        const raw = String(value || '').trim();
        if (!raw) return '';

        // If already in YYYY-MM
        if (/^\d{4}-\d{2}$/.test(raw)) return raw;

        // If only year, return December of that year
        const yearOnly = raw.match(/^(\d{4})$/);
        if (yearOnly) return `${yearOnly[1]}-12`;

        const months = {
            enero: '01',
            feb: '02',
            febrero: '02',
            mar: '03',
            marzo: '03',
            abr: '04',
            abril: '04',
            may: '05',
            mayo: '05',
            jun: '06',
            junio: '06',
            jul: '07',
            julio: '07',
            ago: '08',
            agosto: '08',
            sep: '09',
            sept: '09',
            septiembre: '09',
            oct: '10',
            octubre: '10',
            nov: '11',
            noviembre: '11',
            dic: '12',
            diciembre: '12',
        };

        const normalized = raw
            .toLowerCase()
            .replace(/\./g, '')
            .replace(/\s+/g, ' ');

        const match = normalized.match(/([a-záéíóúñ]+)\s+(\d{4})/i);
        if (match) {
            const monthKey = match[1].normalize('NFD').replace(/\p{Diacritic}/gu, '');
            const year = match[2];
            const month = months[monthKey];
            if (month) return `${year}-${month}`;
        }

        return '';
    }, []);

    const splitCommaList = useCallback((value) => {
        return String(value || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }, []);

    // Scroll al último mensaje
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Mantener el scroll dentro del contenedor del chat (evita que el body scrollee)
        container.scrollTop = container.scrollHeight;
    }, [messages]);

    useEffect(() => {
        currentSectionRef.current = currentSection;
        currentFieldIndexRef.current = currentFieldIndex;
        cvDataRef.current = cvData;
    }, [currentSection, currentFieldIndex, cvData]);

    // Procesar transcript del reconocimiento de voz
    useEffect(() => {
        if (transcript && !isListening) {
            const field = getCurrentField();
            if (field?.key === 'email') {
                setInputValue(normalizeEmail(transcript));
            } else {
                setInputValue(transcript);
            }
        }
    }, [transcript, isListening, normalizeEmail]);

    // Mostrar dictado parcial en el input mientras escucha
    useEffect(() => {
        if (!isListening) return;
        if (!interimTranscript) return;
        const field = getCurrentField();
        if (field?.key === 'email') {
            setInputValue(normalizeEmail(interimTranscript));
        } else {
            setInputValue(interimTranscript);
        }
    }, [interimTranscript, isListening]);

    const getSectionFields = useCallback((sectionId) => {
        const fieldsBySection = {
            contactInfo: [
                { key: 'fullName', question: '¿Cuál es tu nombre completo?', placeholder: 'Ej: Juan Pérez García' },
                { key: 'email', question: '¿Cuál es tu correo electrónico?', placeholder: 'Ej: juan@email.com' },
                { key: 'phone', question: '¿Cuál es tu número de teléfono?', placeholder: 'Ej: +56 9 1234 5678' },
                { key: 'address', question: '¿Cuál es tu dirección o ubicación? (opcional)', placeholder: 'Ej: Chile, Región del Maule, Talca' },
                { key: 'city', question: '¿En qué ciudad resides?', placeholder: 'Ej: Santiago' },
                { key: 'country', question: '¿En qué país resides?', placeholder: 'Ej: Chile' },
            ],
            professionalSummary: [
                { key: 'summary', question: 'Cuéntame brevemente sobre ti y tu perfil profesional.', placeholder: 'Describe tu experiencia y objetivos...' },
            ],
            workExperience: [
                { key: 'company', question: '¿En qué empresa o lugar trabajaste/trabajas?', placeholder: 'Ej: Google' },
                { key: 'position', question: '¿Cuál era/es tu cargo?', placeholder: 'Ej: Desarrollador Senior' },
                { key: 'startDate', question: '¿En qué fecha comenzaste? (mes/año)', placeholder: 'Ej: Enero 2020' },
                { key: 'description', question: 'Describe brevemente tus responsabilidades y logros.', placeholder: 'Tus principales tareas...' },
            ],
            education: [
                { key: 'institution', question: '¿En qué institución estudiaste?', placeholder: 'Ej: Universidad de Chile' },
                { key: 'degree', question: '¿Qué título obtuviste?', placeholder: 'Ej: Ingeniero Civil Informático' },
                { key: 'endDate', question: '¿En qué año te graduaste?', placeholder: 'Ej: 2019' },
            ],
            technicalSkills: [
                { key: 'skills', question: '¿Cuáles son tus habilidades técnicas? (sepáralas con comas)', placeholder: 'Ej: JavaScript, React, Node.js' },
            ],
            languages: [
                { key: 'languages', question: '¿Qué idiomas hablas y a qué nivel?', placeholder: 'Ej: Español (Nativo), Inglés (Avanzado)' },
            ],
        };

        return fieldsBySection[sectionId] || [{ key: 'data', question: `Cuéntame sobre tu ${sectionId}`, placeholder: 'Tu respuesta...' }];
    }, []);

    // Iniciar conversación
    useEffect(() => {
        if (hasStartedRef.current) return;
        if (sections.length > 0) {
            hasStartedRef.current = true;
            lastAskedRef.current = null;
            const welcomeMessage = {
                id: nextMessageId(),
                type: 'bot',
                content: '¡Hola! Soy tu asistente para crear tu CV. 👋 Estos son los primeros pasos para ingresar tus datos y poder comenzar. Luego podrás complementar y mejorar tu currículum con más información, siempre asistido por nuestro asistente de IA. ¡Empecemos!',
            };

            setMessages([welcomeMessage]);

            // Inmediatamente después, mostrar encabezado de la primera sección
            const firstSection = sections[0];
            const sectionMessage = {
                id: nextMessageId(),
                type: 'bot',
                content: `📝 **${getSectionName(firstSection)}**`,
                isSection: true,
            };
            setMessages((prev) => [...prev, sectionMessage]);

            // Luego la primera pregunta
            const firstSectionFields = getSectionFields(firstSection);
            const firstField = firstSectionFields[0];
            if (firstField) {
                const questionMessage = {
                    id: nextMessageId(),
                    type: 'bot',
                    content: firstField.question,
                };
                setMessages((prev) => [...prev, questionMessage]);
            }

            if (startConversationTimeoutRef.current) {
                clearTimeout(startConversationTimeoutRef.current);
            }
            startConversationTimeoutRef.current = setTimeout(() => {
                try {
                    inputRef.current?.focus({ preventScroll: true });
                } catch {
                    inputRef.current?.focus();
                }
            }, 500);
        }
        return () => {
            if (startConversationTimeoutRef.current) {
                clearTimeout(startConversationTimeoutRef.current);
            }
            if (askQuestionTimeoutRef.current) {
                clearTimeout(askQuestionTimeoutRef.current);
            }
            if (nextQuestionTimeoutRef.current) {
                clearTimeout(nextQuestionTimeoutRef.current);
            }
        };
    }, [sections, getSectionFields]);

    const getCurrentField = () => {
        if (currentSection >= sections.length) return null;
        const section = sections[currentSection];
        const fields = getSectionFields(section);
        return fields[currentFieldIndex];
    };

    const askNextQuestion = () => {
        const sectionIndex = currentSectionRef.current;
        const fieldIndex = currentFieldIndexRef.current;
        const promptKey = `${sectionIndex}:${fieldIndex}`;
        if (lastAskedRef.current === promptKey) return;
        lastAskedRef.current = promptKey;

        if (sectionIndex >= sections.length) {
            // Conversación terminada
            const finalMessage = {
                id: nextMessageId(),
                type: 'bot',
                content: '¡Excelente! Ya tengo toda la información necesaria. 🎉 Ahora puedes elegir una plantilla para tu CV.',
            };
            setMessages((prev) => [...prev, finalMessage]);

            if (onComplete && !hasCompletedRef.current) {
                hasCompletedRef.current = true;
                setTimeout(() => {
                    onComplete(cvDataRef.current);
                }, 300);
            }
            return;
        }

        const section = sections[sectionIndex];
        const fields = getSectionFields(section);

        // No mostrar encabezado si ya es la primera sección (ya se mostró al inicio)
        if (fieldIndex === 0 && sectionIndex > 0) {
            const sectionMessage = {
                id: nextMessageId(),
                type: 'bot',
                content: `📝 **${getSectionName(section)}**`,
                isSection: true,
            };
            setMessages((prev) => [...prev, sectionMessage]);
        }

        const field = fields[fieldIndex];
        if (field) {
            if (askQuestionTimeoutRef.current) {
                clearTimeout(askQuestionTimeoutRef.current);
            }
            askQuestionTimeoutRef.current = setTimeout(() => {
                const questionMessage = {
                    id: nextMessageId(),
                    type: 'bot',
                    content: field.question,
                };
                setMessages((prev) => [...prev, questionMessage]);
                try {
                    inputRef.current?.focus({ preventScroll: true });
                } catch {
                    inputRef.current?.focus();
                }
            }, 500);
        }
    };

    const getSectionName = (sectionId) => {
        const names = {
            contactInfo: 'Datos de Contacto',
            professionalSummary: 'Perfil Profesional',
            workExperience: 'Experiencia Laboral',
            education: 'Educación',
            technicalSkills: 'Habilidades Técnicas',
            languages: 'Idiomas',
            certifications: 'Certificaciones',
            projects: 'Proyectos',
        };
        return names[sectionId] || sectionId;
    };

    const handleSend = () => {
        if (!inputValue.trim() || isLoading) return;

        const field = getCurrentField();
        const valueToSend = field?.key === 'email' ? normalizeEmail(inputValue) : inputValue;

        // Agregar mensaje del usuario
        const userMessage = {
            id: nextMessageId(),
            type: 'user',
            content: valueToSend,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Guardar respuesta
        const section = sections[currentSection];
        const fields = getSectionFields(section);
        const fieldFromIndex = fields[currentFieldIndex];

        if (fieldFromIndex) {
            const prevData = cvDataRef.current || {};
            let updatedCvData = { ...prevData };

            if (section === 'contactInfo') {
                updatedCvData = {
                    ...prevData,
                    contactInfo: {
                        ...(prevData.contactInfo || {}),
                        [fieldFromIndex.key]: valueToSend,
                    },
                };
            } else if (section === 'professionalSummary') {
                updatedCvData = {
                    ...prevData,
                    professionalSummary: valueToSend,
                };
            } else if (section === 'workExperience') {
                const prevArr = Array.isArray(prevData.workExperience) ? [...prevData.workExperience] : [];
                const current = prevArr[0] || {
                    company: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    isCurrent: false,
                    description: '',
                    location: '',
                };

                const nextValue = fieldFromIndex.key === 'startDate'
                    ? (parseMonthYearToISO(valueToSend) || valueToSend)
                    : valueToSend;

                prevArr[0] = { ...current, [fieldFromIndex.key]: nextValue };
                updatedCvData = { ...prevData, workExperience: prevArr };
            } else if (section === 'education') {
                const prevArr = Array.isArray(prevData.education) ? [...prevData.education] : [];
                const current = prevArr[0] || {
                    institution: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                };

                const nextValue = (fieldFromIndex.key === 'startDate' || fieldFromIndex.key === 'endDate')
                    ? (parseMonthYearToISO(valueToSend) || valueToSend)
                    : valueToSend;

                prevArr[0] = { ...current, [fieldFromIndex.key]: nextValue };
                updatedCvData = { ...prevData, education: prevArr };
            } else if (section === 'technicalSkills') {
                updatedCvData = {
                    ...prevData,
                    technicalSkills: splitCommaList(valueToSend).map((name) => ({ name, level: 3 })),
                };
            } else if (section === 'languages') {
                updatedCvData = {
                    ...prevData,
                    languages: splitCommaList(valueToSend).map((raw) => {
                        const m = raw.match(/^(.+?)\s*\((.+)\)$/);
                        if (m) return { language: m[1].trim(), level: m[2].trim() };
                        return { language: raw, level: '' };
                    }),
                };
            } else {
                updatedCvData = {
                    ...prevData,
                    [section]: {
                        ...(prevData[section] || {}),
                        [fieldFromIndex.key]: valueToSend,
                    },
                };
            }

            cvDataRef.current = updatedCvData;
            setCvData(updatedCvData);
        }

        setInputValue('');

        try {
            inputRef.current?.focus({ preventScroll: true });
        } catch {
            inputRef.current?.focus();
        }

        // Avanzar a siguiente pregunta
        let nextSectionIndex = currentSection;
        let nextFieldIndex = currentFieldIndex;
        if (currentFieldIndex < fields.length - 1) {
            nextFieldIndex = currentFieldIndex + 1;
            setCurrentFieldIndex(nextFieldIndex);
        } else {
            nextFieldIndex = 0;
            nextSectionIndex = currentSection + 1;
            setCurrentFieldIndex(nextFieldIndex);
            setCurrentSection(nextSectionIndex);
        }

        currentSectionRef.current = nextSectionIndex;
        currentFieldIndexRef.current = nextFieldIndex;

        // Programar siguiente pregunta
        if (nextQuestionTimeoutRef.current) {
            clearTimeout(nextQuestionTimeoutRef.current);
        }
        nextQuestionTimeoutRef.current = setTimeout(() => {
            askNextQuestion();
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleVoice = () => {
        if (isListening) {
            stopListening();
        } else {
            setInputValue('');
            startListening();
        }
    };

    const voiceTooltipText = isListening
        ? 'Escuchando… Parar y revisar información'
        : 'Dictar con micrófono';

    return (
        <>
            {onStartWithSampleTemplate && (
                <div className="chat-sample-toggle">
                    <button
                        className="chat-sample-toggle-btn"
                        onClick={() => {
                            if (onStartWithSampleTemplate) {
                                onStartWithSampleTemplate();
                            }
                        }}
                    >
                        <LayoutTemplate size={18} />
                        <div className="chat-sample-toggle-text">
                            <span className="chat-sample-toggle-title">Rellenar con datos de ejemplo</span>
                            <span className="chat-sample-toggle-subtitle">Ver plantillas y editarlas</span>
                        </div>
                    </button>
                </div>
            )}
            <div className="chat-interface">
                {/* Messages */}
                <div className="chat-messages" ref={messagesContainerRef}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.type} ${message.isSection ? 'section-header' : ''}`}
                    >
                        <div className="message-avatar">
                            {message.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
                        </div>
                        <div className="message-content">
                            {message.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message bot loading">
                        <div className="message-avatar"><Bot size={20} /></div>
                        <div className="message-content">
                            <Loader2 size={20} className="animate-spin" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-wrapper">
                {(isListening || isVoiceTooltipOpen) && (
                    <div className="chat-input-tooltip" role="status">
                        {voiceTooltipText}
                    </div>
                )}
                <div className="chat-input-container">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={getCurrentField()?.placeholder || 'Escribe tu respuesta...'}
                        disabled={isLoading || currentSection >= sections.length}
                    />

                    {isSupported && (
                        <button
                            className={`voice-btn ${isListening ? 'active' : ''}`}
                            onClick={toggleVoice}
                            disabled={isLoading}
                            aria-label={isListening ? 'Parar y revisar información' : 'Dictar con micrófono'}
                            onMouseEnter={() => setIsVoiceTooltipOpen(true)}
                            onMouseLeave={() => setIsVoiceTooltipOpen(false)}
                            onFocus={() => setIsVoiceTooltipOpen(true)}
                            onBlur={() => setIsVoiceTooltipOpen(false)}
                        >
                            {isListening ? <Square size={20} /> : <Mic size={20} />}
                        </button>
                    )}

                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading || isListening}
                    >
                        <Send size={20} />
                    </button>
                </div>

                {speechError && !isListening && (
                    <div className="listening-indicator">
                        {speechError}
                    </div>
                )}
            </div>
            </div>
        </>
    );
};

export default ChatInterface;
