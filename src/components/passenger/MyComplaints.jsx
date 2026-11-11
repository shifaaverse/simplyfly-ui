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

// Step 1: Store the available complaint statuses.
const COMPLAINT_STATUSES = [
    'OPEN',
    'FORWARDED_TO_AIRLINE',
    'IN_PROGRESS',
    'RESOLVED'
]

// Store the available complaint categories.
const CATEGORIES = [
    'BOOKING',
    'PAYMENT',
    'REFUND',
    'FLIGHT_DELAY',
    'FLIGHT_CANCELLATION',
    'PASSENGER_INFO',
    'OTHER'
]

// Step 2: Create the MyComplaints component.
function MyComplaints() {

    // Get complaints and bookings from Redux.
    const complaints = useSelector(state => state.passenger.complaints)
    const bookings = useSelector(state => state.passenger.bookings)

    const dispatch = useDispatch()

    // Step 3: Store the complaint form values.
    const [bookingId, setBookingId] = useState("")
    const [category, setCategory] = useState("BOOKING")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")

    // Store error message, search text and status filter.
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    // Store the current pagination page.
    const [page, setPage] = useState(0)

    // Step 4: Fetch complaints and bookings when the component loads.
    useEffect(() => {
        dispatch(getMyComplaints())
        dispatch(getMyBookings())
    }, [dispatch])

    // Step 5: Submit a new complaint.
    const add = async (e) => {

        // Prevent the browser from refreshing the page.
        e.preventDefault()

        try {
            // Send complaint details to the backend through Redux.
            await dispatch(addComplaint({
                bookingId: bookingId || null,
                category,
                subject,
                description
            }))

            // Clear the subject and description after successful submission.
            setSubject("")
            setDescription("")
            setErrMsg("")
        }
        catch (err) {
            // Display the error returned by the API.
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 6: Filter complaints by status and search text.
    const shown = complaints.filter(c =>
        (!statusFilter || c.status === statusFilter)
        &&
        `${c.subject} ${c.pnr} ${c.airlineName}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Get only the complaints belonging to the current page.
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    // Step 7: Display the complaint form and complaint history.
    return (
        <div className="row g-4">

            {/* Left side: Raise a complaint form. */}
            <div className="col-lg-4">
                <div className="card sf-card">

                    <div className="card-header bg-white fw-semibold">
                        Raise a complaint
                    </div>

                    <div className="card-body">

                        <Alert msg={errMsg} onClose={() => setErrMsg("")} />

                        <form onSubmit={(e) => add(e)}>

                            {/* Select a booking if the complaint is booking-related. */}
                            <label htmlFor="complaint-booking" className="form-label small">
                                Booking (optional)
                            </label>

                            <select
                                id="complaint-booking"
                                className="form-select mb-2"
                                value={bookingId}
                                onChange={(e) => setBookingId(e.target.value)}
                            >
                                <option value="">Not related to a booking</option>

                                {bookings.map(b => (
                                    <option key={b.bookingId} value={b.bookingId}>
                                        {b.pnr} · {b.journeys[0]?.source} → {b.journeys[0]?.destination}
                                    </option>
                                ))}
                            </select>

                            {/* Select the complaint category. */}
                            <label htmlFor="complaint-category" className="form-label small">
                                Category
                            </label>

                            <select
                                id="complaint-category"
                                className="form-select mb-2"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>
                                        {label(c)}
                                    </option>
                                ))}
                            </select>

                            {/* Enter the complaint subject. */}
                            <label htmlFor="complaint-subject" className="form-label small">
                                Subject
                            </label>

                            <input
                                id="complaint-subject"
                                className="form-control mb-2"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />

                            {/* Enter the full complaint description. */}
                            <label htmlFor="complaint-description" className="form-label small">
                                Description
                            </label>

                            <textarea
                                id="complaint-description"
                                className="form-control mb-3"
                                rows={3}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {/* Submit the complaint. */}
                            <button type="submit" className="btn btn-primary w-100">
                                Submit
                            </button>

                        </form>
                    </div>
                </div>
            </div>

            {/* Right side: Display the passenger's complaints. */}
            <div className="col-lg-8">

                {/* Search and status filter controls. */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="sf-section-title mb-0">
                        My complaints
                    </h4>

                    <div className="d-flex gap-2">

                        <SearchBox
                            value={search}
                            onChange={(v) => {
                                setSearch(v)
                                setPage(0)
                            }}
                            placeholder="Search subject / PNR"
                        />

                        <FilterSelect
                            value={statusFilter}
                            onChange={(v) => {
                                setStatusFilter(v)
                                setPage(0)
                            }}
                            allText="All status"
                            options={COMPLAINT_STATUSES}
                        />

                    </div>
                </div>

                {/* Step 8: Display complaint details in a table. */}
                <div className="card sf-card">
                    <table className="table align-middle mb-0">

                        <thead>
                            <tr>
                                <th>Complaint</th>
                                <th>PNR</th>
                                <th>Airline</th>
                                <th>Response</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* Display an empty message when no complaints match. */}
                            {shown.length === 0 &&
                                <EmptyRow cols={5} />}

                            {/* Display the complaints for the current page. */}
                            {rows.map(c => (
                                <tr key={c.complaintId}>

                                    <td>
                                        <b>{c.subject}</b>
                                        <div className="small text-muted">
                                            {label(c.category)} · {formatDateTime(c.createdAt)}
                                        </div>
                                    </td>

                                    <td>{c.pnr || '-'}</td>

                                    <td>{c.airlineName || '-'}</td>

                                    <td className="small">
                                        {c.airlineResponse || '-'}
                                    </td>

                                    <td>
                                        <StatusBadge status={c.status} />
                                    </td>

                                </tr>
                            ))}

                        </tbody>
                    </table>

                    {/* Pagination for the complaint list. */}
                    <Pager
                        page={page}
                        total={shown.length}
                        onChange={setPage}
                    />

                </div>
            </div>
        </div>
    )
}

export default MyComplaints
