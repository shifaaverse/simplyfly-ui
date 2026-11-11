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


// Step 1: Define all available admin dashboard tabs
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

    // Step 2: Check admin authentication and get the logout function
    const logout = useAuthGuard('ADMIN')

    // Step 3: Store the currently selected dashboard tab
    const [activeTab, setActiveTab] = useState('overview')


    // Step 4: Display the admin dashboard
    return (
        <div className="sf-page">

            {/* Display the navbar with admin navigation tabs */}
            <Navbar
                title="Admin"
                tabs={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                logout={logout}
            />


            {/* Main container for displaying admin sections */}
            <div className="container-fluid px-4 py-4">

                {/* Display the dashboard overview when overview tab is selected */}
                {activeTab === 'overview' && <AdminOverview />}

                {/* Display airline management when airlines tab is selected */}
                {activeTab === 'airlines' && <AdminAirlines />}

                {/* Display passenger management when passengers tab is selected */}
                {activeTab === 'passengers' && <AdminPassengers />}

                {/* Display airport management when airports tab is selected */}
                {activeTab === 'airports' && <AdminAirports />}

                {/* Display flight monitoring when flights tab is selected */}
                {activeTab === 'flights' && <AdminFlights />}

                {/* Display booking and payment management when bookings tab is selected */}
                {activeTab === 'bookings' && <AdminBookings />}

                {/* Display refund management when refunds tab is selected */}
                {activeTab === 'refunds' && <AdminRefunds />}

                {/* Display complaint management when complaints tab is selected */}
                {activeTab === 'complaints' && <AdminComplaints />}

            </div>

        </div>
    )
}

export default AdminDashboard
