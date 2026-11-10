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
    const logout = useAuthGuard('AIRLINE')
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="sf-page">
            <Navbar title="Airline" tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />
            <div className="container-fluid px-4 py-4">
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
