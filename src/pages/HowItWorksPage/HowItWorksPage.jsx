import { Link } from 'react-router-dom';
import { FileUp, MessageCircle, LayoutTemplate, Download, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
    const steps = [
        {
            number: '01',
            icon: FileUp,
            title: 'Elige cómo empezar',
            description: 'Tienes dos opciones para comenzar: importa tu CV existente en formato PDF o créalo desde cero con nuestro asistente conversacional inteligente.',
            details: [
                'Importa tu PDF y extraemos automáticamente tu información',
                'O crea uno nuevo respondiendo preguntas simples',
                'Nuestro asistente de voz también está disponible'
            ]
        },
        {
            number: '02',
            icon: MessageCircle,
            title: 'Completa tu información',
            description: 'Responde preguntas simples sobre tu experiencia, educación y habilidades. También puedes dictar tu información usando nuestro asistente de voz.',
            details: [
                'Responde preguntas guiadas paso a paso',
                'Dicta tu experiencia usando reconocimiento de voz',
                'La IA organiza y estructura todo automáticamente'
            ]
        },
        {
            number: '03',
            icon: LayoutTemplate,
            title: 'Selecciona tu plantilla',
            description: 'Explora nuestra colección de 50 plantillas profesionales organizadas por industria. Cada diseño está optimizado para destacar tu perfil.',
            details: [
                '50 plantillas profesionales categorizadas',
                'Diseños para diferentes industrias',
                'Personaliza con tu foto y colores'
            ]
        },
        {
            number: '04',
            icon: Download,
            title: 'Mejora y descarga',
            description: 'Usa nuestra herramienta de mejora con IA para optimizar tus textos. Luego descarga tu CV en formato PDF listo para enviar.',
            details: [
                'Mejora textos con sugerencias de IA',
                'Edita cualquier sección fácilmente',
                'Descarga en PDF de alta calidad'
            ]
        },
    ];

    const benefits = [
        '100% Gratis - Sin costos ocultos',
        'Sin registro obligatorio',
        'Procesamiento instantáneo',
        'Plantillas profesionales',
        'Mejora con IA incluida',
        'Exportación a PDF ilimitada'
    ];

    return (
        <main className="how-it-works-page">
            {/* Hero Section */}
            <section className="how-hero">
                <div className="container">
                    <div className="how-hero-content">
                        <div className="section-badge">
                            <Sparkles size={16} />
                            <span>Proceso Simple</span>
                        </div>
                        <h1 className="how-hero-title">
                            Crea tu CV en <span className="title-highlight">4 simples pasos</span>
                        </h1>
                        <p className="how-hero-description">
                            Un proceso intuitivo diseñado para que tengas tu currículum profesional listo en minutos.
                            Sin complicaciones, sin registro, completamente gratis.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="how-steps-section">
                <div className="container">
                    <div className="steps-container">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <div className="step-content">
                                    <div className="step-icon-wrapper">
                                        <step.icon size={32} />
                                    </div>
                                    <h2 className="step-title">{step.title}</h2>
                                    <p className="step-description">{step.description}</p>
                                    <ul className="step-details">
                                        {step.details.map((detail, idx) => (
                                            <li key={idx} className="step-detail-item">
                                                <CheckCircle size={18} />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="how-benefits-section">
                <div className="container">
                    <div className="benefits-content">
                        <h2 className="benefits-title">¿Por qué elegir CVMagic?</h2>
                        <div className="benefits-grid">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="benefit-card">
                                    <CheckCircle size={24} className="benefit-icon" />
                                    <span className="benefit-text">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="how-cta-section">
                <div className="container">
                    <div className="how-cta-content">
                        <h2 className="how-cta-title">¿Listo para crear tu CV profesional?</h2>
                        <p className="how-cta-description">
                            Comienza ahora y ten tu currículum listo en minutos. Es gratis, rápido y potenciado por IA.
                        </p>
                        <div className="how-cta-buttons">
                            <Link to="/crear">
                                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                                    Crear mi CV Gratis
                                </Button>
                            </Link>
                            <Link to="/importar">
                                <Button variant="outline" size="lg">
                                    Importar PDF
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HowItWorksPage;
