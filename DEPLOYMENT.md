# Tatkal Assist 2.0 — Production Deployment & Operations Guide

## 1. Overview
Tatkal Assist 2.0 is architected as a high-performance, mobile-first web companion. It can be deployed in two main topologies:
1. **Serverless Static Edge (Vercel / Netlify / Cloudflare Pages)**: Built as a Vite React SPA with instant local fallback datasets and direct Google Cloud Firestore persistence.
2. **Full-Stack Node.js / Express (Cloud Run / VPS / Docker)**: Full REST API with Express serving static assets or acting as a secure backend proxy (`server.ts`).

---

## 2. Environment Variables

Create `.env` using `.env.example` as a template:

```bash
# Server Port (Defaults to 3000)
PORT=3000

# Environment Mode
NODE_ENV=production

# App Hosting URL
APP_URL="https://tatkal-alpha.vercel.app"

# Optional Gemini AI API Key for Railway Grounded Research
GEMINI_API_KEY="AIzaSy..."
```

---

## 3. Deployment Targets

### Option A: Vercel (Current Production)
The codebase includes a preconfigured `vercel.json` routing configuration:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Node.js Version**: 18+ or 20+

### Option B: Docker / Containerized Cloud Run
A standard Node.js Alpine container can run the applet directly:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 4. Database Setup & Architecture

### Google Cloud Firestore
- Production Database: `ai-studio-tatkalassistsmar-77cc56e7-1295-4157-885a-46cbe88ffbbf`
- Collections:
  - `users/{userId}/passengers/{passengerId}`: Personal master list records with ID proof last-4 digits.
  - `users/{userId}/journeys/{journeyId}`: Tracked train journeys and calculated countdowns.
  - `users/{userId}/alerts/{alertId}`: Push notifications and countdown alarms.

### MySQL Schema (Optional Relational Backing)
For enterprise multi-tenant deployments, the complete DDL migration script is accessible in the **Admin Console > MySQL & Deployment** tab, featuring:
- Indexed `train_number`, `pnr`, and `journey_date` queries.
- Normalized passenger profile master lists.
- Full audit logs with query response times.

---

## 5. Security & Railway Regulatory Compliance

1. **No Automation Bots**:
   Tatkal Assist does not automate ticket reservations or solve CAPTCHAs. Booking happens through legitimate user interaction on authorized IRCTC channels.
2. **Aadhaar / PII Redaction**:
   Only the last 4 digits of government IDs are accepted, in alignment with Indian data privacy best practices and UIDAI redaction standards.
3. **Emergency Wipe Button**:
   Passengers using shared computers or railway station Wi-Fi kiosks can purge all local data instantly via the **Privacy & A11y** modal.
