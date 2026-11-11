
import { useState } from "react"

import useAuthGuard from "../auth/useAuthGuard"
import Navbar from "../common/Navbar"

import AirlineOverview from "./AirlineOverview"
import RouteManagement from "./RouteManagement"
import FlightManagement from "./FlightManagement"
import ScheduleManagement from "./ScheduleManagement"
import AirlineBookings from "./AirlineBookings"
import AirlineRefunds from "./AirlineRefunds"
import AirlineComplaints from "./AirlineComplaints"
import AirlineProfile from "./AirlineProfile"


// Step 1: Define all tabs available in the airline dashboard
const TABS = [
    { key: 'overview', label: 'Dashboard', icon: 'bi-speedometer2' },
    { key: 'routes', label: 'Routes', icon: 'bi-signpost-split' },
    { key: 'flights', label: 'Flights & Fares', icon: 'bi-airplane' },
    { key: 'schedules', label: 'Schedules & Status', icon: 'bi-calendar-week' },
    { key: 'bookings', label: 'Passenger Bookings', icon: 'bi-people' },
    { key: 'refunds', label: 'Refunds', icon: 'bi-arrow-counterclockwise' },
    { key: 'complaints', label: 'Complaints', icon: 'bi-chat-left-text' },
    { key: 'profile', label: 'Profile', icon: 'bi-building' }
]


function AirlineDashboard() {

    // Step 2: Check airline authentication and get the logout function
    const logout = useAuthGuard('AIRLINE')

    // Step 3: Store the currently selected dashboard tab
    const [activeTab, setActiveTab] = useState('overview')


    // Step 4: Display the airline dashboard
    return (
        <div className="sf-page">

            {/* Display the navigation bar with all airline dashboard tabs */}
            <Navbar
                title="Airline"
                tabs={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                logout={logout}
            />

            {/* Main content area of the dashboard */}
            <div className="container-fluid px-4 py-4">

                {/* Display the component based on the selected tab */}
                {activeTab === 'overview' && <AirlineOverview />}

                {activeTab === 'routes' && <RouteManagement />}

                {activeTab === 'flights' && <FlightManagement />}

                {activeTab === 'schedules' && <ScheduleManagement />}

                {activeTab === 'bookings' && <AirlineBookings />}

                {activeTab === 'refunds' && <AirlineRefunds />}

                {activeTab === 'complaints' && <AirlineComplaints />}

                {activeTab === 'profile' && <AirlineProfile />}

            </div>

        </div>
    )
}

export default AirlineDashboard
