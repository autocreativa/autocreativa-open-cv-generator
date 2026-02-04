import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, Bug } from 'lucide-react';
import { useState } from 'react';
import Button from '../../common/Button';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { to: '/', label: 'Inicio' },
        { to: '/como-funciona', label: 'Cómo Funciona' },
        { to: '/plantillas', label: 'Plantillas' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container container">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <div className="logo-icon">
                        <FileText size={28} />
                    </div>
                    <span className="logo-text">
                        CV<span className="logo-highlight">Magic</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div className="header-actions desktop-nav">
                    <Link to="/soporte" className="header-icon-link" aria-label="Soporte y sugerencias" title="Soporte y sugerencias">
                        <Bug size={18} />
                        <span className="header-icon-text">Enviar comentarios</span>
                    </Link>
                    <Link to="/importar">
                        <Button variant="outline" size="sm">
                            Mejorar CV
                        </Button>
                    </Link>
                    <Link to="/crear">
                        <Button variant="primary" size="sm">
                            Crear desde cero
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Navigation */}
                <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <nav className="mobile-nav-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/soporte"
                            className={`mobile-nav-link ${isActive('/soporte') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Soporte / Sugerencias
                        </Link>
                    </nav>
                    <div className="mobile-nav-actions">
                        <Link to="/importar" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" fullWidth>
                                Mejorar CV
                            </Button>
                        </Link>
                        <Link to="/crear" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="primary" fullWidth>
                                Crear desde cero
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
