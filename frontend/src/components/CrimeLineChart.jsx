/**
 * CrimeLineChart.jsx — Multi-line area chart: crimes by month
 */
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'rgba(15,25,50,0.95)', color: '#f1f5f9',
                padding: '10px 16px', borderRadius: 10, fontSize: 13,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div style={{ color: '#94a3b8' }}>{payload[0]?.value} crime{payload[0]?.value !== 1 ? 's' : ''}</div>
            </div>
        );
    }
    return null;
};

function CrimeLineChart({ data }) {
    if (!data?.length) return <div className="no-data">No data available</div>;
    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 4 }}>
                <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 2 }} />
                <Area
                    type="monotone" dataKey="count"
                    stroke="#6366f1" strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#818cf8', stroke: 'rgba(99,102,241,0.3)', strokeWidth: 4 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default CrimeLineChart;
