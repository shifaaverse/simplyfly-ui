import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

// Step 1: Fetch all available airport options.
export const getAirportOptions = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airport/all`)
    dispatch({
        type: 'FETCH_AIRPORTS_PASSENGER',
        payload: response.data
    })
}

// Step 2: Fetch available routes for passengers.
export const getAvailableRoutes = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/flight/routes`)
    dispatch({
        type: 'FETCH_AVAILABLE_ROUTES',
        payload: response.data
    })
}

// Number of flights displayed on each page.
export const FLIGHTS_PER_PAGE = 10

// Default filter values used during the initial flight search.
const NO_FILTERS = { airline: '', fromTime: '', toTime: '', maxPrice: '', sortBy: 'PRICE' }

/*
 Params for one page of flights. Filtering, sorting and paging are done by the backend.
 DEPARTURE = source -> destination on departure date
 RETURN    = destination -> source on return date
 filters   = { airline, fromTime, toTime, maxPrice, sortBy }   (empty value = no filter)
*/

// Step 3: Prepare the search parameters based on the journey type.
const getSearchParams = (search, journeyType, filters, page) => {

    // Check whether this is the departure journey.
    const isDeparture = journeyType === 'DEPARTURE'

    // Return the parameters that will be sent to the flight search API.
    return {
        source: isDeparture ? search.source : search.destination,
        destination: isDeparture ? search.destination : search.source,
        date: isDeparture ? search.departureDate : search.returnDate,
        seatClass: search.seatClass,
        travellers: Number(search.adults) + Number(search.children), // infants do not take a seat
        airline: filters.airline || undefined,
        fromTime: filters.fromTime || undefined,
        toTime: filters.toTime || undefined,
        maxPrice: filters.maxPrice || undefined,
        sortBy: filters.sortBy,
        page,
        size: FLIGHTS_PER_PAGE
    }
}

/*
 One way  : 1 search call
 Round trip: 2 search calls (onward + return on reverse route)
*/

// Step 4: Search flights for a one-way or round-trip journey.
export const searchFlights = (search) => async (dispatch) => {

    // Fetch the onward/departure flights.
    const onward = await axios.get(`${API_SERVER_URL_DEV}/api/flight/search`, {
        params: getSearchParams(search, 'DEPARTURE', NO_FILTERS, 0)
    })

    // Initially, there are no return flight results.
    let returnResult = null

    // If the passenger selected a round trip, search for return flights too.
    if (search.tripType === 'ROUND_TRIP') {
        const resp = await axios.get(`${API_SERVER_URL_DEV}/api/flight/search`, {
            params: getSearchParams(search, 'RETURN', NO_FILTERS, 0)
        })
        returnResult = resp.data
    }

    // Store the search details and both sets of results in Redux.
    dispatch({
        type: 'SEARCH_FLIGHTS',
        payload: { search, onward: onward.data, returnResult }
    })
}

// Step 5: Fetch one page of flights again when filters, sorting or page changes.
export const getFlights = (journeyType, search, filters, page) => async (dispatch) => {

    // Request the selected journey type with the current filters and page.
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/flight/search`, {
        params: getSearchParams(search, journeyType, filters, page)
    })

    // Send the fetched flight results to Redux.
    dispatch({
        type: 'FETCH_FLIGHTS',
        payload: { journeyType, result: response.data }
    })
}

// Step 6: Store the passenger's selected flight in Redux.
export const selectFlight = (journeyType, flight) => {
    return {
        type: 'SELECT_FLIGHT',
        payload: { journeyType, flight }
    }
}

// Step 7: Fetch available seats for a selected flight instance.
export const getSeats = (instanceId, seatClass, journeyType) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/flight/seats/${instanceId}`, { params: { seatClass } })
    dispatch({
        type: 'FETCH_SEATS',
        payload: { journeyType, seats: response.data }
    })
}

// Step 8: Create a booking for the passenger.
export const createBooking = (booking) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/booking/add`, booking, authHeader())

    // Store the newly created booking in Redux.
    dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: response.data
    })

    // Return the booking details to the calling component.
    return response.data
}

// Step 9: Make a payment for an existing booking.
export const makePayment = (bookingId, payment) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/payment/${bookingId}`, payment, authHeader())

    // Fetch the latest booking details after the payment request.
    const resp = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/booking/${bookingId}`, authHeader())

    // Update the current booking in Redux.
    dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: resp.data
    })

    // Return the payment response.
    return response.data
}

// Razorpay (test mode). Step 1: Create the payment order. Step 2: Verify payment after checkout.

// Step 10: Create a Razorpay payment order.
export const createPaymentOrder = (bookingId) => async () => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/payment/order/${bookingId}`, null, authHeader())
    return response.data
}

// Step 11: Verify the payment after Razorpay checkout.
export const verifyPayment = (bookingId, payment) => async (dispatch) => {

    // Send the payment details to the backend for verification.
    await axios.post(`${API_SERVER_URL_DEV}/api/passenger/payment/verify/${bookingId}`, payment, authHeader())

    // Fetch the latest booking details after verification.
    const resp = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/booking/${bookingId}`, authHeader())

    // Update the current booking in Redux.
    dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: resp.data
    })
}

// Step 12: Reset the current booking information in Redux.
export const resetBooking = () => {
    return { type: 'RESET_BOOKING' }
}

// Step 13: Fetch all bookings belonging to the logged-in passenger.
export const getMyBookings = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/booking/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_BOOKINGS',
        payload: response.data
    })
}

// Step 14: Fetch all payment records belonging to the passenger.
export const getMyPayments = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/payment/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_PAYMENTS',
        payload: response.data
    })
}

// Step 15: Fetch all refund records belonging to the passenger.
export const getMyRefunds = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/refund/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_REFUNDS',
        payload: response.data
    })
}

// Step 16: Submit a refund request.
export const requestRefund = (refund) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/refund/add`, refund, authHeader())

    // Add the new refund to Redux.
    dispatch({
        type: 'ADD_REFUND',
        payload: response.data
    })

    // Refresh the passenger's booking list.
    dispatch(getMyBookings())
}

// Step 17: Fetch all complaints submitted by the passenger.
export const getMyComplaints = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/complaint/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_COMPLAINTS',
        payload: response.data
    })
}

// Step 18: Submit a new complaint.
export const addComplaint = (complaint) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/complaint/add`, complaint, authHeader())
    dispatch({
        type: 'ADD_COMPLAINT',
        payload: response.data
    })
}

// Step 19: Fetch the passenger's profile.
export const getPassengerProfile = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/profile`, authHeader())
    dispatch({
        type: 'FETCH_PASSENGER_PROFILE',
        payload: response.data
    })
}

// Step 20: Update the passenger's profile.
export const updatePassengerProfile = (profile) => async (dispatch) => {
    await axios.put(`${API_SERVER_URL_DEV}/api/passenger/profile`, profile, authHeader())

    // Fetch the updated profile and refresh the Redux store.
    dispatch(getPassengerProfile())
}
