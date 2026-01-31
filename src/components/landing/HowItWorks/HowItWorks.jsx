import { Link } from 'react-router-dom';
import { FileUp, MessageCircle, LayoutTemplate, Download, ArrowRight } from 'lucide-react';
import Button from '../../common/Button';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: FileUp,
            title: 'Elige cómo empezar',
            description: 'Importa tu CV existente en PDF o créalo desde cero con nuestro asistente conversacional.',
        },
        {
            number: '02',
            icon: MessageCircle,
            title: 'Completa tu información',
            description: 'Responde preguntas simples o dicta tu experiencia por voz. La IA organiza todo automáticamente.',
        },
        {
            number: '03',
            icon: LayoutTemplate,
            title: 'Selecciona tu plantilla',
            description: 'Elige entre 50 diseños profesionales organizados por industria. Personaliza con tu foto.',
        },
        {
            number: '04',
            icon: Download,
            title: 'Mejora y descarga',
            description: 'Usa la varita mágica para mejorar tus textos con IA y descarga tu CV en PDF.',
        },
    ];

    return (
        <section className="how-it-works" id="how-it-works">
            <div className="how-container container">
                {/* Header */}
                <div className="how-header">
                    <h2 className="how-title">
                        Crea tu CV en <span className="title-highlight">4 simples pasos</span>
                    </h2>
                    <p className="how-subtitle">
                        Un proceso intuitivo diseñado para que tengas tu currículum profesional listo en minutos.
                    </p>
                </div>

                {/* Steps */}
                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-item">
                            <div className="step-number">{step.number}</div>
                            <div className="step-content">
                                <div className="step-icon-wrapper">
                                    <step.icon size={24} />
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <ArrowRight size={20} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="how-cta">
                    <Link to="/crear">
                        <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                            Empezar ahora
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
