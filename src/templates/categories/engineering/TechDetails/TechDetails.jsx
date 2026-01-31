import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import './TechDetails.css';

const TechDetails = ({ cvData }) => {
    const { contactInfo, professionalSummary, workExperience, education, technicalSkills, projects } = cvData;

    return (
        <div id="cv-content" className="tech-details-template">
            <header className="tech-header">
                <h1 className="tech-name">{contactInfo?.fullName || 'Nombre Completp'}</h1>
                <div className="tech-contact-bar">
                    {contactInfo?.email && (
                        <div className="contact-item">
                            <Mail size={14} />
                            <span>{contactInfo.email}</span>
                        </div>
                    )}
                    {contactInfo?.phone && (
                        <div className="contact-item">
                            <Phone size={14} />
                            <span>{contactInfo.phone}</span>
                        </div>
                    )}
                    {contactInfo?.city && (
                        <div className="contact-item">
                            <MapPin size={14} />
                            <span>{contactInfo.city}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="tech-main">
                {professionalSummary && (
                    <section className="tech-section">
                        <h2 className="section-title">SUMMARY</h2>
                        <p className="summary-text">{professionalSummary}</p>
                    </section>
                )}

                {technicalSkills && technicalSkills.length > 0 && (
                    <section className="tech-section">
                        <h2 className="section-title">TECHNICAL SKILLS</h2>
                        <div className="skills-grid">
                            {technicalSkills.map((skill, index) => (
                                <span key={index} className="tech-tag">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {workExperience && workExperience.length > 0 && (
                    <section className="tech-section">
                        <h2 className="section-title">EXPERIENCE</h2>
                        <div className="experience-list">
                            {workExperience.map((exp, index) => (
                                <div key={index} className="experience-item">
                                    <div className="exp-header">
                                        <h3 className="exp-role">{exp.position}</h3>
                                        <span className="exp-date">
                                            {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="exp-company">{exp.company}</div>
                                    <p className="exp-desc">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects && projects.length > 0 && (
                    <section className="tech-section">
                        <h2 className="section-title">PROJECTS</h2>
                        <div className="projects-list">
                            {projects.map((proj, index) => (
                                <div key={index} className="project-item">
                                    <h3 className="project-name">{proj.name}</h3>
                                    <p className="project-desc">{proj.description}</p>
                                    <div className="project-tech">
                                        {proj.technologies?.map((tech, i) => (
                                            <span key={i} className="tech-mini-tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education && education.length > 0 && (
                    <section className="tech-section">
                        <h2 className="section-title">EDUCATION</h2>
                        <div className="education-list">
                            {education.map((edu, index) => (
                                <div key={index} className="education-item">
                                    <div className="edu-header">
                                        <h3 className="edu-degree">{edu.degree}</h3>
                                        <span className="edu-date">{edu.endDate}</span>
                                    </div>
                                    <div className="edu-school">{edu.institution}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default TechDetails;
