import { Link } from 'react-router-dom';
import { FileText, Github, Globe, Mail, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const handleInternalLinkClick = (e) => {
        // Hacer scroll inmediato primero para asegurar que funcione
        window.scrollTo(0, 0);
        if (document.documentElement) {
            document.documentElement.scrollTop = 0;
        }
        if (document.body) {
            document.body.scrollTop = 0;
        }

        // Luego hacer scroll suave después de un pequeño delay
        // Esto permite que el scroll instantáneo se ejecute primero
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 10);

        // No prevenir el comportamiento por defecto - dejar que React Router maneje la navegación
        // El componente ScrollToTop también hará scroll cuando cambie la ruta
    };

    const renderFooterLink = (link) => {
        const isExternal = Boolean(link.external) || /^https?:\/\//i.test(link.to) || /^mailto:/i.test(link.to);

        if (isExternal) {
            return (
                <a
                    href={link.to}
                    className="footer-link"
                    target={/^https?:\/\//i.test(link.to) ? '_blank' : undefined}
                    rel={/^https?:\/\//i.test(link.to) ? 'noopener noreferrer' : undefined}
                >
                    {link.label}
                </a>
            );
        }

        return (
            <Link 
                to={link.to} 
                className="footer-link"
                onClick={handleInternalLinkClick}
            >
                {link.label}
            </Link>
        );
    };

    const footerLinks = {
        producto: [
            { to: '/plantillas', label: 'Plantillas' },
            { to: '/como-funciona', label: 'Cómo Funciona' },
            { to: '/crear', label: 'Crear CV' },
            { to: '/importar', label: 'Importar PDF' },
            { to: '/importar?mode=ocr', label: 'Importar Foto (OCR)' },
        ],
        recursos: [
            { to: '/faq', label: 'Preguntas Frecuentes' },
            { to: 'https://github.com/autocreativa/autocreativa-open-cv-generator', label: 'Repositorio (GitHub)', external: true },
            { to: 'https://autocreativa.com', label: 'Autocreativa', external: true },
            { to: 'https://autocreativa.com/contacto', label: 'Contacto', external: true },
            { to: 'mailto:contacto@autocreativa.com', label: 'Sugerencias: contacto@autocreativa.com', external: true },
        ],
        legal: [
            { to: '/terminos', label: 'Términos y Condiciones' },
            { to: '/privacidad', label: 'Política de Privacidad' },
            { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
            { to: '/contacto', label: 'Contacto' },
        ],
    };

    return (
        <footer className="footer">
            <div className="footer-container container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <Link 
                        to="/" 
                        className="footer-logo"
                        onClick={handleInternalLinkClick}
                    >
                        <div className="logo-icon">
                            <FileText size={24} />
                        </div>
                        <span className="logo-text">
                            CV<span className="logo-highlight">Magic</span>
                        </span>
                    </Link>
                    <p className="footer-tagline">
                        Tu currículum profesional, gratis y con Inteligencia Artificial.
                    </p>
                    <div className="footer-tech">
                        <span className="tech-badge">Potenciado por IA</span>
                        <span className="tech-badge">100% Gratis</span>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="footer-links-grid">
                    <div className="footer-links-col">
                        <h4 className="footer-links-title">Producto</h4>
                        <ul className="footer-links-list">
                            {footerLinks.producto.map((link) => (
                                <li key={link.to}>
                                    {renderFooterLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h4 className="footer-links-title">Recursos</h4>
                        <ul className="footer-links-list">
                            {footerLinks.recursos.map((link) => (
                                <li key={link.to}>
                                    {renderFooterLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h4 className="footer-links-title">Legal</h4>
                        <ul className="footer-links-list">
                            {footerLinks.legal.map((link) => (
                                <li key={link.to}>
                                    {renderFooterLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-container container">
                    <p className="footer-copyright">
                        © {currentYear} CVMagic. Hecho con{' '}
                        <Heart size={14} className="heart-icon" /> por{' '}
                        <a href="https://autocreativa.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                            autocreativa.com
                        </a>
                    </p>
                    <div className="footer-social">
                        <a
                            href="https://github.com/autocreativa/autocreativa-open-cv-generator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="GitHub"
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://autocreativa.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="Autocreativa"
                        >
                            <Globe size={20} />
                        </a>
                        <a
                            href="mailto:contacto@autocreativa.com"
                            className="social-link"
                            aria-label="Email"
                        >
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
