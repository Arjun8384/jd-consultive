# JD Consultive — Complete Project Guide

## Project Structure

```
jd-consultive/        ← React frontend
jd-backend/           ← Node.js Express backend API
```

---

## 1. Frontend Setup (React)

```bash
cd jd-consultive
npm install
cp .env.example .env.local    # edit API URL if needed
npm start                     # runs on http://localhost:3000
```

**For production build:**
```bash
npm run build
# Deploy the /build folder to Netlify, Vercel, or any static host
```

---

## 2. Backend Setup (Node.js)

### Install dependencies
```bash
cd jd-backend
npm install
cp .env.example .env
```

### Generate your admin password hash
```bash
node -e "const b=require('bcryptjs'); b.hash('YourStrongPassword123!',12).then(console.log)"
```
Copy the output (starts with `$2b$12$...`) into your `.env` as `ADMIN_PASSWORD_HASH`.

### Generate a secure JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Paste this into `.env` as `JWT_SECRET`.

### Fill in your .env
```env
PORT=4000
JWT_SECRET=<output from above>
ADMIN_PASSWORD_HASH=<bcrypt hash from above>
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
DATA_DIR=/var/data/jd-consultive   # wherever you want data stored
```

### Run the server
```bash
npm start          # production
npm run dev        # development (requires nodemon: npm i -g nodemon)
```

---

## 3. How to Access Your Submissions (as Owner)

All form data is stored as JSON files on the server. You access them via the **admin API**.

### Step 1 — Login and get a token

```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YourStrongPassword123!"}'
```

Response:
```json
{ "token": "eyJhbGciOiJIUzI1NiIs...", "expiresIn": "8h" }
```

Copy the token. It lasts 8 hours.

### Step 2 — View client (company) enquiries

```bash
curl http://localhost:4000/api/admin/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 3 — View candidate enquiries

```bash
curl http://localhost:4000/api/admin/candidates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 4 — Export all data as a backup

```bash
curl http://localhost:4000/api/admin/export \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o backup_$(date +%Y%m%d).json
```

### Step 5 — Delete a specific entry

```bash
curl -X DELETE http://localhost:4000/api/admin/entry/client/ENTRY_UUID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 4. Simple Admin Dashboard (optional)

You can use **Postman** or **Insomnia** (free GUI tools) instead of curl:
1. Download Postman: https://www.postman.com
2. POST to `/api/admin/login` with your password
3. Use the returned token as a Bearer token on all other requests

---

## 5. Security Features Built In

| Feature | Detail |
|---|---|
| **Rate limiting** | Global: 60 req/15 min · Forms: 5/hr · Login: 10/15 min |
| **JWT authentication** | All admin routes require a signed token (8h expiry) |
| **bcrypt passwords** | Your password is never stored in plain text |
| **Input validation** | All fields sanitised and validated server-side |
| **CORS** | Only your frontend domain is allowed |
| **Helmet.js** | Security headers (XSS, CSRF, clickjacking protection) |
| **Body size limit** | Max 10KB per request |
| **No sensitive data in logs** | Only ID and email logged, never passwords |

---

## 6. Production Deployment (Recommended)

### Frontend → Vercel or Netlify (free)
1. Push `jd-consultive/` to GitHub
2. Connect to Vercel/Netlify, set `REACT_APP_API_URL` to your backend URL

### Backend → Railway, Render, or DigitalOcean
1. Push `jd-backend/` to GitHub
2. Set all environment variables in the hosting dashboard
3. Set `DATA_DIR` to a persistent volume path

### Domain + HTTPS
- Always use HTTPS in production (Vercel/Netlify do this automatically)
- Your backend should also be behind HTTPS (Railway/Render do this automatically)

---

## 7. Data Storage Location

Data is saved at `DATA_DIR` (set in `.env`):
```
/var/data/jd-consultive/
  ├── client_enquiries.json
  └── candidate_enquiries.json
```

Each entry looks like:
```json
{
  "id": "uuid-here",
  "submittedAt": "2026-05-08T10:30:00.000Z",
  "ip": "::1",
  "type": "client",
  "name": "Rahul Sharma",
  "company": "TechCorp",
  "email": "rahul@techcorp.com",
  ...
}
```

**Backup regularly:** Use the `/api/admin/export` endpoint on a schedule.

---

## 8. Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 4000) |
| `JWT_SECRET` | **YES** | Long random string for signing tokens |
| `ADMIN_PASSWORD_HASH` | **YES** | bcrypt hash of your chosen password |
| `ALLOWED_ORIGINS` | **YES** | Comma-separated frontend URLs |
| `DATA_DIR` | No | Where to store JSON files (default: ./data) |
