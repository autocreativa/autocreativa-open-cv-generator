import {
    FileUp,
    LayoutTemplate,
    Wand2,
    Mic,
    FileText,
    Download,
    Sparkles
} from 'lucide-react';
import './Features.css';

const Features = () => {
    const features = [
        {
            icon: FileUp,
            title: 'Importa tu PDF',
            description: 'Sube tu CV actual y nuestra IA extraerá automáticamente toda tu información profesional.',
            color: 'blue',
        },
        {
            icon: LayoutTemplate,
            title: '50 Plantillas',
            description: 'Elige entre 50 diseños profesionales categorizados por industria y estilo.',
            color: 'green',
        },
        {
            icon: Wand2,
            title: 'Mejora con IA',
            description: 'Potencia tus textos con sugerencias inteligentes que impresionarán a los reclutadores.',
            color: 'purple',
        },
        {
            icon: Mic,
            title: 'Dicta tu CV',
            description: 'Crea tu currículum hablando. Nuestro asistente de voz te guiará paso a paso.',
            color: 'orange',
        },
        {
            icon: FileText,
            title: 'Carta de Presentación',
            description: 'Genera una carta de presentación personalizada basada en tu CV con un solo clic.',
            color: 'pink',
        },
        {
            icon: Download,
            title: 'Descarga PDF',
            description: 'Exporta tu currículum en formato PDF listo para enviar a cualquier empresa.',
            color: 'teal',
        },
    ];

    return (
        <section className="features" id="features">
            <div className="features-container container">
                {/* Section Header */}
                <div className="features-header">
                    <div className="section-badge">
                        <Sparkles size={16} />
                        <span>Características</span>
                    </div>
                    <h2 className="features-title">
                        Todo lo que necesitas para un
                        <span className="title-highlight"> CV perfecto</span>
                    </h2>
                    <p className="features-subtitle">
                        Herramientas profesionales para crear un currículum que destaque.
                        Sin costos ocultos, sin registro obligatorio.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card feature-${feature.color}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="feature-icon-wrapper">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
