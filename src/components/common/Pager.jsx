export const PAGE_SIZE = 20

// Step 1: Small pagination bar, the list is cut into pages of PAGE_SIZE records
function Pager({ page, total, onChange }) {
    const totalPages = Math.ceil(total / PAGE_SIZE)
    if (total === 0) return null
    const from = page * PAGE_SIZE + 1
    const to = Math.min((page + 1) * PAGE_SIZE, total)
    const pages = Array.from({ length: totalPages }, (_, i) => i)

    return (
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
            <span className="small text-muted">Showing {from}-{to} of {total}</span>
            {totalPages > 1 &&
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onChange(page - 1)}>Previous</button>
                    </li>
                    {pages.map(p => (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onChange(p)}>{p + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onChange(page + 1)}>Next</button>
                    </li>
                </ul>}
        </div>
    )
}

export default Pager
