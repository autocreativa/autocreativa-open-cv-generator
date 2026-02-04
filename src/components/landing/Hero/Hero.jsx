import { Link } from 'react-router-dom';
import { ArrowRight, FileUp, Sparkles, CheckCircle } from 'lucide-react';
import Button from '../../common/Button';
import './Hero.css';

const Hero = () => {
    const features = [
        '100% Gratis',
        '50 Plantillas',
        'IA Incluida',
        'Sin registro',
    ];

    return (
        <section className="hero">
            {/* Background decoration */}
            <div className="hero-bg">
                <div className="hero-gradient" />
                <div className="hero-pattern" />
            </div>

            <div className="hero-container container">
                <div className="hero-content">
                    {/* Badge */}
                    <div className="hero-badge animate-fadeInDown">
                        <Sparkles size={16} />
                        <span>Potenciado por Inteligencia Artificial</span>
                    </div>

                    {/* Title */}
                    <h1 className="hero-title animate-fadeInUp">
                        Crea tu Currículum
                        <span className="hero-title-highlight">
                            Profesional
                        </span>
                        Gratis y con IA
                    </h1>

                    {/* Description */}
                    <p className="hero-description animate-fadeInUp animation-delay-100">
                        Diseña un CV impactante en minutos. Importa tu PDF existente o créalo desde cero
                        con nuestro asistente inteligente. Elige entre 50 plantillas profesionales y
                        mejora tus textos con IA.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-actions animate-fadeInUp animation-delay-200">
                        <Link to="/crear">
                            <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                                Crear desde cero
                            </Button>
                        </Link>
                        <Link to="/importar">
                            <Button variant="outline" size="lg" leftIcon={<FileUp size={20} />}>
                                Mejorar CV
                            </Button>
                        </Link>
                    </div>

                    {/* Features list */}
                    <div className="hero-features animate-fadeInUp animation-delay-300">
                        {features.map((feature, index) => (
                            <div key={index} className="hero-feature">
                                <CheckCircle size={18} className="feature-icon" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero Image/Illustration */}
                <div className="hero-visual animate-fadeInRight animation-delay-200">
                    <div className="hero-mockup">
                        <div className="mockup-header">
                            <div className="mockup-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="mockup-content">
                            <div className="mockup-avatar"></div>
                            <div className="mockup-text">
                                <div className="mockup-line w-60"></div>
                                <div className="mockup-line w-40"></div>
                            </div>
                            <div className="mockup-section">
                                <div className="mockup-line w-30"></div>
                                <div className="mockup-line w-80"></div>
                                <div className="mockup-line w-70"></div>
                            </div>
                            <div className="mockup-section">
                                <div className="mockup-line w-30"></div>
                                <div className="mockup-line w-90"></div>
                                <div className="mockup-line w-60"></div>
                            </div>
                        </div>
                        <div className="mockup-badge">
                            <Sparkles size={16} />
                            <span>IA</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
