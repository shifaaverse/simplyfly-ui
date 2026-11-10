import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAirlineBookings } from "../../store/actions/AirlineAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, label } from "../../utils/format"

const BOOKING_STATUSES = ['PENDING_PAYMENT', 'CONFIRMED', 'PARTIALLY_CANCELLED', 'CANCELLED', 'PAYMENT_FAILED', 'EXPIRED']

function AirlineBookings() {
    const bookings = useSelector(state => state.airline.bookings)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getAirlineBookings())
    }, [dispatch])

    // Step 1: Filter by booking status and search text, then show only one page
    const shown = bookings.filter(b => (!statusFilter || b.bookingStatus === statusFilter)
        && `${b.pnr} ${b.travellerName} ${b.flightNumber}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Passenger Bookings <small className="text-muted fs-6">(only your flights)</small></h4>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search PNR / passenger / flight" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All bookings" options={BOOKING_STATUSES} />
                </div>
            </div>
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>Booking</th><th>PNR</th><th>Passenger</th><th>Category</th><th>Travel Date</th><th>Flight</th><th>Seat</th><th>Booking</th><th>Journey</th></tr></thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={9} />}
                            {rows.map(b => (
                                <tr key={`${b.bookingId}-${b.travellerName}-${b.seatNumber}`}>
                                    <td>#{b.bookingId}</td>
                                    <td className="fw-semibold">{b.pnr}</td>
                                    <td>{b.travellerName}</td>
                                    <td>{label(b.category)}</td>
                                    <td>{formatDate(b.travelDate)}</td>
                                    <td>{b.flightNumber}</td>
                                    <td>{b.seatNumber || 'Lap infant'}</td>
                                    <td><StatusBadge status={b.bookingStatus} /></td>
                                    <td><StatusBadge status={b.journeyStatus} /></td>
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

export default AirlineBookings
