import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ArrowLeft, Search } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: 'General',
            questions: [
                {
                    question: '¿CVMagic es realmente gratis?',
                    answer: 'Sí, CVMagic es 100% gratis. No hay costos ocultos, no se requiere tarjeta de crédito y no hay límites en el número de CVs que puedes crear. Todas las funciones, incluyendo la mejora con IA, están disponibles sin costo.'
                },
                {
                    question: '¿Necesito crear una cuenta para usar CVMagic?',
                    answer: 'No, no es necesario crear una cuenta. Puedes usar todas las funciones de CVMagic sin registro. Tu información se guarda localmente en tu navegador para que puedas continuar editando tu CV más tarde.'
                },
                {
                    question: '¿Qué formatos puedo descargar mi CV?',
                    answer: 'Actualmente puedes descargar tu CV en formato PDF de alta calidad. El PDF está optimizado para impresión y para enviar por email a empleadores.'
                },
                {
                    question: '¿Puedo usar CVMagic en mi móvil?',
                    answer: 'Sí, CVMagic es completamente responsive y funciona en dispositivos móviles, tablets y computadoras. Puedes crear y editar tu CV desde cualquier dispositivo con conexión a internet.'
                }
            ]
        },
        {
            category: 'Funcionalidades',
            questions: [
                {
                    question: '¿Cómo funciona la mejora con IA?',
                    answer: 'La mejora con IA utiliza inteligencia artificial para sugerir mejoras en tus textos, hacerlos más profesionales y optimizarlos para sistemas ATS (Applicant Tracking Systems). Simplemente selecciona el texto que quieres mejorar y haz clic en la varita mágica.'
                },
                {
                    question: '¿Puedo importar mi CV existente?',
                    answer: 'Sí, puedes importar tu CV en formato PDF. Nuestra tecnología extraerá automáticamente la información de tu CV y la organizará en las secciones correspondientes. Luego podrás editarla y elegir una nueva plantilla.'
                },
                {
                    question: '¿Cuántas plantillas hay disponibles?',
                    answer: 'Actualmente ofrecemos 50 plantillas profesionales organizadas por categorías: negocios, tecnología, ingeniería, salud, creativo y general. Cada plantilla está diseñada para destacar diferentes aspectos de tu perfil profesional.'
                },
                {
                    question: '¿Puedo personalizar las plantillas?',
                    answer: 'Sí, puedes personalizar todas las plantillas. Puedes cambiar colores, agregar tu foto, modificar secciones, reorganizar el contenido y ajustar el formato según tus preferencias.'
                },
                {
                    question: '¿Cómo funciona el asistente de voz?',
                    answer: 'El asistente de voz te permite dictar tu información en lugar de escribirla. Simplemente activa el reconocimiento de voz y habla. La IA transcribirá y organizará tu información automáticamente.'
                }
            ]
        },
        {
            category: 'Privacidad y Seguridad',
            questions: [
                {
                    question: '¿Dónde se almacena mi información?',
                    answer: 'Tu información se almacena principalmente en tu navegador local (localStorage). No almacenamos tus datos personales en nuestros servidores de forma permanente. Cuando usas funciones de IA, los datos se envían de forma segura para procesamiento pero no se almacenan.'
                },
                {
                    question: '¿Es seguro incluir información personal en mi CV?',
                    answer: 'Sí, es seguro. Sin embargo, te recomendamos no incluir información extremadamente sensible como números de seguridad social completos. Solo incluye la información necesaria para que los empleadores te contacten.'
                },
                {
                    question: '¿Comparten mi información con terceros?',
                    answer: 'No compartimos tu información con terceros para fines de marketing. Solo utilizamos servicios de terceros de IA (actualmente ApiFreeLLM) para procesar tus solicitudes de mejora de texto, y estos servicios tienen sus propias políticas de privacidad.'
                }
            ]
        },
        {
            category: 'Soporte y Ayuda',
            questions: [
                {
                    question: '¿Cómo puedo obtener ayuda si tengo problemas?',
                    answer: 'Puedes contactarnos a través de nuestra página de contacto o enviando un email a contacto@autocreativa.com. Estaremos encantados de ayudarte con cualquier pregunta o problema que tengas.'
                },
                {
                    question: '¿Puedo sugerir nuevas funcionalidades?',
                    answer: '¡Por supuesto! Nos encanta recibir sugerencias de nuestros usuarios. Puedes enviarnos tus ideas a través de la página de contacto o por email. Todas las sugerencias son consideradas para futuras actualizaciones.'
                },
                {
                    question: '¿CVMagic funciona sin conexión a internet?',
                    answer: 'CVMagic requiere conexión a internet para funcionar, ya que utiliza servicios en la nube para funciones de IA y procesamiento. Sin embargo, una vez que descargas tu CV en PDF, puedes usarlo sin conexión.'
                }
            ]
        }
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFAQs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    let questionIndex = 0;

    return (
        <main className="faq-page">
            <div className="container">
                {/* Header */}
                <div className="faq-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver al inicio</span>
                    </Link>
                    <div className="faq-header-content">
                        <div className="faq-icon-wrapper">
                            <HelpCircle size={48} />
                        </div>
                        <h1 className="faq-title">Preguntas Frecuentes</h1>
                        <p className="faq-subtitle">
                            Encuentra respuestas a las preguntas más comunes sobre CVMagic
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="faq-search">
                    <div className="search-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar preguntas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* FAQ Content */}
                <div className="faq-content">
                    {filteredFAQs.length === 0 ? (
                        <div className="faq-empty">
                            <p>No se encontraron preguntas que coincidan con tu búsqueda.</p>
                        </div>
                    ) : (
                        filteredFAQs.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="faq-category">
                                <h2 className="category-title">{category.category}</h2>
                                <div className="faq-list">
                                    {category.questions.map((faq, qIndex) => {
                                        const currentIndex = questionIndex++;
                                        const isOpen = openIndex === currentIndex;
                                        return (
                                            <div key={qIndex} className="faq-item">
                                                <button
                                                    className={`faq-question ${isOpen ? 'open' : ''}`}
                                                    onClick={() => toggleQuestion(currentIndex)}
                                                >
                                                    <span className="question-text">{faq.question}</span>
                                                    <ChevronDown
                                                        size={20}
                                                        className={`chevron ${isOpen ? 'rotated' : ''}`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="faq-answer">
                                                        <p>{faq.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Contact Section */}
                <div className="faq-contact">
                    <div className="contact-card">
                        <h3 className="contact-title">¿No encuentras tu respuesta?</h3>
                        <p className="contact-description">
                            Si no encontraste lo que buscabas, no dudes en contactarnos.
                            Estaremos encantados de ayudarte.
                        </p>
                        <div className="contact-links">
                            <Link to="/contacto" className="contact-link">
                                Ir a contacto
                            </Link>
                            <a href="mailto:contacto@autocreativa.com" className="contact-link secondary">
                                Enviar email
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default FAQ;
