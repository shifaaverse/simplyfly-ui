import { useState } from "react"
import useAuthGuard from "../auth/useAuthGuard"
import Navbar from "../common/Navbar"
import BookFlights from "./BookFlights"
import MyBookings from "./MyBookings"
import MyPayments from "./MyPayments"
import MyRefunds from "./MyRefunds"
import MyComplaints from "./MyComplaints"
import PassengerProfile from "./PassengerProfile"

// Step 1: Define all the passenger dashboard tabs.
const TABS = [
    { key: 'book', label: 'Book Flights', icon: 'bi-search' },
    { key: 'trips', label: 'My Trips', icon: 'bi-suitcase-lg' },
    { key: 'payments', label: 'Payments', icon: 'bi-credit-card' },
    { key: 'refunds', label: 'Refund Status', icon: 'bi-arrow-counterclockwise' },
    { key: 'complaints', label: 'Support', icon: 'bi-chat-left-text' },
    { key: 'profile', label: 'Profile', icon: 'bi-person' }
]

// Step 2: Create the PassengerDashboard component.
function PassengerDashboard() {

    // Check whether the logged-in user has PASSENGER access.
    // This custom hook also provides the logout function.
    const logout = useAuthGuard('PASSENGER')

    // Store the currently selected dashboard tab.
    // Initially, the Book Flights tab is selected.
    const [activeTab, setActiveTab] = useState('book')

    // Step 3: Display the passenger dashboard.
    return (
        <div className="sf-page">

            {/* Display the navigation bar and pass the required props. */}
            <Navbar
                title="Passenger"
                tabs={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                logout={logout}
            />

            {/* Display the selected passenger module. */}
            <div className="container-fluid px-4 py-4">

                {/* Display BookFlights when the book tab is active. */}
                {activeTab === 'book' &&
                    <BookFlights
                        goToTrips={() => setActiveTab('trips')}
                    />
                }

                {/* Display MyBookings when the trips tab is active. */}
                {activeTab === 'trips' && <MyBookings />}

                {/* Display MyPayments when the payments tab is active. */}
                {activeTab === 'payments' && <MyPayments />}

                {/* Display MyRefunds when the refunds tab is active. */}
                {activeTab === 'refunds' && <MyRefunds />}

                {/* Display MyComplaints when the complaints tab is active. */}
                {activeTab === 'complaints' && <MyComplaints />}

                {/* Display PassengerProfile when the profile tab is active. */}
                {activeTab === 'profile' && <PassengerProfile />}

            </div>
        </div>
    )
}

export default PassengerDashboard
