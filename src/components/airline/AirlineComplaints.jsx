import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAirlineComplaints, respondComplaint } from "../../store/actions/AirlineAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { getErrorMessage, label } from "../../utils/format"

const COMPLAINT_STATUSES = ['FORWARDED_TO_AIRLINE', 'IN_PROGRESS', 'RESOLVED']

function AirlineComplaints() {
    const complaints = useSelector(state => state.airline.complaints)
    const dispatch = useDispatch()
    const [responses, setResponses] = useState({})
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getAirlineComplaints())
    }, [dispatch])

    const respond = async (complaintId, status) => {
        try {
            await dispatch(respondComplaint(complaintId, { response: responses[complaintId], status }))
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: Filter by status and search text, then show only one page
    const shown = complaints.filter(c => (!statusFilter || c.status === statusFilter)
        && `${c.passengerName} ${c.pnr} ${c.subject}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Complaints forwarded by Admin</h4>
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
                        <thead><tr><th>Passenger</th><th>PNR</th><th>Category</th><th>Complaint</th><th>Status</th><th style={{ minWidth: 320 }}>Response</th></tr></thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={6} />}
                            {rows.map(c => (
                                <tr key={c.complaintId}>
                                    <td>{c.passengerName}</td>
                                    <td>{c.pnr || '-'}</td>
                                    <td>{label(c.category)}</td>
                                    <td><b>{c.subject}</b><div className="small text-muted">{c.description}</div></td>
                                    <td><StatusBadge status={c.status} /></td>
                                    <td>
                                        {c.status === 'RESOLVED' ? <span className="small">{c.airlineResponse}</span> : (
                                            <div className="d-flex gap-1">
                                                <input className="form-control form-control-sm" placeholder="Reply to passenger"
                                                    defaultValue={c.airlineResponse || ''}
                                                    onChange={(e) => setResponses({ ...responses, [c.complaintId]: e.target.value })} />
                                                <button className="btn btn-sm btn-outline-primary text-nowrap" onClick={() => respond(c.complaintId, 'IN_PROGRESS')}>In progress</button>
                                                <button className="btn btn-sm btn-success" onClick={() => respond(c.complaintId, 'RESOLVED')}>Resolve</button>
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

export default AirlineComplaints
