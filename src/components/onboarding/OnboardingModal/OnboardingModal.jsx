import { useState } from 'react';
import { X, CheckCircle, Circle, ArrowRight, Sparkles, LayoutTemplate, Image as ImageIcon } from 'lucide-react';
import Button from '../../common/Button';
import { CV_SECTIONS, REQUIRED_SECTIONS } from '../../../utils/constants';
import './OnboardingModal.css';

/**
 * Modal de Onboarding para seleccionar secciones del CV
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback al cerrar
 * @param {Function} props.onComplete - Callback al completar con secciones seleccionadas
 */
const OnboardingModal = ({ isOpen, onClose, onComplete, onStartWithSampleTemplate, onOpenOcr }) => {
    const [step, setStep] = useState(1);
    const [selectedSections, setSelectedSections] = useState([...REQUIRED_SECTIONS]);

    if (!isOpen) return null;

    const sectionsArray = Object.values(CV_SECTIONS);

    const optionalSections = sectionsArray.filter(
        (section) => !REQUIRED_SECTIONS.includes(section.id)
    );

    const handleToggleSection = (sectionId) => {
        if (REQUIRED_SECTIONS.includes(sectionId)) return;

        setSelectedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleContinue = () => {
        if (step === 1) {
            setStep(2);
        } else {
            onComplete(selectedSections);
        }
    };

    const renderStep1 = () => (
        <div className="modal-step">
            <div className="step-header">
                <span className="step-number">Paso 1 de 2</span>
                <h2>Secciones Obligatorias</h2>
                <p>Estas secciones son esenciales para un CV profesional y no pueden desactivarse.</p>
            </div>

            <div className="sections-list required">
                {REQUIRED_SECTIONS.map((sectionId) => {
                    const section = sectionsArray.find((s) => s.id === sectionId);
                    return (
                        <div key={sectionId} className="section-item required">
                            <div className="section-check">
                                <CheckCircle size={22} className="check-icon locked" />
                            </div>
                            <div className="section-info">
                                <span className="section-icon">{section?.icon}</span>
                                <div className="section-text">
                                    <h3>{section?.name}</h3>
                                    <p>{section?.description}</p>
                                </div>
                            </div>
                            <span className="required-badge">Obligatorio</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="modal-step">
            <div className="step-header">
                <span className="step-number">Paso 2 de 2</span>
                <h2>Secciones Opcionales</h2>
                <p>Selecciona las secciones adicionales que quieres incluir en tu CV.</p>
            </div>

            <div className="sections-list optional">
                {optionalSections.map((section) => {
                    const isSelected = selectedSections.includes(section.id);
                    return (
                        <div
                            key={section.id}
                            className={`section-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleToggleSection(section.id)}
                        >
                            <div className="section-check">
                                {isSelected ? (
                                    <CheckCircle size={22} className="check-icon active" />
                                ) : (
                                    <Circle size={22} className="check-icon" />
                                )}
                            </div>
                            <div className="section-info">
                                <span className="section-icon">{section.icon}</span>
                                <div className="section-text">
                                    <h3>{section.name}</h3>
                                    <p>{section.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="onboarding-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-logo">
                        <Sparkles size={24} />
                        <span>CVMagic</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Progress */}
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 2) * 100}%` }} />
                </div>

                {/* Content */}
                <div className="modal-content">
                    {step === 1 ? renderStep1() : renderStep2()}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <Button
                        variant="ghost"
                        onClick={onOpenOcr}
                        disabled={!onOpenOcr}
                        leftIcon={<ImageIcon size={18} />}
                    >
                        Extraer info de una imagen
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onStartWithSampleTemplate}
                        disabled={!onStartWithSampleTemplate}
                        leftIcon={<LayoutTemplate size={18} />}
                    >
                        Empezar con plantilla y datos de ejemplo
                    </Button>
                    {step === 2 && (
                        <Button variant="ghost" onClick={() => setStep(1)}>
                            Atrás
                        </Button>
                    )}
                    <Button onClick={handleContinue} rightIcon={<ArrowRight size={18} />}
                    >
                        {step === 1 ? 'Continuar' : 'Empezar a crear mi CV'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
