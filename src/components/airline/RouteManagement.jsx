import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addRoute, getAirportList, getRoutes, updateRouteStatus } from "../../store/actions/AirlineAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { getErrorMessage } from "../../utils/format"

// Manages airline routes: adding, viewing, searching and changing route status.
function RouteManagement() {

    // Step 1: Get routes and airports from the Redux store.
    const routes = useSelector(state => state.airline.routes)
    const airports = useSelector(state => state.airline.airports)

    // Step 2: Get dispatch to call Redux actions.
    const dispatch = useDispatch()

    // Step 3: Store the selected source and destination airport IDs.
    const [sourceAirportId, setSourceAirportId] = useState("")
    const [destinationAirportId, setDestinationAirportId] = useState("")

    // Step 4: Store error message, search text, filter and current page.
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    // Step 5: Load routes and airport list when the component first loads.
    useEffect(() => {
        dispatch(getRoutes())
        dispatch(getAirportList())
    }, [dispatch])

    // Step 6: Add a new route using the selected airport IDs.
    const add = async (e) => {
        e.preventDefault()

        try {
            await dispatch(addRoute({ sourceAirportId, destinationAirportId }))
            setErrMsg("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 7: Activate or deactivate a route.
    const toggle = async (r) => {
        try {
            await dispatch(updateRouteStatus(r.routeId, !r.isActive))
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 8: Filter routes by status and search text.
    const shown = routes.filter(r => (!statusFilter || (statusFilter === 'ACTIVE') === r.isActive)
        && `${r.sourceCity} ${r.sourceCode} ${r.destinationCity} ${r.destinationCode}`.toLowerCase().includes(search.trim().toLowerCase()))

    // Step 9: Display only the records belonging to the current page.
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <h4 className="sf-section-title">Route Management</h4>
            <p className="text-muted small">A route is only source and destination. Flight timings are added in Flights.</p>

            {/* Display an error message if an operation fails. */}
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />

            {/* Add Route Form */}
            <div className="card sf-card mb-3">
                <div className="card-body">
                    <form className="row g-2 align-items-end" onSubmit={(e) => add(e)}>

                        {/* Source Airport Selection */}
                        <div className="col-md-5">
                            <label htmlFor="route-source-airport" className="form-label small">Source Airport</label>
                            <select
                                id="route-source-airport"
                                className="form-select"
                                required
                                value={sourceAirportId}
                                onChange={(e) => setSourceAirportId(e.target.value)}
                            >
                                <option value="">Select</option>

                                {/* Display all available airports as options. */}
                                {airports.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.city} ({a.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Destination Airport Selection */}
                        <div className="col-md-5">
                            <label htmlFor="route-destination-airport" className="form-label small">Destination Airport</label>
                            <select
                                id="route-destination-airport"
                                className="form-select"
                                required
                                value={destinationAirportId}
                                onChange={(e) => setDestinationAirportId(e.target.value)}
                            >
                                <option value="">Select</option>

                                {/* Display all available airports as options. */}
                                {airports.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.city} ({a.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit the selected airports to create a route. */}
                        <div className="col-md-2 d-grid">
                            <button type="submit" className="btn btn-primary">Add Route</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Search and Status Filter */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">All Routes</h5>

                <div className="d-flex gap-2">
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search city / code"
                    />

                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All routes"
                        options={['ACTIVE', 'INACTIVE']}
                    />
                </div>
            </div>

            {/* Routes Table */}
            <div className="card sf-card">
                <table className="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Display an empty row when no routes match the search or filter. */}
                        {shown.length === 0 && <EmptyRow cols={5} />}

                        {/* Display the routes belonging to the current page. */}
                        {rows.map(r => (
                            <tr key={r.routeId}>
                                <td className="fw-semibold">
                                    R{String(r.routeId).padStart(3, '0')}
                                </td>

                                <td>{r.sourceCity} ({r.sourceCode})</td>
                                <td>{r.destinationCity} ({r.destinationCode})</td>

                                {/* Show whether the route is active or inactive. */}
                                <td>
                                    <StatusBadge status={r.isActive} />
                                </td>

                                {/* Change the route status when the button is clicked. */}
                                <td className="text-end">
                                    <button
                                        className={`btn btn-sm ${r.isActive ? 'btn-outline-danger' : 'btn-success'}`}
                                        onClick={() => toggle(r)}
                                    >
                                        {r.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default RouteManagement
