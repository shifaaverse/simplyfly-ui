import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBookings, getAllPayments } from "../../store/actions/AdminAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatDateTime, formatMoney, label } from "../../utils/format"

const BOOKING_STATUSES = ['PENDING_PAYMENT', 'CONFIRMED', 'PARTIALLY_CANCELLED', 'CANCELLED', 'PAYMENT_FAILED', 'EXPIRED']

function AdminBookings() {
    const bookings = useSelector(state => state.admin.bookings)
    const payments = useSelector(state => state.admin.payments)
    const dispatch = useDispatch()
    const [paymentFilter, setPaymentFilter] = useState("")
    const [bookingFilter, setBookingFilter] = useState("")
    const [bookingSearch, setBookingSearch] = useState("")
    const [paymentSearch, setPaymentSearch] = useState("")
    const [bookingPage, setBookingPage] = useState(0)
    const [paymentPage, setPaymentPage] = useState(0)

    useEffect(() => {
        dispatch(getAllBookings())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllPayments(paymentFilter))
    }, [dispatch, paymentFilter])

    // Step 2: Filter by booking status and search text, then show only one page
    const filteredBookings = bookings.filter(b => (!bookingFilter || b.bookingStatus === bookingFilter)
        && `${b.pnr} ${b.passengerName} ${b.airlineName} ${b.flightNumber}`.toLowerCase().includes(bookingSearch.trim().toLowerCase()))
    const bookingRows = filteredBookings.slice(bookingPage * PAGE_SIZE, (bookingPage + 1) * PAGE_SIZE)

    // Step 3: Same for payments (the status filter comes from the backend)
    const filteredPayments = payments.filter(p =>
        `${p.pnr} ${p.passengerName} ${p.transactionId}`.toLowerCase().includes(paymentSearch.trim().toLowerCase()))
    const paymentRows = filteredPayments.slice(paymentPage * PAGE_SIZE, (paymentPage + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Booking Management</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={bookingSearch} onChange={(v) => { setBookingSearch(v); setBookingPage(0) }}
                        placeholder="Search PNR / passenger / flight" />
                    <FilterSelect value={bookingFilter} onChange={(v) => { setBookingFilter(v); setBookingPage(0) }}
                        allText="All bookings" options={BOOKING_STATUSES} />
                </div>
            </div>
            <div className="card sf-card mb-4">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>PNR</th><th>Passenger</th><th>Airline</th><th>Flight</th><th>Route</th><th>Travel Date</th><th>Journey</th><th>Amount</th><th>Booking</th><th>Journey Status</th></tr></thead>
                        <tbody>
                            {filteredBookings.length === 0 && <EmptyRow cols={10} />}
                            {bookingRows.map(b => (
                                <tr key={`${b.bookingId}-${b.journeyType}`}>
                                    <td className="fw-semibold">{b.pnr}</td>
                                    <td>{b.passengerName}</td>
                                    <td>{b.airlineName}</td>
                                    <td>{b.flightNumber}</td>
                                    <td>{b.source} → {b.destination}</td>
                                    <td>{formatDate(b.travelDate)}</td>
                                    <td>{label(b.journeyType)}</td>
                                    <td>{formatMoney(b.amount)}</td>
                                    <td><StatusBadge status={b.bookingStatus} /></td>
                                    <td><StatusBadge status={b.journeyStatus} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pager page={bookingPage} total={filteredBookings.length} onChange={setBookingPage} />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Payment Management</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={paymentSearch} onChange={(v) => { setPaymentSearch(v); setPaymentPage(0) }}
                        placeholder="Search PNR / passenger / txn id" />
                    <select className="form-select form-select-sm w-auto" value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setPaymentPage(0) }}>
                        <option value="">All payments</option>
                        <option>SUCCESS</option>
                        <option>FAILED</option>
                        <option>PENDING</option>
                    </select>
                </div>
            </div>
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>Txn ID</th><th>PNR</th><th>Passenger</th><th>Method</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead>
                        <tbody>
                            {filteredPayments.length === 0 && <EmptyRow cols={7} />}
                            {paymentRows.map(p => (
                                <tr key={p.paymentId}>
                                    <td className="font-monospace small">{p.transactionId || '-'}</td>
                                    <td className="fw-semibold">{p.pnr}</td>
                                    <td>{p.passengerName}</td>
                                    <td>{label(p.method)}</td>
                                    <td>{formatMoney(p.amount)}</td>
                                    <td><StatusBadge status={p.status} /></td>
                                    <td>{formatDateTime(p.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pager page={paymentPage} total={filteredPayments.length} onChange={setPaymentPage} />
            </div>
        </>
    )
}

export default AdminBookings
