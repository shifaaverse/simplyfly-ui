import { useState } from "react"
import useAuthGuard from "../auth/useAuthGuard"
import Navbar from "../common/Navbar"
import BookFlights from "./BookFlights"
import MyBookings from "./MyBookings"
import MyPayments from "./MyPayments"
import MyRefunds from "./MyRefunds"
import MyComplaints from "./MyComplaints"
import PassengerProfile from "./PassengerProfile"

const TABS = [
    { key: 'book', label: 'Book Flights', icon: 'bi-search' },
    { key: 'trips', label: 'My Trips', icon: 'bi-suitcase-lg' },
    { key: 'payments', label: 'Payments', icon: 'bi-credit-card' },
    { key: 'refunds', label: 'Refund Status', icon: 'bi-arrow-counterclockwise' },
    { key: 'complaints', label: 'Support', icon: 'bi-chat-left-text' },
    { key: 'profile', label: 'Profile', icon: 'bi-person' }
]

function PassengerDashboard() {
    const logout = useAuthGuard('PASSENGER')
    const [activeTab, setActiveTab] = useState('book')

    return (
        <div className="sf-page">
            <Navbar title="Passenger" tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />
            <div className="container-fluid px-4 py-4">
                {activeTab === 'book' && <BookFlights goToTrips={() => setActiveTab('trips')} />}
                {activeTab === 'trips' && <MyBookings />}
                {activeTab === 'payments' && <MyPayments />}
                {activeTab === 'refunds' && <MyRefunds />}
                {activeTab === 'complaints' && <MyComplaints />}
                {activeTab === 'profile' && <PassengerProfile />}
            </div>
        </div>
    )
}

export default PassengerDashboard
