/**
 * DonutChart.jsx — Recharts PieChart (donut style) for crime type distribution
 */
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TYPE_COLORS = {
    Theft: '#6366f1', Assault: '#ef4444', Robbery: '#f97316',
    Murder: '#dc2626', Fraud: '#06b6d4', Kidnapping: '#ec4899',
    Vandalism: '#fbbf24', Cybercrime: '#c084fc',
    'Drug Trafficking': '#10b981', Arson: '#fb923c',
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        const { name, value } = payload[0];
        const total = payload[0].payload.total;
        return (
            <div style={{
                background: 'rgba(15,25,50,0.95)', color: '#f1f5f9',
                padding: '10px 14px', borderRadius: 10, fontSize: 12,
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                <div style={{ fontWeight: 700 }}>{name}</div>
                <div style={{ color: '#94a3b8' }}>{value} cases · {Math.round((value / total) * 100)}%</div>
            </div>
        );
    }
    return null;
};

function DonutChart({ data }) {
    if (!data?.length) return <div className="no-data">No data available</div>;
    const total = data.reduce((s, d) => s + d.count, 0);
    const pieData = data.map(d => ({ name: d.type, value: d.count, total }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {pieData.map(entry => (
                        <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || '#6366f1'} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    iconType="circle" iconSize={8}
                    formatter={(v) => <span style={{ fontSize: 10, color: '#94a3b8' }}>{v}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default DonutChart;
