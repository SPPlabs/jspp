const API_HOST = process.env.NEXT_PUBLIC_SPPLABS_API_HOST || 'https://api.spplabs.es';
const DOMAIN = process.env.NEXT_PUBLIC_SPPLABS_DOMAIN || 'jspp.es';
const API_KEY = process.env.NEXT_PUBLIC_SPPLABS_API_KEY || 'spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

/**
 * Standard fetch helper with SPP Labs authentication headers
 */
export async function sppFetch(endpoint, options = {}) {
  const url = `${API_HOST}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-website-domain': DOMAIN,
    'Authorization': `Bearer ${API_KEY}`,
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
  return sppFetch(`/bookings?domain=${encodeURIComponent(DOMAIN)}`, {
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
  const fullPayload = {
    apiKey: API_KEY,
    domain: DOMAIN,
    website_id: DOMAIN,
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
