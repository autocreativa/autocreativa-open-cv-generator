import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

app.use(express.json({ limit: '25mb' }));

const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
        throw new Error('SMTP no configurado. Revisa SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS');
    }

    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    });
};

const parseRecipients = (value) => {
    return String(value || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
const supportInbox = process.env.SUPPORT_INBOX || mailFrom;
const downloadAlertRecipients = parseRecipients(process.env.DOWNLOAD_ALERT_RECIPIENTS);

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

app.post('/api/support', async (req, res) => {
    const {
        name,
        email,
        subject,
        message,
        type,
        pageUrl,
        userAgent,
    } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, error: 'Faltan campos requeridos' });
    }

    const transporter = createTransporter();

    const safeSubject = String(subject || 'Sugerencia / Problema').slice(0, 140);
    const safeType = String(type || 'sugerencia');

    const internalHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
            <h2 style="margin: 0 0 12px;">Nuevo reporte desde CVMagic</h2>
            <p style="margin: 0 0 6px;"><strong>Tipo:</strong> ${safeType}</p>
            <p style="margin: 0 0 6px;"><strong>Nombre:</strong> ${String(name)}</p>
            <p style="margin: 0 0 6px;"><strong>Email:</strong> ${String(email)}</p>
            <p style="margin: 0 0 6px;"><strong>Asunto:</strong> ${safeSubject}</p>
            ${pageUrl ? `<p style="margin: 0 0 6px;"><strong>URL:</strong> ${String(pageUrl)}</p>` : ''}
            ${userAgent ? `<p style="margin: 0 0 6px;"><strong>User-Agent:</strong> ${String(userAgent)}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
            <pre style="white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f8fafc; padding: 12px; border-radius: 8px;">${String(message)}</pre>
        </div>
    `;

    const userHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
            <h2 style="margin: 0 0 12px;">¡Gracias por tu mensaje!</h2>
            <p style="margin: 0 0 10px;">Hola ${String(name)},</p>
            <p style="margin: 0 0 10px;">Hemos recibido tu reporte/sugerencia sobre CVMagic.</p>
            <p style="margin: 0 0 10px;">Nuestro equipo revisará tu mensaje y te contactará si necesitamos más información. Gracias por ayudarnos a mejorar la plataforma.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
            <p style="margin: 0; font-size: 12px; color: #64748b;">Este correo es un acuse automático. Si no enviaste este mensaje, puedes ignorarlo.</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: mailFrom,
            to: supportInbox,
            replyTo: email,
            subject: `[CVMagic] ${safeSubject}`,
            html: internalHtml,
        });

        await transporter.sendMail({
            from: mailFrom,
            to: email,
            subject: 'Recibimos tu mensaje - CVMagic',
            html: userHtml,
        });

        return res.json({ ok: true });
    } catch (err) {
        console.error('Error sending support email:', err);
        return res.status(500).json({ ok: false, error: 'No se pudo enviar el correo' });
    }
});

app.post('/api/track-download', async (req, res) => {
    const { eventType, fileName, fileBase64, user } = req.body || {};

    if (!eventType || !fileName || !fileBase64) {
        return res.status(400).json({ ok: false, error: 'Faltan campos requeridos' });
    }

    if (!Array.isArray(downloadAlertRecipients) || downloadAlertRecipients.length === 0) {
        return res.status(400).json({ ok: false, error: 'DOWNLOAD_ALERT_RECIPIENTS no configurado' });
    }

    const transporter = createTransporter();

    const safeEventType = String(eventType).slice(0, 50);
    const safeFileName = String(fileName).slice(0, 200);

    const fullName = user?.fullName || '';
    const email = user?.email || '';
    const phone = user?.phone || '';
    const city = user?.city || '';
    const country = user?.country || '';

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
            <h2 style="margin: 0 0 12px;">Descarga registrada - CVMagic</h2>
            <p style="margin: 0 0 6px;"><strong>Evento:</strong> ${safeEventType}</p>
            <p style="margin: 0 0 6px;"><strong>Archivo:</strong> ${safeFileName}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
            <h3 style="margin: 0 0 8px;">Datos del usuario</h3>
            <p style="margin: 0 0 6px;"><strong>Nombre:</strong> ${String(fullName)}</p>
            <p style="margin: 0 0 6px;"><strong>Email:</strong> ${String(email)}</p>
            <p style="margin: 0 0 6px;"><strong>Teléfono:</strong> ${String(phone)}</p>
            <p style="margin: 0 0 6px;"><strong>Ubicación:</strong> ${String(city)}${country ? `, ${String(country)}` : ''}</p>
        </div>
    `;

    try {
        const base64 = String(fileBase64).replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(base64, 'base64');

        await transporter.sendMail({
            from: mailFrom,
            to: downloadAlertRecipients,
            subject: `[CVMagic] Descarga PDF: ${safeEventType}`,
            html,
            attachments: [
                {
                    filename: safeFileName,
                    content: buffer,
                    contentType: 'application/pdf',
                },
            ],
        });

        return res.json({ ok: true });
    } catch (err) {
        console.error('Error sending download tracking email:', err);
        return res.status(500).json({ ok: false, error: 'No se pudo enviar el correo' });
    }
});

const port = Number(process.env.PORT || 5174);
app.listen(port, () => {
    console.log(`Mail server running on http://localhost:${port}`);
});
