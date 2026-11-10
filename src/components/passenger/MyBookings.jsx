import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyBookings, requestRefund } from "../../store/actions/PassengerAction"
import StatusBadge from "../common/StatusBadge"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import Ticket from "./Ticket"
import { formatDate, formatMoney, formatTime, getErrorMessage, label, today } from "../../utils/format"

const CANCELLABLE = ['CONFIRMED', 'PARTIALLY_CANCELLED']
const BOOKING_STATUSES = ['PENDING_PAYMENT', 'CONFIRMED', 'PARTIALLY_CANCELLED', 'CANCELLED', 'PAYMENT_FAILED', 'EXPIRED']

function MyBookings() {
    const bookings = useSelector(state => state.passenger.bookings)
    const dispatch = useDispatch()
    const [ticketId, setTicketId] = useState(null)
    const [cancelJourney, setCancelJourney] = useState(null)
    const [reason, setReason] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [upcomingPage, setUpcomingPage] = useState(0)
    const [othersPage, setOthersPage] = useState(0)

    useEffect(() => {
        dispatch(getMyBookings())
    }, [dispatch])

    const submitCancel = async (e) => {
        e.preventDefault()
        try {
            await dispatch(requestRefund({ journeyId: cancelJourney, reason }))
            setMsg('Cancellation requested. Admin will forward it to the airline for refund decision.')
            setCancelJourney(null)
            setReason("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    const isUpcoming = (b) => b.journeys.some(j => j.travelDate >= today())

    // Step 1: Filter by status and search text (PNR, flight, route)
    const filtered = bookings.filter(b => (!statusFilter || b.status === statusFilter)
        && `${b.pnr} ${b.journeys.map(j => `${j.airlineName} ${j.flightNumber} ${j.source} ${j.destination}`).join(' ')}`
            .toLowerCase().includes(search.trim().toLowerCase()))

    // Step 2: Split into upcoming and others, each list has its own pages
    const upcoming = filtered.filter(b => isUpcoming(b) && b.status !== 'EXPIRED' && b.status !== 'PAYMENT_FAILED')
    const others = filtered.filter(b => !upcoming.includes(b))
    const upcomingRows = upcoming.slice(upcomingPage * PAGE_SIZE, (upcomingPage + 1) * PAGE_SIZE)
    const othersRows = others.slice(othersPage * PAGE_SIZE, (othersPage + 1) * PAGE_SIZE)

    const changeSearch = (value) => {
        setSearch(value)
        setUpcomingPage(0)
        setOthersPage(0)
    }

    const changeStatus = (value) => {
        setStatusFilter(value)
        setUpcomingPage(0)
        setOthersPage(0)
    }

    const bookingCard = (b) => (
        <div className="card sf-card mb-3" key={b.bookingId}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                        <span className="fs-5 fw-bold font-monospace me-2">{b.pnr}</span>
                        <StatusBadge status={b.status} />
                        <div className="small text-muted">{label(b.tripType)} · {formatMoney(b.totalAmount)}</div>
                    </div>
                    {['CONFIRMED', 'PARTIALLY_CANCELLED', 'CANCELLED'].includes(b.status) &&
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setTicketId(ticketId === b.bookingId ? null : b.bookingId)}>
                            <i className="bi bi-ticket-perforated me-1"></i>{ticketId === b.bookingId ? 'Hide ticket' : 'View / Download ticket'}
                        </button>}
                </div>
                {b.journeys.map(j => (
                    <div className="sf-journey-row" key={j.journeyId}>
                        <div>
                            <b>{j.source} → {j.destination}</b> · {j.airlineName} {j.flightNumber}
                            <div className="small text-muted">{formatDate(j.travelDate)} · {formatTime(j.departureTime)} · {label(j.seatClass)} · Seats: {j.travellers.map(t => t.seatNumber).join(', ')}</div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <StatusBadge status={j.flightStatus} />
                            <StatusBadge status={j.status} />
                            {CANCELLABLE.includes(b.status) && j.status === 'CONFIRMED' && j.travelDate >= today() &&
                                <button className="btn btn-sm btn-outline-danger" onClick={() => setCancelJourney(j.journeyId)}>Cancel</button>}
                        </div>
                    </div>
                ))}
                {cancelJourney && b.journeys.some(j => j.journeyId === cancelJourney) && (
                    <form className="sf-cancel-box mt-2" onSubmit={(e) => submitCancel(e)}>
                        <div className="small mb-2">
                            <b>Cancellation rules:</b> 48+ hrs before departure → 80% refund · 24-48 hrs → 50% · under 24 hrs → no refund.
                            Final decision is made by the airline.
                        </div>
                        <div className="d-flex gap-2">
                            <input className="form-control form-control-sm" placeholder="Reason for cancellation" required
                                value={reason} onChange={(e) => setReason(e.target.value)} />
                            <button className="btn btn-sm btn-danger text-nowrap">Submit request</button>
                            <button type="button" className="btn btn-sm btn-light" onClick={() => setCancelJourney(null)}>Close</button>
                        </div>
                    </form>
                )}
                {ticketId === b.bookingId && <div className="mt-3"><Ticket booking={b} /></div>}
            </div>
        </div>
    )

    return (
        <>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <Alert msg={msg} type="success" onClose={() => setMsg("")} />
            <div className="d-flex justify-content-end gap-2 mb-3">
                <SearchBox value={search} onChange={changeSearch} placeholder="Search PNR / flight / city" />
                <FilterSelect value={statusFilter} onChange={changeStatus} allText="All bookings" options={BOOKING_STATUSES} />
            </div>
            <h4 className="sf-section-title">Upcoming trips ({upcoming.length})</h4>
            {upcoming.length === 0 && <p className="text-muted">No upcoming trips. Book one from the Book Flights tab.</p>}
            {upcomingRows.map(bookingCard)}
            <Pager page={upcomingPage} total={upcoming.length} onChange={setUpcomingPage} />
            <h4 className="sf-section-title mt-4">Completed / other bookings ({others.length})</h4>
            {others.length === 0 && <p className="text-muted">Nothing here yet.</p>}
            {othersRows.map(bookingCard)}
            <Pager page={othersPage} total={others.length} onChange={setOthersPage} />
        </>
    )
}

export default MyBookings
