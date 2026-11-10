import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FLIGHTS_PER_PAGE, getFlights, selectFlight } from "../../store/actions/PassengerAction"
import Alert from "../common/Alert"
import { formatDate, formatDuration, formatMoney, formatTime, getErrorMessage, label } from "../../utils/format"

const SORT_OPTIONS = [
    { value: 'PRICE', text: 'Cheapest' },
    { value: 'DEPARTURE', text: 'Earliest departure' },
    { value: 'ARRIVAL', text: 'Earliest arrival' }
]

// fromTime / toTime are sent to the backend as departure time filter
const TIME_SLOTS = [
    { text: 'Before 6 AM', icon: 'bi-moon-stars', fromTime: '', toTime: '06:00' },
    { text: '6 AM - 12 PM', icon: 'bi-brightness-alt-high', fromTime: '06:00', toTime: '12:00' },
    { text: '12 PM - 6 PM', icon: 'bi-sun', fromTime: '12:00', toTime: '18:00' },
    { text: 'After 6 PM', icon: 'bi-moon', fromTime: '18:00', toTime: '' }
]

const NO_FILTERS = { airline: '', fromTime: '', toTime: '', maxPrice: '', sortBy: 'PRICE' }

function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null
    const pages = Array.from({ length: totalPages }, (_, i) => i)
    return (
        <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page - 1)}>Previous</button>
                </li>
                {pages.map(p => (
                    <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onChange(p)}>{p + 1}</button>
                    </li>
                ))}
                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page + 1)}>Next</button>
                </li>
            </ul>
        </nav>
    )
}

/* One list of flights (departure or return) - shows the page given by the backend */
function FlightList({ title, result, page, onPage, selected, journeyType, filtersApplied, onClearFilters }) {
    const dispatch = useDispatch()
    const flights = result?.list ?? []
    const info = result?.paginationInfo

    return (
        <div className="mb-4">
            <h5 className="sf-section-title">{title}</h5>

            {flights.length === 0 && !filtersApplied &&
                <div className="card sf-card"><div className="card-body text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    No flights for this route on this date with enough seats in this class.
                    Use "Modify search" to try another date or route.
                </div></div>}

            {flights.length === 0 && filtersApplied &&
                <div className="card sf-card"><div className="card-body text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    No flights match your filters.
                    <button type="button" className="btn btn-link btn-sm" onClick={() => onClearFilters()}>Clear all filters</button>
                </div></div>}

            {flights.length > 0 &&
                <div className="small text-muted mb-2">
                    Showing {page * FLIGHTS_PER_PAGE + 1}-{page * FLIGHTS_PER_PAGE + info.numRecordsInPage} of {info.totalRecords} flights
                </div>}

            {flights.map(f => {
                const isSelected = selected?.instanceId === f.instanceId
                return (
                    <div key={f.instanceId} className={`card sf-flight-card mb-2 ${isSelected ? 'selected' : ''}`}>
                        <div className="card-body row align-items-center g-2">
                            <div className="col-md-3">
                                <div className="fw-bold">{f.airlineName}</div>
                                <div className="small text-muted">{f.flightNumber} · {label(f.seatClass)}</div>
                            </div>
                            <div className="col-4 col-md-2 text-center">
                                <div className="fs-5 fw-bold">{formatTime(f.departureTime)}</div>
                                <div className="small text-muted">{f.source}</div>
                            </div>
                            <div className="col-4 col-md-2 text-center">
                                <div className="small text-muted">{formatDuration(f.durationMinutes)}</div>
                                <div className="sf-line"></div>
                                <div className="small text-success">Non-stop</div>
                            </div>
                            <div className="col-4 col-md-2 text-center">
                                <div className="fs-5 fw-bold">{formatTime(f.arrivalTime)}</div>
                                <div className="small text-muted">{f.destination}</div>
                            </div>
                            <div className="col-md-3 text-md-end">
                                <div className="fs-5 fw-bold">{formatMoney(f.fare)}</div>
                                <div className="small text-muted">per adult · {f.availableSeats} seats left</div>
                                <div className="small text-muted"><i className="bi bi-suitcase me-1"></i>{f.baggageInfo}</div>
                                <button className={`btn btn-sm mt-1 ${isSelected ? 'btn-success' : 'btn-outline-primary'}`}
                                    title={isSelected ? 'Click again to remove' : 'Select this flight'}
                                    onClick={() => dispatch(selectFlight(journeyType, f))}>
                                    {isSelected ? <><i className="bi bi-check-lg me-1"></i>Selected</> : 'Select'}
                                </button>
                                {isSelected && <div className="small text-muted">Click again to remove</div>}
                            </div>
                        </div>
                    </div>
                )
            })}

            <Pagination page={page} totalPages={info?.totalPages ?? 0} onChange={(p) => onPage(p)} />
        </div>
    )
}

/* Results page: summary bar on top, filters on the left, flights on the right */
function FlightResults({ onContinue, onModify }) {
    const dispatch = useDispatch()
    const search = useSelector(state => state.passenger.search)
    const onwardResult = useSelector(state => state.passenger.onwardResult)
    const returnResult = useSelector(state => state.passenger.returnResult)
    const selectedOnward = useSelector(state => state.passenger.selectedOnward)
    const selectedReturn = useSelector(state => state.passenger.selectedReturn)

    const [filters, setFilters] = useState(NO_FILTERS)
    const [priceInput, setPriceInput] = useState('')
    const [pages, setPages] = useState({ DEPARTURE: 0, RETURN: 0 })
    const [errMsg, setErrMsg] = useState("")

    const isRound = search.tripType === 'ROUND_TRIP'
    const ready = selectedOnward && (!isRound || selectedReturn)
    const filtersApplied = filters.airline !== '' || filters.fromTime !== '' || filters.toTime !== '' || filters.maxPrice !== ''

    // Airlines for the airline filter (departure + return)
    const airlines = [...new Set([...(onwardResult?.airlines ?? []), ...(returnResult?.airlines ?? [])])].sort((a, b) => a.localeCompare(b))

    // Ask the backend for a page of flights
    const loadFlights = async (journeyType, newFilters, page) => {
        setErrMsg("")
        try {
            await dispatch(getFlights(journeyType, search, newFilters, page))
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Filter or sorting changed: filters are common for departure and return, start from page 1
    const applyFilters = (newFilters) => {
        setFilters(newFilters)
        setPages({ DEPARTURE: 0, RETURN: 0 })
        void loadFlights('DEPARTURE', newFilters, 0)
        if (isRound)
            void loadFlights('RETURN', newFilters, 0)
    }

    const changePage = (journeyType, page) => {
        setPages({ ...pages, [journeyType]: page })
        void loadFlights(journeyType, filters, page)
    }

    const pickSlot = (slot) => {
        const active = filters.fromTime === slot.fromTime && filters.toTime === slot.toTime
        applyFilters({ ...filters, fromTime: active ? '' : slot.fromTime, toTime: active ? '' : slot.toTime })
    }

    const applyPrice = (e) => {
        e.preventDefault()
        applyFilters({ ...filters, maxPrice: priceInput })
    }

    const clearFilters = () => {
        setPriceInput('')
        applyFilters({ ...NO_FILTERS, sortBy: filters.sortBy })
    }

    return (
        <>
            {/* Search summary */}
            <div className="sf-hero py-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div className="text-white">
                    <div className="fw-bold fs-5">
                        {search.source} <i className="bi bi-arrow-right mx-1"></i> {search.destination}
                        {isRound && <> <i className="bi bi-arrow-right mx-1"></i> {search.source}</>}
                    </div>
                    <div className="small opacity-75">
                        {formatDate(search.departureDate)}{isRound && ` - ${formatDate(search.returnDate)}`}
                        {' · '}{search.adults} Adult{search.children > 0 && `, ${search.children} Child`}{search.infants > 0 && `, ${search.infants} Infant`}
                        {' · '}{label(search.seatClass)}
                    </div>
                </div>
                <button className="btn btn-light btn-sm fw-semibold" onClick={() => onModify()}>
                    <i className="bi bi-pencil me-1"></i>Modify search
                </button>
            </div>

            <Alert msg={errMsg} onClose={() => setErrMsg("")} />

            <div className="row g-3">
                {/* Filters */}
                <div className="col-lg-3">
                    <div className="card sf-card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold"><i className="bi bi-funnel me-1"></i>Filters</span>
                                {filtersApplied &&
                                    <button type="button" className="btn btn-link btn-sm p-0" onClick={() => clearFilters()}>Clear all</button>}
                            </div>

                            <div className="small fw-semibold mb-1">Airline</div>
                            <select className="form-select form-select-sm mb-3" value={filters.airline}
                                onChange={(e) => applyFilters({ ...filters, airline: e.target.value })}>
                                <option value="">All airlines</option>
                                {airlines.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>

                            <div className="small fw-semibold mb-1">Departure time</div>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                                {TIME_SLOTS.map(s => (
                                    <button key={s.text} type="button"
                                        className={`btn btn-sm ${filters.fromTime === s.fromTime && filters.toTime === s.toTime ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => pickSlot(s)}>
                                        <i className={`bi ${s.icon} me-1`}></i>{s.text}
                                    </button>
                                ))}
                            </div>

                            <div className="small fw-semibold mb-1">Max price (per adult)</div>
                            <form className="input-group input-group-sm" onSubmit={(e) => applyPrice(e)}>
                                <span className="input-group-text">₹</span>
                                <input type="number" min="1" className="form-control" placeholder="e.g. 5000"
                                    value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                                <button type="submit" className="btn btn-outline-primary">Apply</button>
                            </form>
                            {filters.maxPrice !== '' &&
                                <div className="small text-muted mt-1">Fares up to {formatMoney(filters.maxPrice)}</div>}
                        </div>
                    </div>
                </div>

                {/* Flights */}
                <div className="col-lg-9">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <span className="small text-muted me-1">Sort by</span>
                        {SORT_OPTIONS.map(o => (
                            <button key={o.value} type="button"
                                className={`btn btn-sm rounded-pill ${filters.sortBy === o.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => applyFilters({ ...filters, sortBy: o.value })}>
                                {o.text}
                            </button>
                        ))}
                    </div>

                    <div className={isRound ? 'row g-3' : ''}>
                        <div className={isRound ? 'col-xl-6' : ''}>
                            <FlightList title={`Departure · ${search.source} → ${search.destination} · ${formatDate(search.departureDate)}`}
                                result={onwardResult} page={pages.DEPARTURE} onPage={(p) => changePage('DEPARTURE', p)}
                                selected={selectedOnward} journeyType="DEPARTURE"
                                filtersApplied={filtersApplied} onClearFilters={clearFilters} />
                        </div>
                        {isRound && <div className="col-xl-6">
                            <FlightList title={`Return · ${search.destination} → ${search.source} · ${formatDate(search.returnDate)}`}
                                result={returnResult} page={pages.RETURN} onPage={(p) => changePage('RETURN', p)}
                                selected={selectedReturn} journeyType="RETURN"
                                filtersApplied={filtersApplied} onClearFilters={clearFilters} />
                        </div>}
                    </div>
                </div>
            </div>

            {ready && (
                <div className="sf-sticky-bar">
                    <div>
                        <b>{selectedOnward.airlineName} {selectedOnward.flightNumber}</b>
                        {isRound && <> + <b>{selectedReturn.airlineName} {selectedReturn.flightNumber}</b></>}
                        <span className="ms-2 text-muted small">
                            {search.adults} Adult{search.children > 0 && `, ${search.children} Child`}{search.infants > 0 && `, ${search.infants} Infant`}
                        </span>
                    </div>
                    <button className="btn btn-primary" onClick={() => onContinue()}>Continue to traveller details <i className="bi bi-arrow-right"></i></button>
                </div>
            )}
        </>
    )
}

export default FlightResults