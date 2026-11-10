import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addComplaint, getMyBookings, getMyComplaints } from "../../store/actions/PassengerAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDateTime, getErrorMessage, label } from "../../utils/format"

const COMPLAINT_STATUSES = ['OPEN', 'FORWARDED_TO_AIRLINE', 'IN_PROGRESS', 'RESOLVED']
const CATEGORIES = ['BOOKING', 'PAYMENT', 'REFUND', 'FLIGHT_DELAY', 'FLIGHT_CANCELLATION', 'PASSENGER_INFO', 'OTHER']

function MyComplaints() {
    const complaints = useSelector(state => state.passenger.complaints)
    const bookings = useSelector(state => state.passenger.bookings)
    const dispatch = useDispatch()
    const [bookingId, setBookingId] = useState("")
    const [category, setCategory] = useState("BOOKING")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getMyComplaints())
        dispatch(getMyBookings())
    }, [dispatch])

    const add = async (e) => {
        e.preventDefault()
        try {
            await dispatch(addComplaint({ bookingId: bookingId || null, category, subject, description }))
            setSubject(""); setDescription(""); setErrMsg("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: Filter by status and search text, then show only one page
    const shown = complaints.filter(c => (!statusFilter || c.status === statusFilter)
        && `${c.subject} ${c.pnr} ${c.airlineName}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <div className="row g-4">
            <div className="col-lg-4">
                <div className="card sf-card">
                    <div className="card-header bg-white fw-semibold">Raise a complaint</div>
                    <div className="card-body">
                        <Alert msg={errMsg} onClose={() => setErrMsg("")} />
                        <form onSubmit={(e) => add(e)}>
                            <label className="form-label small">Booking (optional)</label>
                            <select className="form-select mb-2" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
                                <option value="">Not related to a booking</option>
                                {bookings.map(b => <option key={b.bookingId} value={b.bookingId}>{b.pnr} · {b.journeys[0]?.source} → {b.journeys[0]?.destination}</option>)}
                            </select>
                            <label className="form-label small">Category</label>
                            <select className="form-select mb-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{label(c)}</option>)}
                            </select>
                            <label className="form-label small">Subject</label>
                            <input className="form-control mb-2" required value={subject} onChange={(e) => setSubject(e.target.value)} />
                            <label className="form-label small">Description</label>
                            <textarea className="form-control mb-3" rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} />
                            <button className="btn btn-primary w-100">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="sf-section-title mb-0">My complaints</h4>
                    <div className="d-flex gap-2">
                        <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search subject / PNR" />
                        <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                            allText="All status" options={COMPLAINT_STATUSES} />
                    </div>
                </div>
                <div className="card sf-card">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>Complaint</th><th>PNR</th><th>Airline</th><th>Response</th><th>Status</th></tr></thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={5} />}
                            {rows.map(c => (
                                <tr key={c.complaintId}>
                                    <td><b>{c.subject}</b><div className="small text-muted">{label(c.category)} · {formatDateTime(c.createdAt)}</div></td>
                                    <td>{c.pnr || '-'}</td>
                                    <td>{c.airlineName || '-'}</td>
                                    <td className="small">{c.airlineResponse || '-'}</td>
                                    <td><StatusBadge status={c.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pager page={page} total={shown.length} onChange={setPage} />
                </div>
            </div>
        </div>
    )
}

export default MyComplaints
