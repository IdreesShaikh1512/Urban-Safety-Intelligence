/**
 * CityCompare.jsx — Side-by-side city stat comparison
 * Calls GET /crimes/city-compare?city1=&city2=
 */
import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];

function StatRow({ label, v1, v2, higherWins = false }) {
    const w1 = higherWins ? v1 > v2 : v1 < v2;
    const w2 = higherWins ? v2 > v1 : v2 < v1;
    return (
        <div className="compare-stat">
            <span className={`compare-val ${w1 ? 'compare-wins' : w2 ? 'compare-loses' : ''}`}>{v1}</span>
            <span className="compare-key" style={{ margin: '0 8px' }}>{label}</span>
            <span className={`compare-val ${w2 ? 'compare-wins' : w1 ? 'compare-loses' : ''}`}>{v2}</span>
        </div>
    );
}

function CityCompare() {
    const [city1, setCity1] = useState('Mumbai');
    const [city2, setCity2] = useState('Delhi');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const compare = async () => {
        if (city1 === city2) return;
        setLoading(true);
        try {
            const r = await axios.get(`${API_BASE}/crimes/city-compare`, { params: { city1, city2 } });
            setData(r.data);
        } catch { setData(null); }
        setLoading(false);
    };

    return (
        <div>
            <div className="compare-controls">
                <select
                    value={city1} onChange={e => setCity1(e.target.value)}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border2)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 13 }}
                >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="vs-divider">VS</div>
                <select
                    value={city2} onChange={e => setCity2(e.target.value)}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border2)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 13 }}
                >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <button onClick={compare} disabled={city1 === city2 || loading}
                style={{
                    width: '100%', padding: '10px', marginBottom: 16, borderRadius: 8,
                    background: 'linear-gradient(135deg, var(--accent), var(--pink))',
                    border: 'none', color: 'white', fontWeight: 700, fontSize: 13,
                    cursor: city1 === city2 ? 'not-allowed' : 'pointer',
                    opacity: city1 === city2 ? 0.5 : 1, fontFamily: 'var(--font)'
                }}
            >
                {loading ? 'Comparing…' : '⚡ Compare Cities'}
            </button>

            {!data && !loading && (
                <div className="no-data">Select two different cities and click Compare</div>
            )}

            {data && (
                <div className="compare-grid">
                    {[data.city1, data.city2].map((d, idx) => (
                        <div className="compare-side" key={d.city}>
                            <div className="compare-city-name" style={{ color: idx === 0 ? 'var(--accent2)' : 'var(--pink)' }}>
                                🏙️ {d.city}
                            </div>
                            <div className="compare-stat">
                                <span className="compare-key">Total Crimes</span>
                                <span className="compare-val">{d.total}</span>
                            </div>
                            <div className="compare-stat">
                                <span className="compare-key">Risk Score</span>
                                <span className="compare-val" style={{ color: d.riskScore > (idx === 0 ? data.city2.riskScore : data.city1.riskScore) ? 'var(--red)' : 'var(--green)' }}>
                                    {d.riskScore}
                                </span>
                            </div>
                            <div className="compare-stat">
                                <span className="compare-key">Top Crime</span>
                                <span className="compare-val" style={{ color: 'var(--cyan)' }}>{d.topType}</span>
                            </div>
                            {Object.entries(d.typeCounts).sort((a, b) => b[1] - a[1]).map(([t, c]) => (
                                <div className="compare-stat" key={t}>
                                    <span className="compare-key">{t}</span>
                                    <span className="compare-val">{c}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CityCompare;
