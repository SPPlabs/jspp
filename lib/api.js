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

  // Only include headers allowed by CORS (Content-Type, Authorization, x-api-key)
  const headers = {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}` } : {}),
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
 * Send AI Assistant Chatbot Message (POST /api/chat)
 */
export async function sendChatMessage({ messages, userMessage, visitorId }) {
  const { apiKey, domain } = getApiConfig();
  
  const lastMessageText = userMessage || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '');

  const fullPayload = {
    website_id: domain,
    domain: domain,
    apiKey: apiKey,
    message: lastMessageText,
    messages: messages || [{ role: 'user', content: lastMessageText }],
    visitorId: visitorId || 'anonymous-visitor',
  };

  let result = await sppFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify(fullPayload),
  });

  if (result.success) {
    return {
      success: true,
      reply: result.reply || result.response || result.message || result.answer || 'Gracias por tu consulta.',
    };
  }

  return result;
}
