import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || undefined });
const app = express();

if (process.env.TRUST_PROXY) {
    app.set('trust proxy', process.env.TRUST_PROXY);
}

app.get('/', (_req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.end('OK');
});

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

const supportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.SUPPORT_RATE_LIMIT || 5),
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' },
});

const supportSlowDown = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: Number(process.env.SUPPORT_SLOWDOWN_AFTER || 2),
    delayMs: (hits) => Math.min(500 * Math.max(0, hits - 2), 5000),
});

const downloadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: Number(process.env.DOWNLOAD_RATE_LIMIT || 20),
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' },
});

const downloadSlowDown = slowDown({
    windowMs: 60 * 60 * 1000,
    delayAfter: Number(process.env.DOWNLOAD_SLOWDOWN_AFTER || 5),
    delayMs: (hits) => Math.min(300 * Math.max(0, hits - 5), 4000),
});

const lastConfirmationByEmail = new Map();
const canSendConfirmationToEmail = (email) => {
    const cooldownMs = Number(process.env.SUPPORT_CONFIRMATION_COOLDOWN_MS || 60 * 60 * 1000);
    const now = Date.now();
    const key = String(email || '').trim().toLowerCase();
    if (!key) return false;
    const last = lastConfirmationByEmail.get(key) || 0;
    if (now - last < cooldownMs) return false;
    lastConfirmationByEmail.set(key, now);
    if (lastConfirmationByEmail.size > 5000) {
        const firstKey = lastConfirmationByEmail.keys().next().value;
        if (firstKey) lastConfirmationByEmail.delete(firstKey);
    }
    return true;
};

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

const verifyRecaptchaEnterprise = async ({ token, expectedAction }) => {
    const projectId = process.env.RECAPTCHA_PROJECT_ID;
    const siteKey = process.env.RECAPTCHA_SITE_KEY;
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);

    if (!projectId || !siteKey) {
        throw new Error('reCAPTCHA Enterprise no configurado. Revisa RECAPTCHA_PROJECT_ID y RECAPTCHA_SITE_KEY');
    }

    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectId);

    const request = {
        assessment: {
            event: {
                token,
                siteKey,
            },
        },
        parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    if (!response?.tokenProperties?.valid) {
        return { ok: false, reason: response?.tokenProperties?.invalidReason || 'invalid_token' };
    }

    const action = response?.tokenProperties?.action;
    if (expectedAction && action !== expectedAction) {
        return { ok: false, reason: 'action_mismatch', action };
    }

    const score = Number(response?.riskAnalysis?.score ?? 0);
    if (Number.isFinite(minScore) && score < minScore) {
        return { ok: false, reason: 'low_score', score };
    }

    return { ok: true, score };
};

const verifyRecaptchaV2SiteVerify = async ({ token, remoteIp }) => {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
        throw new Error('reCAPTCHA no configurado. Revisa RECAPTCHA_SECRET_KEY');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    try {
        const params = new URLSearchParams();
        params.set('secret', secret);
        params.set('response', token);
        if (remoteIp) params.set('remoteip', remoteIp);

        const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
            signal: controller.signal,
        });
        const json = await resp.json().catch(() => null);
        if (!json || json.success !== true) return { ok: false, details: json };
        return { ok: true, details: json };
    } finally {
        clearTimeout(timeout);
    }
};

const verifyRecaptcha = async ({ token, remoteIp, expectedAction }) => {
    const bypass = String(process.env.RECAPTCHA_BYPASS || '').toLowerCase() === 'true';
    if (bypass) {
        return { ok: true, bypass: true };
    }
    if (process.env.RECAPTCHA_PROJECT_ID || process.env.RECAPTCHA_SITE_KEY) {
        return verifyRecaptchaEnterprise({ token, expectedAction });
    }
    return verifyRecaptchaV2SiteVerify({ token, remoteIp });
};

const escapeHtml = (value) => {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
};

const formatMultilineTextAsHtml = (value) => {
    const safe = escapeHtml(value);
    return safe.replace(/\r\n|\r|\n/g, '<br />');
};

const formatEmailTextBlock = (value) => {
    return String(value ?? '').replace(/\r\n|\r/g, '\n').trim();
};

const buildBrand = () => {
    const primary = '#16a34a';
    const primary2 = '#22c55e';
    const background = '#f8fafc';
    const text = '#0f172a';
    const muted = '#475569';
    const border = '#e2e8f0';
    const baseUrl = process.env.PUBLIC_BASE_URL || 'https://autocreativa.com/cv-generator/';
    const logoUrl = process.env.BRAND_LOGO_URL || '';
    const productName = process.env.BRAND_NAME || 'CVMagic';
    return {
        primary,
        primary2,
        background,
        text,
        muted,
        border,
        baseUrl,
        logoUrl,
        productName,
    };
};

const renderEmailHeader = ({ brand, title, subtitle }) => {
    const logo = brand.logoUrl
        ? `<img src="${escapeHtml(brand.logoUrl)}" width="44" height="44" alt="${escapeHtml(brand.productName)}" style="display:block; border:0; outline:none; text-decoration:none; border-radius:12px;" />`
        : `
            <div style="width:44px; height:44px; border-radius:12px; background:${brand.primary}; background-image: linear-gradient(135deg, ${brand.primary2} 0%, ${brand.primary} 100%); color:#ffffff; font-family: Arial, sans-serif; font-weight:700; font-size:16px; line-height:44px; text-align:center;">CV</div>
        `;

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding: 0;">
                    <div style="height: 4px; background: linear-gradient(135deg, ${brand.primary2} 0%, ${brand.primary} 100%);"></div>
                </td>
            </tr>
            <tr>
                <td style="padding: 22px 24px 0;" align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                            <td align="center" style="padding: 0 0 10px;">${logo}</td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 0;">
                                <div style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 800; line-height: 1.2; color: ${brand.text};">${escapeHtml(brand.productName)}</div>
                                ${subtitle ? `<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5; color: ${brand.muted}; margin-top: 4px;">${escapeHtml(subtitle)}</div>` : ''}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 14px 24px 0;" align="center">
                    <div style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 800; line-height: 1.25; color: ${brand.text}; text-align:center;">${escapeHtml(title)}</div>
                </td>
            </tr>
        </table>
    `;
};

const renderEmailFooter = ({ brand }) => {
    const year = new Date().getFullYear();
    const homepage = escapeHtml(brand.baseUrl);
    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding: 20px 24px; border-top: 1px solid ${brand.border};" align="center">
                    <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: ${brand.muted}; text-align:center;">
                        <div style="width: 60px; height: 3px; border-radius: 999px; background: linear-gradient(135deg, ${brand.primary2} 0%, ${brand.primary} 100%); margin: 0 auto 10px;"></div>
                        <div style="margin-bottom: 6px;">${escapeHtml(brand.productName)} © ${year}</div>
                        <div>
                            <a href="${homepage}" style="color:${brand.primary}; text-decoration: underline;">Abrir ${escapeHtml(brand.productName)}</a>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; color: ${brand.muted};">
                            Este mensaje fue enviado automáticamente.
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    `;
};

const renderEmailLayout = ({ preheader, headerHtml, bodyHtml, footerHtml, brand }) => {
    const safePreheader = escapeHtml(preheader || '');
    return `
        <!doctype html>
        <html lang="es">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="x-apple-disable-message-reformatting" />
                <title>${escapeHtml(brand.productName)}</title>
                <style>
                    @media (max-width: 600px) {
                        .container { width: 100% !important; }
                        .px { padding-left: 16px !important; padding-right: 16px !important; }
                    }
                </style>
            </head>
            <body style="margin:0; padding:0; background:${brand.background};">
                <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${safePreheader}</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:${brand.background};">
                    <tr>
                        <td align="center" style="padding: 24px 12px;">
                            <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:600px; max-width:600px; background:#ffffff; border:1px solid ${brand.border}; border-radius:16px; overflow:hidden;">
                                <tr>
                                    <td class="px" style="padding:0;">
                                        ${headerHtml}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px" style="padding: 18px 24px 0;">
                                        ${bodyHtml}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px" style="padding: 10px 24px 0;">
                                        ${footerHtml}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
};

const renderKeyValueTable = ({ items, brand }) => {
    const rows = items
        .filter((it) => it && it.value)
        .map(
            (it) => `
                <tr>
                    <td style="padding: 10px 12px; border-top: 1px solid ${brand.border}; font-family: Arial, sans-serif; font-size: 13px; color: ${brand.muted}; width: 140px;">${escapeHtml(it.label)}</td>
                    <td style="padding: 10px 12px; border-top: 1px solid ${brand.border}; font-family: Arial, sans-serif; font-size: 13px; color: ${brand.text};">${formatMultilineTextAsHtml(it.value)}</td>
                </tr>
            `
        )
        .join('');

    if (!rows) return '';

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border: 1px solid ${brand.border}; border-radius: 12px; overflow:hidden;">
            ${rows}
        </table>
    `;
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

const normalizeBasePath = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
    return withLeadingSlash.replace(/\/+$/, '');
};

const apiBasePath = normalizeBasePath(process.env.API_BASE_PATH);
const apiRouter = express.Router();

apiRouter.get('/health', (_req, res) => {
    res.json({ ok: true });
});

// ApiFreeLLM proxy endpoint (evita CORS en frontend)
apiRouter.post('/ai-chat', async (req, res) => {
    const { prompt, options } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ ok: false, error: 'Prompt requerido para IA' });
    }

    const apiKey = process.env.APIFREELLM_API_KEY;
    const baseUrl = process.env.APIFREELLM_API_URL || 'https://apifreellm.com/api/v1/chat';

    if (!apiKey) {
        console.error('APIFREELLM_API_KEY no configurada');
        return res.status(500).json({ ok: false, error: 'Servicio de IA no configurado en el servidor' });
    }

    const controller = new AbortController();
    const timeoutMs = Number(process.env.APIFREELLM_TIMEOUT_MS || 30000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const upstream = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ message: prompt }),
            signal: controller.signal,
        });

        let errorBody = '';
        if (!upstream.ok) {
            try {
                errorBody = await upstream.text();
            } catch {
                // ignore
            }

            if (upstream.status === 400) {
                return res.status(400).json({ ok: false, error: 'Petición inválida a ApiFreeLLM (400).' });
            }
            if (upstream.status === 401) {
                return res.status(401).json({ ok: false, error: 'API key de ApiFreeLLM inválida (401).' });
            }
            if (upstream.status === 429) {
                // Sugerimos al cliente reintentar luego de 5s
                return res.status(429).json({
                    ok: false,
                    error: 'Límite de peticiones alcanzado en ApiFreeLLM (429). Espera unos segundos y vuelve a intentar.',
                });
            }

            console.error('ApiFreeLLM upstream error:', upstream.status, errorBody);
            return res.status(502).json({
                ok: false,
                error: `Error de ApiFreeLLM (${upstream.status}).`,
            });
        }

        const data = await upstream.json().catch(() => null);
        if (!data || !data.success) {
            console.error('ApiFreeLLM respuesta inválida:', data);
            return res.status(502).json({ ok: false, error: 'Respuesta inválida de ApiFreeLLM.' });
        }

        const text = String(data.response || '').trim();
        return res.json({ ok: true, text });
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
            console.error('ApiFreeLLM timeout:', err);
            return res.status(504).json({ ok: false, error: 'Timeout al llamar a ApiFreeLLM.' });
        }
        console.error('Error llamando a ApiFreeLLM:', err);
        return res.status(500).json({ ok: false, error: 'No se pudo contactar al proveedor de IA.' });
    } finally {
        clearTimeout(timeout);
    }
});

apiRouter.post('/support', supportLimiter, supportSlowDown, async (req, res) => {
    const {
        name,
        email,
        subject,
        message,
        type,
        recaptchaToken,
        pageUrl,
        userAgent,
    } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, error: 'Faltan campos requeridos' });
    }

    const safeName = String(name).trim().slice(0, 80);
    const safeEmail = String(email).trim().toLowerCase().slice(0, 254);
    const rawMessage = String(message);
    const safeMessage = rawMessage.slice(0, Number(process.env.SUPPORT_MESSAGE_MAX_LEN || 3000));

    const bypass = String(process.env.RECAPTCHA_BYPASS || '').toLowerCase() === 'true';
    if (!recaptchaToken && !bypass) {
        return res.status(400).json({ ok: false, error: 'reCAPTCHA requerido' });
    }

    try {
        const verification = await verifyRecaptcha({ token: recaptchaToken, remoteIp: req.ip, expectedAction: 'support' });
        if (!verification.ok) {
            return res.status(400).json({ ok: false, error: 'Falló la verificación de reCAPTCHA' });
        }
    } catch (err) {
        console.error('reCAPTCHA verification error:', err);
        return res.status(500).json({ ok: false, error: 'No se pudo validar reCAPTCHA' });
    }

    const transporter = createTransporter();

    const safeSubject = String(subject || 'Sugerencia / Problema').slice(0, 140);
    const safeType = String(type || 'sugerencia');

    const brand = buildBrand();
    const submittedAt = new Date();

    const internalDetailsHtml = renderKeyValueTable({
        brand,
        items: [
            { label: 'Tipo', value: safeType },
            { label: 'Nombre', value: safeName },
            { label: 'Email', value: safeEmail },
            { label: 'Asunto', value: safeSubject },
            { label: 'URL', value: pageUrl ? String(pageUrl) : '' },
            { label: 'User-Agent', value: userAgent ? String(userAgent) : '' },
            { label: 'Fecha', value: submittedAt.toLocaleString('es-ES') },
            { label: 'Mensaje', value: safeMessage },
        ],
    });

    const internalHeaderHtml = renderEmailHeader({
        brand,
        title: 'Nuevo mensaje de soporte',
        subtitle: 'Enviado desde el formulario de CVMagic',
    });

    const internalBodyHtml = `
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${brand.text}; margin: 0 0 14px;">
            Recibiste un nuevo mensaje.
        </div>
        ${internalDetailsHtml}
    `;

    const internalHtml = renderEmailLayout({
        brand,
        preheader: `Nuevo mensaje de ${String(name || '').trim() || 'usuario'} (${safeType})`,
        headerHtml: internalHeaderHtml,
        bodyHtml: internalBodyHtml,
        footerHtml: renderEmailFooter({ brand }),
    });

    const internalText = [
        'Nuevo mensaje de soporte',
        '',
        `Tipo: ${safeType}`,
        `Nombre: ${safeName}`,
        `Email: ${safeEmail}`,
        `Asunto: ${safeSubject}`,
        pageUrl ? `URL: ${String(pageUrl)}` : '',
        userAgent ? `User-Agent: ${String(userAgent)}` : '',
        `Fecha: ${submittedAt.toLocaleString('es-ES')}`,
        '',
        'Mensaje:',
        formatEmailTextBlock(safeMessage),
    ]
        .filter(Boolean)
        .join('\n');

    const userDetailsHtml = renderKeyValueTable({
        brand,
        items: [
            { label: 'Tipo', value: safeType },
            { label: 'Asunto', value: safeSubject },
            { label: 'Mensaje', value: safeMessage },
        ],
    });

    const userHeaderHtml = renderEmailHeader({
        brand,
        title: '¡Gracias por tu mensaje!',
        subtitle: 'Recibimos tu reporte o sugerencia',
    });

    const userBodyHtml = `
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${brand.text}; margin: 0 0 12px;">
            Hola ${escapeHtml(safeName)},
        </div>
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${brand.text}; margin: 0 0 12px;">
            Hemos recibido tu mensaje sobre ${escapeHtml(brand.productName)}. Nuestro equipo lo revisará y te contactará si necesitamos más información.
        </div>
        <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: ${brand.muted}; margin: 0 0 10px;">
            Copia de la información enviada:
        </div>
        ${userDetailsHtml}
        <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; color: ${brand.muted}; margin: 14px 0 0;">
            Si no enviaste este mensaje, puedes ignorar este correo.
        </div>
    `;

    const userHtml = renderEmailLayout({
        brand,
        preheader: 'Recibimos tu mensaje y te enviamos una copia para tus registros.',
        headerHtml: userHeaderHtml,
        bodyHtml: userBodyHtml,
        footerHtml: renderEmailFooter({ brand }),
    });

    const userText = [
        '¡Gracias por tu mensaje!',
        '',
        `Hola ${safeName},`,
        '',
        `Hemos recibido tu mensaje sobre ${brand.productName}. Nuestro equipo lo revisará y te contactará si necesitamos más información.`,
        '',
        'Copia de la información enviada:',
        `Tipo: ${safeType}`,
        `Asunto: ${safeSubject}`,
        '',
        'Mensaje:',
        formatEmailTextBlock(safeMessage),
        '',
        'Si no enviaste este mensaje, puedes ignorar este correo.',
    ]
        .filter(Boolean)
        .join('\n');

    try {
        await transporter.sendMail({
            from: mailFrom,
            to: supportInbox,
            replyTo: safeEmail,
            subject: `[CVMagic] ${safeSubject}`,
            html: internalHtml,
            text: internalText,
        });

        const sendConfirmation = String(process.env.SEND_SUPPORT_CONFIRMATION || 'true').toLowerCase() === 'true';
        if (sendConfirmation && canSendConfirmationToEmail(safeEmail)) {
            await transporter.sendMail({
                from: mailFrom,
                to: safeEmail,
                subject: 'Recibimos tu mensaje - CVMagic',
                html: userHtml,
                text: userText,
            });
        }

        return res.json({ ok: true });
    } catch (err) {
        console.error('Error sending support email:', err);
        return res.status(500).json({ ok: false, error: 'No se pudo enviar el correo' });
    }
});

apiRouter.post('/track-download', downloadLimiter, downloadSlowDown, async (req, res) => {
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

    const brand = buildBrand();
    const occurredAt = new Date();

    const detailsHtml = renderKeyValueTable({
        brand,
        items: [
            { label: 'Evento', value: safeEventType },
            { label: 'Archivo', value: safeFileName },
            { label: 'Fecha', value: occurredAt.toLocaleString('es-ES') },
            { label: 'Nombre', value: String(fullName) },
            { label: 'Email', value: String(email) },
            { label: 'Teléfono', value: String(phone) },
            { label: 'Ubicación', value: `${String(city)}${country ? `, ${String(country)}` : ''}`.trim() },
        ],
    });

    const headerHtml = renderEmailHeader({
        brand,
        title: 'Descarga registrada',
        subtitle: 'Notificación automática',
    });

    const html = renderEmailLayout({
        brand,
        preheader: `Se registró una descarga (${safeEventType}).`,
        headerHtml,
        bodyHtml: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${brand.text}; margin: 0 0 14px;">
                Se registró una descarga en ${escapeHtml(brand.productName)}.
            </div>
            ${detailsHtml}
        `,
        footerHtml: renderEmailFooter({ brand }),
    });

    const text = [
        'Descarga registrada',
        '',
        `Evento: ${safeEventType}`,
        `Archivo: ${safeFileName}`,
        `Fecha: ${occurredAt.toLocaleString('es-ES')}`,
        '',
        'Datos del usuario',
        fullName ? `Nombre: ${String(fullName)}` : '',
        email ? `Email: ${String(email)}` : '',
        phone ? `Teléfono: ${String(phone)}` : '',
        city || country ? `Ubicación: ${String(city)}${country ? `, ${String(country)}` : ''}` : '',
    ]
        .filter(Boolean)
        .join('\n');

    try {
        const base64 = String(fileBase64).replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(base64, 'base64');

        await transporter.sendMail({
            from: mailFrom,
            to: downloadAlertRecipients,
            subject: `[CVMagic] Descarga PDF: ${safeEventType}`,
            html,
            text,
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

app.use('/api', apiRouter);
if (apiBasePath) {
    app.use(`${apiBasePath}/api`, apiRouter);
}

const port = Number(process.env.PORT || 5174);
app.listen(port, () => {
    console.log(`Mail server running on http://localhost:${port}`);
});
