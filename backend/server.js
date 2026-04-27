/**
 * server.js — Entry point for Urban Safety Intelligence Dashboard Backend
 *
 * Architecture: 3-Tier
 *   Frontend (React) → Backend API (Express) → Database (MongoDB)
 *
 * API Endpoints:
 *   GET /crimes              — all crimes (filterable)
 *   GET /crimes/filter       — filtered crimes via query params
 *   GET /risk-score/:city    — risk score for a specific city
 *
 * Future scope:
 *   - Real-time data ingestion via WebSockets
 *   - Predictive analytics (ML microservice)
 *   - Alerts when city risk score exceeds threshold
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const crimeRoutes = require('./routes/crimes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crimedb';

// Middleware — allow all origins so Vercel frontend can reach this Render backend
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/crimes', crimeRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Urban Safety Intelligence Dashboard API is running.' });
});

// Connect to MongoDB then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Urban Safety Intelligence Dashboard server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
