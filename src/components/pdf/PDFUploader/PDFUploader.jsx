import { useState, useRef, useCallback } from 'react';
import { FileUp, File, X, AlertCircle } from 'lucide-react';
import Button from '../../common/Button';
import './PDFUploader.css';

/**
 * Componente para subir archivos PDF
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback cuando se selecciona un archivo
 * @param {boolean} props.disabled - Si está deshabilitado
 * @param {string} props.error - Mensaje de error
 */
const PDFUploader = ({ onFileSelect, disabled = false, error = null }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            onFileSelect?.(file);
        }
    }, [disabled, onFileSelect]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect?.(file);
        }
    }, [onFileSelect]);

    const handleClick = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="pdf-uploader">
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="upload-input"
                    disabled={disabled}
                />

                {selectedFile ? (
                    <div className="selected-file">
                        <div className="file-info">
                            <File size={40} className="file-icon" />
                            <div className="file-details">
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                            </div>
                        </div>
                        <button
                            className="remove-file-btn"
                            onClick={handleRemoveFile}
                            aria-label="Eliminar archivo"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="upload-content">
                        <div className="upload-icon-wrapper">
                            <FileUp size={48} />
                        </div>
                        <p className="upload-title">
                            Arrastra tu PDF aquí
                        </p>
                        <p className="upload-subtitle">
                            o haz clic para seleccionar
                        </p>
                        <span className="upload-hint">
                            Formatos: PDF (máx. 5MB)
                        </span>
                    </div>
                )}
            </div>

            {error && (
                <div className="upload-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default PDFUploader;
