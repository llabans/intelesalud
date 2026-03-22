import { createSign, randomUUID } from 'crypto';

const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const DEFAULT_TIME_ZONE = process.env.GOOGLE_CALENDAR_TIME_ZONE || 'America/Lima';

function parseServiceAccount() {
  const rawJson = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY;
  let parsedJson = null;

  if (rawJson) {
    try {
      parsedJson = JSON.parse(rawJson);
    } catch (error) {
      console.error('[Calendar] GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY is not valid JSON:', error);
    }
  }

  const clientEmail =
    parsedJson?.client_email || process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL || '';
  const privateKey =
    parsedJson?.private_key || process.env.GOOGLE_CALENDAR_PRIVATE_KEY || '';

  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function buildJwtAssertion({ clientEmail, privateKey, impersonateUser }) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: TOKEN_SCOPE,
    aud: TOKEN_AUDIENCE,
    exp: issuedAt + 3600,
    iat: issuedAt,
  };

  if (impersonateUser) {
    payload.sub = impersonateUser;
  }

  const unsignedToken = `${base64UrlEncode({ alg: 'RS256', typ: 'JWT' })}.${base64UrlEncode(payload)}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey, 'base64url');

  return `${unsignedToken}.${signature}`;
}

function uniqueAttendees(emails) {
  return [...new Set(emails.filter(Boolean).map((email) => email.trim().toLowerCase()))].map(
    (email) => ({ email })
  );
}

export class CalendarService {
  constructor() {
    const serviceAccount = parseServiceAccount();
    this.provider = 'GOOGLE_MEET';
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || '';
    this.timeZone = DEFAULT_TIME_ZONE;
    this.impersonateUser = process.env.GOOGLE_CALENDAR_IMPERSONATE_USER || '';
    this.clientEmail = serviceAccount.clientEmail;
    this.privateKey = serviceAccount.privateKey;
    this.cachedToken = null;
    this.cachedTokenExpiresAt = 0;
  }

  isConfigured() {
    return Boolean(this.calendarId && this.clientEmail && this.privateKey);
  }

  async getAccessToken() {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar no esta configurado para generar Google Meet.');
    }

    if (this.cachedToken && Date.now() < this.cachedTokenExpiresAt - 60_000) {
      return this.cachedToken;
    }

    const assertion = buildJwtAssertion({
      clientEmail: this.clientEmail,
      privateKey: this.privateKey,
      impersonateUser: this.impersonateUser,
    });

    const response = await fetch(TOKEN_AUDIENCE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error_description || payload.error || 'No se pudo autenticar Google Calendar.');
    }

    this.cachedToken = payload.access_token;
    this.cachedTokenExpiresAt = Date.now() + (payload.expires_in || 3600) * 1000;

    return this.cachedToken;
  }

  async createMeetingEvent({
    appointmentId,
    title,
    description,
    startTime,
    endTime,
    patientEmail,
    specialistEmail,
  }) {
    if (!this.isConfigured()) {
      return null;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        this.calendarId
      )}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: title,
          description,
          start: {
            dateTime: new Date(startTime).toISOString(),
            timeZone: this.timeZone,
          },
          end: {
            dateTime: new Date(endTime).toISOString(),
            timeZone: this.timeZone,
          },
          attendees: uniqueAttendees([patientEmail, specialistEmail]),
          conferenceData: {
            createRequest: {
              requestId: `${appointmentId}-${randomUUID()}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          },
        }),
        cache: 'no-store',
      }
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        payload.error?.message || 'Google Calendar rechazo la creacion de la teleconsulta.'
      );
    }

    const joinUrl =
      payload.hangoutLink ||
      payload.conferenceData?.entryPoints?.find((entryPoint) => entryPoint.entryPointType === 'video')
        ?.uri ||
      '';

    return {
      eventId: payload.id || '',
      joinUrl,
    };
  }
}

export const calendarService = new CalendarService();

if (calendarService.isConfigured()) {
  console.log('[Calendar] Google Meet habilitado — las citas confirmadas generaran enlace automaticamente.');
} else {
  console.warn('[Calendar] Google Calendar no configurado — no se generaran enlaces Meet. Revisa GOOGLE_CALENDAR_ID y GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY.');
}
