import { useState } from "react"
import useAuthGuard from "../auth/useAuthGuard"
import Navbar from "../common/Navbar"
import AdminOverview from "./AdminOverview"
import AdminAirlines from "./AdminAirlines"
import AdminPassengers from "./AdminPassengers"
import AdminAirports from "./AdminAirports"
import AdminFlights from "./AdminFlights"
import AdminBookings from "./AdminBookings"
import AdminRefunds from "./AdminRefunds"
import AdminComplaints from "./AdminComplaints"

const TABS = [
    { key: 'overview', label: 'Dashboard', icon: 'bi-speedometer2' },
    { key: 'airlines', label: 'Airlines', icon: 'bi-building' },
    { key: 'passengers', label: 'Passengers', icon: 'bi-people' },
    { key: 'airports', label: 'Airports', icon: 'bi-geo-alt' },
    { key: 'flights', label: 'Flight Monitoring', icon: 'bi-airplane' },
    { key: 'bookings', label: 'Bookings & Payments', icon: 'bi-ticket-perforated' },
    { key: 'refunds', label: 'Refunds', icon: 'bi-arrow-counterclockwise' },
    { key: 'complaints', label: 'Complaints', icon: 'bi-chat-left-text' }
]

function AdminDashboard() {
    const logout = useAuthGuard('ADMIN')
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="sf-page">
            <Navbar title="Admin" tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />
            <div className="container-fluid px-4 py-4">
                {activeTab === 'overview' && <AdminOverview />}
                {activeTab === 'airlines' && <AdminAirlines />}
                {activeTab === 'passengers' && <AdminPassengers />}
                {activeTab === 'airports' && <AdminAirports />}
                {activeTab === 'flights' && <AdminFlights />}
                {activeTab === 'bookings' && <AdminBookings />}
                {activeTab === 'refunds' && <AdminRefunds />}
                {activeTab === 'complaints' && <AdminComplaints />}
            </div>
        </div>
    )
}

export default AdminDashboard
