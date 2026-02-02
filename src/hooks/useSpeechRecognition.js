import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Hook para manejar reconocimiento de voz con Web Speech API
 * @param {string} lang - Idioma del reconocimiento (default: 'es-ES')
 * @returns {object} - Estado y funciones del reconocimiento de voz
 */
export const useSpeechRecognition = (lang = 'es-ES') => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState(null);

    const isListeningRef = useRef(false);
    const lastInterimRef = useRef('');
    const finalTranscriptRef = useRef('');

    // Verificar soporte del navegador
    const isSupported = useMemo(() => {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }, []);

    // Crear instancia de reconocimiento
    const recognition = useMemo(() => {
        if (!isSupported) return null;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognizer = new SpeechRecognition();

        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.maxAlternatives = 1;
        recognizer.lang = lang;

        return recognizer;
    }, [isSupported, lang]);

    // Iniciar reconocimiento
    const startListening = useCallback(() => {
        if (!recognition) {
            setError('El reconocimiento de voz no está soportado en este navegador');
            return;
        }

        if (isListeningRef.current) return;

        setTranscript('');
        setInterimTranscript('');
        setError(null);
        lastInterimRef.current = '';
        finalTranscriptRef.current = '';

        const warmupAndStart = async () => {
            if (navigator?.mediaDevices?.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    stream.getTracks().forEach((t) => t.stop());
                } catch {
                    setError('Permiso de micrófono denegado.');
                    return;
                }
            }

            try {
                recognition.start();
            } catch (err) {
                const msg = String(err?.message || err);
                if (/invalidstateerror/i.test(msg) || /start\(\) failed/i.test(msg)) {
                    try {
                        recognition.stop();
                    } catch {
                        // ignore
                    }
                    setTimeout(() => {
                        try {
                            recognition.start();
                        } catch (retryErr) {
                            setError('Error al iniciar el reconocimiento de voz');
                            console.error('Speech recognition retry error:', retryErr);
                        }
                    }, 250);
                    return;
                }

                setError('Error al iniciar el reconocimiento de voz');
                console.error('Speech recognition start error:', err);
            }
        };

        void warmupAndStart();
    }, [recognition]);

    // Detener reconocimiento
    const stopListening = useCallback(() => {
        if (recognition) {
            try {
                recognition.stop();
            } catch {
                try {
                    recognition.abort();
                } catch {
                    // ignore
                }
            }
            setIsListening(false);
            isListeningRef.current = false;
        }
    }, [recognition]);

    // Resetear estado
    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        setError(null);
    }, []);

    // Configurar event listeners
    useEffect(() => {
        if (!recognition) return;

        const handleResult = (event) => {
            let finalTranscript = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (finalTranscript) {
                finalTranscriptRef.current = `${finalTranscriptRef.current}${finalTranscript}`;
                setTranscript(finalTranscriptRef.current);
            }

            if (interim) {
                lastInterimRef.current = interim;
                setInterimTranscript(interim);
            }
        };

        const handleEnd = () => {
            setIsListening(false);
            isListeningRef.current = false;

            // Si no llegó ningún resultado final, mantener lo último dictado (interim)
            if (!finalTranscriptRef.current && lastInterimRef.current) {
                finalTranscriptRef.current = lastInterimRef.current;
                setTranscript(lastInterimRef.current);
            }

            setInterimTranscript('');
        };

        const handleStart = () => {
            setIsListening(true);
            isListeningRef.current = true;
        };

        const handleError = (event) => {
            setIsListening(false);
            isListeningRef.current = false;

            const errorMessages = {
                'no-speech': 'No se detectó ninguna voz. Intenta de nuevo.',
                'audio-capture': 'No se pudo capturar audio. Verifica el micrófono.',
                'not-allowed': 'Permiso de micrófono denegado.',
                'service-not-allowed': 'Permiso de micrófono denegado.',
                'network': 'Error de red. Verifica tu conexión.',
                'aborted': 'El reconocimiento fue cancelado.',
                'language-not-supported': 'Idioma no soportado.',
            };

            setError(errorMessages[event.error] || `Error: ${event.error}`);
        };

        recognition.onresult = handleResult;
        recognition.onstart = handleStart;
        recognition.onend = handleEnd;
        recognition.onerror = handleError;

        return () => {
            recognition.onresult = null;
            recognition.onstart = null;
            recognition.onend = null;
            recognition.onerror = null;
        };
    }, [recognition]);

    return {
        isListening,
        transcript,
        interimTranscript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
};

export default useSpeechRecognition;
