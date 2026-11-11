import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAirportOptions, getAvailableRoutes, searchFlights } from "../../store/actions/PassengerAction"
import Alert from "../common/Alert"
import AvailableRoutes from "./AvailableRoutes"
import { getErrorMessage, today } from "../../utils/format"

// Step 1: Create the FlightSearch component.
function FlightSearch({ onSearched, onBack }) {

    // Step 2: Get airport details and previous search details from Redux.
    const airports = useSelector(state => state.passenger.airports)

    // Get the last search so that the form can be filled again.
    const saved = useSelector(state => state.passenger.search)

    const dispatch = useDispatch()

    // Step 3: Store the passenger's search details using useState.
    const [tripType, setTripType] = useState(saved?.tripType ?? 'ONE_WAY')
    const [source, setSource] = useState(saved?.source ?? "")
    const [destination, setDestination] = useState(saved?.destination ?? "")
    const [departureDate, setDepartureDate] = useState(saved?.departureDate ?? today())
    const [returnDate, setReturnDate] = useState(saved?.returnDate ?? "")
    const [adults, setAdults] = useState(saved?.adults ?? 1)
    const [children, setChildren] = useState(saved?.children ?? 0)
    const [infants, setInfants] = useState(saved?.infants ?? 0)
    const [seatClass, setSeatClass] = useState(saved?.seatClass ?? 'ECONOMY')

    // Store error message and loading status.
    const [errMsg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(false)

    // Step 4: Fetch airport options and available routes when the component loads.
    useEffect(() => {
        dispatch(getAirportOptions())
        dispatch(getAvailableRoutes())
    }, [dispatch])

    // Step 5: Fill From and To when the passenger selects an available route.
    const pickRoute = (r) => {
        setSource(r.sourceCode)
        setDestination(r.destinationCode)

        // Keep the departure date within the route's operating date range.
        if (departureDate < r.firstDate || departureDate > r.lastDate)
            setDepartureDate(r.firstDate)
    }

    // Step 6: Swap the source and destination.
    const swap = () => {
        setSource(destination)
        setDestination(source)
    }

    // Step 7: Validate the search details and request flights.
    const search = async (e) => {

        // Prevent the browser's default form submission.
        e.preventDefault()

        setErrMsg("")

        // Source and destination cannot be the same.
        if (source === destination) {
            setErrMsg("From and To cannot be same")
            return
        }

        // Return date must be later than departure date for round trips.
        if (tripType === 'ROUND_TRIP' && returnDate <= departureDate) {
            setErrMsg("Return date must be later than departure date")
            return
        }

        // Every infant must travel with an adult.
        if (Number(infants) > Number(adults)) {
            setErrMsg("Each infant must travel with an adult")
            return
        }

        setLoading(true)

        try {
            // Send the search details to the backend through Redux.
            await dispatch(searchFlights({
                tripType,
                source,
                destination,
                departureDate,
                returnDate,
                adults: Number(adults),
                children: Number(children),
                infants: Number(infants),
                seatClass
            }))

            // Stop the loading indicator after a successful search.
            setLoading(false)

            // Navigate to the flight results screen.
            onSearched()
            return
        }
        catch (err) {
            // Display the error returned by the API.
            setErrMsg(getErrorMessage(err))
        }

        setLoading(false)
    }

    // Step 8: Reusable function to create passenger count inputs.
    const counter = (text, hint, value, setter, min) => (
        <div className="col-4">
            <label className="form-label small mb-1">
                {text} <span className="text-muted">{hint}</span>
            </label>

            <input
                type="number"
                className="form-control"
                min={min}
                max={9}
                value={value}
                onChange={(e) => setter(e.target.value)}
            />
        </div>
    )

    // Step 9: Display the flight search form.
    return (
        <div className="sf-hero mb-4">

            {/* One-way and round-trip selection buttons. */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                    {['ONE_WAY', 'ROUND_TRIP'].map(t => (
                        <button
                            key={t}
                            type="button"
                            className={`btn btn-sm rounded-pill ${tripType === t ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setTripType(t)}
                        >
                            {t === 'ONE_WAY' ? 'One Way' : 'Round Trip'}
                        </button>
                    ))}
                </div>

                {/* Show Back button only when onBack is provided. */}
                {onBack &&
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => onBack()}
                    >
                        <i className="bi bi-arrow-left me-1"></i>
                        Back to results
                    </button>}
            </div>

            {/* Flight search form. */}
            <form
                className="card sf-search-card"
                onSubmit={(e) => search(e)}
            >
                <div className="card-body">

                    <Alert msg={errMsg} onClose={() => setErrMsg("")} />

                    <div className="row g-3 align-items-end">

                        {/* Step 10: Source airport selection. */}
                        <div className="col-md-3">
                            <label htmlFor="search-from" className="form-label small">
                                From
                            </label>

                            <select
                                id="search-from"
                                className="form-select form-select-lg"
                                required
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            >
                                <option value="">Select city</option>

                                {airports.map(a => (
                                    <option key={a.id} value={a.code}>
                                        {a.city} ({a.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Swap source and destination button. */}
                        <div className="col-auto d-none d-md-block">
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-circle"
                                onClick={() => swap()}
                                title="Swap"
                            >
                                <i className="bi bi-arrow-left-right"></i>
                            </button>
                        </div>

                        {/* Destination airport selection. */}
                        <div className="col-md-3">
                            <label htmlFor="search-to" className="form-label small">
                                To
                            </label>

                            <select
                                id="search-to"
                                className="form-select form-select-lg"
                                required
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            >
                                <option value="">Select city</option>

                                {airports.map(a => (
                                    <option key={a.id} value={a.code}>
                                        {a.city} ({a.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Departure date selection. */}
                        <div className="col-md">
                            <label htmlFor="search-departure" className="form-label small">
                                Departure
                            </label>

                            <input
                                id="search-departure"
                                type="date"
                                className="form-control form-control-lg"
                                required
                                min={today()}
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                            />
                        </div>

                        {/* Return date selection, enabled only for round trips. */}
                        <div className="col-md">
                            <label htmlFor="search-return" className="form-label small">
                                Return
                            </label>

                            <input
                                id="search-return"
                                type="date"
                                className="form-control form-control-lg"
                                disabled={tripType === 'ONE_WAY'}
                                required={tripType === 'ROUND_TRIP'}
                                min={departureDate}
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row g-3 align-items-end mt-1">

                        {/* Step 11: Passenger count selection. */}
                        <div className="col-md-6">
                            <div className="row g-2">

                                {counter('Adults', '(12+)', adults, setAdults, 1)}
                                {counter('Children', '(2-11)', children, setChildren, 0)}
                                {counter('Infants', '(<2)', infants, setInfants, 0)}

                            </div>
                        </div>

                        {/* Travel class selection. */}
                        <div className="col-md-3">
                            <label htmlFor="search-travel-class" className="form-label small">
                                Travel Class
                            </label>

                            <select
                                id="search-travel-class"
                                className="form-select"
                                value={seatClass}
                                onChange={(e) => setSeatClass(e.target.value)}
                            >
                                <option value="ECONOMY">Economy</option>
                                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                <option value="BUSINESS">Business</option>
                            </select>
                        </div>

                        {/* Submit the search form. */}
                        <div className="col-md-3 d-grid">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg fw-semibold"
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Search Flights'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Step 12: Display available routes below the search form. */}
            <AvailableRoutes onPick={pickRoute} />

        </div>
    )
}

export default FlightSearch
