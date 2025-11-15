# Agreement API Documentation

## Overview

The Agreement API provides endpoints for creating, managing, and signing Smart Stay Agreements between hosts and guests. The system includes digital signature tracking, immutable content hashing, and automatic trust score updates.

## Data Model

### Agreement Schema

```typescript
model Agreement {
  id              String            // Unique identifier
  
  // Content
  preamble        String            // Human-first introduction text
  clauses         Json              // Array of clause objects
  countryCode     String            // Legal jurisdiction (default: "AT")
  
  // Signatures
  signatures      Json              // Array of signature objects
  
  // Immutability
  hash            String?           // SHA-256 hash of finalized content
  
  // Status & dates
  status          AgreementStatus   // Current status
  startDate       DateTime?         // Agreement start date
  endDate         DateTime?         // Agreement end date
  createdAt       DateTime          // Creation timestamp
  updatedAt       DateTime          // Last update timestamp
  finalizedAt     DateTime?         // When both parties signed
  
  // Relations
  listingId       String
  listing         Listing
  hostId          String
  host            User
  guestId         String
  guest           User
}
```

### Agreement Status Enum

- **DRAFT** - Agreement created but not signed
- **PENDING_HOST** - Waiting for host signature
- **PENDING_GUEST** - Waiting for guest signature
- **FULLY_SIGNED** - Both parties signed
- **ACTIVE** - Agreement in effect
- **COMPLETED** - Stay/job completed successfully
- **CANCELLED** - Cancelled before completion
- **DISPUTED** - Under dispute resolution

### Signature Object Structure

```json
{
  "userId": "user_id",
  "name": "User Name",
  "signedAt": "2025-11-10T12:00:00Z",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### Clause Object Structure

```json
{
  "title": "Clause Title",
  "content": "Clause content text",
  "order": 1
}
```

## API Endpoints

### POST /api/agreements

Create a new agreement between host and guest.

**Auth Required:** Yes (Host must own the listing)

**Request Body:**
```json
{
  "listingId": "listing_123",
  "guestId": "user_456",
  "preamble": "Welcome to our mountain home...",
  "clauses": [
    {
      "title": "Duration",
      "content": "This agreement covers the period from...",
      "order": 1
    }
  ],
  "countryCode": "AT",
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z"
}
```

**Response (201):**
```json
{
  "id": "agreement_789",
  "status": "DRAFT",
  "preamble": "Welcome to our mountain home...",
  "clauses": [...],
  "signatures": [],
  "hash": null,
  "listing": {...},
  "host": {...},
  "guest": {...},
  "createdAt": "2025-11-10T12:00:00Z",
  "updatedAt": "2025-11-10T12:00:00Z"
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - User doesn't own the listing
- `404 Not Found` - Listing or guest not found
- `400 Bad Request` - Missing required fields

---

### GET /api/agreements

List all agreements for the authenticated user (as host or guest).

**Auth Required:** Yes

**Query Parameters:**
- `role` (optional) - Filter by role: `host`, `guest`, or omit for both
- `status` (optional) - Filter by status: `DRAFT`, `FULLY_SIGNED`, etc.

**Examples:**
- `/api/agreements` - All agreements
- `/api/agreements?role=host` - Agreements where user is host
- `/api/agreements?status=FULLY_SIGNED` - All fully signed agreements
- `/api/agreements?role=guest&status=ACTIVE` - Active agreements as guest

**Response (200):**
```json
[
  {
    "id": "agreement_789",
    "status": "FULLY_SIGNED",
    "listing": {
      "id": "listing_123",
      "title": "Mountain Chalet in Tirol",
      "type": "STAY",
      "location": "Innsbruck",
      "region": "TIROL",
      "city": "Innsbruck"
    },
    "host": {
      "id": "user_123",
      "name": "Maria Schmidt",
      "email": "maria@example.com",
      "image": "https://..."
    },
    "guest": {
      "id": "user_456",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://..."
    },
    "createdAt": "2025-11-10T12:00:00Z",
    "updatedAt": "2025-11-10T14:30:00Z",
    "finalizedAt": "2025-11-10T14:30:00Z"
  }
]
```

---

### GET /api/agreements/[id]

Fetch a single agreement by ID.

**Auth Required:** Yes (Must be party to agreement)

**Response (200):**
```json
{
  "id": "agreement_789",
  "preamble": "Welcome to our mountain home...",
  "clauses": [...],
  "countryCode": "AT",
  "signatures": [
    {
      "userId": "user_123",
      "name": "Maria Schmidt",
      "signedAt": "2025-11-10T12:30:00Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "hash": "a3f8b2c1...",
  "status": "PENDING_GUEST",
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "listing": {...},
  "host": {
    "id": "user_123",
    "name": "Maria Schmidt",
    "email": "maria@example.com",
    "image": "https://...",
    "trustScore": 85.5
  },
  "guest": {
    "id": "user_456",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://...",
    "trustScore": 72.3
  },
  "createdAt": "2025-11-10T12:00:00Z",
  "updatedAt": "2025-11-10T12:30:00Z"
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - User is not party to agreement
- `404 Not Found` - Agreement not found

---

### PATCH /api/agreements/[id]

Update an agreement (add signature or change status).

**Auth Required:** Yes (Must be party to agreement)

#### Action: Sign Agreement

**Request Body:**
```json
{
  "action": "sign"
}
```

**Behavior:**
- Adds current user's signature with metadata (IP, user agent, timestamp)
- Updates status based on signatures:
  - Host signs → `PENDING_GUEST`
  - Guest signs → `PENDING_HOST`
  - Both signed → `FULLY_SIGNED`
- Generates SHA-256 hash when fully signed
- Increments `completedAgreements` trust metric for both users

**Response (200):**
```json
{
  "id": "agreement_789",
  "status": "FULLY_SIGNED",
  "signatures": [
    {
      "userId": "user_123",
      "name": "Maria Schmidt",
      "signedAt": "2025-11-10T12:30:00Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    },
    {
      "userId": "user_456",
      "name": "John Doe",
      "signedAt": "2025-11-10T14:30:00Z",
      "ipAddress": "192.168.1.2",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "hash": "a3f8b2c1d4e5f6...",
  "finalizedAt": "2025-11-10T14:30:00Z",
  ...
}
```

**Errors:**
- `400 Bad Request` - Already signed

---

#### Action: Update Status

**Request Body:**
```json
{
  "status": "ACTIVE"
}
```

**Allowed Transitions:**
- `DRAFT` → `PENDING_HOST`, `PENDING_GUEST`, `CANCELLED`
- `PENDING_HOST` → `FULLY_SIGNED`, `CANCELLED`
- `PENDING_GUEST` → `FULLY_SIGNED`, `CANCELLED`
- `FULLY_SIGNED` → `ACTIVE`, `CANCELLED`
- `ACTIVE` → `COMPLETED`, `DISPUTED`, `CANCELLED`
- `DISPUTED` → `ACTIVE`, `CANCELLED`

**Special Behavior:**
- Status `COMPLETED` → Increments `completedStays` trust metric for both users

**Response (200):**
```json
{
  "id": "agreement_789",
  "status": "ACTIVE",
  ...
}
```

**Errors:**
- `400 Bad Request` - Invalid status transition

---

### DELETE /api/agreements/[id]

Delete an agreement (only in DRAFT status).

**Auth Required:** Yes (Must be host)

**Response (200):**
```json
{
  "success": true
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Only host can delete
- `404 Not Found` - Agreement not found
- `400 Bad Request` - Can only delete DRAFT agreements

---

## Integration with Trust Metrics

The Agreement system automatically updates user trust scores:

### Completed Agreements (+5 points per agreement)
- Incremented when agreement becomes `FULLY_SIGNED`
- Both host and guest receive the trust boost

### Completed Stays (+10 points per stay)
- Incremented when agreement status changes to `COMPLETED`
- Both host and guest receive the trust boost

### Hash Generation
- SHA-256 hash generated when both parties sign
- Hash includes: preamble, clauses, countryCode, hostId, guestId, listingId, dates
- Provides immutable proof of agreement terms

---

## Usage Examples

### Creating an Agreement

```javascript
const response = await fetch('/api/agreements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    listingId: 'listing_123',
    guestId: 'user_456',
    preamble: 'Welcome to our mountain home in Innsbruck...',
    clauses: [
      {
        title: 'Duration of Stay',
        content: 'This agreement covers the winter season...',
        order: 1
      },
      {
        title: 'House Rules',
        content: 'Please respect quiet hours between 22:00-07:00...',
        order: 2
      }
    ],
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    countryCode: 'AT'
  })
});

const agreement = await response.json();
```

### Signing an Agreement

```javascript
const response = await fetch(`/api/agreements/${agreementId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'sign' })
});

const signedAgreement = await response.json();
```

### Listing User's Agreements

```javascript
// All agreements
const all = await fetch('/api/agreements');

// As host only
const asHost = await fetch('/api/agreements?role=host');

// Active agreements as guest
const activeAsGuest = await fetch('/api/agreements?role=guest&status=ACTIVE');
```

### Updating Agreement Status

```javascript
const response = await fetch(`/api/agreements/${agreementId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'ACTIVE' })
});
```

---

## Security Considerations

1. **Authentication**: All endpoints require valid NextAuth session
2. **Authorization**: Users can only access agreements they're party to
3. **Signature Integrity**: IP address and user agent captured for audit trail
4. **Immutability**: Hash prevents tampering after both parties sign
5. **Status Transitions**: Strict state machine prevents invalid progressions
6. **Deletion Protection**: Only DRAFT agreements can be deleted, only by host

---

## Future Enhancements

- [ ] PDF generation from agreement content
- [ ] Email notifications on signature/status changes
- [ ] Dispute resolution workflow
- [ ] Multi-language clause templates
- [ ] Automated agreement expiration
- [ ] Digital signature verification UI
- [ ] Agreement analytics dashboard
