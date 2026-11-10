import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addFlight, getFlights, getRoutes, updateFlight, updateFlightStatus } from "../../store/actions/AirlineAction"
import StatusBadge from "../common/StatusBadge"
import FlightEdit from "./FlightEdit"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatMoney, formatTime, getErrorMessage } from "../../utils/format"

const EMPTY_FLIGHT = {
    flightNumber: '', routeId: '', departureTime: '', arrivalTime: '',
    businessRows: 2, premiumRows: 2, economyRows: 10,
    businessFare: 12000, premiumFare: 7000, economyFare: 4500,
    windowCharge: 300, aisleCharge: 200, baggageInfo: '15 kg check-in, 7 kg cabin'
}

function FlightManagement() {
    const flights = useSelector(state => state.airline.flights)
    const routes = useSelector(state => state.airline.routes)
    const dispatch = useDispatch()
    const [flight, setFlight] = useState(EMPTY_FLIGHT)
    const [editing, setEditing] = useState(null)
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getFlights())
        dispatch(getRoutes())
    }, [dispatch])

    const change = (field, value) => setFlight({ ...flight, [field]: value })

    const add = async (e) => {
        e.preventDefault()
        try {
            await dispatch(addFlight(flight))
            setMsg(`Flight ${flight.flightNumber} created. Now create its schedule.`)
            setFlight(EMPTY_FLIGHT)
            setErrMsg("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: save the new fares of a flight
    const save = async (f, values) => {
        try {
            await dispatch(updateFlight(f.flightId, values))
            setMsg(`Flight ${f.flightNumber} updated. New fares apply to all upcoming bookings.`)
            setEditing(null)
            setErrMsg("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 2: activate or deactivate a flight (a deactivated flight is hidden from search)
    const toggleActive = async (f) => {
        try {
            await dispatch(updateFlightStatus(f.flightId, !f.isActive))
            setMsg(`Flight ${f.flightNumber} ${f.isActive ? 'deactivated. It will not appear in search.' : 'activated'}`)
            setErrMsg("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 3: Filter by active / inactive and search text, then show only one page
    const shown = flights.filter(f => (!statusFilter || (statusFilter === 'ACTIVE') === f.isActive)
        && `${f.flightNumber} ${f.source} ${f.destination}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const numberField = (key, text) => (
        <div className="col-6 col-md-3 col-xl-2" key={key}>
            <label className="form-label small">{text}</label>
            <input type="number" min="0" className="form-control" required value={flight[key]}
                onChange={(e) => change(key, e.target.value)} />
        </div>
    )

    return (
        <>
            <h4 className="sf-section-title">Flight Services, Seats & Fares</h4>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <Alert msg={msg} type="success" onClose={() => setMsg("")} />
            <div className="card sf-card mb-3">
                <div className="card-body">
                    <form onSubmit={(e) => add(e)}>
                        <div className="row g-2">
                            <div className="col-md-3">
                                <label className="form-label small">Flight Number</label>
                                <input className="form-control" placeholder="6E-201" required value={flight.flightNumber}
                                    onChange={(e) => change('flightNumber', e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Route</label>
                                <select className="form-select" required value={flight.routeId} onChange={(e) => change('routeId', e.target.value)}>
                                    <option value="">Select route</option>
                                    {routes.filter(r => r.isActive).map(r =>
                                        <option key={r.routeId} value={r.routeId}>{r.sourceCity} → {r.destinationCity}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Departure Time</label>
                                <input type="time" className="form-control" required value={flight.departureTime}
                                    onChange={(e) => change('departureTime', e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Arrival Time</label>
                                <input type="time" className="form-control" required value={flight.arrivalTime}
                                    onChange={(e) => change('arrivalTime', e.target.value)} />
                            </div>
                        </div>
                        <div className="sf-subhead mt-3">Seat configuration (6 seats per row: A/F window, B/E middle, C/D aisle)</div>
                        <div className="row g-2">
                            {numberField('businessRows', 'Business rows')}
                            {numberField('premiumRows', 'Premium Eco rows')}
                            {numberField('economyRows', 'Economy rows')}
                        </div>
                        <div className="sf-subhead mt-3">Base fare per class & seat position charges (₹)</div>
                        <div className="row g-2">
                            {numberField('businessFare', 'Business fare')}
                            {numberField('premiumFare', 'Premium Eco fare')}
                            {numberField('economyFare', 'Economy fare')}
                            {numberField('windowCharge', 'Window extra')}
                            {numberField('aisleCharge', 'Aisle extra')}
                        </div>
                        <div className="row g-2 mt-1 align-items-end">
                            <div className="col-md-9">
                                <label className="form-label small">Baggage info</label>
                                <input className="form-control" value={flight.baggageInfo} onChange={(e) => change('baggageInfo', e.target.value)} />
                            </div>
                            <div className="col-md-3 d-grid">
                                <button className="btn btn-primary">Create Flight</button>
                            </div>
                        </div>
                        <p className="small text-muted mt-2 mb-0">Child fare = 75% of base, Infant = 10% (no seat). 5% tax applied on total.</p>
                    </form>
                </div>
            </div>
            {editing && <FlightEdit key={editing.flightId} flight={editing} onSave={save} onCancel={() => setEditing(null)} />}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">All Flights</h5>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search flight / city" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All flights" options={['ACTIVE', 'INACTIVE']} />
                </div>
            </div>
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>Flight</th><th>Route</th><th>Timing</th><th>Seats (B/P/E)</th><th>Fares (B/P/E)</th><th>Window/Aisle</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={8} />}
                            {rows.map(f => (
                                <tr key={f.flightId}>
                                    <td className="fw-semibold">{f.flightNumber}</td>
                                    <td>{f.source} → {f.destination}</td>
                                    <td>{formatTime(f.departureTime)} - {formatTime(f.arrivalTime)}</td>
                                    <td>{f.businessRows * 6} / {f.premiumRows * 6} / {f.economyRows * 6}</td>
                                    <td className="small">{formatMoney(f.businessFare)} / {formatMoney(f.premiumFare)} / {formatMoney(f.economyFare)}</td>
                                    <td className="small">{formatMoney(f.windowCharge)} / {formatMoney(f.aisleCharge)}</td>
                                    <td><StatusBadge status={f.isActive} /></td>
                                    <td className="text-end text-nowrap">
                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setEditing(f)}>Edit</button>
                                        <button className={`btn btn-sm ${f.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                            onClick={() => toggleActive(f)}>{f.isActive ? 'Deactivate' : 'Activate'}</button>
                                    </td>
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

export default FlightManagement
