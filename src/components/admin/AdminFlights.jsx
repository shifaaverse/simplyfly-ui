import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllFlights } from "../../store/actions/AdminAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatTime, today } from "../../utils/format"

const FLIGHT_STATUSES = ['SCHEDULED', 'BOARDING', 'DEPARTED', 'DELAYED', 'CANCELLED', 'ARRIVED']

function AdminFlights() {
    const flights = useSelector(state => state.admin.flights)
    const dispatch = useDispatch()
    const [fromDate, setFromDate] = useState(today())
    const [statusFilter, setStatusFilter] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getAllFlights(fromDate))
    }, [dispatch, fromDate])

    // Step 2: Filter by flight status and search text, then show only one page
    const filteredFlights = flights.filter(f => (!statusFilter || f.status === statusFilter)
        && `${f.airlineName} ${f.flightNumber} ${f.source} ${f.destination}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = filteredFlights.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="sf-section-title mb-0">Flight Monitoring <small className="text-muted fs-6">(dated flights of all airlines)</small></h4>
                <div className="d-flex align-items-center gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search airline / flight / city" />
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All status" options={FLIGHT_STATUSES} />
                    <label className="small text-muted mb-0 ms-2">From date</label>
                    <input type="date" className="form-control form-control-sm" style={{ width: 160 }}
                        value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(0) }} />
                </div>
            </div>
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead><tr><th>Date</th><th>Airline</th><th>Flight</th><th>Route</th><th>Departure</th><th>Arrival</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredFlights.length === 0 && <EmptyRow cols={7} />}
                            {rows.map(f => (
                                <tr key={f.instanceId}>
                                    <td>{formatDate(f.travelDate)}</td>
                                    <td>{f.airlineName}</td>
                                    <td className="fw-semibold">{f.flightNumber}</td>
                                    <td>{f.source} → {f.destination}</td>
                                    <td>{formatTime(f.departureTime)}</td>
                                    <td>{formatTime(f.arrivalTime)}</td>
                                    <td><StatusBadge status={f.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pager page={page} total={filteredFlights.length} onChange={setPage} />
            </div>
        </>
    )
}

export default AdminFlights
