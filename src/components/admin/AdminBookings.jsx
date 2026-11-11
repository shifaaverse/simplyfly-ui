
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAllBookings,
    getAllPayments
} from "../../store/actions/AdminAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"

import {
    formatDate,
    formatDateTime,
    formatMoney,
    label
} from "../../utils/format"


// List of available booking statuses for filtering
const BOOKING_STATUSES = [
    'PENDING_PAYMENT',
    'CONFIRMED',
    'PARTIALLY_CANCELLED',
    'CANCELLED',
    'PAYMENT_FAILED',
    'EXPIRED'
]


function AdminBookings() {

    // Step 1: Get booking and payment details from the Redux store
    const bookings = useSelector(state => state.admin.bookings)
    const payments = useSelector(state => state.admin.payments)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 3: Create state variables for booking and payment management
    const [paymentFilter, setPaymentFilter] = useState("")
    const [bookingFilter, setBookingFilter] = useState("")
    const [bookingSearch, setBookingSearch] = useState("")
    const [paymentSearch, setPaymentSearch] = useState("")
    const [bookingPage, setBookingPage] = useState(0)
    const [paymentPage, setPaymentPage] = useState(0)


    // Step 4: Fetch all bookings when the component loads
    useEffect(() => {
        dispatch(getAllBookings())
    }, [dispatch])


    // Step 5: Fetch payments whenever the payment status filter changes
    useEffect(() => {
        dispatch(getAllPayments(paymentFilter))
    }, [dispatch, paymentFilter])


    // Step 6: Filter bookings based on status and search text
    const filteredBookings = bookings.filter(b =>
        (!bookingFilter || b.bookingStatus === bookingFilter)
        &&
        `${b.pnr} ${b.passengerName} ${b.airlineName} ${b.flightNumber}`
            .toLowerCase()
            .includes(bookingSearch.trim().toLowerCase())
    )

    // Display only the bookings belonging to the current page
    const bookingRows = filteredBookings.slice(
        bookingPage * PAGE_SIZE,
        (bookingPage + 1) * PAGE_SIZE
    )


    // Step 7: Filter payments based on search text
    // Payment status filtering is already handled by the backend
    const filteredPayments = payments.filter(p =>
        `${p.pnr} ${p.passengerName} ${p.transactionId}`
            .toLowerCase()
            .includes(paymentSearch.trim().toLowerCase())
    )

    // Display only the payments belonging to the current page
    const paymentRows = filteredPayments.slice(
        paymentPage * PAGE_SIZE,
        (paymentPage + 1) * PAGE_SIZE
    )


    // Step 8: Display the booking and payment management interface
    return (
        <>

            {/* ================= BOOKING MANAGEMENT ================= */}

            {/* Booking heading, search and status filter */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Booking Management
                </h4>

                <div className="d-flex gap-2">

                    {/* Search bookings by PNR, passenger or flight */}
                    <SearchBox
                        value={bookingSearch}
                        onChange={(v) => {
                            setBookingSearch(v)
                            setBookingPage(0)
                        }}
                        placeholder="Search PNR / passenger / flight"
                    />

                    {/* Filter bookings based on booking status */}
                    <FilterSelect
                        value={bookingFilter}
                        onChange={(v) => {
                            setBookingFilter(v)
                            setBookingPage(0)
                        }}
                        allText="All bookings"
                        options={BOOKING_STATUSES}
                    />

                </div>
            </div>


            {/* Display all filtered bookings in a table */}
            <div className="card sf-card mb-4">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Booking table column headings */}
                        <thead>
                            <tr>
                                <th>PNR</th>
                                <th>Passenger</th>
                                <th>Airline</th>
                                <th>Flight</th>
                                <th>Route</th>
                                <th>Travel Date</th>
                                <th>Journey</th>
                                <th>Amount</th>
                                <th>Booking</th>
                                <th>Journey Status</th>
                            </tr>
                        </thead>


                        {/* Display booking records */}
                        <tbody>

                            {/* Show an empty message when no bookings are found */}
                            {filteredBookings.length === 0 && <EmptyRow cols={10} />}

                            {/* Loop through the current page's booking records */}
                            {bookingRows.map(b => (

                                <tr key={`${b.bookingId}-${b.journeyType}`}>

                                    <td className="fw-semibold">
                                        {b.pnr}
                                    </td>

                                    <td>{b.passengerName}</td>

                                    <td>{b.airlineName}</td>

                                    <td>{b.flightNumber}</td>

                                    {/* Display source and destination */}
                                    <td>
                                        {b.source} → {b.destination}
                                    </td>

                                    {/* Format the travel date */}
                                    <td>
                                        {formatDate(b.travelDate)}
                                    </td>

                                    {/* Convert journey type into a readable label */}
                                    <td>
                                        {label(b.journeyType)}
                                    </td>

                                    {/* Display formatted booking amount */}
                                    <td>
                                        {formatMoney(b.amount)}
                                    </td>

                                    {/* Display booking status */}
                                    <td>
                                        <StatusBadge status={b.bookingStatus} />
                                    </td>

                                    {/* Display individual journey status */}
                                    <td>
                                        <StatusBadge status={b.journeyStatus} />
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for booking records */}
                <Pager
                    page={bookingPage}
                    total={filteredBookings.length}
                    onChange={setBookingPage}
                />

            </div>


            {/* ================= PAYMENT MANAGEMENT ================= */}

            {/* Payment heading, search and status filter */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Payment Management
                </h4>

                <div className="d-flex gap-2">

                    {/* Search payments by PNR, passenger or transaction ID */}
                    <SearchBox
                        value={paymentSearch}
                        onChange={(v) => {
                            setPaymentSearch(v)
                            setPaymentPage(0)
                        }}
                        placeholder="Search PNR / passenger / txn id"
                    />

                    {/* Filter payments based on payment status */}
                    <select
                        className="form-select form-select-sm w-auto"
                        value={paymentFilter}
                        onChange={(e) => {
                            setPaymentFilter(e.target.value)
                            setPaymentPage(0)
                        }}
                    >
                        <option value="">All payments</option>
                        <option>SUCCESS</option>
                        <option>FAILED</option>
                        <option>PENDING</option>
                    </select>

                </div>
            </div>


            {/* Display all filtered payments in a table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Payment table column headings */}
                        <thead>
                            <tr>
                                <th>Txn ID</th>
                                <th>PNR</th>
                                <th>Passenger</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>


                        {/* Display payment records */}
                        <tbody>

                            {/* Show an empty message when no payments are found */}
                            {filteredPayments.length === 0 && <EmptyRow cols={7} />}

                            {/* Loop through the current page's payment records */}
                            {paymentRows.map(p => (

                                <tr key={p.paymentId}>

                                    {/* Display transaction ID or '-' if unavailable */}
                                    <td className="font-monospace small">
                                        {p.transactionId || '-'}
                                    </td>

                                    <td className="fw-semibold">
                                        {p.pnr}
                                    </td>

                                    <td>{p.passengerName}</td>

                                    {/* Convert payment method into a readable label */}
                                    <td>
                                        {label(p.method)}
                                    </td>

                                    {/* Display formatted payment amount */}
                                    <td>
                                        {formatMoney(p.amount)}
                                    </td>

                                    {/* Display payment status */}
                                    <td>
                                        <StatusBadge status={p.status} />
                                    </td>

                                    {/* Display formatted payment date and time */}
                                    <td>
                                        {formatDateTime(p.createdAt)}
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for payment records */}
                <Pager
                    page={paymentPage}
                    total={filteredPayments.length}
                    onChange={setPaymentPage}
                />

            </div>

        </>
    )
}

export default AdminBookings
