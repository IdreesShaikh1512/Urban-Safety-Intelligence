/**
 * AreaHotspot.jsx — Area-level crime breakdown for selected city
 * Calls GET /crimes/area-stats?city=
 */
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const AREA_COLORS = [
    'linear-gradient(90deg, #f59e0b, #ef4444)',
    'linear-gradient(90deg, #6366f1, #818cf8)',
    'linear-gradient(90deg, #06b6d4, #10b981)',
    'linear-gradient(90deg, #ec4899, #f97316)',
    'linear-gradient(90deg, #8b5cf6, #6366f1)',
    'linear-gradient(90deg, #14b8a6, #06b6d4)',
];

function AreaHotspot({ city }) {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!city) { setAreas([]); return; }
        setLoading(true);
        axios.get(`${API_BASE}/crimes/area-stats`, { params: { city } })
            .then(r => setAreas(r.data))
            .catch(() => setAreas([]))
            .finally(() => setLoading(false));
    }, [city]);

    if (!city) return (
        <div className="no-data" style={{ padding: '20px' }}>
            🏙️ Select a city in the filters to see area-level crime hotspots
        </div>
    );

    if (loading) return <div className="no-data">Loading area data…</div>;
    if (!areas.length) return <div className="no-data">No area data found</div>;

    const max = areas[0]?.total || 1;

    return (
        <div className="area-grid">
            {areas.map((a, i) => (
                <div className="area-row" key={a.area}>
                    <div className={`area-rank ${['r1', 'r2', 'r3'][i] || 'rn'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </div>
                    <div className="area-info">
                        <div className="area-name">{a.area}</div>
                        <div className="area-top-crime">⚡ Most: <strong style={{ color: 'var(--text)' }}>{a.topType}</strong></div>
                    </div>
                    <div className="area-bar-wrap">
                        <div className="area-bar-bg">
                            <div
                                className="area-bar-fill"
                                style={{
                                    width: `${(a.total / max) * 100}%`,
                                    background: AREA_COLORS[i % AREA_COLORS.length],
                                }}
                            />
                        </div>
                    </div>
                    <div className="area-count">{a.total}</div>
                </div>
            ))}
        </div>
    );
}

export default AreaHotspot;
