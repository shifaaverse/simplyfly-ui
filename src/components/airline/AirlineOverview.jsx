import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAirlineProfile,
    getAirlineStats
} from "../../store/actions/AirlineAction"

import StatCard from "../common/StatCard"
import { formatMoney } from "../../utils/format"


function AirlineOverview() {

    // Step 1: Get airline statistics from the Redux store
    const stats = useSelector(state => state.airline.stats)

    // Step 2: Get airline profile details from the Redux store
    const profile = useSelector(state => state.airline.profile)

    // Step 3: Get dispatch to call Redux actions
    const dispatch = useDispatch()


    // Step 4: Fetch airline statistics and profile details
    useEffect(() => {

        // Fetch dashboard statistics from the backend
        dispatch(getAirlineStats())

        // Fetch the logged-in airline's profile details
        dispatch(getAirlineProfile())

    }, [dispatch])


    // Step 5: Show loading message until statistics are available
    if (!stats) {
        return <p className="text-muted">Loading...</p>
    }


    // Step 6: Display airline information and dashboard statistics
    return (
        <>

            {/* Display airline name and airline code */}
            <h4 className="sf-section-title">
                {profile?.name}

                <span className="text-muted fs-6">
                    ({profile?.code})
                </span>
            </h4>


            {/* Display all airline statistics using reusable StatCard components */}
            <div className="row g-3">

                {/* Total number of routes managed by the airline */}
                <StatCard
                    label="Total Routes"
                    value={stats.totalRoutes}
                    icon="bi-signpost-split"
                />

                {/* Total flight services provided by the airline */}
                <StatCard
                    label="Flight Services"
                    value={stats.totalFlights}
                    icon="bi-airplane"
                    tone="info"
                />

                {/* Number of flights scheduled for today */}
                <StatCard
                    label="Today's Flights"
                    value={stats.todaysFlights}
                    icon="bi-calendar-day"
                    tone="info"
                />

                {/* Number of upcoming flights */}
                <StatCard
                    label="Upcoming Flights"
                    value={stats.upcomingFlights}
                    icon="bi-calendar-week"
                />

                {/* Total number of bookings made for this airline */}
                <StatCard
                    label="Total Bookings"
                    value={stats.totalBookings}
                    icon="bi-ticket-perforated"
                    tone="success"
                />

                {/* Total number of confirmed passengers */}
                <StatCard
                    label="Confirmed Passengers"
                    value={stats.totalPassengers}
                    icon="bi-people"
                    tone="success"
                />

                {/* Number of currently available seats */}
                <StatCard
                    label="Available Seats"
                    value={stats.availableSeats}
                    icon="bi-grid-3x3-gap"
                    tone="secondary"
                />

                {/* Total number of cancelled journeys */}
                <StatCard
                    label="Cancelled Journeys"
                    value={stats.cancelledJourneys}
                    icon="bi-x-circle"
                    tone="danger"
                />

                {/* Number of refund requests awaiting airline decisions */}
                <StatCard
                    label="Pending Refund Decisions"
                    value={stats.pendingRefunds}
                    icon="bi-hourglass-split"
                    tone="warning"
                />

                {/* Display total airline revenue in formatted currency */}
                <StatCard
                    label="Revenue"
                    value={formatMoney(stats.revenue)}
                    icon="bi-currency-rupee"
                    tone="success"
                />

            </div>

        </>
    )
}

export default AirlineOverview
