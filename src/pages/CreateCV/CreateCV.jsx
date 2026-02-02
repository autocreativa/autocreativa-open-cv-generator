import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Edit3, LayoutTemplate, Loader2 } from 'lucide-react';
import OnboardingModal from '../../components/onboarding/OnboardingModal';
import ChatInterface from '../../components/onboarding/ChatInterface';
import Button from '../../components/common/Button';
import { useCV } from '../../context/CVContext';
import { REQUIRED_SECTIONS } from '../../utils/constants';
import { cleanOnboardingCvData } from '../../services/openRouterService';
import './CreateCV.css';

const CreateCV = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cvData, setCvData, setSelectedSections } = useCV();

    const [showOnboarding, setShowOnboarding] = useState(true);
    const [selectedSectionsLocal, setSelectedSectionsLocal] = useState([...REQUIRED_SECTIONS]);
    const [mode, setMode] = useState('chat'); // 'chat' | 'manual'
    const [chatComplete, setChatComplete] = useState(false);
    const [completionStatus, setCompletionStatus] = useState('idle'); // 'idle' | 'processing' | 'redirecting'

    // Si viene de importar PDF, saltar onboarding
    useEffect(() => {
        const hasAnyContactValue = Object.values(cvData?.contactInfo || {}).some((v) => String(v || '').trim());
        if (searchParams.get('from') === 'import' || hasAnyContactValue) {
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

    const handleChatCompleteWithSections = async (data) => {
        setChatComplete(true);
        setCompletionStatus('processing');

        try {
            const cleaned = await cleanOnboardingCvData(data);
            setCvData((prev) => ({
                ...prev,
                ...cleaned,
                onboardingSource: 'assistant',
            }));
        } catch {
            setCvData((prev) => ({
                ...prev,
                ...data,
                onboardingSource: 'assistant',
            }));
        }

        setSelectedSectionsLocal(selectedSectionsLocal);
        setSelectedSections(selectedSectionsLocal);
        setCompletionStatus('redirecting');

        // Redirigir a seleccionar plantilla después de un momento
        setTimeout(() => {
            navigate('/seleccionar-plantilla?from=assistant');
        }, 1200);
    };

    const handleSwitchToManual = () => {
        setMode('manual');
        navigate('/editor');
    };

    const handleStartWithSampleTemplate = () => {
        navigate('/seleccionar-plantilla?sample=1');
    };

    return (
        <main className="create-cv-page">
            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onClose={() => navigate('/')}
                onComplete={handleOnboardingComplete}
                onStartWithSampleTemplate={handleStartWithSampleTemplate}
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
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<LayoutTemplate size={16} />}
                                    onClick={handleStartWithSampleTemplate}
                                >
                                    Empezar con plantilla y datos de ejemplo
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Edit3 size={16} />}
                                    onClick={handleSwitchToManual}
                                >
                                    Editar manualmente
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Chat Interface */}
                    <div className="chat-wrapper">
                        <ChatInterface
                            sections={selectedSectionsLocal}
                            onComplete={handleChatCompleteWithSections}
                            initialData={cvData}
                            onStartWithSampleTemplate={handleStartWithSampleTemplate}
                        />
                    </div>

                    {/* Completion Message */}
                    {chatComplete && (
                        <div className="completion-overlay">
                            <div className="completion-content">
                                <div className="completion-icon">
                                    <Loader2 size={44} className="animate-spin" />
                                </div>
                                <h2>{completionStatus === 'processing' ? 'Procesando datos...' : '¡Listo!'}</h2>
                                <p>
                                    {completionStatus === 'processing'
                                        ? 'Estamos preparando tu CV con ayuda de IA.'
                                        : 'Redirigiendo al selector de plantillas...'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default CreateCV;
