import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAirportOptions, getAvailableRoutes, searchFlights } from "../../store/actions/PassengerAction"
import Alert from "../common/Alert"
import AvailableRoutes from "./AvailableRoutes"
import { getErrorMessage, today } from "../../utils/format"

function FlightSearch({ onSearched, onBack }) {
    const airports = useSelector(state => state.passenger.airports)
    const saved = useSelector(state => state.passenger.search) // last search, used to refill the form
    const dispatch = useDispatch()
    const [tripType, setTripType] = useState(saved?.tripType ?? 'ONE_WAY')
    const [source, setSource] = useState(saved?.source ?? "")
    const [destination, setDestination] = useState(saved?.destination ?? "")
    const [departureDate, setDepartureDate] = useState(saved?.departureDate ?? today())
    const [returnDate, setReturnDate] = useState(saved?.returnDate ?? "")
    const [adults, setAdults] = useState(saved?.adults ?? 1)
    const [children, setChildren] = useState(saved?.children ?? 0)
    const [infants, setInfants] = useState(saved?.infants ?? 0)
    const [seatClass, setSeatClass] = useState(saved?.seatClass ?? 'ECONOMY')
    const [errMsg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        dispatch(getAirportOptions())
        dispatch(getAvailableRoutes())
    }, [dispatch])

    /* Fill From / To from a route chip; keep the date inside its operating range */
    const pickRoute = (r) => {
        setSource(r.sourceCode)
        setDestination(r.destinationCode)
        if (departureDate < r.firstDate || departureDate > r.lastDate)
            setDepartureDate(r.firstDate)
    }

    const swap = () => {
        setSource(destination)
        setDestination(source)
    }

    const search = async (e) => {
        e.preventDefault()
        setErrMsg("")
        if (source === destination) {
            setErrMsg("From and To cannot be same")
            return
        }
        if (tripType === 'ROUND_TRIP' && returnDate <= departureDate) {
            setErrMsg("Return date must be later than departure date")
            return
        }
        if (Number(infants) > Number(adults)) {
            setErrMsg("Each infant must travel with an adult")
            return
        }
        setLoading(true)
        try {
            await dispatch(searchFlights({
                tripType, source, destination, departureDate, returnDate,
                adults: Number(adults), children: Number(children), infants: Number(infants), seatClass
            }))
            setLoading(false)
            onSearched() // go to the results page
            return
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
        setLoading(false)
    }

    const counter = (text, hint, value, setter, min) => (
        <div className="col-4">
            <label className="form-label small mb-1">{text} <span className="text-muted">{hint}</span></label>
            <input type="number" className="form-control" min={min} max={9} value={value}
                onChange={(e) => setter(e.target.value)} />
        </div>
    )

    return (
        <div className="sf-hero mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                    {['ONE_WAY', 'ROUND_TRIP'].map(t => (
                        <button key={t} type="button" className={`btn btn-sm rounded-pill ${tripType === t ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setTripType(t)}>
                            {t === 'ONE_WAY' ? 'One Way' : 'Round Trip'}
                        </button>
                    ))}
                </div>
                {onBack &&
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => onBack()}>
                        <i className="bi bi-arrow-left me-1"></i>Back to results
                    </button>}
            </div>
            <form className="card sf-search-card" onSubmit={(e) => search(e)}>
                <div className="card-body">
                    <Alert msg={errMsg} onClose={() => setErrMsg("")} />
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small">From</label>
                            <select className="form-select form-select-lg" required value={source} onChange={(e) => setSource(e.target.value)}>
                                <option value="">Select city</option>
                                {airports.map(a => <option key={a.id} value={a.code}>{a.city} ({a.code})</option>)}
                            </select>
                        </div>
                        <div className="col-auto d-none d-md-block">
                            <button type="button" className="btn btn-outline-secondary rounded-circle" onClick={() => swap()} title="Swap">
                                <i className="bi bi-arrow-left-right"></i>
                            </button>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">To</label>
                            <select className="form-select form-select-lg" required value={destination} onChange={(e) => setDestination(e.target.value)}>
                                <option value="">Select city</option>
                                {airports.map(a => <option key={a.id} value={a.code}>{a.city} ({a.code})</option>)}
                            </select>
                        </div>
                        <div className="col-md">
                            <label className="form-label small">Departure</label>
                            <input type="date" className="form-control form-control-lg" required min={today()} value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)} />
                        </div>
                        <div className="col-md">
                            <label className="form-label small">Return</label>
                            <input type="date" className="form-control form-control-lg" disabled={tripType === 'ONE_WAY'}
                                required={tripType === 'ROUND_TRIP'} min={departureDate} value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="row g-3 align-items-end mt-1">
                        <div className="col-md-6">
                            <div className="row g-2">
                                {counter('Adults', '(12+)', adults, setAdults, 1)}
                                {counter('Children', '(2-11)', children, setChildren, 0)}
                                {counter('Infants', '(<2)', infants, setInfants, 0)}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Travel Class</label>
                            <select className="form-select" value={seatClass} onChange={(e) => setSeatClass(e.target.value)}>
                                <option value="ECONOMY">Economy</option>
                                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                <option value="BUSINESS">Business</option>
                            </select>
                        </div>
                        <div className="col-md-3 d-grid">
                            <button className="btn btn-primary btn-lg fw-semibold" disabled={loading}>
                                {loading ? 'Searching...' : 'Search Flights'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <AvailableRoutes onPick={pickRoute} />
        </div>
    )
}

export default FlightSearch