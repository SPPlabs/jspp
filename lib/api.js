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
    'x-website-domain': domain,
    ...(apiKey ? { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}` } : {}),
    ...(options.headers || {}),
  };

  // Clean undefined headers so caller options can explicitly suppress headers
  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined) {
      delete headers[key];
    }
  });

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const errorMessage = data.message || data.error || `HTTP ${res.status}: Error en la solicitud`;
      return {
        success: false,
        status: res.status,
        message: errorMessage,
        data,
      };
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      const rawText = await res.text();
      return {
        success: true,
        status: res.status,
        reply: rawText,
        text: rawText,
      };
    }

    // Try reading as JSON first, fallback to text if stream or plain format
    const data = await res.json().catch(async () => {
      const text = await res.text().catch(() => '');
      return { reply: text, text: text };
    });

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
  const { domain, apiKey } = getApiConfig();
  return sppFetch('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      domain,
      apiKey,
      ...formData,
    }),
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
  const { domain, apiKey } = getApiConfig();
  return sppFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      domain,
      apiKey,
      ...bookingData,
    }),
  });
}

/**
 * Extract AI Chatbot Reply string from various API Gateway response schemas
 */
function extractAiReply(result) {
  if (!result) return null;

  // Check direct string fields
  if (typeof result.reply === 'string' && result.reply.trim()) return result.reply;
  if (typeof result.response === 'string' && result.response.trim()) return result.response;
  if (typeof result.text === 'string' && result.text.trim()) return result.text;
  if (typeof result.content === 'string' && result.content.trim()) return result.content;
  if (typeof result.output === 'string' && result.output.trim()) return result.output;
  if (typeof result.answer === 'string' && result.answer.trim()) return result.answer;

  // Check nested data object
  if (result.data) {
    if (typeof result.data === 'string' && result.data.trim()) return result.data;
    if (typeof result.data.reply === 'string' && result.data.reply.trim()) return result.data.reply;
    if (typeof result.data.response === 'string' && result.data.response.trim()) return result.data.response;
    if (typeof result.data.text === 'string' && result.data.text.trim()) return result.data.text;
    if (typeof result.data.content === 'string' && result.data.content.trim()) return result.data.content;
    if (typeof result.data.output === 'string' && result.data.output.trim()) return result.data.output;
    if (typeof result.data.message === 'string' && result.data.message.trim()) return result.data.message;
  }

  // Check message property if it's actual AI content
  if (typeof result.message === 'string' && result.message.trim()) {
    const msg = result.message.trim();
    const isGenericStatus = ['success', 'ok', '200', 'successful', 'true'].includes(msg.toLowerCase());
    if (!isGenericStatus) {
      return msg;
    }
  }

  return null;
}

/**
 * Send AI Assistant Chatbot Message (POST /api/chat)
 */
export async function sendChatMessage({ messages, userMessage, visitorId }) {
  const { apiKey, domain } = getApiConfig();
  
  const lastMessageText = (userMessage || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '') || '').slice(0, 150);

  const fullPayload = {
    website_id: domain,
    domain: domain,
    apiKey: apiKey,
    message: lastMessageText,
    messages: messages || [{ role: 'user', content: lastMessageText }],
    visitorId: visitorId || 'anonymous-visitor',
  };

  // Omit x-website-domain header for /api/chat because backend CORS only allows Content-Type, Authorization, x-api-key
  let result = await sppFetch('/api/chat', {
    method: 'POST',
    headers: {
      'x-website-domain': undefined,
    },
    body: JSON.stringify(fullPayload),
  });

  if (result.success) {
    const aiReply = extractAiReply(result);
    if (aiReply) {
      return {
        success: true,
        reply: aiReply,
      };
    }
  }

  return result;
}
