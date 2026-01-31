import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2, Bot, User } from 'lucide-react';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import './ChatInterface.css';

/**
 * Interfaz de chat conversacional para recopilar datos del CV
 * @param {Object} props
 * @param {Array} props.sections - Secciones a completar
 * @param {Function} props.onComplete - Callback cuando se completa
 * @param {Object} props.initialData - Datos iniciales del CV
 */
const ChatInterface = ({ sections, onComplete, initialData = {} }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentSection, setCurrentSection] = useState(0);
    const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
    const [cvData, setCvData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        isSupported,
        error: speechError
    } = useSpeechRecognition();

    // Scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Procesar transcript del reconocimiento de voz
    useEffect(() => {
        if (transcript && !isListening) {
            setInputValue(transcript);
        }
    }, [transcript, isListening]);

    // Iniciar conversación
    useEffect(() => {
        if (messages.length === 0 && sections.length > 0) {
            const welcomeMessage = {
                id: Date.now(),
                type: 'bot',
                content: '¡Hola! 👋 Soy tu asistente para crear tu CV. Te haré algunas preguntas para completar cada sección. ¡Empecemos!',
            };

            setMessages([welcomeMessage]);

            setTimeout(() => {
                askNextQuestion();
            }, 1000);
        }
    }, [sections]);

    const getCurrentField = () => {
        if (currentSection >= sections.length) return null;
        const section = sections[currentSection];
        const fields = getSectionFields(section);
        return fields[currentFieldIndex];
    };

    const getSectionFields = (sectionId) => {
        const fieldsBySection = {
            contactInfo: [
                { key: 'fullName', question: '¿Cuál es tu nombre completo?', placeholder: 'Ej: Juan Pérez García' },
                { key: 'email', question: '¿Cuál es tu correo electrónico?', placeholder: 'Ej: juan@email.com' },
                { key: 'phone', question: '¿Cuál es tu número de teléfono?', placeholder: 'Ej: +56 9 1234 5678' },
                { key: 'city', question: '¿En qué ciudad resides?', placeholder: 'Ej: Santiago' },
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
    };

    const askNextQuestion = () => {
        if (currentSection >= sections.length) {
            // Conversación terminada
            const finalMessage = {
                id: Date.now(),
                type: 'bot',
                content: '¡Excelente! Ya tengo toda la información necesaria. 🎉 Ahora puedes elegir una plantilla para tu CV.',
            };
            setMessages((prev) => [...prev, finalMessage]);

            setTimeout(() => {
                onComplete(cvData);
            }, 2000);
            return;
        }

        const section = sections[currentSection];
        const fields = getSectionFields(section);

        if (currentFieldIndex === 0) {
            // Nueva sección
            const sectionMessage = {
                id: Date.now(),
                type: 'bot',
                content: `📝 **${getSectionName(section)}**`,
                isSection: true,
            };
            setMessages((prev) => [...prev, sectionMessage]);
        }

        const field = fields[currentFieldIndex];
        if (field) {
            setTimeout(() => {
                const questionMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: field.question,
                };
                setMessages((prev) => [...prev, questionMessage]);
                inputRef.current?.focus();
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

        // Agregar mensaje del usuario
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Guardar respuesta
        const section = sections[currentSection];
        const fields = getSectionFields(section);
        const field = fields[currentFieldIndex];

        if (field) {
            setCvData((prev) => ({
                ...prev,
                [section]: {
                    ...(prev[section] || {}),
                    [field.key]: inputValue,
                },
            }));
        }

        setInputValue('');

        // Avanzar a siguiente pregunta
        if (currentFieldIndex < fields.length - 1) {
            setCurrentFieldIndex(currentFieldIndex + 1);
        } else {
            setCurrentFieldIndex(0);
            setCurrentSection(currentSection + 1);
        }

        setTimeout(() => {
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
            startListening();
        }
    };

    return (
        <div className="chat-interface">
            {/* Messages */}
            <div className="chat-messages">
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
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    )}

                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <Send size={20} />
                    </button>
                </div>

                {isListening && (
                    <div className="listening-indicator">
                        <span className="pulse" />
                        Escuchando...
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
