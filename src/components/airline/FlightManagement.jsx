import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    addFlight,
    getFlights,
    getRoutes,
    updateFlight,
    updateFlightStatus
} from "../../store/actions/AirlineAction"

import StatusBadge from "../common/StatusBadge"
import FlightEdit from "./FlightEdit"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"

import {
    formatMoney,
    formatTime,
    getErrorMessage
} from "../../utils/format"


// Step 1: Define default values for creating a new flight
const EMPTY_FLIGHT = {
    flightNumber: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    businessRows: 2,
    premiumRows: 2,
    economyRows: 10,
    businessFare: 12000,
    premiumFare: 7000,
    economyFare: 4500,
    windowCharge: 300,
    aisleCharge: 200,
    baggageInfo: '15 kg check-in, 7 kg cabin'
}


function FlightManagement() {

    // Step 2: Get flights and routes from the Redux store
    const flights = useSelector(state => state.airline.flights)
    const routes = useSelector(state => state.airline.routes)

    // Get dispatch to call Redux actions
    const dispatch = useDispatch()


    // Step 3: Create state variables for flight management
    const [flight, setFlight] = useState(EMPTY_FLIGHT)
    const [editing, setEditing] = useState(null)
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)


    // Step 4: Fetch flights and routes when the component loads
    useEffect(() => {

        // Fetch all flights belonging to the airline
        dispatch(getFlights())

        // Fetch available routes for flight creation
        dispatch(getRoutes())

    }, [dispatch])


    // Step 5: Update a particular field in the new flight form
    const change = (field, value) => {

        setFlight({
            ...flight,
            [field]: value
        })

    }


    // Step 6: Create a new flight
    const add = async (e) => {

        // Prevent the browser from refreshing the page
        e.preventDefault()

        try {

            // Send the new flight details to the backend
            await dispatch(addFlight(flight))

            // Display success message
            setMsg(`Flight ${flight.flightNumber} created. Now create its schedule.`)

            // Reset the form to its default values
            setFlight(EMPTY_FLIGHT)

            // Clear previous error message
            setErrMsg("")

        }
        catch (err) {

            // Display error message if flight creation fails
            setErrMsg(getErrorMessage(err))

        }
    }


    // Step 7: Save updated fares and baggage information
    const save = async (f, values) => {

        try {

            // Update the selected flight using its ID and new values
            await dispatch(updateFlight(f.flightId, values))

            // Display success message after updating
            setMsg(`Flight ${f.flightNumber} updated. New fares apply to all upcoming bookings.`)

            // Close the flight editing form
            setEditing(null)

            // Clear previous error message
            setErrMsg("")

        }
        catch (err) {

            // Display error message if update fails
            setErrMsg(getErrorMessage(err))

        }
    }


    // Step 8: Activate or deactivate a flight
    const toggleActive = async (f) => {

        try {

            // Reverse the current active status of the selected flight
            await dispatch(updateFlightStatus(f.flightId, !f.isActive))

            // Display the appropriate success message
            setMsg(
                `Flight ${f.flightNumber} ${f.isActive
                    ? 'deactivated. It will not appear in search.'
                    : 'activated'}`
            )

            // Clear previous error message
            setErrMsg("")

        }
        catch (err) {

            // Display error message if status update fails
            setErrMsg(getErrorMessage(err))

        }
    }


    // Step 9: Filter flights by active status and search text
    const shown = flights.filter(f =>
        (!statusFilter || (statusFilter === 'ACTIVE') === f.isActive)
        &&
        `${f.flightNumber} ${f.source} ${f.destination}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the flight records belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 10: Reusable function to generate number input fields
    const numberField = (key, text) => (

        <div className="col-6 col-md-3 col-xl-2" key={key}>

            {/* Display the input field label */}
            <label className="form-label small">
                {text}
            </label>

            {/* Input for entering seat rows, fares or seat charges */}
            <input
                type="number"
                min="0"
                className="form-control"
                required
                value={flight[key]}
                onChange={(e) => change(key, e.target.value)}
            />

        </div>
    )


    // Step 11: Display the flight management interface
    return (
        <>

            {/* Page heading */}
            <h4 className="sf-section-title">
                Flight Services, Seats & Fares
            </h4>


            {/* Display error and success messages */}
            <Alert
                msg={errMsg}
                onClose={() => setErrMsg("")}
            />

            <Alert
                msg={msg}
                type="success"
                onClose={() => setMsg("")}
            />


            {/* Section for creating a new flight */}
            <div className="card sf-card mb-3">

                <div className="card-body">

                    <form onSubmit={(e) => add(e)}>

                        {/* Flight number, route and timings */}
                        <div className="row g-2">

                            {/* Flight number input */}
                            <div className="col-md-3">

                                <label
                                    htmlFor="flight-flight-number"
                                    className="form-label small"
                                >
                                    Flight Number
                                </label>

                                <input
                                    id="flight-flight-number"
                                    className="form-control"
                                    placeholder="6E-201"
                                    required
                                    value={flight.flightNumber}
                                    onChange={(e) =>
                                        change('flightNumber', e.target.value)
                                    }
                                />

                            </div>


                            {/* Select an active route */}
                            <div className="col-md-3">

                                <label
                                    htmlFor="flight-route"
                                    className="form-label small"
                                >
                                    Route
                                </label>

                                <select
                                    id="flight-route"
                                    className="form-select"
                                    required
                                    value={flight.routeId}
                                    onChange={(e) =>
                                        change('routeId', e.target.value)
                                    }
                                >

                                    <option value="">
                                        Select route
                                    </option>

                                    {/* Display only active routes */}
                                    {routes.filter(r => r.isActive).map(r => (

                                        <option
                                            key={r.routeId}
                                            value={r.routeId}
                                        >
                                            {r.sourceCity} → {r.destinationCity}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* Flight departure time */}
                            <div className="col-md-3">

                                <label
                                    htmlFor="flight-departure-time"
                                    className="form-label small"
                                >
                                    Departure Time
                                </label>

                                <input
                                    id="flight-departure-time"
                                    type="time"
                                    className="form-control"
                                    required
                                    value={flight.departureTime}
                                    onChange={(e) =>
                                        change('departureTime', e.target.value)
                                    }
                                />

                            </div>


                            {/* Flight arrival time */}
                            <div className="col-md-3">

                                <label
                                    htmlFor="flight-arrival-time"
                                    className="form-label small"
                                >
                                    Arrival Time
                                </label>

                                <input
                                    id="flight-arrival-time"
                                    type="time"
                                    className="form-control"
                                    required
                                    value={flight.arrivalTime}
                                    onChange={(e) =>
                                        change('arrivalTime', e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* Seat configuration section */}
                        <div className="sf-subhead mt-3">
                            Seat configuration (6 seats per row: A/F window, B/E middle, C/D aisle)
                        </div>

                        <div className="row g-2">

                            {/* Number of business class rows */}
                            {numberField('businessRows', 'Business rows')}

                            {/* Number of premium economy rows */}
                            {numberField('premiumRows', 'Premium Eco rows')}

                            {/* Number of economy class rows */}
                            {numberField('economyRows', 'Economy rows')}

                        </div>


                        {/* Base fares and seat position charges */}
                        <div className="sf-subhead mt-3">
                            Base fare per class & seat position charges (₹)
                        </div>

                        <div className="row g-2">

                            {numberField('businessFare', 'Business fare')}

                            {numberField('premiumFare', 'Premium Eco fare')}

                            {numberField('economyFare', 'Economy fare')}

                            {numberField('windowCharge', 'Window extra')}

                            {numberField('aisleCharge', 'Aisle extra')}

                        </div>


                        {/* Baggage information and create flight button */}
                        <div className="row g-2 mt-1 align-items-end">

                            <div className="col-md-9">

                                <label
                                    htmlFor="flight-baggage-info"
                                    className="form-label small"
                                >
                                    Baggage info
                                </label>

                                <input
                                    id="flight-baggage-info"
                                    className="form-control"
                                    value={flight.baggageInfo}
                                    onChange={(e) =>
                                        change('baggageInfo', e.target.value)
                                    }
                                />

                            </div>


                            {/* Submit the new flight form */}
                            <div className="col-md-3 d-grid">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Create Flight
                                </button>

                            </div>

                        </div>


                        {/* Display fare calculation information */}
                        <p className="small text-muted mt-2 mb-0">
                            Child fare = 75% of base, Infant = 10% (no seat). 5% tax applied on total.
                        </p>

                    </form>

                </div>

            </div>


            {/* Display FlightEdit when a flight is selected for editing */}
            {editing && (

                <FlightEdit
                    key={editing.flightId}
                    flight={editing}
                    onSave={save}
                    onCancel={() => setEditing(null)}
                />

            )}


            {/* Heading, search and status filter for existing flights */}
            <div className="d-flex justify-content-between align-items-center mb-2">

                <h5 className="mb-0">
                    All Flights
                </h5>

                <div className="d-flex gap-2">

                    {/* Search by flight number or city */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search flight / city"
                    />

                    {/* Filter flights by active or inactive status */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All flights"
                        options={['ACTIVE', 'INACTIVE']}
                    />

                </div>

            </div>


            {/* Display all filtered flight records */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Flight table headings */}
                        <thead>
                            <tr>
                                <th>Flight</th>
                                <th>Route</th>
                                <th>Timing</th>
                                <th>Seats (B/P/E)</th>
                                <th>Fares (B/P/E)</th>
                                <th>Window/Aisle</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>


                        {/* Flight table records */}
                        <tbody>

                            {/* Display an empty message if no flights are found */}
                            {shown.length === 0 && <EmptyRow cols={8} />}


                            {/* Loop through the flights on the current page */}
                            {rows.map(f => (

                                <tr key={f.flightId}>

                                    {/* Display flight number */}
                                    <td className="fw-semibold">
                                        {f.flightNumber}
                                    </td>

                                    {/* Display source and destination */}
                                    <td>
                                        {f.source} → {f.destination}
                                    </td>

                                    {/* Display formatted departure and arrival times */}
                                    <td>
                                        {formatTime(f.departureTime)} - {formatTime(f.arrivalTime)}
                                    </td>

                                    {/* Calculate total seats for each class: rows multiplied by 6 */}
                                    <td>
                                        {f.businessRows * 6} / {f.premiumRows * 6} / {f.economyRows * 6}
                                    </td>

                                    {/* Display formatted base fares */}
                                    <td className="small">
                                        {formatMoney(f.businessFare)} / {formatMoney(f.premiumFare)} / {formatMoney(f.economyFare)}
                                    </td>

                                    {/* Display window and aisle charges */}
                                    <td className="small">
                                        {formatMoney(f.windowCharge)} / {formatMoney(f.aisleCharge)}
                                    </td>

                                    {/* Display whether the flight is active */}
                                    <td>
                                        <StatusBadge status={f.isActive} />
                                    </td>


                                    {/* Edit and activate/deactivate actions */}
                                    <td className="text-end text-nowrap">

                                        {/* Open the selected flight in the editing form */}
                                        <button
                                            className="btn btn-sm btn-outline-primary me-1"
                                            onClick={() => setEditing(f)}
                                        >
                                            Edit
                                        </button>


                                        {/* Toggle the active status of the flight */}
                                        <button
                                            className={`btn btn-sm ${f.isActive
                                                ? 'btn-outline-danger'
                                                : 'btn-outline-success'}`}
                                            onClick={() => toggleActive(f)}
                                        >
                                            {f.isActive ? 'Deactivate' : 'Activate'}
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for flight records */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>

        </>
    )
}

export default FlightManagement
