// Cloudflare Pages Function — contact form handler
// POST /api/contact  body: { name, email, subject?, message, _hp? }
//
// Emails the form submission to joshrutledge@ourmysticjourneys.com
// via Zoho Mail. Uses the same Zoho credentials as ourmysticjourneys.
// Requires Pages secrets:
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID

import { getZohoAccessToken, sendZohoMail, type ZohoEnv } from '../_shared/zoho';

interface Env extends ZohoEnv {}

const TO_ADDRESS = 'joshrutledge@ourmysticjourneys.com';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Parse JSON body
  let name: string;
  let email: string;
  let subject: string;
  let message: string;
  let hp: string;

  try {
    const body = await request.json();
    name = String(body?.name ?? '').trim().slice(0, 100);
    email = String(body?.email ?? '').trim().toLowerCase().slice(0, 200);
    subject = String(body?.subject ?? '').trim().slice(0, 200);
    message = String(body?.message ?? '').trim().slice(0, 10000);
    hp = String(body?._hp ?? '').trim(); // honeypot — should be empty
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  // Honeypot — silently succeed for bots
  if (hp) {
    return json({ success: true, message: 'Thanks!' }, 200);
  }

  // Validate
  if (!name || name.length < 1) {
    return json({ error: 'Please provide your name.' }, 400);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please provide a valid email address.' }, 400);
  }
  if (!message || message.length < 5) {
    return json({ error: 'Please provide a message.' }, 400);
  }

  // Check Zoho secrets
  const required = ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN', 'ZOHO_ACCOUNT_ID'];
  for (const key of required) {
    if (!env?.[key as keyof Env]) {
      console.error(`Missing secret: ${key}`);
      return json({ error: 'Email service is not configured. Please try again later.' }, 500);
    }
  }

  // Build the email
  const emailSubject = subject
    ? `[UFO Wizard Contact] ${subject}`
    : `[UFO Wizard Contact] Message from ${name}`;

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,-apple-system,sans-serif;color:#222;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;padding:40px;border:1px solid #e0e0e0;">
    <h2 style="font-size:20px;color:#333;margin:0 0 24px;">New contact form submission — The UFO Wizard</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr><td style="padding:8px 0;font-weight:600;color:#555;width:80px;">Name:</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#555;">Email:</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#4ad8c8;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
      ${subject ? `<tr><td style="padding:8px 0;font-weight:600;color:#555;">Subject:</td><td style="padding:8px 0;">${escapeHtml(subject)}</td></tr>` : ''}
    </table>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
    <h3 style="font-size:14px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Message</h3>
    <p style="font-size:15px;line-height:1.7;color:#333;white-space:pre-wrap;">${escapeHtml(message)}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
    <p style="font-size:12px;color:#aaa;">Sent from theufowizard.com contact form.</p>
  </div>
</body>
</html>`;

  // Send
  const accessToken = await getZohoAccessToken(env);
  if (!accessToken) {
    return json({ error: 'Could not send email. Please try again later.' }, 500);
  }

  const sent = await sendZohoMail(env, accessToken, {
    to: TO_ADDRESS,
    subject: emailSubject,
    html,
  });

  if (!sent) {
    return json({ error: 'Could not send email. Please try again later.' }, 500);
  }

  return json({ success: true, message: 'Message sent! I\'ll get back to you soon.' }, 200);
};

function json(data: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
