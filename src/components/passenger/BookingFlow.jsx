import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createBooking, createPaymentOrder, getSeats, makePayment, resetBooking, verifyPayment } from "../../store/actions/PassengerAction"
import SeatMap from "./SeatMap"
import FareBreakup from "./FareBreakup"
import Ticket from "./Ticket"
import Alert from "../common/Alert"
import StatusBadge from "../common/StatusBadge"
import { MAX_EXTRA_BAGGAGE, MEALS, TAX_PERCENT, addOnPrice, extrasText } from "../../utils/addons"
import { loadRazorpay, openCheckout } from "../../utils/razorpay"
import { formatDate, formatMoney, formatTime, getErrorMessage, label } from "../../utils/format"

// Child pays 75% and infant pays 10% of the adult fare (same as the backend).
const FACTOR = { ADULT: 1, CHILD: 0.75, INFANT: 0.1 }

// Step 1: Create traveller objects based on the passenger search details.
const buildTravellers = (search) => {
    const list = []

    // Add the required number of travellers for each category.
    const add = (count, category) => {
        for (let i = 0; i < count; i++)
            list.push({
                number: list.length + 1,
                category,
                name: '',
                dateOfBirth: '',
                gender: 'MALE',
                govtIdType: 'AADHAAR',
                govtIdNumber: '',
                mealOption: 'NONE',
                extraBaggageKg: 0
            })
    }

    add(search.adults, 'ADULT')
    add(search.children, 'CHILD')
    add(search.infants, 'INFANT')

    return list
}

function BookingFlow({ back, goToTrips }) {

    // Step 2: Get search, selected flights, seats and booking details from Redux.
    const search = useSelector(state => state.passenger.search)
    const selectedOnward = useSelector(state => state.passenger.selectedOnward)
    const selectedReturn = useSelector(state => state.passenger.selectedReturn)
    const seats = useSelector(state => state.passenger.seats)
    const booking = useSelector(state => state.passenger.currentBooking)

    const dispatch = useDispatch()

    // Step 3: Store the current booking stage and traveller information.
    const [step, setStep] = useState('details')
    const [travellers, setTravellers] = useState(() => buildTravellers(search))

    // Store selected seat IDs separately for departure and return journeys.
    const [departureSeatIds, setDepartureSeatIds] = useState([])
    const [returnSeatIds, setReturnSeatIds] = useState([])

    // Store payment method and demo payment failure option.
    const [method, setMethod] = useState('UPI')
    const [simulateFailure, setSimulateFailure] = useState(false)

    // Store error message and loading state.
    const [errMsg, setErrMsg] = useState("")
    const [busy, setBusy] = useState(false)

    // Step 4: Check whether this is a round-trip booking.
    const isRound = search.tripType === 'ROUND_TRIP'

    // Infants do not require seats, so count only adults and children.
    const seatedCount = Number(search.adults) + Number(search.children)

    // Step 5: Fetch available seats for the selected journeys.
    useEffect(() => {
        dispatch(getSeats(selectedOnward.instanceId, search.seatClass, 'DEPARTURE'))

        if (isRound)
            dispatch(getSeats(selectedReturn.instanceId, search.seatClass, 'RETURN'))
    }, [dispatch, selectedOnward, selectedReturn, search, isRound])

    // Step 6: Update a particular traveller's details.
    const changeTraveller = (index, field, value) => {
        const copy = [...travellers]
        copy[index] = { ...copy[index], [field]: value }
        setTravellers(copy)
    }

    // Step 7: Get the seat number and additional seat charge using the seat ID.
    const seatNumber = (journey, id) => seats[journey].find(s => s.seatId === id)?.seatNumber

    const seatCharge = (journey, id) => seats[journey].find(s => s.seatId === id)?.extraCharge || 0

    // Step 8: Calculate the estimated fare for one journey.
    // The displayed flight fare already includes tax.
    const journeyEstimate = (journey, flight, selected) => {
        const taxRate = 1 + TAX_PERCENT / 100
        let seatIndex = 0
        let total = 0

        travellers.forEach(t => {

            // Infants do not need seats.
            // Other travellers receive the corresponding selected seat charge.
            const seat = t.category === 'INFANT' ? 0 : seatCharge(journey, selected[seatIndex++])

            // Calculate the base fare according to traveller category.
            const base = flight.fare / taxRate * FACTOR[t.category]

            // Add tax and seat charge to the traveller's fare.
            total += Math.round((base + seat) * taxRate * 100) / 100

            // Add meal and extra baggage charges for non-infant travellers.
            if (t.category !== 'INFANT')
                total += addOnPrice(t.mealOption, t.extraBaggageKg)
        })

        return total
    }

    // Step 9: Calculate the estimated total for departure and return journeys.
    const estimate = journeyEstimate('DEPARTURE', selectedOnward, departureSeatIds)
        + (isRound ? journeyEstimate('RETURN', selectedReturn, returnSeatIds) : 0)

    // Step 10: Validate details and create the booking for review.
    const createAndReview = async (e) => {
        e.preventDefault()
        setErrMsg("")

        // Check whether enough seats have been selected for each journey.
        if (departureSeatIds.length !== seatedCount || (isRound && returnSeatIds.length !== seatedCount)) {
            setErrMsg(`Please select ${seatedCount} seat(s) for each journey`)
            return
        }

        setBusy(true)

        try {
            // Send booking details to the backend through Redux.
            await dispatch(createBooking({
                tripType: search.tripType,
                seatClass: search.seatClass,
                departureInstanceId: selectedOnward.instanceId,
                returnInstanceId: isRound ? selectedReturn.instanceId : null,

                // Send traveller details in the required request format.
                travellers: travellers.map(t => ({
                    name: t.name,
                    dateOfBirth: t.dateOfBirth,
                    gender: t.gender,
                    govtIdType: t.govtIdType,
                    govtIdNumber: t.govtIdNumber.trim().toUpperCase(),
                    mealOption: t.mealOption,
                    extraBaggageKg: Number(t.extraBaggageKg) || 0
                })),

                departureSeatIds,
                returnSeatIds: isRound ? returnSeatIds : null
            }))

            // Move to the booking review and payment screen.
            setStep('review')
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))

            // Check whether a selected seat was taken by another passenger.
            const seatTaken = err?.response?.status === 409
                || err?.response?.data?.message?.includes('no longer available')

            if (seatTaken) {
                // Clear previous seat selections.
                setDepartureSeatIds([])
                setReturnSeatIds([])

                // Fetch the latest departure seat availability.
                dispatch(getSeats(selectedOnward.instanceId, search.seatClass, 'DEPARTURE'))

                // Fetch the latest return seat availability for round trips.
                if (isRound)
                    dispatch(getSeats(selectedReturn.instanceId, search.seatClass, 'RETURN'))
            }
        }

        setBusy(false)
    }

    // Step 11: Create a payment order and start the payment process.
    const pay = async () => {
        setBusy(true)
        setErrMsg("")

        try {
            // Ask the backend to create a payment order.
            const order = await dispatch(createPaymentOrder(booking.bookingId))

            // Use Razorpay if it is enabled; otherwise use the demo gateway.
            if (order.enabled)
                await payWithRazorpay(order)
            else {
                await dispatch(makePayment(booking.bookingId, { method, simulateFailure }))
                setStep('result')
            }
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }

        setBusy(false)
    }

    // Step 12: Load Razorpay and open its checkout window.
    const payWithRazorpay = async (order) => {
        const loaded = await loadRazorpay()

        if (!loaded) {
            setErrMsg("Could not load Razorpay. Please check your internet connection.")
            return
        }

        // Open checkout and provide callbacks for payment success and failure.
        openCheckout(order, `PNR ${booking.pnr}`, { onPaid: verify, onError: setErrMsg })
    }

    // Step 13: Verify the Razorpay payment using the response from checkout.
    const verify = async (response) => {
        try {
            await dispatch(verifyPayment(booking.bookingId, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
            }))

            // Move to the result screen after successful verification.
            setStep('result')
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 14: Reset the current booking and return to flight results.
    const startOver = () => {
        dispatch(resetBooking())
        back()
    }

    // Step 15: Reusable seat selection section for each journey.
    const seatPicker = (journey, flight, selected, setSelected) => (
        <div className="card sf-card mb-3">
            <div className="card-header bg-white d-flex justify-content-between">
                <span className="fw-semibold">
                    {label(journey)} · {flight.airlineName} {flight.flightNumber} · {flight.source} → {flight.destination}
                </span>

                <span className="small text-muted">
                    {selected.length}/{seatedCount} selected
                </span>
            </div>

            <div className="card-body">
                {/* SeatMap displays the available seats and handles selection. */}
                <SeatMap
                    seats={seats[journey]}
                    selected={selected}
                    maxSelect={seatedCount}
                    onChange={setSelected}
                />

                {/* Show the selected seat number and any extra seat charge for each traveller. */}
                <div className="small mt-2">
                    {travellers.filter(t => t.category !== 'INFANT').map((t, i) => (
                        <span key={t.number} className="badge text-bg-light border me-1">
                            {t.name || `Traveller ${t.number}`}: {seatNumber(journey, selected[i]) || '—'}
                            {selected[i] && seatCharge(journey, selected[i]) > 0
                                ? ` (+${formatMoney(seatCharge(journey, selected[i]))})`
                                : ''}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )

    /* ---------- Step 3: Display booking result ---------- */
    if (step === 'result' && booking) {

        // Display the ticket when the booking is confirmed.
        if (booking.status === 'CONFIRMED') {
            return (
                <>
                    <div className="alert alert-success d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill fs-4"></i>
                        <div>
                            Booking confirmed! Your PNR is <b>{booking.pnr}</b>. E-ticket generated below.
                        </div>
                    </div>

                    <Ticket booking={booking} />

                    <div className="d-flex gap-2 mt-3 no-print">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                dispatch(resetBooking())
                                goToTrips()
                            }}
                        >
                            Go to My Trips
                        </button>

                        <button className="btn btn-outline-secondary" onClick={() => startOver()}>
                            Book another flight
                        </button>
                    </div>
                </>
            )
        }

        // Display the payment failure message when the booking is not confirmed.
        return (
            <div className="alert alert-danger">
                <h5><i className="bi bi-x-circle me-2"></i>Payment failed</h5>

                <p className="mb-2">
                    Booking {booking.pnr} is <StatusBadge status={booking.status} />.
                    Your held seats were released safely and no amount was charged.
                </p>

                <button className="btn btn-outline-danger" onClick={() => startOver()}>
                    Search again
                </button>
            </div>
        )
    }

    /* ---------- Step 2: Review booking and make payment ---------- */
    if (step === 'review' && booking) {
        return (
            <div className="row g-4">
                <div className="col-lg-8">
                    <h4 className="sf-section-title">Review your booking</h4>

                    <Alert msg={errMsg} onClose={() => setErrMsg("")} />

                    {/* Display each journey in the booking. */}
                    {booking.journeys.map(j => (
                        <div className="card sf-card mb-3" key={j.journeyId}>
                            <div className="card-header bg-white fw-semibold">
                                {label(j.journeyType)} · {j.airlineName} {j.flightNumber} · {formatDate(j.travelDate)}
                            </div>

                            <div className="card-body">
                                <p className="mb-2">
                                    {j.source} {formatTime(j.departureTime)} → {j.destination} {formatTime(j.arrivalTime)} · {label(j.seatClass)}
                                </p>

                                {/* Display traveller, seat, extras and fare details. */}
                                <table className="table table-sm mb-0">
                                    <thead>
                                        <tr>
                                            <th>Traveller</th>
                                            <th>Category</th>
                                            <th>Seat</th>
                                            <th>Meal / Baggage</th>
                                            <th className="text-end">Fare (incl. tax)</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {j.travellers.map(t => (
                                            <tr key={`${t.travellerName}-${t.category}-${t.seatNumber}`}>
                                                <td>{t.travellerName}</td>
                                                <td>{label(t.category)}</td>
                                                <td>
                                                    {t.seatNumber}
                                                    {t.seatPosition && (
                                                        <span className="text-muted small">
                                                            ({label(t.seatPosition)})
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="small">{extrasText(t)}</td>
                                                <td className="text-end">{formatMoney(t.fare)}</td>
                                            </tr>
                                        ))}

                                        <tr className="fw-semibold">
                                            <td colSpan={4}>Journey total</td>
                                            <td className="text-end">{formatMoney(j.amount)}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Display the fare calculation details for each traveller. */}
                                <div className="small text-muted mt-3">How the fare is calculated</div>

                                {j.travellers.map(t => (
                                    <FareBreakup
                                        key={`${t.travellerName}-${t.category}-${t.seatNumber}`}
                                        traveller={t}
                                        seatClass={j.seatClass}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Summary */}
                <div className="col-lg-4">
                    <div className="card sf-card sf-pay-card">
                        <div className="card-body">
                            <div className="small text-muted">PNR (on hold for 10 minutes)</div>
                            <div className="fs-4 fw-bold mb-3">{booking.pnr}</div>

                            <div className="d-flex justify-content-between fs-5 mb-3">
                                <span>Total</span>
                                <b>{formatMoney(booking.totalAmount)}</b>
                            </div>

                            {/* Select the payment method. */}
                            <div className="form-label small">Payment method</div>

                            {['UPI', 'CARD', 'NET_BANKING'].map(m => (
                                <div className="form-check" key={m}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id={m}
                                        checked={method === m}
                                        onChange={() => setMethod(m)}
                                    />

                                    <label className="form-check-label" htmlFor={m}>
                                        {label(m)}
                                    </label>
                                </div>
                            ))}

                            {/* Demo option to simulate a payment failure. */}
                            <div className="form-check mt-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="fail"
                                    checked={simulateFailure}
                                    onChange={() => setSimulateFailure(!simulateFailure)}
                                />

                                <label className="form-check-label small text-muted" htmlFor="fail">
                                    Simulate payment failure (demo gateway)
                                </label>
                            </div>

                            {/* Start payment when the button is clicked. */}
                            <div className="d-grid mt-3">
                                <button
                                    className="btn btn-success btn-lg"
                                    disabled={busy}
                                    onClick={() => pay()}
                                >
                                    {busy ? 'Processing...' : `Pay ${formatMoney(booking.totalAmount)}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* ---------- Step 1: Enter traveller details and select seats ---------- */
    return (
        <form onSubmit={(e) => createAndReview(e)}>

            {/* Return to the flight results screen. */}
            <button type="button" className="btn btn-link px-0 mb-2" onClick={() => back()}>
                <i className="bi bi-arrow-left"></i> Back to results
            </button>

            <Alert msg={errMsg} onClose={() => setErrMsg("")} />

            <div className="row g-4">

                {/* Traveller Details Section */}
                <div className="col-xl-6">
                    <h4 className="sf-section-title">Traveller details</h4>

                    {/* Generate a form for each traveller. */}
                    {travellers.map((t, i) => (
                        <div className="card sf-card mb-2" key={t.number}>
                            <div className="card-body">
                                <div className="fw-semibold mb-2">
                                    Traveller {t.number}
                                    <span className="badge text-bg-light border">{t.category}</span>
                                </div>

                                <div className="row g-2">

                                    {/* Traveller name */}
                                    <div className="col-md-6">
                                        <input
                                            className="form-control"
                                            placeholder="Full name"
                                            required
                                            value={t.name}
                                            onChange={(e) => changeTraveller(i, 'name', e.target.value)}
                                        />
                                    </div>

                                    {/* Date of birth */}
                                    <div className="col-md-3">
                                        <input
                                            type="date"
                                            className="form-control"
                                            required
                                            value={t.dateOfBirth}
                                            title="Date of birth"
                                            onChange={(e) => changeTraveller(i, 'dateOfBirth', e.target.value)}
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="col-md-3">
                                        <select
                                            className="form-select"
                                            value={t.gender}
                                            onChange={(e) => changeTraveller(i, 'gender', e.target.value)}
                                        >
                                            <option>MALE</option>
                                            <option>FEMALE</option>
                                            <option>OTHER</option>
                                        </select>
                                    </div>

                                    {/* Additional fields are displayed only for adults and children. */}
                                    {t.category !== 'INFANT' && (
                                        <>
                                            {/* Government ID type */}
                                            <div className="col-md-6">
                                                <select
                                                    className="form-select"
                                                    value={t.govtIdType}
                                                    onChange={(e) => changeTraveller(i, 'govtIdType', e.target.value)}
                                                >
                                                    <option value="AADHAAR">Aadhaar</option>
                                                    <option value="PAN">PAN</option>
                                                    <option value="PASSPORT">Passport</option>
                                                    <option value="DRIVING_LICENSE">Driving License</option>
                                                </select>
                                            </div>

                                            {/* Government ID number */}
                                            <div className="col-md-6">
                                                <input
                                                    className="form-control"
                                                    placeholder="ID number"
                                                    required
                                                    value={t.govtIdNumber}
                                                    onChange={(e) => changeTraveller(i, 'govtIdNumber', e.target.value.toUpperCase())}
                                                />
                                            </div>

                                            {/* Meal selection */}
                                            <div className="col-md-6">
                                                <label htmlFor={`meal-${t.number}`} className="form-label small mb-0">
                                                    Meal
                                                </label>

                                                <select
                                                    id={`meal-${t.number}`}
                                                    className="form-select"
                                                    value={t.mealOption}
                                                    onChange={(e) => changeTraveller(i, 'mealOption', e.target.value)}
                                                >
                                                    {MEALS.map(m => (
                                                        <option key={m.value} value={m.value}>
                                                            {m.text}{m.price > 0 ? ` (+₹${m.price})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Extra baggage selection */}
                                            <div className="col-md-6">
                                                <label htmlFor={`baggage-${t.number}`} className="form-label small mb-0">
                                                    Extra baggage (kg, ₹400/kg)
                                                </label>

                                                <input
                                                    id={`baggage-${t.number}`}
                                                    type="number"
                                                    min="0"
                                                    max={MAX_EXTRA_BAGGAGE}
                                                    className="form-control"
                                                    value={t.extraBaggageKg}
                                                    onChange={(e) => changeTraveller(i, 'extraBaggageKg', e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Infants travel on a parent's lap and do not need seats. */}
                                    {t.category === 'INFANT' && (
                                        <div className="col-12 small text-muted">
                                            Infant travels on lap — no seat required.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Seat Selection Section */}
                <div className="col-xl-6">
                    <h4 className="sf-section-title">Select seats</h4>

                    {/* Departure seat selection. */}
                    {seatPicker('DEPARTURE', selectedOnward, departureSeatIds, setDepartureSeatIds)}

                    {/* Return seat selection is displayed only for round trips. */}
                    {isRound && seatPicker('RETURN', selectedReturn, returnSeatIds, setReturnSeatIds)}
                </div>
            </div>

            {/* Display estimated fare and submit the booking for review. */}
            <div className="sf-sticky-bar">
                <span className="small">
                    Estimated fare: <b>{formatMoney(estimate)}</b>
                    <span className="text-muted">
                        (with 5% tax, seat charges and extras. The server confirms the final fare on the next step.)
                    </span>
                </span>

                <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? 'Holding seats...' : 'Review fare'}
                    <i className="bi bi-arrow-right"></i>
                </button>
            </div>
        </form>
    )
}

export default BookingFlow
