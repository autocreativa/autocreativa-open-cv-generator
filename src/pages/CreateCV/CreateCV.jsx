import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Edit3 } from 'lucide-react';
import OnboardingModal from '../../components/onboarding/OnboardingModal';
import ChatInterface from '../../components/onboarding/ChatInterface';
import Button from '../../components/common/Button';
import { useCV } from '../../context/CVContext';
import { REQUIRED_SECTIONS } from '../../utils/constants';
import './CreateCV.css';

const CreateCV = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cvData, setCvData, setSelectedSections } = useCV();

    const [showOnboarding, setShowOnboarding] = useState(true);
    const [selectedSectionsLocal, setSelectedSectionsLocal] = useState([...REQUIRED_SECTIONS]);
    const [mode, setMode] = useState('chat'); // 'chat' | 'manual'
    const [chatComplete, setChatComplete] = useState(false);

    // Si viene de importar PDF, saltar onboarding
    useEffect(() => {
        if (searchParams.get('from') === 'import' || Object.keys(cvData?.contactInfo || {}).length > 0) {
            setShowOnboarding(false);
            setMode('manual');
        }
    }, [searchParams, cvData]);

    const handleOnboardingComplete = (sections) => {
        setSelectedSectionsLocal(sections);
        setSelectedSections(sections);
        setShowOnboarding(false);
    };

    const handleChatComplete = (data) => {
        setCvData((prev) => ({ ...prev, ...data }));
        setChatComplete(true);

        // Redirigir a seleccionar plantilla después de un momento
        setTimeout(() => {
            navigate('/seleccionar-plantilla');
        }, 2000);
    };

    const handleSwitchToManual = () => {
        setMode('manual');
        navigate('/editor');
    };

    return (
        <main className="create-cv-page">
            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onClose={() => navigate('/')}
                onComplete={handleOnboardingComplete}
            />

            {/* Main Content */}
            {!showOnboarding && (
                <div className="create-container container">
                    {/* Header */}
                    <div className="create-header">
                        <button className="back-link" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                            <span>Volver</span>
                        </button>

                        <div className="create-title">
                            <MessageCircle size={28} className="title-icon" />
                            <div>
                                <h1>Crea tu CV con nuestro asistente</h1>
                                <p>Responde las preguntas y dejaremos todo listo para ti</p>
                            </div>
                        </div>

                        {mode === 'chat' && !chatComplete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<Edit3 size={16} />}
                                onClick={handleSwitchToManual}
                            >
                                Editar manualmente
                            </Button>
                        )}
                    </div>

                    {/* Chat Interface */}
                    <div className="chat-wrapper">
                        <ChatInterface
                            sections={selectedSectionsLocal}
                            onComplete={handleChatComplete}
                            initialData={cvData}
                        />
                    </div>

                    {/* Completion Message */}
                    {chatComplete && (
                        <div className="completion-overlay">
                            <div className="completion-content">
                                <div className="completion-icon">🎉</div>
                                <h2>¡Datos recopilados!</h2>
                                <p>Redirigiendo al selector de plantillas...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default CreateCV;
