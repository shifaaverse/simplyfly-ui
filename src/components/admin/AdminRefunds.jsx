import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { forwardRefund, getAllRefunds } from "../../store/actions/AdminAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatMoney, getErrorMessage } from "../../utils/format"

const REFUND_STATUSES = ['REQUESTED', 'FORWARDED_TO_AIRLINE', 'APPROVED', 'REJECTED', 'PROCESSING', 'REFUNDED', 'FAILED']

function AdminRefunds() {
    const refunds = useSelector(state => state.admin.refunds)
    const dispatch = useDispatch()
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getAllRefunds())
    }, [dispatch])

    const forward = async (id) => {
        try {
            await dispatch(forwardRefund(id))
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: Filter by status and search text, then show only one page
    const shown = refunds.filter(r => (!statusFilter || r.status === statusFilter)
        && `${r.pnr} ${r.passengerName} ${r.airlineName} ${r.flightNumber}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="sf-section-title mb-0">Cancellation & Refund Requests</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search PNR / passenger / flight" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All status" options={REFUND_STATUSES} />
                </div>
            </div>
            <p className="text-muted small">Admin forwards each request to the airline. The airline makes the final decision.</p>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>PNR</th><th>Passenger</th><th>Airline</th><th>Flight</th><th>Travel</th><th>Paid</th><th>Eligible Refund</th><th>Reason</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={10} />}
                            {rows.map(r => (
                                <tr key={r.refundId}>
                                    <td className="fw-semibold">{r.pnr}</td>
                                    <td>{r.passengerName}</td>
                                    <td>{r.airlineName}</td>
                                    <td>{r.flightNumber}</td>
                                    <td>{formatDate(r.travelDate)}</td>
                                    <td>{formatMoney(r.journeyAmount)}</td>
                                    <td>{formatMoney(r.refundAmount)}</td>
                                    <td className="small">{r.reason}{r.rejectionReason && <div className="text-danger">Rejected: {r.rejectionReason}</div>}</td>
                                    <td><StatusBadge status={r.status} /></td>
                                    <td className="text-end">
                                        {r.status === 'REQUESTED' &&
                                            <button className="btn btn-sm btn-primary text-nowrap" onClick={() => forward(r.refundId)}>
                                                Forward to Airline
                                            </button>}
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

export default AdminRefunds
