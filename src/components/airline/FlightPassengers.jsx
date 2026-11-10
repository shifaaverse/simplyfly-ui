import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getFlightPassengers } from "../../store/actions/AirlineAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import { extrasText } from "../../utils/addons"
import { label } from "../../utils/format"

// Passenger list (with meal and baggage) of one dated flight
function FlightPassengers({ instance, close }) {
    const passengers = useSelector(state => state.airline.passengers)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getFlightPassengers(instance.instanceId))
    }, [dispatch, instance])

    // Search by passenger name or PNR, then show only one page
    const shown = passengers.filter(p => `${p.travellerName} ${p.pnr}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <div className="card sf-card mb-3 border-primary">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Passengers · {instance.flightNumber} · {instance.travelDate}</span>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search passenger / PNR" />
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => close()}>Close</button>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                    <thead><tr><th>PNR</th><th>Passenger</th><th>Type</th><th>Gender</th><th>ID</th><th>Seat</th><th>Meal / Baggage</th><th>Status</th></tr></thead>
                    <tbody>
                        {shown.length === 0 && <EmptyRow cols={8} />}
                        {rows.map(p => (
                            <tr key={`${p.pnr}-${p.travellerName}-${p.seatNumber}`}>
                                <td className="fw-semibold">{p.pnr}</td>
                                <td>{p.travellerName}</td>
                                <td>{label(p.category)}</td>
                                <td>{label(p.gender)}</td>
                                <td>{p.govtIdType ? label(p.govtIdType) : '—'}</td>
                                <td>{p.seatNumber || 'Lap infant'}</td>
                                <td className="small">{extrasText(p)}</td>
                                <td><StatusBadge status={p.journeyStatus} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pager page={page} total={shown.length} onChange={setPage} />
        </div>
    )
}

export default FlightPassengers
