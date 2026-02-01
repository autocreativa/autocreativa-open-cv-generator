import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Send, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: null, message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validación básica
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({
                type: 'error',
                message: 'Por favor completa todos los campos requeridos.'
            });
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({
                type: 'error',
                message: 'Por favor ingresa un email válido.'
            });
            return;
        }

        // Crear mailto link
        const subject = encodeURIComponent(formData.subject || 'Contacto desde CVMagic');
        const body = encodeURIComponent(
            `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
        );
        const mailtoLink = `mailto:contacto@autocreativa.com?subject=${subject}&body=${body}`;
        
        window.location.href = mailtoLink;
        
        setStatus({
            type: 'success',
            message: 'Redirigiendo a tu cliente de correo...'
        });
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email',
            description: 'Escríbenos directamente',
            value: 'contacto@autocreativa.com',
            link: 'mailto:contacto@autocreativa.com'
        },
        {
            icon: MessageSquare,
            title: 'Sitio Web',
            description: 'Visita nuestro sitio',
            value: 'autocreativa.com',
            link: 'https://autocreativa.com',
            external: true
        }
    ];

    return (
        <main className="contact-page">
            <div className="container">
                {/* Header */}
                <div className="contact-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver al inicio</span>
                    </Link>
                    <div className="contact-header-content">
                        <div className="contact-icon-wrapper">
                            <MessageSquare size={48} />
                        </div>
                        <h1 className="contact-title">Contáctanos</h1>
                        <p className="contact-subtitle">
                            ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para ayudarte.
                        </p>
                    </div>
                </div>

                <div className="contact-content">
                    {/* Contact Methods */}
                    <section className="contact-methods">
                        <h2 className="methods-title">Formas de contacto</h2>
                        <div className="methods-grid">
                            {contactMethods.map((method, index) => (
                                <a
                                    key={index}
                                    href={method.link}
                                    target={method.external ? '_blank' : undefined}
                                    rel={method.external ? 'noopener noreferrer' : undefined}
                                    className="method-card"
                                >
                                    <div className="method-icon-wrapper">
                                        <method.icon size={28} />
                                    </div>
                                    <h3 className="method-title">{method.title}</h3>
                                    <p className="method-description">{method.description}</p>
                                    <p className="method-value">{method.value}</p>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Contact Form */}
                    <section className="contact-form-section">
                        <div className="form-header">
                            <h2 className="form-title">Envíanos un mensaje</h2>
                            <p className="form-description">
                                Completa el formulario y te responderemos lo antes posible.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Nombre <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Tu nombre completo"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject" className="form-label">
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="¿Sobre qué quieres contactarnos?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message" className="form-label">
                                    Mensaje <span className="required">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows="6"
                                    placeholder="Escribe tu mensaje aquí..."
                                    required
                                />
                            </div>

                            {status.message && (
                                <div className={`form-status ${status.type}`}>
                                    {status.type === 'success' ? (
                                        <CheckCircle size={20} />
                                    ) : (
                                        <AlertCircle size={20} />
                                    )}
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                rightIcon={<Send size={20} />}
                                className="form-submit"
                            >
                                Enviar mensaje
                            </Button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Contact;
