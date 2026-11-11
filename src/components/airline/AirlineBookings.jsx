import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAirlineBookings
} from "../../store/actions/AirlineAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"

import {
    formatDate,
    label
} from "../../utils/format"


// Step 1: List of available booking statuses for filtering
const BOOKING_STATUSES = [
    'PENDING_PAYMENT',
    'CONFIRMED',
    'PARTIALLY_CANCELLED',
    'CANCELLED',
    'PAYMENT_FAILED',
    'EXPIRED'
]


function AirlineBookings() {

    // Step 2: Get booking records from the Redux store
    const bookings = useSelector(state => state.airline.bookings)

    // Step 3: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 4: Create state variables to manage bookings
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)


    // Step 5: Fetch airline bookings when the component loads
    useEffect(() => {

        // Get bookings belonging to the logged-in airline
        dispatch(getAirlineBookings())

    }, [dispatch])


    // Step 6: Filter bookings based on status and search text
    const shown = bookings.filter(b =>
        (!statusFilter || b.bookingStatus === statusFilter)
        &&
        `${b.pnr} ${b.travellerName} ${b.flightNumber}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the bookings belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 7: Display the airline booking management interface
    return (
        <>

            {/* Page heading, search and status filter */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Passenger Bookings

                    <small className="text-muted fs-6">
                        (only your flights)
                    </small>
                </h4>

                <div className="d-flex gap-2">

                    {/* Search bookings by PNR, passenger or flight */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search PNR / passenger / flight"
                    />

                    {/* Filter bookings based on booking status */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All bookings"
                        options={BOOKING_STATUSES}
                    />

                </div>
            </div>


            {/* Display all filtered bookings in a table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Booking table column headings */}
                        <thead>
                            <tr>
                                <th>Booking</th>
                                <th>PNR</th>
                                <th>Passenger</th>
                                <th>Category</th>
                                <th>Travel Date</th>
                                <th>Flight</th>
                                <th>Seat</th>
                                <th>Booking</th>
                                <th>Journey</th>
                            </tr>
                        </thead>


                        {/* Display passenger booking records */}
                        <tbody>

                            {/* Show an empty message when no bookings are found */}
                            {shown.length === 0 && <EmptyRow cols={9} />}

                            {/* Loop through the current page's booking records */}
                            {rows.map(b => (

                                <tr key={`${b.bookingId}-${b.travellerName}-${b.seatNumber}`}>

                                    {/* Display booking ID */}
                                    <td>
                                        #{b.bookingId}
                                    </td>

                                    {/* Display booking PNR */}
                                    <td className="fw-semibold">
                                        {b.pnr}
                                    </td>

                                    {/* Display passenger name */}
                                    <td>
                                        {b.travellerName}
                                    </td>

                                    {/* Convert passenger category into a readable label */}
                                    <td>
                                        {label(b.category)}
                                    </td>

                                    {/* Display formatted travel date */}
                                    <td>
                                        {formatDate(b.travelDate)}
                                    </td>

                                    {/* Display flight number */}
                                    <td>
                                        {b.flightNumber}
                                    </td>

                                    {/* Display seat number or Lap infant */}
                                    <td>
                                        {b.seatNumber || 'Lap infant'}
                                    </td>

                                    {/* Display overall booking status */}
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
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>

        </>
    )
}

export default AirlineBookings
