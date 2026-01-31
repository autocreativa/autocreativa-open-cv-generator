import './CleanSimple.css';

/**
 * Plantilla Clean Simple
 * Diseño versátil y limpio para cualquier industria
 */
const CleanSimple = ({ cvData, className = '' }) => {
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
        <div className={`cv-template clean-simple ${className}`} id="cv-content">
            {/* Header */}
            <header className="cv-header-clean">
                <div className="header-left">
                    <h1 className="cv-name">{contactInfo.fullName || 'Tu Nombre'}</h1>
                    {contactInfo.title && <p className="cv-title">{contactInfo.title}</p>}
                </div>
                <div className="header-right">
                    {contactInfo.email && <span className="contact-item">📧 {contactInfo.email}</span>}
                    {contactInfo.phone && <span className="contact-item">📱 {contactInfo.phone}</span>}
                    {contactInfo.city && (
                        <span className="contact-item">
                            📍 {contactInfo.city}{contactInfo.country ? `, ${contactInfo.country}` : ''}
                        </span>
                    )}
                    {socialLinks.length > 0 && (
                        <span className="contact-item">
                            🔗 {socialLinks[0].url.replace('https://', '').replace('www.', '')}
                        </span>
                    )}
                </div>
            </header>

            <div className="cv-body-clean">
                {/* Profile Summary */}
                {hasSection('professionalSummary') && professionalSummary && (
                    <section className="clean-section">
                        <h2 className="section-heading">Perfil Profesional</h2>
                        <p className="profile-text">{professionalSummary}</p>
                    </section>
                )}

                {/* Experience */}
                {hasSection('workExperience') && workExperience.length > 0 && (
                    <section className="clean-section">
                        <h2 className="section-heading">Experiencia Laboral</h2>
                        {workExperience.map((exp, idx) => (
                            <div key={idx} className="entry">
                                <div className="entry-header">
                                    <div>
                                        <h3 className="entry-title">{exp.position}</h3>
                                        <p className="entry-subtitle">{exp.company}</p>
                                    </div>
                                    <span className="entry-date">
                                        {formatDate(exp.startDate)} — {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.description && <p className="entry-desc">{exp.description}</p>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Education */}
                {hasSection('education') && education.length > 0 && (
                    <section className="clean-section">
                        <h2 className="section-heading">Educación</h2>
                        {education.map((edu, idx) => (
                            <div key={idx} className="entry">
                                <div className="entry-header">
                                    <div>
                                        <h3 className="entry-title">{edu.degree}</h3>
                                        <p className="entry-subtitle">{edu.institution}</p>
                                    </div>
                                    <span className="entry-date">{formatDate(edu.endDate)}</span>
                                </div>
                                {edu.field && <p className="entry-field">{edu.field}</p>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Two Column Layout for Skills */}
                <div className="two-columns">
                    {/* Technical Skills */}
                    {hasSection('technicalSkills') && technicalSkills.length > 0 && (
                        <section className="clean-section half">
                            <h2 className="section-heading">Habilidades Técnicas</h2>
                            <div className="skills-list-clean">
                                {technicalSkills.map((skill, idx) => (
                                    <div key={idx} className="skill-row">
                                        <span className="skill-name">{skill.name}</span>
                                        {skill.level && (
                                            <span className="skill-dots">
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <span key={n} className={`dot ${n <= skill.level ? 'filled' : ''}`} />
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {hasSection('languages') && languages.length > 0 && (
                        <section className="clean-section half">
                            <h2 className="section-heading">Idiomas</h2>
                            <div className="skills-list-clean">
                                {languages.map((lang, idx) => (
                                    <div key={idx} className="skill-row">
                                        <span className="skill-name">{lang.language}</span>
                                        <span className="skill-level">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Soft Skills */}
                {hasSection('softSkills') && softSkills.length > 0 && (
                    <section className="clean-section">
                        <h2 className="section-heading">Habilidades Personales</h2>
                        <div className="tags-clean">
                            {softSkills.map((skill, idx) => (
                                <span key={idx} className="tag-item">{skill.name}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {hasSection('certifications') && certifications.length > 0 && (
                    <section className="clean-section">
                        <h2 className="section-heading">Certificaciones</h2>
                        <div className="certs-grid">
                            {certifications.map((cert, idx) => (
                                <div key={idx} className="cert-item">
                                    <span className="cert-name">{cert.name}</span>
                                    <span className="cert-meta">{cert.institution} {cert.date && `• ${formatDate(cert.date)}`}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {hasSection('projects') && projects.length > 0 && (
                    <section className="clean-section">
                        <h2 className="section-heading">Proyectos</h2>
                        {projects.map((project, idx) => (
                            <div key={idx} className="project-item-clean">
                                <h3>{project.name}</h3>
                                {project.description && <p>{project.description}</p>}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="project-techs">
                                        {project.technologies.map((tech, i) => (
                                            <span key={i}>{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
};

export default CleanSimple;
