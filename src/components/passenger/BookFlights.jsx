import { useState } from "react"
import { useSelector } from "react-redux"
import FlightSearch from "./FlightSearch"
import FlightResults from "./FlightResults"
import BookingFlow from "./BookingFlow"

/*
 Three screens, like MakeMyTrip:
 1. search   -> From / To / date / travellers
 2. results  -> all flights with filters, sorting and pages
 3. booking  -> travellers, seats, review, payment, ticket
*/

function BookFlights({ goToTrips }) {

    // Step 1: Get the passenger's search details from Redux.
    const search = useSelector(state => state.passenger.search)

    // Step 2: Decide which screen should be displayed initially.
    const [screen, setScreen] = useState(search ? 'results' : 'search')

    // Step 3: Display the booking process when the user enters the booking screen.
    if (screen === 'booking' && search)
        return <BookingFlow back={() => setScreen('results')} goToTrips={goToTrips} />

    // Step 4: Display available flight results when a search exists.
    if (screen === 'results' && search)
        return <FlightResults
            onContinue={() => setScreen('booking')}
            onModify={() => setScreen('search')}
        />

    // Step 5: Display the flight search screen.
    return (
        <FlightSearch
            onSearched={() => setScreen('results')}
            onBack={search ? () => setScreen('results') : null}
        />
    )
}

export default BookFlights
