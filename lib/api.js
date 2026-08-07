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
      status: 500,
      message: error.message || 'Error de conexión con el servidor SPP Labs API',
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
 * Send AI Assistant Chatbot Message (POST /api/chat)
 */
export async function sendChatMessage(chatPayload) {
  return sppFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify(chatPayload),
  });
}
