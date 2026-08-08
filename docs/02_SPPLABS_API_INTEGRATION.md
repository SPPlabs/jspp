# 02_SPPLABS_API_INTEGRATION.md — SPP Labs API Integration Specification

All API communication between the client website and the SPP Labs platform targets the central API gateway: `https://api.spplabs.es`.

---

## 1. Quick-Reference API Gateway Matrix

| Endpoint | HTTP Method | CORS Allowed Headers | Auth Headers Required | Body Payload Fields Required | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/contacts` | `POST` | `Content-Type, Authorization, x-api-key, x-website-domain` | `x-api-key` or `Authorization: Bearer` | `domain`, `apiKey`, `name`, `email`, `message` | `JSON (200 OK)` |
| `/bookings` | `GET` | `Content-Type, Authorization, x-api-key, x-website-domain` | Domain query param (`?domain=...`) | N/A | `JSON (200 OK)` |
| `/bookings` | `POST` | `Content-Type, Authorization, x-api-key, x-website-domain` | `x-api-key` or `Authorization: Bearer` | `domain`, `apiKey`, `name`, `email`, `date`, `time` | `JSON (200 OK)` |
| `/api/chat` | `POST` | `Content-Type, Authorization, x-api-key` *(Omit `x-website-domain` header)* | `Authorization: Bearer <API_KEY>` | `website_id`, `domain`, `apiKey`, `message` (max 150 chars), `visitorId` | `Stream (text/event-stream)` |
| `/api/analytics` | `POST` | `Content-Type, Authorization, x-api-key, x-website-domain` | `x-api-key` or `data-website-domain` | `website_id`, `event_type`, `visitor_id`, `session_id` | `JSON (200 OK)` |

---

## 2. Global API Authentication & CORS Header Rules

### Standard Authentication Headers
HTTP requests sent to the API gateway must supply API key and domain credentials via headers and/or JSON body fields.

```http
Content-Type: application/json
Authorization: Bearer spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
x-api-key: spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
x-website-domain: clientbusiness.com
```

> [!IMPORTANT]
> **Critical Endpoint CORS Rules:**
> - `/contacts` and `/bookings` endpoints permit `x-website-domain` in `Access-Control-Allow-Headers`.
> - `/api/chat` endpoint's CORS policy explicitly permits **ONLY** `Content-Type, Authorization, x-api-key`.
> - **Rule for AI Agents:** Do **NOT** send `x-website-domain` in the HTTP headers of `/api/chat` requests, as browser CORS preflight (`OPTIONS`) will fail with `TypeError: Failed to fetch`. Instead, send `website_id` and `domain` inside the JSON request body.

---

## 3. Endpoints Specification

### A. Contact Form Submission
* **Endpoint:** `POST https://api.spplabs.es/contacts`
* **Rate Limit:** 60 requests/minute per IP.

**Request Body (JSON):**
```json
{
  "domain": "clientbusiness.com",
  "apiKey": "spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
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
* **Description:** Fetches confirmed and pending booking dates and time slots for the business to disable occupied calendar slots.

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
  "domain": "clientbusiness.com",
  "apiKey": "spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
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
* **Mandatory Headers:** `Content-Type: application/json`, `Authorization: Bearer <API_KEY>`, `x-api-key: <API_KEY>`. (Omit `x-website-domain`).

**Request Body (JSON):**
```json
{
  "website_id": "clientbusiness.com",
  "domain": "clientbusiness.com",
  "apiKey": "spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "message": "What are your business opening hours?",
  "messages": [
    { "role": "user", "content": "What are your business opening hours?" }
  ],
  "visitorId": "b47c9210-91a0-42ab-b192-381920192012"
}
```

> [!WARNING]
> **Payload Constraints & Response Type:**
> 1. `website_id` and `message` are strictly required in the request body.
> 2. `message` parameter must be sliced to **150 characters maximum** (`message.slice(0, 150)`).
> 3. **Streaming Response Handling:** On HTTP 200 OK, `/api/chat` returns a streaming response (`Content-Type: text/event-stream` / `text/plain`). Do **not** call `res.json()`; extract raw text via `res.text()`.

---

## 4. Rate Limiting & HTTP Error Handling
When a user exceeds rate limits or provides an unauthenticated API key, the gateway returns HTTP status codes:

- **HTTP 401 Unauthorized:** Invalid or missing API Key (`{"error":"Unauthorized","message":"Invalid API key"}`).
- **HTTP 429 Too Many Requests:** Exceeded rate limits (`{"error":"Too Many Requests","message":"Has enviado demasiados mensajes..."}`).

AI Coder Agents must handle HTTP status codes `400` (Validation error), `401` (Unauthorized key/domain), `429` (Rate limited), and `500` (Internal server error) gracefully in the Next.js frontend UI.
