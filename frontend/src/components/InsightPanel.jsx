/**
 * InsightPanel.jsx — Urban Safety Insights
 * Shows: top crime type, peak month, top 5 cities by crime count, year trend, total records
 */
const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function InsightPanel({ crimes, filters, stats }) {
    const insights = [];
    if (!crimes.length) return (
        <div className="insight-card">
            <div className="insight-item">
                <span className="ii">ℹ️</span>
                <span>No data for selected filters.</span>
            </div>
        </div>
    );

    const typeCounts = crimes.reduce((a, c) => { a[c.type] = (a[c.type] || 0) + 1; return a; }, {});
    const cityLabel = filters.city || 'all cities';
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const topType = sorted[0];
    const bottomType = sorted[sorted.length - 1];

    // 1. Top crime type
    insights.push({ icon: '📌', text: `Most reported incident in ${cityLabel}: ${topType[0]} (${topType[1]} cases, ${Math.round((topType[1] / crimes.length) * 100)}% of total).`, cls: '' });

    // 2. Peak month
    if (stats.byMonth?.length) {
        const peak = [...stats.byMonth].sort((a, b) => b.count - a.count)[0];
        insights.push({ icon: '📅', text: `Peak month for safety incidents: ${peak.month} with ${peak.count} reported case${peak.count !== 1 ? 's' : ''}.`, cls: 'cyan-border' });
    }

    // 3. Least common crime
    if (topType[0] !== bottomType[0])
        insights.push({ icon: '📉', text: `Least reported incident type: ${bottomType[0]} with only ${bottomType[1]} case${bottomType[1] !== 1 ? 's' : ''}.`, cls: 'pink-border' });

    // 4. Total records
    insights.push({ icon: '📊', text: `${crimes.length} total safety record${crimes.length !== 1 ? 's' : ''} match the current filters.`, cls: 'green-border' });

    // 5. TOP 5 CITIES — core insight
    if (!filters.city) {
        const cityCounts = crimes.reduce((a, c) => { a[c.city] = (a[c.city] || 0) + 1; return a; }, {});
        const top5 = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const top5Text = top5.map(([c, n], i) => `${i + 1}. ${c} (${n})`).join('  ·  ');
        insights.push({ icon: '🏙️', text: `Top 5 cities by incident count: ${top5Text}`, cls: 'pink-border' });
    }

    // 6. Year-over-year trend
    if (stats.byYear?.length > 1) {
        const years = stats.byYear;
        const last = years[years.length - 1];
        const prev = years[years.length - 2];
        const delta = last.count - prev.count;
        const arrow = delta > 0 ? '▲' : '▼';
        const col = delta > 0 ? 'var(--red)' : 'var(--green)';
        insights.push({
            icon: delta > 0 ? '📈' : '📉',
            text: `${last.year}: ${last.count} incidents (${arrow} ${Math.abs(delta)} vs ${prev.year}).`,
            cls: '', col,
        });
    }

    return (
        <div className="insight-card">
            {insights.map((ins, i) => (
                <div className={`insight-item ${ins.cls || ''}`} key={i}>
                    <span className="ii">{ins.icon}</span>
                    <span style={ins.col ? { color: ins.col } : {}}>{ins.text}</span>
                </div>
            ))}
        </div>
    );
}

export default InsightPanel;
