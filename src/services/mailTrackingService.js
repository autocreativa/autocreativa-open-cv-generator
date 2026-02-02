export const trackDownload = async ({ eventType, fileName, blob, user }) => {
    if (!blob) return;

    const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('No se pudo leer el PDF'));
        reader.readAsDataURL(blob);
    });

    try {
        await fetch('/api/track-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventType,
                fileName,
                fileBase64: base64,
                user,
            }),
        });
    } catch {
        // ignore
    }
};

export default {
    trackDownload,
};
