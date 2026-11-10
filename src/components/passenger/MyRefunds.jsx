import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyRefunds } from "../../store/actions/PassengerAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatMoney } from "../../utils/format"

const REFUND_STATUSES = ['REQUESTED', 'FORWARDED_TO_AIRLINE', 'APPROVED', 'REJECTED', 'PROCESSING', 'REFUNDED', 'FAILED']

function MyRefunds() {
    const refunds = useSelector(state => state.passenger.refunds)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getMyRefunds())
    }, [dispatch])

    // Step 1: Filter by status and search text, then show only one page
    const shown = refunds.filter(r => (!statusFilter || r.status === statusFilter)
        && `${r.pnr} ${r.airlineName} ${r.flightNumber}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="sf-section-title mb-0">Cancellation & refund status</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search PNR / flight" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All status" options={REFUND_STATUSES} />
                </div>
            </div>
            <p className="small text-muted">REQUESTED → FORWARDED TO AIRLINE → REFUNDED / REJECTED</p>
            <div className="card sf-card">
                <table className="table align-middle mb-0">
                    <thead><tr><th>PNR</th><th>Flight</th><th>Travel</th><th>Paid</th><th>Refund</th><th>Reason</th><th>Status</th></tr></thead>
                    <tbody>
                        {shown.length === 0 && <EmptyRow cols={7} />}
                        {rows.map(r => (
                            <tr key={r.refundId}>
                                <td className="fw-semibold">{r.pnr}</td>
                                <td>{r.airlineName} {r.flightNumber}</td>
                                <td>{formatDate(r.travelDate)}</td>
                                <td>{formatMoney(r.journeyAmount)}</td>
                                <td className="fw-semibold">{formatMoney(r.refundAmount)}</td>
                                <td className="small">{r.reason}{r.rejectionReason && <div className="text-danger">Airline: {r.rejectionReason}</div>}</td>
                                <td><StatusBadge status={r.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default MyRefunds
