// Analytics and Client State helper matching Spec 03 (ClickHouse Analytics & Client State)

function getAnalyticsConfig() {
  return {
    apiHost: process.env.NEXT_PUBLIC_SPPLABS_API_HOST || 'https://api.spplabs.es',
    domain: process.env.NEXT_PUBLIC_SPPLABS_DOMAIN || 'jspp.es',
    apiKey: process.env.NEXT_PUBLIC_SPPLABS_API_KEY || '',
  };
}

/**
 * Generate standard UUID v4
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Cookie helpers
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export function setCookie(name, value, days) {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
}

/**
 * Initialize / fetch Visitor and Session IDs according to consent
 */
export function getVisitorAndSessionIds() {
  if (typeof window === 'undefined') return { visitorId: null, sessionId: null };

  let visitorId = getCookie('spp_visitor_id');
  if (!visitorId) {
    visitorId = generateUUID();
    setCookie('spp_visitor_id', visitorId, 365); // 365 days retention
  }

  let sessionId = getCookie('spp_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    // 30 minutes session cookie (stored in fractional days)
    setCookie('spp_session_id', sessionId, 0.020833);
  }

  return { visitorId, sessionId };
}

/**
 * Dispatch event payload to ClickHouse Ingestion Endpoint
 */
export async function trackAnalyticsEvent(eventType, extraData = {}) {
  if (typeof window === 'undefined') return;

  const { apiHost, domain, apiKey } = getAnalyticsConfig();
  const { visitorId, sessionId } = getVisitorAndSessionIds();

  const payload = {
    website_id: domain,
    apiKey: apiKey,
    visitor_id: visitorId,
    session_id: sessionId,
    event_type: eventType,
    page_url: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer || 'Direct / None',
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    duration_ms: extraData.duration_ms || 0,
    scroll_percent: extraData.scroll_percent || 0,
    button_name: extraData.button_name || '',
    form_name: extraData.form_name || '',
    booking_id: extraData.booking_id || '',
    conversion: extraData.conversion ? 1 : 0,
    ...extraData,
  };

  try {
    await fetch(`${apiHost}/api/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-website-domain': domain,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    // Silent fail for analytics tracking
  }
}
