/**
 * CrimeBarChart.jsx — Bar chart with gradient fill for 10 crime types
 */
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell,
} from 'recharts';

const TYPE_COLORS = {
    Theft: '#6366f1', Assault: '#ef4444', Robbery: '#f97316',
    Murder: '#dc2626', Fraud: '#06b6d4', Kidnapping: '#ec4899',
    Vandalism: '#fbbf24', Cybercrime: '#c084fc',
    'Drug Trafficking': '#10b981', Arson: '#fb923c',
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        const { type, count } = payload[0].payload;
        return (
            <div style={{
                background: 'rgba(15,25,50,0.95)', color: '#f1f5f9',
                padding: '10px 16px', borderRadius: 10, fontSize: 13,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{type}</div>
                <div style={{ color: '#94a3b8' }}>{count} crime{count !== 1 ? 's' : ''}</div>
            </div>
        );
    }
    return null;
};

function CrimeBarChart({ data }) {
    if (!data?.length) return <div className="no-data">No data available</div>;
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="type"
                    tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'Inter' }}
                    angle={-35} textAnchor="end"
                    tickLine={false} axisLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {data.map(entry => (
                        <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#6366f1'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default CrimeBarChart;
