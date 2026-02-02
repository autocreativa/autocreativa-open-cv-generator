import { useEffect, useState, useRef, useCallback } from 'react';
import { Image as ImageIcon, Camera, X, AlertCircle } from 'lucide-react';
import Button from '../../common/Button';
import './ImageUploader.css';

const ImageUploader = ({ onFileSelect, disabled = false, error = null }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const inputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
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
        if (file && /^image\//i.test(file.type)) {
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
        if (!disabled) inputRef.current?.click();
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const stopCamera = useCallback(() => {
        try {
            const stream = streamRef.current;
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
        } catch {
            // ignore
        }
        streamRef.current = null;
    }, []);

    const openCamera = useCallback(async () => {
        if (disabled) return;
        setCameraError('');

        if (!navigator?.mediaDevices?.getUserMedia) {
            setCameraError('Tu navegador no soporta cámara. Usa la opción de subir una imagen.');
            return;
        }

        setIsCameraOpen(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        } catch (err) {
            setCameraError('No se pudo acceder a la cámara. Revisa permisos del navegador.');
            stopCamera();
        }
    }, [disabled, stopCamera]);

    const closeCamera = useCallback(() => {
        stopCamera();
        setIsCameraOpen(false);
    }, [stopCamera]);

    const capturePhoto = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, width, height);

        const blob = await new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9);
        });

        if (!blob) return;
        const file = new File([blob], `captura-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        onFileSelect?.(file);
        closeCamera();
    }, [closeCamera, onFileSelect]);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <div className="image-uploader">
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
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="upload-input"
                    disabled={disabled}
                />

                {selectedFile ? (
                    <div className="selected-file">
                        <div className="file-info">
                            <ImageIcon size={40} className="file-icon" />
                            <div className="file-details">
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                            </div>
                        </div>
                        <button className="remove-file-btn" onClick={handleRemoveFile} aria-label="Eliminar archivo">
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="upload-content">
                        <div className="upload-icon-wrapper">
                            <Camera size={48} />
                        </div>
                        <p className="upload-title">Sube una foto de tu CV</p>
                        <p className="upload-subtitle">o toma una foto desde tu celular</p>
                        <span className="upload-hint">Formatos: JPG, PNG, WebP</span>

                        <div className="camera-actions">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openCamera();
                                }}
                                disabled={disabled}
                            >
                                Abrir cámara
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="upload-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {isCameraOpen && (
                <div className="camera-overlay" role="dialog" aria-modal="true">
                    <div className="camera-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="camera-header">
                            <div className="camera-title">
                                <Camera size={18} />
                                <span>Tomar foto</span>
                            </div>
                            <button className="camera-close" type="button" onClick={closeCamera} aria-label="Cerrar">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="camera-body">
                            {cameraError ? (
                                <div className="camera-error">
                                    <AlertCircle size={16} />
                                    <span>{cameraError}</span>
                                </div>
                            ) : (
                                <video ref={videoRef} className="camera-video" playsInline />
                            )}
                        </div>

                        <div className="camera-footer">
                            <Button type="button" variant="outline" onClick={closeCamera}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={capturePhoto} disabled={!!cameraError}>
                                Capturar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
