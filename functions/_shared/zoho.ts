// Shared Zoho Mail helper for Pages Functions.
// Reuses the same Zoho Mail credentials as ourmysticjourneys.

export interface ZohoEnv {
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_ACCOUNT_ID: string;
}

const FROM_ADDRESS = 'joshrutledge@ourmysticjourneys.com';

/** Exchange the long-lived refresh token for a short-lived access token. */
export async function getZohoAccessToken(env: ZohoEnv): Promise<string | null> {
  const url =
    `https://accounts.zoho.com/oauth/v2/token` +
    `?refresh_token=${encodeURIComponent(env.ZOHO_REFRESH_TOKEN)}` +
    `&client_id=${encodeURIComponent(env.ZOHO_CLIENT_ID)}` +
    `&client_secret=${encodeURIComponent(env.ZOHO_CLIENT_SECRET)}` +
    `&grant_type=refresh_token`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) {
    console.error('Zoho token exchange failed:', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return data?.access_token ?? null;
}

/** Send a transactional email via the Zoho Mail API. Returns true on success. */
export async function sendZohoMail(
  env: ZohoEnv,
  accessToken: string,
  opts: { to: string; subject: string; html: string },
): Promise<boolean> {
  const res = await fetch(`https://mail.zoho.com/api/accounts/${env.ZOHO_ACCOUNT_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      fromAddress: FROM_ADDRESS,
      toAddress: opts.to,
      subject: opts.subject,
      content: opts.html,
      mailFormat: 'html',
      askReceipt: 'no',
    }),
  });
  if (!res.ok) {
    console.error('Zoho Mail API error:', res.status, await res.text());
    return false;
  }
  return true;
}
