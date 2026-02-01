import { Link } from 'react-router-dom';
import { Lock, Shield, Eye, Database, ArrowLeft, CheckCircle } from 'lucide-react';
import './Privacy.css';

const Privacy = () => {
    const sections = [
        {
            icon: Eye,
            title: '1. Información que Recopilamos',
            content: 'CVMagic procesa la información que ingresas para crear tu CV. Esta información incluye datos personales, experiencia laboral, educación, habilidades y cualquier otro contenido que agregues a tu currículum. La mayoría del procesamiento se realiza localmente en tu navegador.'
        },
        {
            icon: Database,
            title: '2. Cómo Usamos tu Información',
            content: 'Utilizamos tu información únicamente para proporcionar el servicio de creación de CV. Esto incluye procesar tus datos para generar el currículum, mejorar textos con IA cuando lo solicitas, y almacenar temporalmente tu información en tu navegador para que puedas continuar editando.'
        },
        {
            icon: Shield,
            title: '3. Almacenamiento de Datos',
            content: 'Tu información se almacena principalmente en tu navegador local (localStorage). No almacenamos tus datos personales en nuestros servidores de forma permanente. Cuando usas funciones de IA, los datos se envían de forma segura a proveedores de servicios de IA para procesamiento, pero no se almacenan permanentemente.'
        },
        {
            icon: Lock,
            title: '4. Seguridad',
            content: 'Implementamos medidas de seguridad para proteger tu información. Sin embargo, ningún método de transmisión por Internet es 100% seguro. Te recomendamos no incluir información extremadamente sensible como números de seguridad social completos en tu CV.'
        },
        {
            icon: CheckCircle,
            title: '5. Tus Derechos',
            content: 'Tienes derecho a acceder, modificar o eliminar tu información en cualquier momento. Puedes limpiar los datos almacenados en tu navegador eliminando el localStorage. No compartimos tu información con terceros para fines de marketing.'
        },
        {
            icon: Shield,
            title: '6. Cookies y Tecnologías Similares',
            content: 'CVMagic puede usar cookies y tecnologías similares para mejorar la experiencia del usuario. Estas tecnologías nos ayudan a recordar tus preferencias y mantener tu sesión activa mientras editas tu CV.'
        },
        {
            icon: Database,
            title: '7. Servicios de Terceros',
            content: 'Utilizamos servicios de terceros como OpenRouter para funciones de IA. Estos servicios tienen sus propias políticas de privacidad. Te recomendamos revisar sus términos cuando uses funciones de IA.'
        },
        {
            icon: Eye,
            title: '8. Cambios en esta Política',
            content: 'Podemos actualizar esta política de privacidad ocasionalmente. Los cambios se publicarán en esta página con una fecha de actualización. Te recomendamos revisar esta política periódicamente.'
        }
    ];

    return (
        <main className="privacy-page">
            <div className="container">
                {/* Header */}
                <div className="privacy-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver al inicio</span>
                    </Link>
                    <div className="privacy-header-content">
                        <div className="privacy-icon-wrapper">
                            <Lock size={48} />
                        </div>
                        <h1 className="privacy-title">Política de Privacidad</h1>
                        <p className="privacy-subtitle">
                            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="privacy-content">
                    <div className="privacy-intro">
                        <p>
                            En CVMagic, tu privacidad es importante para nosotros. Esta política explica cómo recopilamos,
                            usamos y protegemos tu información personal cuando utilizas nuestro servicio.
                        </p>
                    </div>

                    <div className="privacy-sections">
                        {sections.map((section, index) => (
                            <div key={index} className="privacy-section">
                                <div className="section-header">
                                    <div className="section-icon-wrapper">
                                        <section.icon size={28} />
                                    </div>
                                    <h2 className="section-title">{section.title}</h2>
                                </div>
                                <p className="section-content">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="privacy-contact">
                        <div className="contact-card">
                            <h3 className="contact-title">¿Preguntas sobre privacidad?</h3>
                            <p className="contact-description">
                                Si tienes preguntas o preocupaciones sobre cómo manejamos tu información,
                                contáctanos y estaremos encantados de ayudarte.
                            </p>
                            <div className="contact-links">
                                <a href="mailto:contacto@autocreativa.com" className="contact-link">
                                    contacto@autocreativa.com
                                </a>
                                <Link to="/contacto" className="contact-link">
                                    Página de contacto
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Privacy;
