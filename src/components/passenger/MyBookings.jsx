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

// Step 1: Define the booking statuses that allow cancellation.
const CANCELLABLE = ['CONFIRMED', 'PARTIALLY_CANCELLED']

// Store all the booking statuses available in the filter.
const BOOKING_STATUSES = [
    'PENDING_PAYMENT',
    'CONFIRMED',
    'PARTIALLY_CANCELLED',
    'CANCELLED',
    'PAYMENT_FAILED',
    'EXPIRED'
]

// Step 2: Create the MyBookings component.
function MyBookings() {

    // Get the passenger's bookings from Redux.
    const bookings = useSelector(state => state.passenger.bookings)

    const dispatch = useDispatch()

    // Step 3: Store ticket, cancellation and message details.
    const [ticketId, setTicketId] = useState(null)
    const [cancelJourney, setCancelJourney] = useState(null)
    const [reason, setReason] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")

    // Store search text and selected booking status.
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    // Maintain separate pagination for upcoming and other bookings.
    const [upcomingPage, setUpcomingPage] = useState(0)
    const [othersPage, setOthersPage] = useState(0)

    // Step 4: Fetch the passenger's bookings when the component loads.
    useEffect(() => {
        dispatch(getMyBookings())
    }, [dispatch])

    // Step 5: Submit a cancellation/refund request.
    const submitCancel = async (e) => {

        // Prevent the browser from refreshing the page.
        e.preventDefault()

        try {
            // Send the journey ID and cancellation reason to the backend.
            await dispatch(requestRefund({
                journeyId: cancelJourney,
                reason
            }))

            // Display a success message after submitting the request.
            setMsg('Cancellation requested. Admin will forward it to the airline for refund decision.')

            // Close the cancellation form and clear the reason.
            setCancelJourney(null)
            setReason("")
        }
        catch (err) {
            // Display the error returned by the API.
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 6: Check whether a booking contains an upcoming journey.
    const isUpcoming = (b) =>
        b.journeys.some(j => j.travelDate >= today())

    // Step 7: Filter bookings by status and search text.
    const filtered = bookings.filter(b =>
        (!statusFilter || b.status === statusFilter)
        &&
        `${b.pnr} ${b.journeys.map(j =>
            `${j.airlineName} ${j.flightNumber} ${j.source} ${j.destination}`
        ).join(' ')}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Step 8: Separate upcoming bookings from completed and other bookings.
    const upcoming = filtered.filter(b =>
        isUpcoming(b) &&
        b.status !== 'EXPIRED' &&
        b.status !== 'PAYMENT_FAILED'
    )

    const others = filtered.filter(b => !upcoming.includes(b))

    // Get only the records belonging to the current page.
    const upcomingRows = upcoming.slice(
        upcomingPage * PAGE_SIZE,
        (upcomingPage + 1) * PAGE_SIZE
    )

    const othersRows = others.slice(
        othersPage * PAGE_SIZE,
        (othersPage + 1) * PAGE_SIZE
    )

    // Step 9: Update search text and reset both page numbers.
    const changeSearch = (value) => {
        setSearch(value)
        setUpcomingPage(0)
        setOthersPage(0)
    }

    // Update status filter and reset both page numbers.
    const changeStatus = (value) => {
        setStatusFilter(value)
        setUpcomingPage(0)
        setOthersPage(0)
    }

    // Step 10: Reusable function to display one booking card.
    const bookingCard = (b) => (
        <div className="card sf-card mb-3" key={b.bookingId}>
            <div className="card-body">

                {/* Display PNR, booking status, trip type and total amount. */}
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                        <span className="fs-5 fw-bold font-monospace me-2">
                            {b.pnr}
                        </span>

                        <StatusBadge status={b.status} />

                        <div className="small text-muted">
                            {label(b.tripType)} · {formatMoney(b.totalAmount)}
                        </div>
                    </div>

                    {/* Show ticket button for eligible booking statuses. */}
                    {['CONFIRMED', 'PARTIALLY_CANCELLED', 'CANCELLED'].includes(b.status) &&
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setTicketId(
                                ticketId === b.bookingId ? null : b.bookingId
                            )}
                        >
                            <i className="bi bi-ticket-perforated me-1"></i>
                            {ticketId === b.bookingId
                                ? 'Hide ticket'
                                : 'View / Download ticket'}
                        </button>}
                </div>

                {/* Step 11: Display every journey inside this booking. */}
                {b.journeys.map(j => (
                    <div className="sf-journey-row" key={j.journeyId}>
                        <div>
                            <b>{j.source} → {j.destination}</b>
                            {' · '}{j.airlineName} {j.flightNumber}

                            <div className="small text-muted">
                                {formatDate(j.travelDate)}
                                {' · '}{formatTime(j.departureTime)}
                                {' · '}{label(j.seatClass)}
                                {' · Seats: '}
                                {j.travellers.map(t => t.seatNumber).join(', ')}
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">

                            {/* Display flight status and journey status. */}
                            <StatusBadge status={j.flightStatus} />
                            <StatusBadge status={j.status} />

                            {/* Show Cancel button only when cancellation is allowed. */}
                            {CANCELLABLE.includes(b.status) &&
                                j.status === 'CONFIRMED' &&
                                j.travelDate >= today() &&
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setCancelJourney(j.journeyId)}
                                >
                                    Cancel
                                </button>}
                        </div>
                    </div>
                ))}

                {/* Step 12: Display cancellation form for the selected journey. */}
                {cancelJourney &&
                    b.journeys.some(j => j.journeyId === cancelJourney) && (
                        <form
                            className="sf-cancel-box mt-2"
                            onSubmit={(e) => submitCancel(e)}
                        >
                            <div className="small mb-2">
                                <b>Cancellation rules:</b>
                                48+ hrs before departure → 80% refund ·
                                24-48 hrs → 50% · under 24 hrs → no refund.
                                Final decision is made by the airline.
                            </div>

                            <div className="d-flex gap-2">
                                <input
                                    className="form-control form-control-sm"
                                    placeholder="Reason for cancellation"
                                    required
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />

                                <button
                                    type="submit"
                                    className="btn btn-sm btn-danger text-nowrap"
                                >
                                    Submit request
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-light"
                                    onClick={() => setCancelJourney(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    )}

                {/* Display the ticket when its booking ID is selected. */}
                {ticketId === b.bookingId &&
                    <div className="mt-3">
                        <Ticket booking={b} />
                    </div>}
            </div>
        </div>
    )

    // Step 13: Display bookings, filters and pagination.
    return (
        <>
            {/* Display error and success messages. */}
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <Alert msg={msg} type="success" onClose={() => setMsg("")} />

            {/* Search and status filter controls. */}
            <div className="d-flex justify-content-end gap-2 mb-3">
                <SearchBox
                    value={search}
                    onChange={changeSearch}
                    placeholder="Search PNR / flight / city"
                />

                <FilterSelect
                    value={statusFilter}
                    onChange={changeStatus}
                    allText="All bookings"
                    options={BOOKING_STATUSES}
                />
            </div>

            {/* Step 14: Display upcoming trips. */}
            <h4 className="sf-section-title">
                Upcoming trips ({upcoming.length})
            </h4>

            {upcoming.length === 0 &&
                <p className="text-muted">
                    No upcoming trips. Book one from the Book Flights tab.
                </p>}

            {upcomingRows.map(bookingCard)}

            {/* Pagination for upcoming trips. */}
            <Pager
                page={upcomingPage}
                total={upcoming.length}
                onChange={setUpcomingPage}
            />

            {/* Step 15: Display completed and other bookings. */}
            <h4 className="sf-section-title mt-4">
                Completed / other bookings ({others.length})
            </h4>

            {others.length === 0 &&
                <p className="text-muted">
                    Nothing here yet.
                </p>}

            {othersRows.map(bookingCard)}

            {/* Separate pagination for other bookings. */}
            <Pager
                page={othersPage}
                total={others.length}
                onChange={setOthersPage}
            />
        </>
    )
}

export default MyBookings
