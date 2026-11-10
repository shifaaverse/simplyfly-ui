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

function RouteManagement() {
    const routes = useSelector(state => state.airline.routes)
    const airports = useSelector(state => state.airline.airports)
    const dispatch = useDispatch()
    const [sourceAirportId, setSourceAirportId] = useState("")
    const [destinationAirportId, setDestinationAirportId] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getRoutes())
        dispatch(getAirportList())
    }, [dispatch])

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

    const toggle = async (r) => {
        try {
            await dispatch(updateRouteStatus(r.routeId, !r.isActive))
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: Filter by active / inactive and search text, then show only one page
    const shown = routes.filter(r => (!statusFilter || (statusFilter === 'ACTIVE') === r.isActive)
        && `${r.sourceCity} ${r.sourceCode} ${r.destinationCity} ${r.destinationCode}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <h4 className="sf-section-title">Route Management</h4>
            <p className="text-muted small">A route is only source and destination. Flight timings are added in Flights.</p>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <div className="card sf-card mb-3">
                <div className="card-body">
                    <form className="row g-2 align-items-end" onSubmit={(e) => add(e)}>
                        <div className="col-md-5">
                            <label htmlFor="route-source-airport" className="form-label small">Source Airport</label>
                            <select id="route-source-airport" className="form-select" required value={sourceAirportId} onChange={(e) => setSourceAirportId(e.target.value)}>
                                <option value="">Select</option>
                                {airports.map(a => <option key={a.id} value={a.id}>{a.city} ({a.code})</option>)}
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="route-destination-airport" className="form-label small">Destination Airport</label>
                            <select id="route-destination-airport" className="form-select" required value={destinationAirportId} onChange={(e) => setDestinationAirportId(e.target.value)}>
                                <option value="">Select</option>
                                {airports.map(a => <option key={a.id} value={a.id}>{a.city} ({a.code})</option>)}
                            </select>
                        </div>
                        <div className="col-md-2 d-grid">
                            <button type="submit" className="btn btn-primary">Add Route</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">All Routes</h5>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search city / code" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All routes" options={['ACTIVE', 'INACTIVE']} />
                </div>
            </div>
            <div className="card sf-card">
                <table className="table align-middle mb-0">
                    <thead><tr><th>Route</th><th>Source</th><th>Destination</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                        {shown.length === 0 && <EmptyRow cols={5} />}
                        {rows.map(r => (
                            <tr key={r.routeId}>
                                <td className="fw-semibold">R{String(r.routeId).padStart(3, '0')}</td>
                                <td>{r.sourceCity} ({r.sourceCode})</td>
                                <td>{r.destinationCity} ({r.destinationCode})</td>
                                <td><StatusBadge status={r.isActive} /></td>
                                <td className="text-end">
                                    <button className={`btn btn-sm ${r.isActive ? 'btn-outline-danger' : 'btn-success'}`} onClick={() => toggle(r)}>
                                        {r.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default RouteManagement