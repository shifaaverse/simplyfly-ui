import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAdminStats } from "../../store/actions/AdminAction"
import StatCard from "../common/StatCard"
import EmptyRow from "../common/EmptyRow"
import { formatMoney } from "../../utils/format"

function AdminOverview() {
    const stats = useSelector(state => state.admin.stats)
    const airlineBookings = useSelector(state => state.admin.airlineBookings)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAdminStats())
    }, [dispatch])

    if (!stats) return <p className="text-muted">Loading...</p>
    const max = Math.max(1, ...airlineBookings.map(a => a.numberOfBookings))

    return (
        <>
            <h4 className="sf-section-title">Platform Overview</h4>
            <div className="row g-3 mb-4">
                <StatCard label="Registered Passengers" value={stats.totalPassengers} icon="bi-people" />
                <StatCard label="Onboarded Airlines" value={stats.totalAirlines} icon="bi-building" tone="info" />
                <StatCard label="Active Airlines" value={stats.activeAirlines} icon="bi-check-circle" tone="success" />
                <StatCard label="Pending Approvals" value={stats.pendingAirlines} icon="bi-hourglass-split" tone="warning" />
                <StatCard label="Total Flights" value={stats.totalFlights} icon="bi-airplane" tone="info" />
                <StatCard label="Total Bookings" value={stats.totalBookings} icon="bi-ticket-perforated" />
                <StatCard label="Successful Payments" value={stats.totalPayments} icon="bi-credit-card" tone="success" />
                <StatCard label="Pending Refunds" value={stats.pendingRefunds} icon="bi-arrow-counterclockwise" tone="danger" />
                <StatCard label="Net Revenue" value={formatMoney(stats.revenue)} icon="bi-currency-rupee" tone="success" />
            </div>

            <div className="card sf-card">
                <div className="card-header bg-white fw-semibold">Airline-wise Bookings</div>
                <div className="card-body">
                    <table className="table align-middle mb-0">
                        <thead><tr><th style={{ width: '25%' }}>Airline</th><th>Journeys booked</th></tr></thead>
                        <tbody>
                            {airlineBookings.length === 0 && <EmptyRow cols={2} text="No bookings yet" />}
                            {airlineBookings.map(a => (
                                <tr key={a.airlineName}>
                                    <td className="fw-semibold">{a.airlineName}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="sf-bar" style={{ width: `${(a.numberOfBookings / max) * 80}%` }}></div>
                                            <span>{a.numberOfBookings}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default AdminOverview
