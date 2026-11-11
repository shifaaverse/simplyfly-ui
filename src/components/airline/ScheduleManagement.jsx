import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addSchedule, getFlights, getInstances, updateInstanceStatus } from "../../store/actions/AirlineAction"
import FlightPassengers from "./FlightPassengers"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatTime, getErrorMessage, today } from "../../utils/format"

// Step 1: Define available weekdays and flight statuses.
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const STATUSES = ['SCHEDULED', 'BOARDING', 'DEPARTED', 'DELAYED', 'CANCELLED', 'ARRIVED']

function ScheduleManagement() {

    // Step 2: Get flights and dated flight instances from Redux.
    const flights = useSelector(state => state.airline.flights)
    const instances = useSelector(state => state.airline.instances)

    const dispatch = useDispatch()

    // Step 3: Store the schedule creation form values.
    const [flightId, setFlightId] = useState("")
    const [startDate, setStartDate] = useState(today())
    const [endDate, setEndDate] = useState("")
    const [daily, setDaily] = useState(true)
    const [days, setDays] = useState([])

    // Step 4: Store messages and selected passenger details.
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")
    const [showPassengers, setShowPassengers] = useState(null)

    // Step 5: Store dated flight filtering and pagination values.
    const [fromDate, setFromDate] = useState(today())
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    // Step 6: Fetch all flights when the component loads.
    useEffect(() => {
        dispatch(getFlights())
    }, [dispatch])

    // Step 7: Fetch dated flight instances from the selected date.
    useEffect(() => {
        dispatch(getInstances(fromDate))
    }, [dispatch, fromDate])

    // Step 8: Add or remove a weekday from the selected days.
    const toggleDay = (d) => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d])

    // Step 9: Create a recurring flight schedule.
    const add = async (e) => {
        e.preventDefault()

        try {
            const resp = await dispatch(addSchedule({
                flightId, startDate, endDate, operatingDays: daily ? [] : days
            }))

            setMsg(`Schedule created for ${resp.flightNumber} (${resp.operatingDays}) - ${resp.instancesCreated} dated flights generated with seats`)
            setErrMsg("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 10: Change the status of a dated flight.
    // For DELAYED, ask for delay minutes.
    // For CANCELLED, ask for confirmation because passengers receive full refunds.
    const changeStatus = async (instance, status) => {
        let delayMinutes = 0

        if (status === 'DELAYED') {
            const answer = window.prompt('Delay in minutes?', '30')

            if (answer === null) return

            delayMinutes = Number(answer)

            if (!Number.isInteger(delayMinutes) || delayMinutes <= 0) {
                setErrMsg('Delay must be a whole number of minutes, more than 0')
                return
            }
        }

        if (status === 'CANCELLED' &&
            !window.confirm(`Cancel ${instance.flightNumber} on ${instance.travelDate}? Every passenger gets a full automatic refund. This cannot be undone.`))
            return

        // Save the new flight status through Redux.
        try {
            await dispatch(updateInstanceStatus(instance.instanceId, status, delayMinutes))

            setErrMsg("")

            if (status === 'CANCELLED') setMsg('Flight cancelled. Passengers were refunded and notified.')
            if (status === 'DELAYED') setMsg(`Flight delayed by ${delayMinutes} minutes. Passengers were notified.`)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 11: Filter dated flights by status and search text.
    const shown = instances.filter(i => (!statusFilter || i.status === statusFilter)
        && `${i.flightNumber} ${i.source} ${i.destination}`.toLowerCase().includes(search.trim().toLowerCase()))

    // Step 12: Display only the records for the current page.
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <h4 className="sf-section-title">Recurring Schedules</h4>

            {/* Display error and success messages. */}
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <Alert msg={msg} type="success" onClose={() => setMsg("")} />

            {/* Create Recurring Schedule Form */}
            <div className="card sf-card mb-4">
                <div className="card-body">
                    <form onSubmit={(e) => add(e)}>
                        <div className="row g-2 align-items-end">

                            {/* Select the flight for which the schedule is created. */}
                            <div className="col-md-4">
                                <label htmlFor="schedule-flight" className="form-label small">Flight</label>

                                <select
                                    id="schedule-flight"
                                    className="form-select"
                                    required
                                    value={flightId}
                                    onChange={(e) => setFlightId(e.target.value)}
                                >
                                    <option value="">Select flight</option>

                                    {flights.map(f => (
                                        <option key={f.flightId} value={f.flightId}>
                                            {f.flightNumber} {f.source} → {f.destination} ({formatTime(f.departureTime)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select the schedule start date. */}
                            <div className="col-md-3">
                                <label htmlFor="schedule-start-date" className="form-label small">Start date</label>

                                <input
                                    id="schedule-start-date"
                                    type="date"
                                    className="form-control"
                                    required
                                    min={today()}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            {/* Select the schedule end date. */}
                            <div className="col-md-3">
                                <label htmlFor="schedule-end-date" className="form-label small">End date (max 60 days)</label>

                                <input
                                    id="schedule-end-date"
                                    type="date"
                                    className="form-control"
                                    required
                                    min={startDate}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            {/* Submit the schedule form. */}
                            <div className="col-md-2 d-grid">
                                <button type="submit" className="btn btn-primary">Create Schedule</button>
                            </div>
                        </div>

                        {/* Choose whether the flight operates daily or on selected weekdays. */}
                        <div className="mt-3 d-flex flex-wrap align-items-center gap-3">

                            {/* Daily schedule switch. */}
                            <div className="form-check form-switch mb-0">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="daily"
                                    checked={daily}
                                    onChange={() => setDaily(!daily)}
                                />
                                <label className="form-check-label" htmlFor="daily">Daily</label>
                            </div>

                            {/* Show weekday checkboxes only when Daily is disabled. */}
                            {!daily && DAYS.map(d => (
                                <div className="form-check form-check-inline mb-0" key={d}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={d}
                                        checked={days.includes(d)}
                                        onChange={() => toggleDay(d)}
                                    />
                                    <label className="form-check-label small" htmlFor={d}>
                                        {d.slice(0, 3)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>

            {/* Dated Flights and Status Section */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="sf-section-title mb-0">Dated Flights & Status</h4>

                <div className="d-flex align-items-center gap-2">

                    {/* Search by flight number or city. */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search flight / city"
                    />

                    {/* Filter flights by their current status. */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All status"
                        options={STATUSES}
                    />

                    {/* Select the date from which dated flights should be fetched. */}
                    <label htmlFor="schedule-from-date" className="small text-muted mb-0 ms-2">
                        From date
                    </label>

                    <input
                        id="schedule-from-date"
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

            {/* Show passenger details for the selected dated flight. */}
            {showPassengers &&
                <FlightPassengers
                    key={showPassengers.instanceId}
                    instance={showPassengers}
                    close={() => setShowPassengers(null)}
                />
            }

            {/* Dated Flights Table */}
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Flight</th>
                                <th>Route</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Status</th>
                                <th>Update Status</th>
                                <th>Passengers</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Show an empty row when there are no matching flights. */}
                            {shown.length === 0 && <EmptyRow cols={8} />}

                            {/* Display the dated flights for the current page. */}
                            {rows.map(i => (
                                <tr key={i.instanceId}>
                                    <td>{formatDate(i.travelDate)}</td>
                                    <td className="fw-semibold">{i.flightNumber}</td>
                                    <td>{i.source} → {i.destination}</td>
                                    <td>{formatTime(i.departureTime)}</td>
                                    <td>{formatTime(i.arrivalTime)}</td>

                                    {/* Display status and delay minutes, if any. */}
                                    <td>
                                        <StatusBadge status={i.status} />
                                        {i.delayMinutes > 0 &&
                                            <div className="small text-muted">
                                                +{i.delayMinutes} min
                                            </div>
                                        }
                                    </td>

                                    {/* Allow the airline to update flight status. */}
                                    <td style={{ maxWidth: 170 }}>
                                        <select
                                            className="form-select form-select-sm"
                                            value={i.status}
                                            disabled={i.status === 'ARRIVED' || i.status === 'CANCELLED'}
                                            onChange={(e) => changeStatus(i, e.target.value)}
                                        >
                                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>

                                    {/* Open the passenger list for this dated flight. */}
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setShowPassengers(i)}
                                        >
                                            <i className="bi bi-people"></i> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination for dated flights. */}
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default ScheduleManagement
