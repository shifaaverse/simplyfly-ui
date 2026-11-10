import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { forwardComplaint, getAirlines, getAllComplaints } from "../../store/actions/AdminAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDateTime, getErrorMessage, label } from "../../utils/format"

const COMPLAINT_STATUSES = ['OPEN', 'FORWARDED_TO_AIRLINE', 'IN_PROGRESS', 'RESOLVED']

function AdminComplaints() {
    const complaints = useSelector(state => state.admin.complaints)
    const airlines = useSelector(state => state.admin.airlines)
    const dispatch = useDispatch()
    const [airlineChoice, setAirlineChoice] = useState({})
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getAllComplaints())
        dispatch(getAirlines('APPROVED'))
    }, [dispatch])

    const forward = async (c) => {
        try {
            await dispatch(forwardComplaint(c.complaintId, airlineChoice[c.complaintId]))
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: Filter by status and search text, then show only one page
    const shown = complaints.filter(c => (!statusFilter || c.status === statusFilter)
        && `${c.passengerName} ${c.pnr} ${c.subject} ${c.airlineName}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Complaints & Support</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search passenger / PNR / subject" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All status" options={COMPLAINT_STATUSES} />
                </div>
            </div>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>Passenger</th><th>PNR</th><th>Category</th><th>Complaint</th><th>Airline</th><th>Airline Response</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={8} />}
                            {rows.map(c => (
                                <tr key={c.complaintId}>
                                    <td>{c.passengerName}<div className="small text-muted">{formatDateTime(c.createdAt)}</div></td>
                                    <td>{c.pnr || '-'}</td>
                                    <td>{label(c.category)}</td>
                                    <td><b>{c.subject}</b><div className="small text-muted">{c.description}</div></td>
                                    <td>{c.airlineName || '-'}</td>
                                    <td className="small">{c.airlineResponse || '-'}</td>
                                    <td><StatusBadge status={c.status} /></td>
                                    <td className="text-end" style={{ minWidth: 200 }}>
                                        {c.status === 'OPEN' && (
                                            <div className="d-flex gap-1">
                                                {!c.pnr &&
                                                    <select className="form-select form-select-sm"
                                                        onChange={(e) => setAirlineChoice({ ...airlineChoice, [c.complaintId]: e.target.value })}>
                                                        <option value="">Airline...</option>
                                                        {airlines.map(a => <option key={a.airlineId} value={a.airlineId}>{a.name}</option>)}
                                                    </select>}
                                                <button className="btn btn-sm btn-primary text-nowrap" onClick={() => forward(c)}>Forward</button>
                                            </div>
                                        )}
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

export default AdminComplaints
