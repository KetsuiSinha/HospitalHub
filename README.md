# 💊 HospitalHub

## 📌 Project Overview

HospitalHub is a **medicine inventory management system** powered by **AI recommendations**.  
Admins can **Create, Read, Update, Delete (CRUD)** medicines in stock while the AI predicts what medicines should be restocked, removed, or added.  
The goal is to help hospitals maintain **optimized medicine inventories** with minimal guesswork.

---

## 🏗 Monorepo Structure

```
HospitalHub/
├── backend/           # Express API + MongoDB
├── frontend/          # Next.js + TailwindCSS + shadcn/ui
├── packages/
│   └── ai-service/    # LangChain.js AI recommendation engine
├── package.json       # Root workspace config
└── .env.example
```

---

## 🛠 Tech Stack

| Layer      | Stack                                      |
|-----------|---------------------------------------------|
| Frontend  | Next.js 15, TailwindCSS, shadcn/ui          |
| Backend   | Node.js, Express.js                         |
| Database  | MongoDB (Mongoose ODM)                      |
| AI        | LangChain.js, OpenAI GPT-4o-mini, Zod       |

---

## ⚙️ Features

- **Inventory Management** – View, add, edit, delete medicines
- **AI Recommendations** – RESTOCK, REMOVE, ADD suggestions with confidence scores
- **Visual Dashboard** – Charts, summary stats, clean UI

---

## 🚀 Quick Start (Local)

### 1. Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (optional – fallback rules work without it)

### 2. Install

```bash
git clone https://github.com/YOUR_USERNAME/HospitalHub.git
cd HospitalHub
npm install
```

### 3. Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with MONGO_URI, JWT_SECRET, OPENAI_API_KEY

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit NEXT_PUBLIC_API_BASE_URL if backend runs on different port
```

### 4. Run

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:3000

---

## 📡 AI Recommendations API

**Endpoint:** `POST /api/ai/recommendations`  
**Auth:** Bearer token required  
**Rate limit:** 20 requests / 15 minutes (configurable)

**Request:**
```json
{
  "inventoryData": [...],
  "usageHistory": [...],
  "filters": { "category": "antibiotics", "urgencyOnly": true }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "rec-restock-1",
      "type": "RESTOCK",
      "medicine": { "name": "Paracetamol", "id": "..." },
      "action": "Reorder 500 units",
      "reasoning": "Stock below threshold...",
      "confidence": 0.85,
      "urgency": "HIGH",
      "metadata": { "currentStock": 10, "recommendedQuantity": 500 }
    }
  ],
  "summary": {
    "totalRecommendations": 5,
    "highPriority": 2,
    "estimatedImpact": "Prevents 2 stockouts, reduces waste by 15%"
  }
}
```

---

## 🚢 Deployment Guide

### GitHub Setup

1. **Create repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/HospitalHub.git
   git push -u origin main
   ```

2. **Add `.gitignore`** (if not present):
   ```
   .env
   .env.local
   .env*.local
   node_modules
   .next
   ```

---

### Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → New Project → Import Git repo.
2. **Root Directory:** Select `frontend` (important for monorepo).
3. **Framework Preset:** Next.js (auto-detected)
4. **Environment Variables:**
   | Variable                  | Value                      |
   |---------------------------|----------------------------|
   | `NEXT_PUBLIC_API_BASE_URL` | Your backend API URL       |

5. Deploy.

---

### Backend Hosting (Vercel Serverless / Railway / Render)

The backend uses Express and MongoDB. For Vercel:

1. Add `api/` route in project root (or use a separate backend deployment).
2. Or deploy backend separately on **Railway** / **Render** / **Fly.io**.

**Option A – Deploy backend on Railway (recommended)**

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub.
2. Select repo, set **Root Directory:** `backend`
3. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENAI_API_KEY` (optional)
   - `CLIENT_ORIGIN` = `https://your-app.vercel.app`
   - `PORT` = `5000` (or use Railway default)
4. Deploy. Copy the public URL and use it as `NEXT_PUBLIC_API_BASE_URL` in Vercel.

**Option B – Deploy backend on Render**

1. [render.com](https://render.com) → New Web Service → Connect repo.
2. Root: `backend`
3. Build: `npm install`
4. Start: `npm start`
5. Add env vars (same as above).
6. Use the Render URL as `NEXT_PUBLIC_API_BASE_URL`.

---

### Environment Variables Summary

| Variable                   | Where     | Required | Description                    |
|----------------------------|-----------|----------|--------------------------------|
| `MONGO_URI`                | Backend   | Yes      | MongoDB connection string      |
| `JWT_SECRET`               | Backend   | Yes      | Secret for JWT signing         |
| `OPENAI_API_KEY`           | Backend   | No       | Enables AI; fallback without   |
| `CLIENT_ORIGIN`            | Backend   | No       | Frontend URL for CORS          |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend  | Yes      | Backend API URL                |
| `AI_CACHE_TTL_MS`          | Backend   | No       | Cache TTL (default: 1h)        |
| `AI_RATE_LIMIT_MAX`        | Backend   | No       | AI requests per 15 min         |

---

## 📂 Monorepo Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev:backend` | Start backend dev server  |
| `npm run dev:frontend`| Start frontend dev server |
| `npm run build`      | Build frontend             |
| `npm run start`      | Start backend (prod)       |

---

## 🔒 Security Notes

- Never commit `.env` or `.env.local`
- Use strong `JWT_SECRET` in production
- Set `CLIENT_ORIGIN` to your real frontend URL
- AI endpoint is rate-limited and requires auth

---

## 📄 License

MIT
