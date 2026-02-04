import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileUp, Sparkles, LayoutTemplate, MessageCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import './CreateMethodSelection.css';

const CreateMethodSelection = () => {
    const navigate = useNavigate();

    const methods = [
        {
            id: 'extract',
            icon: FileUp,
            title: 'Extraer información desde un archivo',
            description: 'Sube tu CV en PDF o una imagen (foto) y extraeremos automáticamente toda tu información usando IA y OCR.',
            features: [
                'Soporta archivos PDF',
                'Soporta imágenes (JPG, PNG)',
                'Tomar foto con la cámara',
                'Extracción automática con IA'
            ],
            action: () => navigate('/importar'),
            variant: 'primary',
            badge: 'Más rápido'
        },
        {
            id: 'sample',
            icon: LayoutTemplate,
            title: 'Utilizar datos por defecto',
            description: 'Comienza con un CV de ejemplo pre-cargado que puedes editar y personalizar según tus necesidades.',
            features: [
                'CV de ejemplo completo',
                'Todos los campos pre-llenados',
                'Fácil de personalizar',
                'Ideal para ver el resultado final'
            ],
            action: () => navigate('/seleccionar-plantilla?sample=1'),
            variant: 'outline',
            badge: 'Vista previa'
        },
        {
            id: 'assistant',
            icon: MessageCircle,
            title: 'Utilizar asistente conversacional',
            description: 'Crea tu CV desde cero conversando con nuestro asistente inteligente. Responde preguntas simples y nosotros lo organizamos todo.',
            features: [
                'Asistente con IA',
                'Conversación natural',
                'Reconocimiento de voz',
                'Guía paso a paso'
            ],
            action: () => navigate('/crear/asistente'),
            variant: 'outline',
            badge: 'Recomendado'
        }
    ];

    return (
        <main className="method-selection-page">
            <div className="method-container container">
                {/* Header */}
                <div className="method-header">
                    <button className="back-link" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                        <span>Volver</span>
                    </button>
                </div>

                {/* Title Section */}
                <div className="method-title-section">
                    <div className="section-badge">
                        <Sparkles size={16} />
                        <span>Crear desde cero</span>
                    </div>
                    <h1 className="method-title">¿Cómo quieres crear tu CV?</h1>
                    <p className="method-description">
                        Elige el método que mejor se adapte a ti. Todos los métodos te llevarán al mismo resultado: un CV profesional y personalizado.
                    </p>
                </div>

                {/* Method Cards */}
                <div className="method-cards">
                    {methods.map((method) => (
                        <div key={method.id} className="method-card">
                            {method.badge && (
                                <div className="method-badge">{method.badge}</div>
                            )}

                            <div className="method-card-icon">
                                <method.icon size={40} />
                            </div>

                            <h2 className="method-card-title">{method.title}</h2>
                            <p className="method-card-description">{method.description}</p>

                            <ul className="method-features">
                                {method.features.map((feature, idx) => (
                                    <li key={idx} className="method-feature">
                                        <span className="feature-dot"></span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={method.variant}
                                size="lg"
                                fullWidth
                                onClick={method.action}
                                className="method-card-button"
                            >
                                Seleccionar
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="method-help">
                    <p>
                        ¿No estás seguro cuál elegir? <strong>Extrae información desde un archivo</strong> si ya tienes un CV,
                        usa el <strong>asistente conversacional</strong> si empiezas desde cero, o prueba los <strong>datos por defecto</strong> para ver cómo funciona.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default CreateMethodSelection;
