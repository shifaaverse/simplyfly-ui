import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { approveRefund, getAirlineRefunds, rejectRefund } from "../../store/actions/AirlineAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatMoney, getErrorMessage } from "../../utils/format"

const REFUND_STATUSES = ['FORWARDED_TO_AIRLINE', 'APPROVED', 'REJECTED', 'PROCESSING', 'REFUNDED', 'FAILED']

function AirlineRefunds() {
    const refunds = useSelector(state => state.airline.refunds)
    const dispatch = useDispatch()
    const [reasons, setReasons] = useState({})
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getAirlineRefunds())
    }, [dispatch])

    const decide = async (action) => {
        try {
            await dispatch(action)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: Filter by status and search text, then show only one page
    const shown = refunds.filter(r => (!statusFilter || r.status === statusFilter)
        && `${r.pnr} ${r.passengerName} ${r.flightNumber}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="sf-section-title mb-0">Refund Requests</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search PNR / passenger / flight" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All status" options={REFUND_STATUSES} />
                </div>
            </div>
            <p className="text-muted small">
                Cancellation policy: 48+ hrs before departure → 80% refund · 24-48 hrs → 50% · under 24 hrs → no refund.
            </p>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>PNR</th><th>Passenger</th><th>Flight</th><th>Travel</th><th>Paid</th><th>Eligible Refund</th><th>Reason</th><th>Status</th><th style={{ minWidth: 280 }}>Decision</th></tr></thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={9} text="No refund requests found" />}
                            {rows.map(r => (
                                <tr key={r.refundId}>
                                    <td className="fw-semibold">{r.pnr}</td>
                                    <td>{r.passengerName}</td>
                                    <td>{r.flightNumber}</td>
                                    <td>{formatDate(r.travelDate)}</td>
                                    <td>{formatMoney(r.journeyAmount)}</td>
                                    <td className="fw-semibold">{formatMoney(r.refundAmount)}</td>
                                    <td className="small">{r.reason}</td>
                                    <td><StatusBadge status={r.status} /></td>
                                    <td>
                                        {r.status === 'FORWARDED_TO_AIRLINE' ? (
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-sm btn-success" onClick={() => decide(approveRefund(r.refundId))}>Approve</button>
                                                <input className="form-control form-control-sm" placeholder="Rejection reason"
                                                    onChange={(e) => setReasons({ ...reasons, [r.refundId]: e.target.value })} />
                                                <button className="btn btn-sm btn-outline-danger"
                                                    onClick={() => decide(rejectRefund(r.refundId, reasons[r.refundId]))}>Reject</button>
                                            </div>
                                        ) : <span className="small text-muted">{r.rejectionReason || 'Decided'}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default AirlineRefunds
