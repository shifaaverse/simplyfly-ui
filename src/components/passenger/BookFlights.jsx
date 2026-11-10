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
    const search = useSelector(state => state.passenger.search)
    const [screen, setScreen] = useState(search ? 'results' : 'search')

    if (screen === 'booking' && search)
        return <BookingFlow back={() => setScreen('results')} goToTrips={goToTrips} />

    if (screen === 'results' && search)
        return <FlightResults onContinue={() => setScreen('booking')} onModify={() => setScreen('search')} />

    return <FlightSearch onSearched={() => setScreen('results')}
        onBack={search ? () => setScreen('results') : null} />
}

export default BookFlights