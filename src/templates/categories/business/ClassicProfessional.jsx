import './ClassicProfessional.css';

/**
 * Plantilla Classic Professional
 * Diseño elegante y tradicional para entornos corporativos
 */
const ClassicProfessional = ({ cvData, className = '' }) => {
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
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return month ? `${months[parseInt(month) - 1]} ${year}` : year;
    };

    return (
        <div className={`cv-template classic-professional ${className}`} id="cv-content">
            {/* Header */}
            <header className="cv-header-classic">
                <div className="header-main">
                    {profileImage && (
                        <div className="profile-image-wrapper">
                            <img src={profileImage} alt={contactInfo.fullName} className="profile-image" />
                        </div>
                    )}
                    <div className="header-content">
                        <h1 className="cv-name">{contactInfo.fullName || 'Tu Nombre'}</h1>
                        {contactInfo.title && <p className="cv-title">{contactInfo.title}</p>}
                    </div>
                </div>
                <div className="contact-bar">
                    {contactInfo.email && <span>{contactInfo.email}</span>}
                    {contactInfo.phone && <span>{contactInfo.phone}</span>}
                    {contactInfo.city && <span>{contactInfo.city}{contactInfo.country ? `, ${contactInfo.country}` : ''}</span>}
                </div>
            </header>

            <div className="cv-body">
                {/* Sidebar */}
                <aside className="cv-sidebar">
                    {/* Skills */}
                    {hasSection('technicalSkills') && technicalSkills.length > 0 && (
                        <section className="sidebar-section">
                            <h2 className="sidebar-title">Competencias</h2>
                            <ul className="skills-list">
                                {technicalSkills.map((skill, idx) => (
                                    <li key={idx} className="skill-item">
                                        <span className="skill-name">{skill.name}</span>
                                        {skill.level && (
                                            <div className="skill-bar">
                                                <div className="skill-fill" style={{ width: `${(skill.level / 5) * 100}%` }} />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Languages */}
                    {hasSection('languages') && languages.length > 0 && (
                        <section className="sidebar-section">
                            <h2 className="sidebar-title">Idiomas</h2>
                            <ul className="languages-list">
                                {languages.map((lang, idx) => (
                                    <li key={idx} className="language-item">
                                        <span className="language-name">{lang.language}</span>
                                        <span className="language-level">{lang.level}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Soft Skills */}
                    {hasSection('softSkills') && softSkills.length > 0 && (
                        <section className="sidebar-section">
                            <h2 className="sidebar-title">Habilidades</h2>
                            <ul className="soft-skills-list">
                                {softSkills.map((skill, idx) => (
                                    <li key={idx}>{skill.name}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Certifications */}
                    {hasSection('certifications') && certifications.length > 0 && (
                        <section className="sidebar-section">
                            <h2 className="sidebar-title">Certificaciones</h2>
                            <ul className="cert-list">
                                {certifications.map((cert, idx) => (
                                    <li key={idx}>
                                        <strong>{cert.name}</strong>
                                        <span>{cert.institution}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Main Content */}
                <main className="cv-main">
                    {/* Professional Summary */}
                    {hasSection('professionalSummary') && professionalSummary && (
                        <section className="main-section">
                            <h2 className="main-title">Perfil</h2>
                            <p className="summary-text">{professionalSummary}</p>
                        </section>
                    )}

                    {/* Work Experience */}
                    {hasSection('workExperience') && workExperience.length > 0 && (
                        <section className="main-section">
                            <h2 className="main-title">Experiencia Profesional</h2>
                            <div className="timeline">
                                {workExperience.map((exp, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div className="timeline-marker" />
                                        <div className="timeline-content">
                                            <div className="timeline-header">
                                                <h3 className="position">{exp.position}</h3>
                                                <span className="date">{formatDate(exp.startDate)} - {exp.isCurrent ? 'Actual' : formatDate(exp.endDate)}</span>
                                            </div>
                                            <p className="company">{exp.company}</p>
                                            {exp.description && <p className="description">{exp.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {hasSection('education') && education.length > 0 && (
                        <section className="main-section">
                            <h2 className="main-title">Formación Académica</h2>
                            <div className="timeline">
                                {education.map((edu, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div className="timeline-marker" />
                                        <div className="timeline-content">
                                            <div className="timeline-header">
                                                <h3 className="degree">{edu.degree}</h3>
                                                <span className="date">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                                            </div>
                                            <p className="institution">{edu.institution}</p>
                                            {edu.field && <p className="field">{edu.field}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {hasSection('projects') && projects.length > 0 && (
                        <section className="main-section">
                            <h2 className="main-title">Proyectos Destacados</h2>
                            {projects.map((project, idx) => (
                                <div key={idx} className="project-item">
                                    <h3>{project.name}</h3>
                                    {project.description && <p>{project.description}</p>}
                                </div>
                            ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ClassicProfessional;
