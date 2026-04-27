/**
 * FilterPanel.jsx — Expanded filters: 10 cities, 10 crime types, 12 months, 2020–2025, area
 */
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];
const TYPES = ['Theft', 'Assault', 'Robbery', 'Murder', 'Fraud', 'Kidnapping', 'Vandalism', 'Cybercrime', 'Drug Trafficking', 'Arson'];
const MONTHS = [
    { v: '', l: 'All Months' },
    { v: '1', l: 'January' }, { v: '2', l: 'February' }, { v: '3', l: 'March' },
    { v: '4', l: 'April' }, { v: '5', l: 'May' }, { v: '6', l: 'June' },
    { v: '7', l: 'July' }, { v: '8', l: 'August' }, { v: '9', l: 'September' },
    { v: '10', l: 'October' }, { v: '11', l: 'November' }, { v: '12', l: 'December' },
];
const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

const CITY_AREAS = {
    Mumbai: ['Dharavi', 'Andheri', 'Bandra', 'Kurla', 'Borivali', 'Worli'],
    Delhi: ['Connaught Place', 'Karol Bagh', 'Dwarka', 'Rohini', 'Lajpat Nagar', 'Saket'],
    Bangalore: ['Koramangala', 'Whitefield', 'Indiranagar', 'Hebbal', 'Electronic City', 'BTM Layout'],
    Chennai: ['T. Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Tambaram', 'Mylapore'],
    Kolkata: ['Park Street', 'Howrah', 'Salt Lake', 'Dum Dum', 'Behala', 'Tollygunge'],
    Hyderabad: ['Banjara Hills', 'Secunderabad', 'Hitech City', 'Kukatpally', 'LB Nagar', 'Ameerpet'],
    Pune: ['Koregaon Park', 'Kothrud', 'Hadapsar', 'Wakad', 'Baner', 'Viman Nagar'],
    Ahmedabad: ['Navrangpura', 'Maninagar', 'Vastrapur', 'Bodakdev', 'Gota', 'Bopal'],
    Jaipur: ['Pink City', 'Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'Tonk Road', 'C-Scheme'],
    Surat: ['Adajan', 'Vesu', 'Katargam', 'Udhna', 'Rander', 'Althan'],
};

function FilterPanel({ filters, onChange }) {
    const handle = (key) => (e) => {
        const newFilters = { ...filters, [key]: e.target.value };
        if (key === 'city') newFilters.area = ''; // reset stale area when city changes
        onChange(newFilters);
    };
    const reset = () => onChange({ city: '', type: '', area: '', month: '', year: '' });
    const areas = filters.city ? CITY_AREAS[filters.city] || [] : [];

    return (
        <div className="filters-grid">
            <div className="filter-group">
                <label htmlFor="fc">City</label>
                <select id="fc" value={filters.city} onChange={handle('city')}>
                    <option value="">All Cities</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="fa">Area</label>
                <select id="fa" value={filters.area} onChange={handle('area')} disabled={!filters.city}>
                    <option value="">All Areas</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="ft">Crime Type</label>
                <select id="ft" value={filters.type} onChange={handle('type')}>
                    <option value="">All Types</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="fm">Month</label>
                <select id="fm" value={filters.month} onChange={handle('month')}>
                    {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="fy">Year</label>
                <select id="fy" value={filters.year} onChange={handle('year')}>
                    <option value="">All Years</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            <button className="btn-reset" onClick={reset} id="btn-reset">↺ Reset</button>
        </div>
    );
}

export default FilterPanel;
