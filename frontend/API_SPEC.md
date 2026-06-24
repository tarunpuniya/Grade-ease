# GradeFlow NFC Attendance API Specification

Last updated: 2025-10-11

Purpose
-------
This document defines the minimal REST API contract for the NFC attendance system used by GradeFlow. It is designed for a prototype using an ESP32 (or similar) to POST NFC scans, and for the web UI to query records and manage mappings between card UIDs and students.

Assumptions
-----------
- ESP32 and server are reachable on the same LAN or the server is reachable via a public URL.
- Devices (ESP32) authenticate using an API key sent in the `x-api-key` header.
- Persistence is via JSON files (`attendance.json`, `mappings.json`) initially; later we can migrate to SQLite/Postgres.
- Time values are ISO-8601 in UTC.

Authentication
--------------
- Header: `x-api-key: <device-key>`
- For prototype the server will validate the header against `process.env.API_KEY` or a device list. Missing/invalid keys produce 401.

Data models
-----------
Attendance record (attendance.json entry):

```json
{
  "id": "uuid-v4",
  "card_uid": "04:A3:B2:C1",
  "card_uid_raw": "12345678",
  "student_id": "student-123", // optional if mapped
  "student_name": "Tarun Kumar", // optional if mapped
  "device_id": "esp32-1",
  "timestamp": "2025-10-11T08:32:12.345Z",
  "status": "present" // or 'unknown', 'error'
}
```

Mapping record (mappings.json entry):

```json
{
  "card_uid": "04:A3:B2:C1",
  "student_id": "student-123",
  "student_name": "Tarun Kumar",
  "notes": "Roll 12"
}
```

Endpoints
---------
All endpoints return JSON and use standard HTTP status codes. The POST scan endpoint requires the `x-api-key` header.

1) POST /api/attendance/scan
- Description: Record a single NFC scan from a device.
- Headers:
  - `Content-Type: application/json`
  - `x-api-key: <device-key>` (required)
- Request body (JSON):

```json
{
  "card_uid": "04:A3:B2:C1",
  "card_uid_raw": "12345678",   // optional
  "device_id": "esp32-1",       // optional
  "timestamp": "2025-10-11T08:32:12Z" // optional; server will add if missing
}
```

- Responses:
  - 201 Created

```json
{
  "success": true,
  "id": "<attendance-id>",
  "mapped_student": { "student_id":"student-123", "student_name":"Tarun Kumar" }
}
```

  - 400 Bad Request (missing card_uid):

```json
{ "success": false, "error": "card_uid missing or invalid" }
```

  - 401 Unauthorized (missing/invalid API key)
  - 500 Internal Server Error (persistence error)

Notes:
- Server will normalize `card_uid` (uppercase, colon or hyphen delimited) before storing.
- Server will look up mapping (mappings.json) and include mapped student info in the response when available.

2) GET /api/attendance/today
- Description: Return attendance records for today (server-local timezone or UTC; iso date returned). Optional `?date=YYYY-MM-DD` to fetch a different day.
- Query params: `date` (optional)
- Response 200:

```json
{
  "date": "2025-10-11",
  "records": [ /* attendance record objects */ ]
}
```

3) GET /api/attendance/recent
- Description: Return recent scans (useful for dashboards). Supports `?limit=20`.
- Response 200:

```json
{
  "records": [ /* newest first */ ]
}
```

4) GET /api/attendance/student/:student_id
- Description: Return attendance history for a student.
- Query params: `from=YYYY-MM-DD`, `to=YYYY-MM-DD` (optional)
- Response 200:

```json
{ "student_id": "student-123", "history": [ /* records */ ] }
```

5) Mappings CRUD
- GET /api/mappings  — list all mappings; supports `?card_uid=` and `?student_id=` filters.
- POST /api/mappings — create mapping
  - Body: `{ "card_uid": "04:A3:B2:C1", "student_id": "student-123", "student_name": "Tarun Kumar" }`
  - Response: 201 with created mapping
- PUT /api/mappings/:card_uid — update mapping
- DELETE /api/mappings/:card_uid — delete mapping

Responses: 200 for success, 400 for bad input.

6) Optional: GET /api/attendance/stream (SSE)
- Description: Server-Sent Events endpoint that emits new scan objects as they arrive. Useful to update dashboards in real time.
- Accepts long-living GET requests and emits events in the SSE format.

Error codes
-----------
- 200 OK — success with data
- 201 Created — resource created
- 400 Bad Request — payload validation failed
- 401 Unauthorized — API key missing/invalid
- 404 Not Found — resource not found
- 500 Internal Server Error — persistence or unexpected server error

Examples (curl)
---------------
Post a scan (replace host and API_KEY):

```bash
curl -X POST http://localhost:3000/api/attendance/scan \
  -H "Content-Type: application/json" \
  -H "x-api-key: REPLACE_WITH_KEY" \
  -d '{"card_uid":"04:A3:B2:C1","device_id":"esp32-1"}'
```

Get today's scans:

```bash
curl http://localhost:3000/api/attendance/today
```

Security & reliability notes
----------------------------
- Use `x-api-key` for devices. For production use TLS and stronger auth.
- ESP32 should retry failed requests and optionally store scans locally (LittleFS) until acknowledgement.
- Implement atomic file writes on the server (write temp file then rename) to prevent corruption.
- Consider rate-limiting device requests to prevent abuse (simple token bucket).

Implementation notes
--------------------
- Server will store data in `attendance.json` and `mappings.json`. Each file contains an array in top-level property (`records`/`mappings`).
- Provide helper utilities for read/write and for normalization of `card_uid`.
- Include small unit/integration tests or curl scripts to verify endpoints.

SSE example (client JS):

```js
const es = new EventSource('/api/attendance/stream');
es.onmessage = (ev) => console.log('scan:', JSON.parse(ev.data));
```

Next steps
----------
- Implement the POST `/api/attendance/scan` endpoint (Day 3).
- Add mapping CRUD endpoints (Day 4).

---

If you want any changes to this spec (extra fields, different auth method, or a DB schema version), tell me now and I will update `API_SPEC.md` accordingly.