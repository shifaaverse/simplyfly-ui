import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAdminStats
} from "../../store/actions/AdminAction"

import StatCard from "../common/StatCard"
import EmptyRow from "../common/EmptyRow"

import { formatMoney } from "../../utils/format"


function AdminOverview() {

    // Step 1: Get dashboard statistics from the Redux store
    const stats = useSelector(state => state.admin.stats)

    // Get airline-wise booking details from the Redux store
    const airlineBookings = useSelector(state => state.admin.airlineBookings)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()


    // Step 3: Fetch admin dashboard statistics when the component loads
    useEffect(() => {

        // Send a request to get the latest platform statistics
        dispatch(getAdminStats())

    }, [dispatch])


    // Step 4: Display loading message until statistics are available
    if (!stats) {
        return <p className="text-muted">Loading...</p>
    }


    // Step 5: Find the highest number of bookings among all airlines
    const max = Math.max(
        1,
        ...airlineBookings.map(a => a.numberOfBookings)
    )


    // Step 6: Display the admin dashboard overview
    return (
        <>

            {/* Page heading */}
            <h4 className="sf-section-title">
                Platform Overview
            </h4>


            {/* Display platform statistics using reusable StatCard components */}
            <div className="row g-3 mb-4">

                {/* Display total registered passengers */}
                <StatCard
                    label="Registered Passengers"
                    value={stats.totalPassengers}
                    icon="bi-people"
                />

                {/* Display total onboarded airlines */}
                <StatCard
                    label="Onboarded Airlines"
                    value={stats.totalAirlines}
                    icon="bi-building"
                    tone="info"
                />

                {/* Display total active airlines */}
                <StatCard
                    label="Active Airlines"
                    value={stats.activeAirlines}
                    icon="bi-check-circle"
                    tone="success"
                />

                {/* Display airlines waiting for admin approval */}
                <StatCard
                    label="Pending Approvals"
                    value={stats.pendingAirlines}
                    icon="bi-hourglass-split"
                    tone="warning"
                />

                {/* Display total flights */}
                <StatCard
                    label="Total Flights"
                    value={stats.totalFlights}
                    icon="bi-airplane"
                    tone="info"
                />

                {/* Display total bookings */}
                <StatCard
                    label="Total Bookings"
                    value={stats.totalBookings}
                    icon="bi-ticket-perforated"
                />

                {/* Display successful payments */}
                <StatCard
                    label="Successful Payments"
                    value={stats.totalPayments}
                    icon="bi-credit-card"
                    tone="success"
                />

                {/* Display refunds waiting for processing */}
                <StatCard
                    label="Pending Refunds"
                    value={stats.pendingRefunds}
                    icon="bi-arrow-counterclockwise"
                    tone="danger"
                />

                {/* Display total platform revenue */}
                <StatCard
                    label="Net Revenue"
                    value={formatMoney(stats.revenue)}
                    icon="bi-currency-rupee"
                    tone="success"
                />

            </div>


            {/* Display airline-wise booking statistics */}
            <div className="card sf-card">

                {/* Card heading */}
                <div className="card-header bg-white fw-semibold">
                    Airline-wise Bookings
                </div>

                <div className="card-body">

                    <table className="table align-middle mb-0">

                        {/* Table column headings */}
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>
                                    Airline
                                </th>

                                <th>
                                    Journeys booked
                                </th>
                            </tr>
                        </thead>


                        {/* Display airline booking records */}
                        <tbody>

                            {/* Show a message when no bookings are available */}
                            {airlineBookings.length === 0 &&
                                <EmptyRow
                                    cols={2}
                                    text="No bookings yet"
                                />
                            }

                            {/* Loop through each airline and display its bookings */}
                            {airlineBookings.map(a => (

                                <tr key={a.airlineName}>

                                    {/* Display airline name */}
                                    <td className="fw-semibold">
                                        {a.airlineName}
                                    </td>

                                    <td>

                                        <div className="d-flex align-items-center gap-2">

                                            {/* Display a bar based on the airline's booking count */}
                                            <div
                                                className="sf-bar"
                                                style={{
                                                    width: `${(a.numberOfBookings / max) * 80}%`
                                                }}
                                            ></div>

                                            {/* Display the actual booking count */}
                                            <span>
                                                {a.numberOfBookings}
                                            </span>

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
