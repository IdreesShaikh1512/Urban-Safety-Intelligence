# Urban Safety Intelligence Dashboard

> "This project demonstrates a cloud-ready, NoSQL-based data analytics system for urban safety monitoring."

A full-stack data analytics web application that transforms raw crime data into interactive urban safety insights — featuring risk scoring, trend analysis, and area-wise risk levels across major Indian cities.

**Stack**: React + Node.js/Express + MongoDB/Mongoose + Recharts + Docker

---

## 📊 Project Description

The **Urban Safety Intelligence Dashboard** is a comprehensive data analytics platform designed to analyze, visualize, and interpret urban crime data. By aggregating crime records across 10 major Indian cities and 10 crime categories (2020–2025), it enables analysts and civic planners to:

- Understand **crime distribution** across cities and neighborhoods
- Track **safety trends** over time using interactive charts
- Identify **area-wise risk levels** for targeted interventions
- Compute **risk scores** to quantify urban safety at a glance

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Risk Score** | Total crimes in selected city — displayed as Low / Medium / High |
| 🏙️ **Top 5 Cities** | Insight panel shows the 5 most crime-affected cities |
| 📈 **Monthly Trend Chart** | Line chart showing crime frequency month-by-month |
| 📊 **Crime Type Bar Chart** | Distribution of incidents by category |
| 🍩 **Donut Chart** | Crime type proportions at a glance |
| 🌡️ **Heatmap** | City × Crime Type frequency matrix |
| 📍 **Area-wise Risk** | Per-area crime breakdown for any city |
| ⚡ **City Comparison** | Side-by-side safety stats for two cities |
| 🔍 **Advanced Filters** | Filter by city, area, crime type, month, and year |
| 📋 **Incident Records** | Paginated table of all matching crime records |
| 🐳 **Docker Support** | Full containerization with Docker Compose |

---

## 📁 Project Structure

```
Urban-Safety-Intelligence-Dashboard/
├── backend/
│   ├── models/Crime.js            # Mongoose schema (10 cities, 10 types)
│   ├── routes/crimes.js           # REST API routes
│   ├── server.js                  # Express entry point
│   ├── seed.js                    # Generates ~11,000 sample records
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterPanel.jsx    # City / Area / Type / Month / Year filters
│   │   │   ├── StatCards.jsx      # Summary stat cards
│   │   │   ├── CrimeBarChart.jsx  # Bar chart — crimes by type
│   │   │   ├── CrimeLineChart.jsx # Line chart — monthly trend
│   │   │   ├── DonutChart.jsx     # Donut — type distribution
│   │   │   ├── RiskScore.jsx      # Risk score card
│   │   │   ├── InsightPanel.jsx   # Auto-generated safety insights
│   │   │   ├── AreaHotspot.jsx    # Area-wise risk breakdown
│   │   │   ├── CityCompare.jsx    # Two-city comparison
│   │   │   └── HeatmapTable.jsx   # City × crime type heatmap
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crimes` | All crimes (filterable via query params) |
| GET | `/crimes/filter` | Filtered crimes — returns `{ count, data }` |
| GET | `/crimes/stats` | Aggregated bar + line chart data |
| GET | `/crimes/top-cities` | Top 5 cities by crime count |
| GET | `/crimes/area-stats?city=Mumbai` | Area-wise breakdown for a city |
| GET | `/crimes/city-compare?city1=X&city2=Y` | Side-by-side city stats |
| GET | `/crimes/heatmap` | City × crime type frequency matrix |
| GET | `/risk-score/:city` | Risk score for a specific city |

**Query parameters for `/crimes` and `/crimes/filter`:**
- `city` — e.g., `Mumbai`
- `type` — e.g., `Theft`
- `area` — e.g., `Bandra`
- `month` — 1–12
- `year` — e.g., `2024`

---

## 🚀 How to Run Locally (without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running on `localhost:27017`

### 1. Start Backend

```bash
cd backend
npm install
node seed.js        # Inserts ~11,000 safety records into MongoDB
npm run dev         # Starts on http://localhost:5000
```

### 2. Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev         # Starts on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🐳 Run with Docker Compose

```bash
# From the project root directory:
docker-compose up --build

# Seed the database (first time only):
docker-compose exec backend node seed.js
```

| Service   | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost:3000     |
| Backend   | http://localhost:5000     |
| MongoDB   | mongodb://localhost:27017 |

To stop:
```bash
docker-compose down
```

To remove all data (including MongoDB volume):
```bash
docker-compose down -v
```

---

## ☁️ Deployment

### Option A — Render (Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → connect repo
3. **Backend**:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `node server.js`
   - Env variable: `MONGO_URI=<your MongoDB Atlas URI>`
4. **Frontend**:
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Env variable: `VITE_API_URL=https://your-backend.onrender.com`

### Option B — Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → Deploy from GitHub
3. Add a **MongoDB** plugin from the Railway dashboard
4. Configure `MONGO_URI` env variable with the Railway MongoDB URL

### Option C — AWS EC2

```bash
# On EC2 instance (Ubuntu):
sudo apt update && sudo apt install docker docker-compose -y
git clone <your-repo> && cd Urban-Safety-Intelligence-Dashboard
docker-compose up -d --build
docker-compose exec backend node seed.js
```

---

## 🔭 Future Scope

- **Predictive Analytics** — ML model to forecast future crime trends (Python microservice)
- **Real-time Data** — WebSocket feed for live incident reporting
- **Push Alerts** — Notifications when city risk score exceeds threshold
- **More Cities** — Expand dataset to all major Indian cities
- **User Auth** — Role-based access (Admin vs. Analyst)
- **Export** — Download filtered data as CSV/PDF reports
