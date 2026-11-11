import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getFlightPassengers } from "../../store/actions/AirlineAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"

import { extrasText } from "../../utils/addons"
import { label } from "../../utils/format"


// Passenger list with meal and baggage details for one dated flight
function FlightPassengers({ instance, close }) {

    // Step 1: Get passenger records from the Redux store
    const passengers = useSelector(state => state.airline.passengers)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 3: Create state variables for search and pagination
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)


    // Step 4: Fetch passengers for the selected flight instance
    useEffect(() => {

        // Use the selected flight instance ID to fetch its passengers
        dispatch(getFlightPassengers(instance.instanceId))

    }, [dispatch, instance])


    // Step 5: Filter passengers by name or PNR
    const shown = passengers.filter(p =>
        `${p.travellerName} ${p.pnr}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the passenger records belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 6: Display passenger details for the selected flight
    return (
        <div className="card sf-card mb-3 border-primary">

            {/* Header showing flight details, search and close button */}
            <div className="card-header bg-white d-flex justify-content-between align-items-center">

                {/* Display flight number and travel date */}
                <span className="fw-semibold">
                    Passengers · {instance.flightNumber} · {instance.travelDate}
                </span>

                <div className="d-flex gap-2">

                    {/* Search passengers by name or PNR */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search passenger / PNR"
                    />

                    {/* Close the passenger list */}
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => close()}
                    >
                        Close
                    </button>

                </div>

            </div>


            {/* Passenger details table */}
            <div className="table-responsive">

                <table className="table table-sm align-middle mb-0">

                    {/* Passenger table headings */}
                    <thead>
                        <tr>
                            <th>PNR</th>
                            <th>Passenger</th>
                            <th>Type</th>
                            <th>Gender</th>
                            <th>ID</th>
                            <th>Seat</th>
                            <th>Meal / Baggage</th>
                            <th>Status</th>
                        </tr>
                    </thead>


                    {/* Display passenger records */}
                    <tbody>

                        {/* Show an empty message when no passengers are found */}
                        {shown.length === 0 && <EmptyRow cols={8} />}


                        {/* Loop through passengers on the current page */}
                        {rows.map(p => (

                            <tr key={`${p.pnr}-${p.travellerName}-${p.seatNumber}`}>

                                {/* Display booking PNR */}
                                <td className="fw-semibold">
                                    {p.pnr}
                                </td>

                                {/* Display passenger name */}
                                <td>
                                    {p.travellerName}
                                </td>

                                {/* Display passenger category */}
                                <td>
                                    {label(p.category)}
                                </td>

                                {/* Display passenger gender */}
                                <td>
                                    {label(p.gender)}
                                </td>

                                {/* Display government ID type or dash if unavailable */}
                                <td>
                                    {p.govtIdType ? label(p.govtIdType) : '—'}
                                </td>

                                {/* Display seat number or Lap infant */}
                                <td>
                                    {p.seatNumber || 'Lap infant'}
                                </td>

                                {/* Display selected meal and baggage information */}
                                <td className="small">
                                    {extrasText(p)}
                                </td>

                                {/* Display the passenger's journey status */}
                                <td>
                                    <StatusBadge status={p.journeyStatus} />
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {/* Handle passenger list pagination */}
            <Pager
                page={page}
                total={shown.length}
                onChange={setPage}
            />

        </div>
    )
}

export default FlightPassengers
