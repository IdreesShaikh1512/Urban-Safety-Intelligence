/**
 * HeatmapTable.jsx — City × Crime Type count matrix with color intensity
 * Uses GET /crimes/heatmap
 */

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];
const TYPES = ['Theft', 'Assault', 'Robbery', 'Murder', 'Fraud', 'Kidnapping', 'Vandalism', 'Cybercrime', 'Drug Trafficking', 'Arson'];

function getColor(val, max) {
    if (!val) return 'rgba(255,255,255,0.03)';
    const ratio = val / max;
    if (ratio > 0.75) return 'rgba(239,68,68,0.55)';
    if (ratio > 0.5) return 'rgba(249,115,22,0.45)';
    if (ratio > 0.25) return 'rgba(245,158,11,0.35)';
    return 'rgba(99,102,241,0.25)';
}

function HeatmapTable({ rawData }) {
    if (!rawData || !rawData.length) return <div className="no-data">No data</div>;

    // Build matrix
    const matrix = {};
    let globalMax = 0;
    rawData.forEach(({ city, type, count }) => {
        if (!matrix[city]) matrix[city] = {};
        matrix[city][type] = count;
        if (count > globalMax) globalMax = count;
    });

    return (
        <div className="heatmap-wrap">
            <table className="heatmap-table">
                <thead>
                    <tr>
                        <th>City ↓ / Type →</th>
                        {TYPES.map(t => <th key={t}>{t.split(' ')[0]}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {CITIES.map(city => (
                        <tr key={city}>
                            <td>{city}</td>
                            {TYPES.map(type => {
                                const val = matrix[city]?.[type] || 0;
                                return (
                                    <td key={type}>
                                        <span
                                            className="heatmap-cell"
                                            style={{ background: getColor(val, globalMax), color: val ? 'var(--text)' : 'var(--text3)' }}
                                        >
                                            {val || '–'}
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HeatmapTable;
