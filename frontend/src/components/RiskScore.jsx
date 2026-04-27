/**
 * RiskScore.jsx — Urban Safety Risk Score Card
 *
 * Risk Score = total crimes in selected city (simple count)
 * Also shows weighted severity score for deeper analysis.
 * Risk Level thresholds:
 *   Low    < 50 crimes
 *   Medium 50 – 199 crimes
 *   High   200+ crimes
 */
const WEIGHTS = {
    Theft: 1, Vandalism: 1, Fraud: 2, Cybercrime: 2,
    Assault: 3, 'Drug Trafficking': 3, Robbery: 4, Kidnapping: 5, Arson: 5, Murder: 10,
};

const TYPE_COLORS = {
    Theft: '#6366f1', Assault: '#ef4444', Robbery: '#f97316', Murder: '#dc2626',
    Fraud: '#06b6d4', Kidnapping: '#ec4899', Vandalism: '#fbbf24',
    Cybercrime: '#c084fc', 'Drug Trafficking': '#10b981', Arson: '#fb923c',
};

function getRiskLevel(totalCrimes) {
    if (totalCrimes < 50) return 'low';
    if (totalCrimes < 200) return 'medium';
    return 'high';
}

function RiskScore({ crimes, selectedCity }) {
    // Risk Score = total crimes in selected city
    const totalCrimes = crimes.length;
    const level = getRiskLevel(totalCrimes);
    const cityLabel = selectedCity || 'All Cities';
    const EMOJI = { low: '🟢', medium: '🟡', high: '🔴' };

    const counts = crimes.reduce((a, c) => { a[c.type] = (a[c.type] || 0) + 1; return a; }, {});
    const maxCount = Math.max(...Object.values(counts), 1);

    return (
        <div className="risk-wrap">
            <div className={`risk-number ${level}`}>{totalCrimes.toLocaleString()}</div>
            <div className="risk-label">
                Risk Score (Total Crimes) for <strong style={{ color: 'var(--text)' }}>{cityLabel}</strong>
            </div>
            <div className={`risk-badge ${level}`}>
                {EMOJI[level]} {level.charAt(0).toUpperCase() + level.slice(1)} Risk
            </div>

            {Object.keys(counts).length > 0 && (
                <div className="risk-breakdown" style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Crime Distribution
                    </div>
                    {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                        <div key={type} className="risk-row">
                            <span style={{ minWidth: 100, color: 'var(--text2)', fontSize: 11 }}>{type}</span>
                            <div className="risk-row-bar">
                                <div
                                    className="risk-row-fill"
                                    style={{ width: `${(count / maxCount) * 100}%`, background: TYPE_COLORS[type] || '#6366f1' }}
                                />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--text2)', minWidth: 40, textAlign: 'right' }}>
                                <strong style={{ color: 'var(--text)' }}>{count}</strong>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RiskScore;
