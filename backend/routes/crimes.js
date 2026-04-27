/**
 * routes/crimes.js — Urban Safety Intelligence Dashboard REST API
 *
 * GET /crimes                — all crimes (filterable via query params)
 * GET /crimes/filter         — filtered crimes (city, type, area, month, year)
 * GET /crimes/stats          — aggregated bar + line chart data
 * GET /crimes/top-cities     — top 5 cities with highest crime count
 * GET /crimes/area-stats     — area hotspot breakdown for a city
 * GET /crimes/city-compare   — side-by-side two-city comparison
 * GET /crimes/heatmap        — city × type matrix
 * GET /risk-score/:city      — risk score for a specific city
 */
const express = require('express');
const router = express.Router();
const Crime = require('../models/Crime');

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CRIME_WEIGHTS = {
    Theft: 1, Vandalism: 1, Fraud: 2, Cybercrime: 2,
    Assault: 3, 'Drug Trafficking': 3, Robbery: 4,
    Kidnapping: 5, Arson: 5, Murder: 10,
};

// Helper: build a MongoDB filter object from query params
function buildFilter({ city, type, area, month, year }) {
    const filter = {};
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (area) filter.area = area;
    if (month || year) {
        const y = parseInt(year) || new Date().getFullYear();
        if (month) {
            const m = parseInt(month) - 1;
            filter.date = { $gte: new Date(y, m, 1), $lt: new Date(y, m + 1, 1) };
        } else {
            filter.date = { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) };
        }
    }
    return filter;
}

// ── GET /crimes ─────────────────────────────────────────────────
// All crimes, optionally filtered via query params
router.get('/', async (req, res) => {
    try {
        const filter = buildFilter(req.query);
        const crimes = await Crime.find(filter).sort({ date: -1 });
        res.json(crimes);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /crimes/filter ──────────────────────────────────────────
// Same as GET /crimes but as a dedicated clean endpoint
router.get('/filter', async (req, res) => {
    try {
        const filter = buildFilter(req.query);
        const crimes = await Crime.find(filter).sort({ date: -1 });
        res.json({ count: crimes.length, data: crimes });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /crimes/top-cities ──────────────────────────────────────
// Returns top 5 cities with highest crime count
router.get('/top-cities', async (req, res) => {
    try {
        const result = await Crime.aggregate([
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { city: '$_id', count: 1, _id: 0 } },
        ]);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /crimes/stats ───────────────────────────────────────────
router.get('/stats', async (req, res) => {
    try {
        const match = buildFilter(req.query);

        const [byType, byMonth, byYear] = await Promise.all([
            Crime.aggregate([
                { $match: match },
                { $group: { _id: '$type', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Crime.aggregate([
                { $match: match },
                { $group: { _id: { month: { $month: '$date' } }, count: { $sum: 1 } } },
                { $sort: { '_id.month': 1 } },
            ]),
            Crime.aggregate([
                { $match: match },
                { $group: { _id: { year: { $year: '$date' } }, count: { $sum: 1 } } },
                { $sort: { '_id.year': 1 } },
            ]),
        ]);

        res.json({
            byType: byType.map(d => ({
                type: d._id, count: d.count,
                weight: CRIME_WEIGHTS[d._id] || 1,
            })),
            byMonth: byMonth.map(d => ({
                month: MONTH_NAMES[d._id.month],
                monthNum: d._id.month,
                count: d.count,
            })),
            byYear: byYear.map(d => ({ year: d._id.year, count: d.count })),
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /crimes/area-stats ──────────────────────────────────────
router.get('/area-stats', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ error: 'city is required' });

        const areaData = await Crime.aggregate([
            { $match: { city } },
            {
                $group: {
                    _id: { area: '$area', type: '$type' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        const areaMap = {};
        areaData.forEach(({ _id: { area, type }, count }) => {
            if (!areaMap[area]) areaMap[area] = { area, total: 0, topType: '', topCount: 0, breakdown: {} };
            areaMap[area].total += count;
            areaMap[area].breakdown[type] = count;
            if (count > areaMap[area].topCount) {
                areaMap[area].topCount = count;
                areaMap[area].topType = type;
            }
        });

        const result = Object.values(areaMap).sort((a, b) => b.total - a.total);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /crimes/city-compare ────────────────────────────────────
router.get('/city-compare', async (req, res) => {
    try {
        const { city1, city2 } = req.query;
        if (!city1 || !city2) return res.status(400).json({ error: 'city1 and city2 required' });

        const buildStats = async (city) => {
            const crimes = await Crime.find({ city });
            const typeCounts = {};
            crimes.forEach(c => { typeCounts[c.type] = (typeCounts[c.type] || 0) + 1; });
            const riskScore = Object.entries(typeCounts).reduce((s, [t, c]) => s + (CRIME_WEIGHTS[t] || 1) * c, 0);
            const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
            return { city, total: crimes.length, riskScore, topType: topType?.[0] || 'N/A', typeCounts };
        };

        const [s1, s2] = await Promise.all([buildStats(city1), buildStats(city2)]);
        res.json({ city1: s1, city2: s2 });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /crimes/heatmap ─────────────────────────────────────────
router.get('/heatmap', async (req, res) => {
    try {
        const data = await Crime.aggregate([
            { $group: { _id: { city: '$city', type: '$type' }, count: { $sum: 1 } } },
        ]);
        res.json(data.map(d => ({ city: d._id.city, type: d._id.type, count: d.count })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /risk-score/:city ───────────────────────────────────────
// Risk Score = total crimes in the specified city
// Weighted: each crime type has a severity weight
router.get('/risk-score/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const crimes = await Crime.find({ city });
        if (!crimes.length) return res.json({ city, totalCrimes: 0, riskScore: 0, riskLevel: 'low', breakdown: {} });

        const typeCounts = {};
        crimes.forEach(c => { typeCounts[c.type] = (typeCounts[c.type] || 0) + 1; });

        const riskScore = Object.entries(typeCounts).reduce(
            (sum, [type, count]) => sum + (CRIME_WEIGHTS[type] || 1) * count, 0
        );

        let riskLevel = 'low';
        if (riskScore >= 5000) riskLevel = 'high';
        else if (riskScore >= 2000) riskLevel = 'medium';

        res.json({
            city,
            totalCrimes: crimes.length,
            riskScore,
            riskLevel,
            breakdown: typeCounts,
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
