/**
 * StatCards.jsx — Animated stat cards for total crimes, top city, top type, avg risk
 */
const WEIGHTS = {
    Theft: 1, Vandalism: 1, Fraud: 2, Cybercrime: 2,
    Assault: 3, 'Drug Trafficking': 3, Robbery: 4, Kidnapping: 5, Arson: 5, Murder: 10,
};

function StatCards({ crimes, allCrimes }) {
    const total = crimes.length;

    // Top type
    const typeCounts = crimes.reduce((a, c) => { a[c.type] = (a[c.type] || 0) + 1; return a; }, {});
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

    // Risk score for current filter
    const risk = Object.entries(typeCounts).reduce((s, [t, c]) => s + (WEIGHTS[t] || 1) * c, 0);

    // Most active city in current results
    const cityCounts = crimes.reduce((a, c) => { a[c.city] = (a[c.city] || 0) + 1; return a; }, {});
    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0];

    return (
        <div className="stat-cards">
            <div className="stat-card purple">
                <div className="stat-icon">🔎</div>
                <div className="stat-value">{total.toLocaleString()}</div>
                <div className="stat-label">Total Crimes</div>
                <div className="stat-sub">matching current filters</div>
            </div>
            <div className="stat-card pink">
                <div className="stat-icon">⚠️</div>
                <div className="stat-value">{risk.toLocaleString()}</div>
                <div className="stat-label">Risk Score</div>
                <div className="stat-sub">{risk < 50 ? 'Low' : risk < 200 ? 'Medium' : 'High'} severity</div>
            </div>
            <div className="stat-card cyan">
                <div className="stat-icon">🏙️</div>
                <div className="stat-value" style={{ fontSize: topCity?.[0]?.length > 7 ? '20px' : '34px' }}>
                    {topCity?.[0] || '—'}
                </div>
                <div className="stat-label">Most Active City</div>
                <div className="stat-sub">{topCity?.[1] || 0} incidents</div>
            </div>
            <div className="stat-card green">
                <div className="stat-icon">🔥</div>
                <div className="stat-value" style={{ fontSize: topType?.[0]?.length > 7 ? '16px' : '34px' }}>
                    {topType?.[0] || '—'}
                </div>
                <div className="stat-label">Top Crime Type</div>
                <div className="stat-sub">{topType?.[1] || 0} occurrences</div>
            </div>
        </div>
    );
}

export default StatCards;
