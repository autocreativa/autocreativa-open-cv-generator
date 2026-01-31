import { useState, useCallback, useEffect, useMemo } from 'react';

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

    // Verificar soporte del navegador
    const isSupported = useMemo(() => {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }, []);

    // Crear instancia de reconocimiento
    const recognition = useMemo(() => {
        if (!isSupported) return null;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognizer = new SpeechRecognition();

        recognizer.continuous = false;
        recognizer.interimResults = true;
        recognizer.lang = lang;

        return recognizer;
    }, [isSupported, lang]);

    // Iniciar reconocimiento
    const startListening = useCallback(() => {
        if (!recognition) {
            setError('El reconocimiento de voz no está soportado en este navegador');
            return;
        }

        setTranscript('');
        setInterimTranscript('');
        setError(null);

        try {
            recognition.start();
            setIsListening(true);
        } catch (err) {
            setError('Error al iniciar el reconocimiento de voz');
            console.error('Speech recognition start error:', err);
        }
    }, [recognition]);

    // Detener reconocimiento
    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
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
                setTranscript((prev) => prev + finalTranscript);
            }
            setInterimTranscript(interim);
        };

        const handleEnd = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        const handleError = (event) => {
            setIsListening(false);

            const errorMessages = {
                'no-speech': 'No se detectó ninguna voz. Intenta de nuevo.',
                'audio-capture': 'No se pudo capturar audio. Verifica el micrófono.',
                'not-allowed': 'Permiso de micrófono denegado.',
                'network': 'Error de red. Verifica tu conexión.',
                'aborted': 'El reconocimiento fue cancelado.',
                'language-not-supported': 'Idioma no soportado.',
            };

            setError(errorMessages[event.error] || `Error: ${event.error}`);
        };

        recognition.onresult = handleResult;
        recognition.onend = handleEnd;
        recognition.onerror = handleError;

        return () => {
            recognition.onresult = null;
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
