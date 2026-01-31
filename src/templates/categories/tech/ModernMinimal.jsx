import './ModernMinimal.css';

/**
 * Plantilla Modern Minimal
 * Diseño minimalista para desarrolladores y profesionales tech
 */
const ModernMinimal = ({ cvData, className = '' }) => {
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
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return month ? `${months[parseInt(month) - 1]} ${year}` : year;
    };

    return (
        <div className={`cv-template modern-minimal ${className}`} id="cv-content">
            {/* Header */}
            <header className="cv-header">
                {profileImage && (
                    <div className="profile-image-wrapper">
                        <img src={profileImage} alt={contactInfo.fullName} className="profile-image" />
                    </div>
                )}
                <div className="header-info">
                    <h1 className="cv-name">{contactInfo.fullName || 'Tu Nombre'}</h1>
                    <div className="contact-row">
                        {contactInfo.email && <span className="contact-item">{contactInfo.email}</span>}
                        {contactInfo.phone && <span className="contact-item">{contactInfo.phone}</span>}
                        {contactInfo.city && (
                            <span className="contact-item">
                                {contactInfo.city}{contactInfo.country ? `, ${contactInfo.country}` : ''}
                            </span>
                        )}
                    </div>
                    {socialLinks.length > 0 && (
                        <div className="social-row">
                            {socialLinks.map((link, idx) => (
                                <a key={idx} href={link.url} className="social-link" target="_blank" rel="noopener noreferrer">
                                    {link.platform}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {hasSection('professionalSummary') && professionalSummary && (
                <section className="cv-section">
                    <h2 className="section-title">Perfil Profesional</h2>
                    <p className="summary-text">{professionalSummary}</p>
                </section>
            )}

            {/* Work Experience */}
            {hasSection('workExperience') && workExperience.length > 0 && (
                <section className="cv-section">
                    <h2 className="section-title">Experiencia Laboral</h2>
                    <div className="experience-list">
                        {workExperience.map((exp, idx) => (
                            <div key={idx} className="experience-item">
                                <div className="experience-header">
                                    <div className="experience-title">
                                        <h3 className="position">{exp.position}</h3>
                                        <span className="company">{exp.company}</span>
                                    </div>
                                    <span className="date-range">
                                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.description && <p className="experience-description">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {hasSection('education') && education.length > 0 && (
                <section className="cv-section">
                    <h2 className="section-title">Educación</h2>
                    <div className="education-list">
                        {education.map((edu, idx) => (
                            <div key={idx} className="education-item">
                                <div className="education-header">
                                    <div className="education-title">
                                        <h3 className="degree">{edu.degree}</h3>
                                        <span className="institution">{edu.institution}</span>
                                    </div>
                                    <span className="date-range">
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </span>
                                </div>
                                {edu.field && <span className="field">{edu.field}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {hasSection('technicalSkills') && technicalSkills.length > 0 && (
                <section className="cv-section">
                    <h2 className="section-title">Habilidades Técnicas</h2>
                    <div className="skills-grid">
                        {technicalSkills.map((skill, idx) => (
                            <div key={idx} className="skill-item">
                                <span className="skill-name">{skill.name}</span>
                                {skill.level && (
                                    <div className="skill-level">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <span
                                                key={level}
                                                className={`level-dot ${level <= skill.level ? 'active' : ''}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Soft Skills */}
            {hasSection('softSkills') && softSkills.length > 0 && (
                <section className="cv-section">
                    <h2 className="section-title">Habilidades Blandas</h2>
                    <div className="tags-list">
                        {softSkills.map((skill, idx) => (
                            <span key={idx} className="tag">{skill.name}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {hasSection('languages') && languages.length > 0 && (
                <section className="cv-section">
                    <h2 className="section-title">Idiomas</h2>
                    <div className="languages-list">
                        {languages.map((lang, idx) => (
                            <div key={idx} className="language-item">
                                <span className="language-name">{lang.language}</span>
                                <span className="language-level">{lang.level}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {hasSection('certifications') && certifications.length > 0 && (
                <section className="cv-section">
                    <h2 className="section-title">Certificaciones</h2>
                    <div className="certifications-list">
                        {certifications.map((cert, idx) => (
                            <div key={idx} className="certification-item">
                                <span className="cert-name">{cert.name}</span>
                                <span className="cert-institution">{cert.institution}</span>
                                {cert.date && <span className="cert-date">{formatDate(cert.date)}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {hasSection('projects') && projects.length > 0 && (
                <section className="cv-section">
                    <h2 className="section-title">Proyectos</h2>
                    <div className="projects-list">
                        {projects.map((project, idx) => (
                            <div key={idx} className="project-item">
                                <h3 className="project-name">{project.name}</h3>
                                {project.description && <p className="project-description">{project.description}</p>}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="project-tech">
                                        {project.technologies.map((tech, i) => (
                                            <span key={i} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ModernMinimal;
