import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import './CareClean.css';

const CareClean = ({ cvData }) => {
    const { contactInfo, professionalSummary, workExperience, education, technicalSkills, projects } = cvData;

    return (
        <div id="cv-content" className="care-clean-template">
            <div className="care-sidebar">
                <div className="care-profile-section">
                    <h1 className="care-name">{contactInfo?.fullName || 'Nombre Completp'}</h1>
                    <h2 className="care-title">{workExperience?.[0]?.position || 'Profesional de Salud'}</h2>
                </div>

                <div className="care-contact-info">
                    <h3 className="sidebar-title">Contacto</h3>
                    {contactInfo?.phone && (
                        <div className="care-contact-item">
                            <Phone size={14} /> <span>{contactInfo.phone}</span>
                        </div>
                    )}
                    {contactInfo?.email && (
                        <div className="care-contact-item">
                            <Mail size={14} /> <span>{contactInfo.email}</span>
                        </div>
                    )}
                    {contactInfo?.city && (
                        <div className="care-contact-item">
                            <MapPin size={14} /> <span>{contactInfo.city}</span>
                        </div>
                    )}
                </div>

                {technicalSkills && technicalSkills.length > 0 && (
                    <div className="care-skills">
                        <h3 className="sidebar-title">Especialidades</h3>
                        <ul>
                            {technicalSkills.map((skill, index) => (
                                <li key={index}>{skill.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="care-main">
                {professionalSummary && (
                    <section className="care-section">
                        <h3 className="care-section-title">
                            <Heart size={18} className="care-icon" />
                            Perfil Profesional
                        </h3>
                        <p className="care-text">{professionalSummary}</p>
                    </section>
                )}

                {workExperience && workExperience.length > 0 && (
                    <section className="care-section">
                        <h3 className="care-section-title">Experiencia Laboral</h3>
                        <div className="care-timeline">
                            {workExperience.map((exp, index) => (
                                <div key={index} className="care-item">
                                    <div className="care-item-header">
                                        <h4>{exp.position}</h4>
                                        <span className="care-date">{exp.startDate} - {exp.isCurrent ? 'Presente' : exp.endDate}</span>
                                    </div>
                                    <div className="care-company">{exp.company}</div>
                                    <p className="care-text">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education && education.length > 0 && (
                    <section className="care-section">
                        <h3 className="care-section-title">Formación Académica</h3>
                        {education.map((edu, index) => (
                            <div key={index} className="care-item">
                                <div className="care-item-header">
                                    <h4>{edu.degree}</h4>
                                    <span className="care-date">{edu.endDate}</span>
                                </div>
                                <div className="care-company">{edu.institution}</div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
};

export default CareClean;
