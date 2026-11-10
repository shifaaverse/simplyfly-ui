import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAirlineProfile, getAirlineStats } from "../../store/actions/AirlineAction"
import StatCard from "../common/StatCard"
import { formatMoney } from "../../utils/format"

function AirlineOverview() {
    const stats = useSelector(state => state.airline.stats)
    const profile = useSelector(state => state.airline.profile)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAirlineStats())
        dispatch(getAirlineProfile())
    }, [dispatch])

    if (!stats) return <p className="text-muted">Loading...</p>
    return (
        <>
            <h4 className="sf-section-title">{profile?.name} <span className="text-muted fs-6">({profile?.code})</span></h4>
            <div className="row g-3">
                <StatCard label="Total Routes" value={stats.totalRoutes} icon="bi-signpost-split" />
                <StatCard label="Flight Services" value={stats.totalFlights} icon="bi-airplane" tone="info" />
                <StatCard label="Today's Flights" value={stats.todaysFlights} icon="bi-calendar-day" tone="info" />
                <StatCard label="Upcoming Flights" value={stats.upcomingFlights} icon="bi-calendar-week" />
                <StatCard label="Total Bookings" value={stats.totalBookings} icon="bi-ticket-perforated" tone="success" />
                <StatCard label="Confirmed Passengers" value={stats.totalPassengers} icon="bi-people" tone="success" />
                <StatCard label="Available Seats" value={stats.availableSeats} icon="bi-grid-3x3-gap" tone="secondary" />
                <StatCard label="Cancelled Journeys" value={stats.cancelledJourneys} icon="bi-x-circle" tone="danger" />
                <StatCard label="Pending Refund Decisions" value={stats.pendingRefunds} icon="bi-hourglass-split" tone="warning" />
                <StatCard label="Revenue" value={formatMoney(stats.revenue)} icon="bi-currency-rupee" tone="success" />
            </div>
        </>
    )
}

export default AirlineOverview
