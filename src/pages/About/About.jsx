import { Link } from 'react-router-dom';
import { Users, Target, Heart, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import './About.css';

const About = () => {
    const values = [
        {
            icon: Heart,
            title: 'Comprometidos con tu éxito',
            description: 'Creemos que todos merecen tener un CV profesional que los represente. Por eso ofrecemos nuestro servicio completamente gratis.'
        },
        {
            icon: Target,
            title: 'Innovación constante',
            description: 'Utilizamos las últimas tecnologías de IA para ayudarte a crear el mejor CV posible. Siempre estamos mejorando y agregando nuevas funcionalidades.'
        },
        {
            icon: Sparkles,
            title: 'Diseño profesional',
            description: 'Nuestras plantillas están diseñadas por profesionales y optimizadas para pasar los sistemas ATS (Applicant Tracking Systems) de las empresas.'
        },
        {
            icon: Users,
            title: 'Para todos',
            description: 'CVMagic es para estudiantes, profesionales, freelancers y cualquier persona que necesite un CV profesional. Sin barreras, sin complicaciones.'
        }
    ];

    const features = [
        '100% Gratis - Sin costos ocultos',
        '50 Plantillas profesionales',
        'Mejora con Inteligencia Artificial',
        'Sin registro obligatorio',
        'Exportación a PDF ilimitada',
        'Soporte para múltiples idiomas'
    ];

    return (
        <main className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <div className="section-badge">
                            <Sparkles size={16} />
                            <span>Sobre Nosotros</span>
                        </div>
                        <h1 className="about-hero-title">
                            Creando oportunidades, <span className="title-highlight">un CV a la vez</span>
                        </h1>
                        <p className="about-hero-description">
                            CVMagic es un proyecto de Autocreativa diseñado para democratizar el acceso a herramientas
                            profesionales de creación de currículums. Creemos que todos merecen tener un CV que los
                            represente profesionalmente, sin barreras económicas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-mission">
                <div className="container">
                    <div className="mission-content">
                        <div className="mission-text">
                            <h2 className="mission-title">Nuestra Misión</h2>
                            <p className="mission-description">
                                Facilitar el acceso a herramientas profesionales de creación de CVs para personas de todo el mundo.
                                Queremos eliminar las barreras económicas y técnicas que impiden a las personas crear currículums
                                de calidad profesional.
                            </p>
                            <p className="mission-description">
                                Utilizamos tecnología de vanguardia, incluyendo Inteligencia Artificial, para hacer que el proceso
                                de creación de CVs sea más rápido, fácil y efectivo. Nuestro objetivo es ayudarte a destacar en el
                                mercado laboral.
                            </p>
                        </div>
                        <div className="mission-visual">
                            <div className="visual-card">
                                <div className="visual-icon">
                                    <Target size={48} />
                                </div>
                                <h3 className="visual-title">Impacto</h3>
                                <p className="visual-text">Ayudando a miles de personas a conseguir su trabajo ideal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <div className="container">
                    <h2 className="values-title">Nuestros Valores</h2>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon-wrapper">
                                    <value.icon size={32} />
                                </div>
                                <h3 className="value-title">{value.title}</h3>
                                <p className="value-description">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="about-features">
                <div className="container">
                    <div className="features-content">
                        <h2 className="features-title">Lo que ofrecemos</h2>
                        <div className="features-grid">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <CheckCircle size={24} className="feature-icon" />
                                    <span className="feature-text">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="about-team">
                <div className="container">
                    <div className="team-content">
                        <h2 className="team-title">Desarrollado por Autocreativa</h2>
                        <p className="team-description">
                            CVMagic es un proyecto desarrollado y mantenido por{' '}
                            <a href="https://autocreativa.com" target="_blank" rel="noopener noreferrer" className="team-link">
                                Autocreativa
                            </a>
                            , una agencia digital especializada en crear soluciones innovadoras con tecnología de punta.
                        </p>
                        <p className="team-description">
                            Nuestro equipo está comprometido con la innovación y la accesibilidad. Creemos en el poder
                            de la tecnología para mejorar vidas y crear oportunidades.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <div className="about-cta-content">
                        <h2 className="about-cta-title">¿Listo para crear tu CV?</h2>
                        <p className="about-cta-description">
                            Únete a miles de personas que ya crearon su currículum profesional con CVMagic.
                        </p>
                        <div className="about-cta-buttons">
                            <Link to="/crear">
                                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                                    Crear mi CV Gratis
                                </Button>
                            </Link>
                            <Link to="/contacto">
                                <Button variant="outline" size="lg">
                                    Contáctanos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
