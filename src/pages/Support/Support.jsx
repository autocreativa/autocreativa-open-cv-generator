import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bug, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import './Support.css';

const Support = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'sugerencia',
    });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    const recaptchaBypass = String(import.meta.env.VITE_RECAPTCHA_BYPASS || '').toLowerCase() === 'true';
    const defaultApiBaseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
        .toString()
        .replace(/\/$/, '');
    const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl).replace(/\/$/, '');

    useEffect(() => {
        if (!siteKey) return;
        const existing = document.querySelector('script[data-recaptcha-enterprise="true"]');
        if (existing) return;

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`;
        script.async = true;
        script.defer = true;
        script.setAttribute('data-recaptcha-enterprise', 'true');
        document.head.appendChild(script);
    }, [siteKey]);

    const getRecaptchaToken = async () => {
        if (recaptchaBypass) return 'bypass';
        if (!siteKey) {
            throw new Error('reCAPTCHA no está configurado. Revisa VITE_RECAPTCHA_SITE_KEY.');
        }

        const grecaptcha = window.grecaptcha;
        if (!grecaptcha?.enterprise?.ready || !grecaptcha?.enterprise?.execute) {
            throw new Error('reCAPTCHA no está listo. Intenta nuevamente en unos segundos.');
        }

        const token = await new Promise((resolve, reject) => {
            try {
                grecaptcha.enterprise.ready(async () => {
                    try {
                        const t = await grecaptcha.enterprise.execute(siteKey, { action: 'support' });
                        resolve(t);
                    } catch (err) {
                        reject(err);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });

        if (!token) throw new Error('No se pudo obtener el token de reCAPTCHA.');
        return token;
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ type: 'error', message: 'Por favor completa todos los campos requeridos.' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({ type: 'error', message: 'Por favor ingresa un email válido.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            const recaptchaToken = await getRecaptchaToken();
            const res = await fetch(`${apiBaseUrl}/api/support`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken,
                    pageUrl: window.location.href,
                    userAgent: navigator.userAgent,
                }),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.ok) {
                throw new Error(json.error || 'No se pudo enviar el mensaje');
            }

            setStatus({
                type: 'success',
                message: '¡Gracias! Recibimos tu mensaje. Te enviamos un correo de confirmación.',
            });

            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                type: 'sugerencia',
            });
        } catch (err) {
            const raw = String(err?.message || err || '');
            const isNetwork = /failed to fetch|networkerror|load failed|fetch/i.test(raw);
            setStatus({
                type: 'error',
                message: isNetwork
                    ? 'No se pudo conectar al servidor de envío. Asegúrate de levantar el backend de correo (npm run dev:server o npm run dev:all) y que esté en http://localhost:5174.'
                    : (err?.message || 'No se pudo enviar el mensaje'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="support-page">
            <div className="container">
                <div className="support-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver al inicio</span>
                    </Link>

                    <div className="support-header-content">
                        <div className="support-icon-wrapper">
                            <Bug size={48} />
                        </div>
                        <h1 className="support-title">Soporte y Sugerencias</h1>
                        <p className="support-subtitle">
                            La plataforma está en construcción. Agradecemos tus sugerencias y reportes de problemas para poder mejorarlo.
                        </p>
                    </div>
                </div>

                <div className="support-content">
                    <section className="support-form-section">
                        <div className="form-header">
                            <h2 className="form-title">Enviar reporte</h2>
                            <p className="form-description">
                                Te enviaremos un correo confirmando la recepción. Nuestro equipo revisará tu mensaje.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="support-form">
                            <div className="form-group">
                                <label htmlFor="type" className="form-label">Tipo</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="sugerencia">Sugerencia</option>
                                    <option value="bug">Problema / Bug</option>
                                </select>
                            </div>

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
                                    placeholder="Tu nombre"
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
                                <label htmlFor="subject" className="form-label">Asunto</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ej: Error al exportar PDF"
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
                                    rows="7"
                                    placeholder="Describe el problema o tu sugerencia (pasos para reproducir, navegador, etc.)"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                    Este formulario está protegido por reCAPTCHA.
                                </div>
                            </div>

                            {status.message && (
                                <div className={`form-status ${status.type}`}>
                                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                rightIcon={<Send size={20} />}
                                className="form-submit"
                                loading={isSubmitting}
                            >
                                Enviar
                            </Button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Support;
