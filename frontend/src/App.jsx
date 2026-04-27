/**
 * App.jsx — Urban Safety Intelligence Dashboard
 * 
 * Architecture: React (Vite) → Express API → MongoDB
 * Features: 10 cities · 10 crime types · risk scoring · area hotspots · city comparison · heatmap
 * Future: real-time WebSocket feeds, ML predictions, push alerts
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FilterPanel from './components/FilterPanel';
import StatCards from './components/StatCards';
import CrimeTable from './components/CrimeTable';
import CrimeBarChart from './components/CrimeBarChart';
import CrimeLineChart from './components/CrimeLineChart';
import DonutChart from './components/DonutChart';
import RiskScore from './components/RiskScore';
import InsightPanel from './components/InsightPanel';
import AreaHotspot from './components/AreaHotspot';
import CityCompare from './components/CityCompare';
import HeatmapTable from './components/HeatmapTable';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
    const [filters, setFilters] = useState({ city: '', type: '', area: '', month: '', year: '' });
    const [crimes, setCrimes] = useState([]);
    const [stats, setStats] = useState({ byType: [], byMonth: [], byYear: [] });
    const [heatmap, setHeatmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('overview'); // overview | area | compare | heatmap | table

    const fetchData = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
            const [cr, st, hm] = await Promise.all([
                axios.get(`${API_BASE}/crimes`, { params }),
                axios.get(`${API_BASE}/crimes/stats`, { params }),
                axios.get(`${API_BASE}/crimes/heatmap`),
            ]);
            setCrimes(cr.data);
            setStats(st.data);
            setHeatmap(hm.data);
        } catch {
            setError('Cannot connect to the backend – make sure the server is running on port 5000.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const now = new Date();

    return (
        <div className="app-container">
            {/* ── HEADER ── */}
            <header className="app-header">
                <div className="header-left">
                    <div className="header-logo">🛡️</div>
                    <div>
                        <div className="header-title">Urban Safety Intelligence Dashboard</div>
                        <div className="header-sub">Cloud-Ready · NoSQL Analytics · React · Node.js · MongoDB</div>
                    </div>
                </div>
                <div className="header-right">
                    <div className="live-badge"><div className="live-dot" /> Live Data</div>
                    <div className="year-badge">2020 – 2025</div>
                </div>
            </header>

            <main className="main-content">
                {error && <div className="error-box">{error}</div>}

                {/* ── FILTERS ── */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-title">⚙️ Filters</div>
                    <FilterPanel filters={filters} onChange={setFilters} />
                </div>

                {loading ? (
                    <div className="status-center">
                        <div className="spinner" />
                        <span>Loading urban safety data…</span>
                    </div>
                ) : (
                    <>
                        {/* ── STAT CARDS ── */}
                        <StatCards crimes={crimes} />

                        {/* ── TABS ── */}
                        <div className="tabs">
                            {[
                                { id: 'overview', label: '📊 Overview' },
                                { id: 'area', label: '📍 Area Risk' },
                                { id: 'compare', label: '⚡ City Compare' },
                                { id: 'heatmap', label: '🌡️ Heatmap' },
                                { id: 'table', label: '📋 Records' },
                            ].map(t => (
                                <button
                                    key={t.id}
                                    className={`tab-btn ${tab === t.id ? 'active' : ''}`}
                                    onClick={() => setTab(t.id)}
                                    id={`tab-${t.id}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* ── OVERVIEW TAB ── */}
                        {tab === 'overview' && (
                            <>
                                <div className="charts-row">
                                    <div className="card">
                                        <div className="card-title">📊 Crimes by Type</div>
                                        <CrimeBarChart data={stats.byType} />
                                    </div>
                                    <div className="card">
                                        <div className="card-title">📈 Monthly Trend</div>
                                        <CrimeLineChart data={stats.byMonth} />
                                    </div>
                                    <div className="card">
                                        <div className="card-title">🍩 Type Distribution</div>
                                        <DonutChart data={stats.byType} />
                                    </div>
                                </div>

                                <div className="charts-row-2">
                                    <div className="card">
                                        <div className="card-title">🎯 Risk Score</div>
                                        <RiskScore crimes={crimes} selectedCity={filters.city} />
                                    </div>
                                    <div className="card">
                                        <div className="card-title">🧠 Insights</div>
                                        <InsightPanel crimes={crimes} filters={filters} stats={stats} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── AREA RISK TAB ── */}
                        {tab === 'area' && (
                            <div className="card">
                                <div className="card-title">
                                    📍 Area-Wise Risk Levels
                                    {filters.city && <span style={{ marginLeft: 8, color: 'var(--cyan)', textTransform: 'none', fontSize: 13, fontWeight: 700 }}>— {filters.city}</span>}
                                </div>
                                {!filters.city && (
                                    <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, color: 'var(--text2)' }}>
                                        💡 <strong style={{ color: 'var(--accent2)' }}>Tip:</strong> Select a city in the Filters above to see area-wise risk levels.
                                    </div>
                                )}
                                <AreaHotspot city={filters.city} />
                            </div>
                        )}

                        {/* ── CITY COMPARE TAB ── */}
                        {tab === 'compare' && (
                            <div className="card">
                                <div className="card-title">⚡ City Safety Comparison</div>
                                <CityCompare />
                            </div>
                        )}

                        {/* ── HEATMAP TAB ── */}
                        {tab === 'heatmap' && (
                            <div className="card">
                                <div className="card-title">🌡️ Crime Distribution Heatmap</div>
                                <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>
                                    Color intensity indicates crime frequency across cities &amp; types. 🔴 = High · 🟠 = Medium · 🟡 = Low · 🟣 = Very Low
                                </p>
                                <HeatmapTable rawData={heatmap} />
                            </div>
                        )}

                        {/* ── TABLE TAB ── */}
                        {tab === 'table' && (
                            <div className="card">
                                <div className="card-title">📋 Safety Incident Records</div>
                                <CrimeTable crimes={crimes} />
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="app-footer">
                Urban Safety Intelligence Dashboard &copy; {now.getFullYear()} &nbsp;·&nbsp; Cloud-ready, NoSQL-based data analytics system for urban safety monitoring &nbsp;·&nbsp;
                Data simulated for demonstration purposes
            </footer>
        </div>
    );
}
