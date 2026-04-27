/**
 * CrimeTable.jsx — Paginated dark table with area column and type badges
 */
import { useState } from 'react';

const PAGE_SIZE = 12;

function fmt(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function CrimeTable({ crimes }) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(crimes.length / PAGE_SIZE));
    const paged = crimes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    if (page > totalPages && totalPages > 0) setPage(1);

    return (
        <>
            <div className="record-count">{crimes.length.toLocaleString()} record(s) found</div>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>City</th>
                            <th>Area</th>
                            <th>Crime Type</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr><td colSpan={5}><div className="no-data">No records match filters.</div></td></tr>
                        ) : (
                            paged.map((c, i) => (
                                <tr key={c._id || i}>
                                    <td style={{ color: 'var(--text3)' }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{c.city}</td>
                                    <td style={{ color: 'var(--text2)' }}>{c.area}</td>
                                    <td>
                                        <span className={`badge badge-${c.type.replace(/\s+/g, '')}`}>{c.type}</span>
                                    </td>
                                    <td style={{ color: 'var(--text2)' }}>{fmt(c.date)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} id="btn-prev">← Prev</button>
                    <span className="cur">Page {page} / {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} id="btn-next">Next →</button>
                </div>
            )}
        </>
    );
}

export default CrimeTable;
