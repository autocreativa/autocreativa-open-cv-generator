import './CreativeDesigner.css';

/**
 * Plantilla Creative Designer
 * Diseño colorido y expresivo para diseñadores creativos
 */
const CreativeDesigner = ({ cvData, className = '' }) => {
    const {
        contactInfo = {},
        professionalSummary = '',
        workExperience = [],
        education = [],
        technicalSkills = [],
        softSkills = [],
        languages = [],
        certifications = [],
        projects = [],
        socialLinks = [],
        profileImage,
        selectedSections = [],
    } = cvData || {};

    const hasSection = (sectionId) => selectedSections.includes(sectionId);

    const formatDate = (date) => {
        if (!date) return '';
        const [year, month] = date.split('-');
        return month ? `${month}/${year}` : year;
    };

    return (
        <div className={`cv-template creative-designer ${className}`} id="cv-content">
            {/* Header with gradient */}
            <header className="cv-header-creative">
                <div className="header-blob blob-1" />
                <div className="header-blob blob-2" />
                <div className="header-blob blob-3" />

                <div className="header-content">
                    {profileImage && (
                        <div className="profile-frame">
                            <img src={profileImage} alt={contactInfo.fullName} className="profile-image" />
                        </div>
                    )}
                    <h1 className="cv-name">{contactInfo.fullName || 'Tu Nombre'}</h1>
                    {contactInfo.title && <p className="cv-tagline">{contactInfo.title}</p>}

                    <div className="contact-icons">
                        {contactInfo.email && (
                            <a href={`mailto:${contactInfo.email}`} className="contact-icon">✉️</a>
                        )}
                        {contactInfo.phone && (
                            <a href={`tel:${contactInfo.phone}`} className="contact-icon">📱</a>
                        )}
                        {socialLinks.map((link, idx) => (
                            <a key={idx} href={link.url} className="contact-icon" target="_blank" rel="noopener noreferrer">
                                {link.platform === 'LinkedIn' ? '💼' : link.platform === 'GitHub' ? '💻' : '🔗'}
                            </a>
                        ))}
                    </div>
                </div>
            </header>

            <div className="cv-content-creative">
                {/* About Section */}
                {hasSection('professionalSummary') && professionalSummary && (
                    <section className="creative-section about-section">
                        <div className="section-icon">✨</div>
                        <h2>Sobre Mí</h2>
                        <p className="about-text">{professionalSummary}</p>
                    </section>
                )}

                {/* Skills as Tags Cloud */}
                {hasSection('technicalSkills') && technicalSkills.length > 0 && (
                    <section className="creative-section skills-section">
                        <div className="section-icon">🎨</div>
                        <h2>Herramientas & Skills</h2>
                        <div className="skills-cloud">
                            {technicalSkills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className={`skill-bubble size-${skill.level || 3}`}
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience Cards */}
                {hasSection('workExperience') && workExperience.length > 0 && (
                    <section className="creative-section experience-section">
                        <div className="section-icon">💼</div>
                        <h2>Experiencia</h2>
                        <div className="experience-cards">
                            {workExperience.map((exp, idx) => (
                                <div key={idx} className="exp-card" style={{ '--card-index': idx }}>
                                    <div className="card-header">
                                        <span className="card-year">{formatDate(exp.startDate)}</span>
                                        <span className="card-arrow">→</span>
                                        <span className="card-year">{exp.isCurrent ? 'Ahora' : formatDate(exp.endDate)}</span>
                                    </div>
                                    <h3 className="card-title">{exp.position}</h3>
                                    <p className="card-company">{exp.company}</p>
                                    {exp.description && <p className="card-desc">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {hasSection('education') && education.length > 0 && (
                    <section className="creative-section education-section">
                        <div className="section-icon">🎓</div>
                        <h2>Educación</h2>
                        <div className="education-list">
                            {education.map((edu, idx) => (
                                <div key={idx} className="edu-item">
                                    <div className="edu-badge">{formatDate(edu.endDate)}</div>
                                    <div className="edu-content">
                                        <h3>{edu.degree}</h3>
                                        <p>{edu.institution}</p>
                                        {edu.field && <span className="edu-field">{edu.field}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects as Gallery */}
                {hasSection('projects') && projects.length > 0 && (
                    <section className="creative-section projects-section">
                        <div className="section-icon">🚀</div>
                        <h2>Proyectos</h2>
                        <div className="projects-gallery">
                            {projects.map((project, idx) => (
                                <div key={idx} className="project-card" style={{ '--project-index': idx }}>
                                    <h3>{project.name}</h3>
                                    {project.description && <p>{project.description}</p>}
                                    {project.technologies && (
                                        <div className="project-tags">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="project-tag">{tech}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages & Soft Skills Footer */}
                <footer className="creative-footer">
                    {hasSection('languages') && languages.length > 0 && (
                        <div className="footer-section">
                            <h3>🌍 Idiomas</h3>
                            <div className="footer-items">
                                {languages.map((lang, idx) => (
                                    <span key={idx} className="footer-item">{lang.language} · {lang.level}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasSection('softSkills') && softSkills.length > 0 && (
                        <div className="footer-section">
                            <h3>💡 Soft Skills</h3>
                            <div className="footer-items">
                                {softSkills.map((skill, idx) => (
                                    <span key={idx} className="footer-item">{skill.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default CreativeDesigner;
