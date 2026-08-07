# 03_CLICKHOUSE_ANALYTICS_AND_STATE_SPEC.md — ClickHouse Analytics & Client State Specification

## 1. ClickHouse Analytics Schema (`analytics_events`)
All visitor metrics, page views, and conversions generated on client websites are ingested into the **ClickHouse OLAP Database** at `https://api.spplabs.es/api/analytics`. The database table is partitioned monthly (`toYYYYMM(event_time)`) with a 2-year automatic retention TTL.

### ClickHouse Table Column Definitions:

| Column Name | ClickHouse Data Type | Description & Frontend Source |
| :--- | :--- | :--- |
| `website_id` | `String` | Business domain name (`NEXT_PUBLIC_SPPLABS_DOMAIN`). |
| `event_time` | `DateTime64(3)` | Event ISO timestamp (`YYYY-MM-DD HH:mm:ss.sss`). |
| `visitor_id` | `UUID` | Unique persistent visitor identifier (stored in `spp_visitor_id` cookie). |
| `session_id` | `UUID` | Unique active session identifier (stored in `spp_session_id` cookie). |
| `event_type` | `LowCardinality(String)` | Event type: `page_view`, `button_click`, `form_submit`, `booking_conversion`. |
| `page_url` | `String` | Current page route (e.g., `/servicios`, `/contacto`). |
| `page_title` | `String` | Document title (`document.title`). |
| `referrer` | `String` | Referrer URL (`document.referrer`) or `"Direct / None"`. |
| `utm_source` | `String` | Campaign source parameter (`?utm_source=...`). |
| `utm_medium` | `String` | Campaign medium parameter (`?utm_medium=...`). |
| `utm_campaign` | `String` | Campaign name parameter (`?utm_campaign=...`). |
| `utm_term` | `String` | Campaign search keyword (`?utm_term=...`). |
| `utm_content` | `String` | Campaign ad variation (`?utm_content=...`). |
| `country` | `LowCardinality(String)` | Geolocation country derived from IP. |
| `region` | `LowCardinality(String)` | Geolocation region derived from IP. |
| `city` | `LowCardinality(String)` | Geolocation city derived from IP. |
| `device_type` | `LowCardinality(String)` | Detected device: `Desktop`, `Mobile`, or `Tablet`. |
| `browser` | `LowCardinality(String)` | User browser (`Chrome`, `Safari`, `Firefox`, `Edge`, `Opera`). |
| `os` | `LowCardinality(String)` | User OS (`Windows`, `macOS`, `iOS`, `Android`, `Linux`). |
| `screen_width` | `UInt16` | Screen width in pixels (`window.screen.width`). |
| `screen_height` | `UInt16` | Screen height in pixels (`window.screen.height`). |
| `duration_ms` | `UInt32` | Total time spent on page in milliseconds (computed upon navigation/unload). |
| `scroll_percent`| `UInt8` | Maximum page scroll depth percentage (`0`-`100`). |
| `button_name` | `String` | Text label of the clicked button (for `button_click`). |
| `form_name` | `String` | Name of the submitted form (for `form_submit`). |
| `booking_id` | `String` | Generated booking ID upon conversion. |
| `conversion` | `UInt8` | Conversion flag: `1` for lead/booking submission, `0` otherwise. |
| `ip_hash` | `FixedString(64)` | SHA-256 hashed IP address for GDPR-compliant anonymization. |

---

## 2. Analytics Tracking Integration
The Next.js client website includes the tracker script in the root layout (`app/layout.js`) or dispatches payloads via `POST https://api.spplabs.es/api/analytics`:

```html
<script 
  src="https://api.spplabs.es/tracker.js" 
  data-website-domain="clientbusiness.com" 
  defer>
</script>
```

### Analytics Event Ingestion Payload Example:
```json
{
  "website_id": "clientbusiness.com",
  "apiKey": "spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "visitor_id": "c89a01f2-7721-419b-a012-998811223344",
  "session_id": "f12e3456-e89b-12d3-a456-426614174000",
  "event_type": "page_view",
  "page_url": "/contacto",
  "page_title": "Contacto | Business Name",
  "referrer": "https://google.com",
  "screen_width": 1920,
  "screen_height": 1080,
  "duration_ms": 12500,
  "scroll_percent": 85
}
```

---

## 3. Client Cookies & Web Storage Requirements

| Storage Type | Key / Cookie Name | Purpose & Expiration | Legal Classification |
| :--- | :--- | :--- | :--- |
| **Cookie** | `spp_visitor_id` | Persistent UUID v4 visitor identifier (365 days). | Analytics (Requires Banner Consent) |
| **Cookie** | `spp_session_id` | Active session UUID v4 identifier (30 minutes). | Analytics (Requires Banner Consent) |
| **Cookie** | `spp_session` | JWT session token for client dashboard auth (24h). | Strictly Necessary (Exempt) |
| **LocalStorage** | `spp_lang` | Language preference (`es` / `en`). | Functional |
| **LocalStorage** | `spp_theme` | UI theme preference (`light` / `dark`). | Functional |
| **SessionStorage** | `spp_chatbot_conversation_session` | Active chat history thread for the AI Assistant. | Functional |
