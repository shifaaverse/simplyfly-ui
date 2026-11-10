import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyPayments } from "../../store/actions/PassengerAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDateTime, formatMoney, label } from "../../utils/format"

const PAYMENT_STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']

function MyPayments() {
    const payments = useSelector(state => state.passenger.payments)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getMyPayments())
    }, [dispatch])

    // Step 1: Filter by status and search text, then show only one page
    const shown = payments.filter(p => (!statusFilter || p.status === statusFilter)
        && `${p.pnr} ${p.transactionId}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Payment history</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search PNR / transaction id" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All payments" options={PAYMENT_STATUSES} />
                </div>
            </div>
            <div className="card sf-card">
                <table className="table align-middle mb-0">
                    <thead><tr><th>PNR</th><th>Transaction</th><th>Method</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead>
                    <tbody>
                        {shown.length === 0 && <EmptyRow cols={6} />}
                        {rows.map(p => (
                            <tr key={p.paymentId}>
                                <td className="fw-semibold">{p.pnr}</td>
                                <td className="font-monospace small">{p.transactionId || '-'}</td>
                                <td>{label(p.method)}</td>
                                <td>{formatMoney(p.amount)}</td>
                                <td><StatusBadge status={p.status} /></td>
                                <td>{formatDateTime(p.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default MyPayments
