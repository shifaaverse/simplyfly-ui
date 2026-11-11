
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAllFlights
} from "../../store/actions/AdminAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"

import {
    formatDate,
    formatTime,
    today
} from "../../utils/format"


// Step 1: List of available flight statuses for filtering
const FLIGHT_STATUSES = [
    'SCHEDULED',
    'BOARDING',
    'DEPARTED',
    'DELAYED',
    'CANCELLED',
    'ARRIVED'
]


function AdminFlights() {

    // Step 2: Get all flight records from the Redux store
    const flights = useSelector(state => state.admin.flights)

    // Step 3: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 4: Create state variables to manage flight monitoring
    const [fromDate, setFromDate] = useState(today())
    const [statusFilter, setStatusFilter] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)


    // Step 5: Fetch flights whenever the selected date changes
    useEffect(() => {

        // Send the selected date to the backend through Redux
        dispatch(getAllFlights(fromDate))

    }, [dispatch, fromDate])


    // Step 6: Filter flights based on status and search text
    const filteredFlights = flights.filter(f =>
        (!statusFilter || f.status === statusFilter)
        &&
        `${f.airlineName} ${f.flightNumber} ${f.source} ${f.destination}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the flights belonging to the current page
    const rows = filteredFlights.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 7: Display the flight monitoring interface
    return (
        <>

            {/* Page heading */}
            <div className="d-flex justify-content-between align-items-center mb-2">

                <h4 className="sf-section-title mb-0">
                    Flight Monitoring

                    <small className="text-muted fs-6">
                        (dated flights of all airlines)
                    </small>
                </h4>


                {/* Search, status filter and date selection */}
                <div className="d-flex align-items-center gap-2">

                    {/* Search flights by airline, flight number or city */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search airline / flight / city"
                    />


                    {/* Filter flights based on their current status */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All status"
                        options={FLIGHT_STATUSES}
                    />


                    {/* Select the date from which flights should be fetched */}
                    <label
                        htmlFor="admin-flights-from-date"
                        className="small text-muted mb-0 ms-2"
                    >
                        From date
                    </label>

                    <input
                        id="admin-flights-from-date"
                        type="date"
                        className="form-control form-control-sm"
                        style={{ width: 160 }}
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value)
                            setPage(0)
                        }}
                    />

                </div>
            </div>


            {/* Display all filtered flights in a table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Flight table column headings */}
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Airline</th>
                                <th>Flight</th>
                                <th>Route</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Status</th>
                            </tr>
                        </thead>


                        {/* Display flight records */}
                        <tbody>

                            {/* Show an empty message when no flights are found */}
                            {filteredFlights.length === 0 && <EmptyRow cols={7} />}

                            {/* Loop through the current page's flight records */}
                            {rows.map(f => (

                                <tr key={f.instanceId}>

                                    {/* Display formatted travel date */}
                                    <td>
                                        {formatDate(f.travelDate)}
                                    </td>

                                    {/* Display airline name */}
                                    <td>
                                        {f.airlineName}
                                    </td>

                                    {/* Display flight number */}
                                    <td className="fw-semibold">
                                        {f.flightNumber}
                                    </td>

                                    {/* Display source and destination */}
                                    <td>
                                        {f.source} → {f.destination}
                                    </td>

                                    {/* Display formatted departure time */}
                                    <td>
                                        {formatTime(f.departureTime)}
                                    </td>

                                    {/* Display formatted arrival time */}
                                    <td>
                                        {formatTime(f.arrivalTime)}
                                    </td>

                                    {/* Display current flight status */}
                                    <td>
                                        <StatusBadge status={f.status} />
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for flight records */}
                <Pager
                    page={page}
                    total={filteredFlights.length}
                    onChange={setPage}
                />

            </div>

        </>
    )
}

export default AdminFlights
