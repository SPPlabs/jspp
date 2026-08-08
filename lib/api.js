export function getApiConfig() {
  return {
    host: process.env.NEXT_PUBLIC_SPPLABS_API_HOST || 'https://api.spplabs.es',
    domain: process.env.NEXT_PUBLIC_SPPLABS_DOMAIN || 'jspp.es',
    apiKey: process.env.NEXT_PUBLIC_SPPLABS_API_KEY || '',
  };
}

/**
 * Standard fetch helper with SPP Labs authentication headers
 */
export async function sppFetch(endpoint, options = {}) {
  const { host, domain, apiKey } = getApiConfig();
  const url = `${host}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'x-website-domain': domain,
    ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = data.message || data.error || `HTTP ${res.status}: Error en la solicitud`;
      return {
        success: false,
        status: res.status,
        message: errorMessage,
        data,
      };
    }

    return {
      success: true,
      status: res.status,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error.message || 'Failed to fetch',
    };
  }
}

/**
 * Submit Contact Form (POST /contacts)
 */
export async function submitContactForm(formData) {
  return sppFetch('/contacts', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

/**
 * Fetch Occupied Booking Slots (GET /bookings?domain=jspp.es)
 */
export async function getOccupiedSlots() {
  const { domain } = getApiConfig();
  return sppFetch(`/bookings?domain=${encodeURIComponent(domain)}`, {
    method: 'GET',
    cache: 'no-store',
  });
}

/**
 * Submit Booking / Appointment Request (POST /bookings)
 */
export async function submitBooking(bookingData) {
  return sppFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

/**
 * Send AI Assistant Chatbot Message (POST /api/chat or POST /chat)
 */
export async function sendChatMessage(chatPayload) {
  const { apiKey, domain } = getApiConfig();
  const fullPayload = {
    apiKey,
    domain,
    website_id: domain,
    ...chatPayload,
  };

  // Try primary endpoint /api/chat
  let result = await sppFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify(fullPayload),
  });

  // If /api/chat fails due to network/CORS (status 0 / Failed to fetch) or 404, fallback to /chat
  if (!result.success && (result.status === 0 || result.status === 404 || result.message.includes('fetch'))) {
    const fallbackResult = await sppFetch('/chat', {
      method: 'POST',
      body: JSON.stringify(fullPayload),
    });

    if (fallbackResult.success || fallbackResult.status !== 0) {
      return fallbackResult;
    }
  }

  return result;
}
