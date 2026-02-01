import { useState, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Check, LayoutTemplate } from 'lucide-react';
import Button from '../../components/common/Button';
import { templates, getTemplatesByCategory } from '../../templates';
import { useCV } from '../../context/CVContext';
import { getSampleCVData } from '../../utils/constants';
import './SelectTemplate.css';

const CATEGORIES = [
    { id: 'all', label: 'Todas', icon: '📋' },
    { id: 'tech', label: 'Tecnología', icon: '💻' },
    { id: 'business', label: 'Negocios', icon: '💼' },
    { id: 'creative', label: 'Creativos', icon: '🎨' },
    { id: 'general', label: 'General', icon: '📄' },
];

const SelectTemplate = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const sampleFromQuery = searchParams.get('sample') === '1';
    const { selectedTemplate, setSelectedTemplate, setCvData } = useCV();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredTemplate, setHoveredTemplate] = useState(null);
    const [useSampleData, setUseSampleData] = useState(sampleFromQuery);

    // Filter templates
    const filteredTemplates = useMemo(() => {
        let result = getTemplatesByCategory(activeCategory);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.name.toLowerCase().includes(query) ||
                    t.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        return result;
    }, [activeCategory, searchQuery]);

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template.id);
    };

    const handleContinue = () => {
        if (selectedTemplate) {
            if (useSampleData) {
                const sample = getSampleCVData();
                setCvData((prev) => ({
                    ...prev,
                    ...sample,
                    selectedTemplate,
                }));
            }
            navigate('/editor');
        }
    };

    const toggleSample = () => {
        const next = !useSampleData;
        setUseSampleData(next);
        const nextParams = new URLSearchParams(searchParams);
        if (next) nextParams.set('sample', '1');
        else nextParams.delete('sample');
        setSearchParams(nextParams);
    };

    return (
        <main className="select-template-page">
            <div className="select-container container">
                {/* Header */}
                <div className="select-header">
                    <Link to="/importar" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver</span>
                    </Link>
                    <div className="header-title">
                        <LayoutTemplate size={32} className="title-icon" />
                        <div>
                            <h1>Selecciona tu plantilla</h1>
                            <p>Elige el diseño que mejor represente tu perfil profesional</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    {/* Categories */}
                    <div className="category-tabs">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span className="tab-icon">{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar plantillas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className={`sample-toggle ${useSampleData ? 'active' : ''}`}
                        onClick={toggleSample}
                    >
                        <span className="sample-toggle-title">Rellenar con datos de ejemplo</span>
                        <span className="sample-toggle-subtitle">Ideal para empezar desde cero y luego editar</span>
                    </button>
                </div>

                {/* Templates Grid */}
                <div className="templates-grid">
                    {filteredTemplates.map((template) => {
                        const isSelected = selectedTemplate === template.id;
                        const isHovered = hoveredTemplate === template.id;

                        return (
                            <div
                                key={template.id}
                                className={`template-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelectTemplate(template)}
                                onMouseEnter={() => setHoveredTemplate(template.id)}
                                onMouseLeave={() => setHoveredTemplate(null)}
                            >
                                {/* Preview */}
                                <div className="template-preview">
                                    <div className="preview-placeholder">
                                        <div className="preview-header-mock" />
                                        <div className="preview-content-mock">
                                            <div className="mock-line w-60" />
                                            <div className="mock-line w-40" />
                                            <div className="mock-line w-80" />
                                            <div className="mock-line w-50" />
                                        </div>
                                    </div>

                                    {/* Overlay */}
                                    {(isHovered || isSelected) && (
                                        <div className="preview-overlay">
                                            {isSelected ? (
                                                <div className="selected-badge">
                                                    <Check size={20} />
                                                    <span>Seleccionada</span>
                                                </div>
                                            ) : (
                                                <Button variant="secondary" size="sm">
                                                    Seleccionar
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="template-info">
                                    <h3 className="template-name">{template.name}</h3>
                                    <p className="template-desc">{template.description}</p>
                                    <div className="template-tags">
                                        {template.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="empty-state">
                        <Filter size={48} />
                        <h3>No se encontraron plantillas</h3>
                        <p>Intenta con otros filtros o términos de búsqueda</p>
                        <Button variant="outline" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
                            Limpiar filtros
                        </Button>
                    </div>
                )}

                {/* Footer Action */}
                {selectedTemplate && (
                    <div className="select-footer">
                        <div className="selected-info">
                            <Check size={16} className="check-icon" />
                            <span>Plantilla seleccionada: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong></span>
                        </div>
                        <Button size="lg" onClick={handleContinue}>
                            Continuar al Editor
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default SelectTemplate;
