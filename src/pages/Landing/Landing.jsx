import { Link } from 'react-router-dom';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import './Landing.css';

const Landing = () => {
    return (
        <main className="landing-page">
            <Hero />
            <Features />
            <HowItWorks />

            {/* Tech Stack Section */}
            <section className="tech-section">
                <div className="container">
                    <div className="tech-content">
                        <h3 className="tech-title">Tecnologías que usamos</h3>
                        <p className="tech-description">
                            Construido con las mejores herramientas para ofrecerte la mejor experiencia
                        </p>
                        <div className="tech-badges">
                            <span className="tech-badge">React</span>
                            <span className="tech-badge">OpenRouter AI</span>
                            <span className="tech-badge">PDF.js</span>
                            <span className="tech-badge">Web Speech API</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">
                            ¿Listo para crear tu CV profesional?
                        </h2>
                        <p className="cta-description">
                            Únete a miles de personas que ya crearon su currículum con CVMagic.
                            Es gratis, rápido y potenciado por IA.
                        </p>
                        <Link to="/crear" className="cta-button">
                            Crear mi CV Gratis
                        </Link>
                    </div>
                </div>
            </section>

            <section className="author-section">
                <div className="container">
                    <div className="author-content">
                        <h3 className="author-title">Autor y contacto</h3>
                        <p className="author-text">
                            Proyecto creado y mantenido por{' '}
                            <a className="author-link" href="https://autocreativa.com" target="_blank" rel="noopener noreferrer">
                                autocreativa.com
                            </a>
                            .
                        </p>
                        <p className="author-text">
                            Para sugerencias, reportes o colaboración:{' '}
                            <a className="author-link" href="mailto:contacto@autocreativa.com">
                                contacto@autocreativa.com
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Landing;
