import { Link } from 'react-router-dom';
import { FileText, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import './Terms.css';

const Terms = () => {
    const sections = [
        {
            title: '1. Aceptación de los Términos',
            content: 'Al acceder y utilizar CVMagic, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.'
        },
        {
            title: '2. Uso del Servicio',
            content: 'CVMagic es una herramienta gratuita para crear currículums profesionales. Puedes usar el servicio para crear, editar y descargar tu CV sin costo alguno. No se requiere registro obligatorio para usar las funciones básicas.'
        },
        {
            title: '3. Contenido del Usuario',
            content: 'Eres el único responsable del contenido que ingresas en tu CV. CVMagic no se hace responsable por la veracidad, exactitud o legalidad de la información proporcionada por los usuarios. Te recomendamos verificar toda la información antes de compartir tu CV.'
        },
        {
            title: '4. Propiedad Intelectual',
            content: 'Las plantillas, diseños y funcionalidades de CVMagic son propiedad de Autocreativa. El contenido de tu CV es de tu propiedad. Al usar nuestro servicio, otorgas a CVMagic una licencia limitada para procesar y almacenar tu información únicamente para proporcionar el servicio.'
        },
        {
            title: '5. Privacidad',
            content: 'Respetamos tu privacidad. La información que ingresas se procesa localmente en tu navegador cuando es posible. Para más detalles sobre cómo manejamos tus datos, consulta nuestra Política de Privacidad.'
        },
        {
            title: '6. Limitación de Responsabilidad',
            content: 'CVMagic se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos que el servicio esté libre de errores o interrupciones. No seremos responsables por cualquier pérdida o daño derivado del uso de nuestro servicio.'
        },
        {
            title: '7. Modificaciones del Servicio',
            content: 'Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento sin previo aviso. Haremos nuestro mejor esfuerzo para notificar cambios importantes cuando sea posible.'
        },
        {
            title: '8. Enlaces a Terceros',
            content: 'Nuestro servicio puede contener enlaces a sitios web de terceros. No tenemos control sobre el contenido de estos sitios y no asumimos responsabilidad por ellos.'
        },
        {
            title: '9. Uso Aceptable',
            content: 'Te comprometes a usar CVMagic de manera legal y ética. No debes usar el servicio para crear contenido fraudulento, difamatorio o que viole derechos de terceros.'
        },
        {
            title: '10. Cambios en los Términos',
            content: 'Podemos actualizar estos términos ocasionalmente. Los cambios entrarán en vigor cuando se publiquen en esta página. Te recomendamos revisar estos términos periódicamente.'
        }
    ];

    return (
        <main className="terms-page">
            <div className="container">
                {/* Header */}
                <div className="terms-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver al inicio</span>
                    </Link>
                    <div className="terms-header-content">
                        <div className="terms-icon-wrapper">
                            <Shield size={48} />
                        </div>
                        <h1 className="terms-title">Términos y Condiciones</h1>
                        <p className="terms-subtitle">
                            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="terms-content">
                    <div className="terms-intro">
                        <p>
                            Bienvenido a CVMagic. Estos términos y condiciones rigen el uso de nuestro servicio.
                            Al utilizar CVMagic, aceptas estos términos en su totalidad.
                        </p>
                    </div>

                    <div className="terms-sections">
                        {sections.map((section, index) => (
                            <div key={index} className="terms-section">
                                <h2 className="section-title">
                                    <FileText size={24} className="section-icon" />
                                    {section.title}
                                </h2>
                                <p className="section-content">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="terms-contact">
                        <div className="contact-card">
                            <h3 className="contact-title">¿Tienes preguntas?</h3>
                            <p className="contact-description">
                                Si tienes alguna pregunta sobre estos términos, no dudes en contactarnos.
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

export default Terms;
