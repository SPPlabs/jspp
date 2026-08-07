# 02_SPPLABS_API_INTEGRATION.md — SPP Labs API Integration Specification

All API communication between the client website and the SPP Labs platform must target the API gateway: `https://api.spplabs.es`.

---

## 1. Global API Authentication & Headers
Every HTTP request (`POST`, `GET`, `OPTIONS`) sent to the API gateway must include the following headers:

```http
Content-Type: application/json
x-api-key: spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
x-website-domain: clientbusiness.com
```

*Note:* API keys follow the strict `spp_api_...` format. The key can also be provided as a Bearer token in the `Authorization` header (`Authorization: Bearer spp_api_...`) or as `apiKey` in JSON request bodies.

---

## 2. Endpoints Specification

### A. Contact Form Submission
* **Endpoint:** `POST https://api.spplabs.es/contacts`
* **Rate Limit:** 60 requests/minute per IP.

**Request Body (JSON):**
```json
{
  "name": "Alex Smith",
  "email": "alex.smith@example.com",
  "phone": "+34612345678",
  "message": "I would like to request information about your services."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "c1f7b823-92a0-432d-b124-7128a39110ab"
}
```

---

### B. Occupied Booking Slots Retrieval
* **Endpoint:** `GET https://api.spplabs.es/bookings?domain=clientbusiness.com`
* **Description:** Fetches all confirmed and pending booking dates and time slots for the business. Used to disable occupied slots on the Next.js interactive calendar.

**Success Response (200 OK):**
```json
{
  "success": true,
  "occupied": [
    { "date": "2026-08-10", "time": "10:00" },
    { "date": "2026-08-10", "time": "14:30" }
  ]
}
```

---

### C. Booking / Appointment Request
* **Endpoint:** `POST https://api.spplabs.es/bookings`
* **Rate Limit:** 60 requests/minute per IP.
* **Validation Rule:** Booking dates must be within the current calendar month or the immediately following calendar month.

**Request Body (JSON):**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "phone": "+34699887766",
  "date": "2026-08-15",
  "time": "11:00",
  "message": "Initial consultation"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking requested successfully",
  "id": "b881c2f9-77a1-4321-a5b6-123456789abc"
}
```

---

### D. AI Chatbot Assistant Widget
* **Endpoint:** `POST https://api.spplabs.es/api/chat`
* **Rate Limit:** 15 requests/minute per IP.

**Request Body (JSON):**
```json
{
  "messages": [
    { "role": "user", "content": "What are your business opening hours?" }
  ],
  "visitorId": "b47c9210-91a0-42ab-b192-381920192012"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "reply": "We are open Monday through Friday from 9:00 AM to 6:00 PM."
}
```

---

## 3. Rate Limiting & HTTP Error Handling
When a user exceeds rate limits, the API gateway returns **HTTP 429 Too Many Requests**:

```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Has enviado demasiados mensajes. Por favor, espera un momento antes de volver a intentarlo."
}
```

The AI Coder Agent must handle HTTP status codes `400` (Validation error), `401` (Unauthorized key/domain), `429` (Rate limited), and `500` (Internal server error) gracefully in the Next.js frontend UI.
