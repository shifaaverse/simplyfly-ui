import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPassengerBookings, getPassengers, updatePassengerStatus } from "../../store/actions/AdminAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatMoney } from "../../utils/format"

function AdminPassengers() {
    const passengers = useSelector(state => state.admin.passengers)
    const passengerBookings = useSelector(state => state.admin.passengerBookings)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const [openId, setOpenId] = useState(null)
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getPassengers(""))
    }, [dispatch])

    const onSearch = (e) => {
        e.preventDefault()
        setPage(0)
        dispatch(getPassengers(search))
    }

    const toggleHistory = (id) => {
        if (openId === id) {
            setOpenId(null)
            return
        }
        setOpenId(id)
        dispatch(getPassengerBookings(id))
    }

    // Step 1: Filter by active / inactive, then show only one page
    const shown = passengers.filter(p => !statusFilter || (statusFilter === 'ACTIVE') === p.isActive)
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Passenger Management</h4>
                <div className="d-flex gap-2">
                    <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0) }}
                        allText="All passengers" options={['ACTIVE', 'INACTIVE']} />
                    <form className="d-flex gap-2" onSubmit={(e) => onSearch(e)}>
                        <input className="form-control form-control-sm" placeholder="Search name / email / username"
                            onChange={(e) => setSearch(e.target.value)} />
                        <button type="submit" className="btn btn-sm btn-primary"><i className="bi bi-search"></i></button>
                    </form>
                </div>
            </div>
            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr><th>Name</th><th>Username</th><th>Email</th><th>Mobile</th><th>DOB</th><th>Status</th><th className="text-end">Actions</th></tr>
                        </thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={7} />}
                            {rows.map(p => (
                                <Fragment key={p.passengerId}>
                                    <tr>
                                        <td className="fw-semibold">{p.name}</td>
                                        <td>{p.username}</td>
                                        <td>{p.email}</td>
                                        <td>{p.contact}</td>
                                        <td>{formatDate(p.dateOfBirth)}</td>
                                        <td><StatusBadge status={p.isActive} /></td>
                                        <td className="text-end text-nowrap">
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => toggleHistory(p.passengerId)}>
                                                Bookings
                                            </button>
                                            {p.isActive
                                                ? <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(updatePassengerStatus(p.passengerId, false))}>Block</button>
                                                : <button className="btn btn-sm btn-success" onClick={() => dispatch(updatePassengerStatus(p.passengerId, true))}>Activate</button>}
                                        </td>
                                    </tr>
                                    {openId === p.passengerId && (
                                        <tr>
                                            <td colSpan={7} className="bg-light">
                                                {(passengerBookings[p.passengerId] || []).length === 0
                                                    ? <span className="text-muted small">No bookings</span>
                                                    : (passengerBookings[p.passengerId] || []).map(b => (
                                                        <div key={b.bookingId} className="small mb-1">
                                                            <b>{b.pnr}</b> · {b.tripType} · {formatMoney(b.totalAmount)} · <StatusBadge status={b.status} />
                                                            {b.journeys.map(j => (
                                                                <span key={j.journeyId} className="ms-2 text-muted">
                                                                    {j.flightNumber} {j.source}→{j.destination} ({formatDate(j.travelDate)})
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ))}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default AdminPassengers