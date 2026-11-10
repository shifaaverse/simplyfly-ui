import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

export const getAirportOptions = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airport/all`)
    dispatch({
        type: 'FETCH_AIRPORTS_PASSENGER',
        payload: response.data
    })
}

export const getAvailableRoutes = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/flight/routes`)
    dispatch({
        type: 'FETCH_AVAILABLE_ROUTES',
        payload: response.data
    })
}

export const FLIGHTS_PER_PAGE = 10

const NO_FILTERS = { airline: '', fromTime: '', toTime: '', maxPrice: '', sortBy: 'PRICE' }

/*
 Params for one page of flights. Filtering, sorting and paging are done by the backend.
 DEPARTURE = source -> destination on departure date
 RETURN    = destination -> source on return date
 filters   = { airline, fromTime, toTime, maxPrice, sortBy }   (empty value = no filter)
*/
const getSearchParams = (search, journeyType, filters, page) => {
    const isDeparture = journeyType === 'DEPARTURE'
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
 Each call gives: { list, paginationInfo, airlines }
*/
export const searchFlights = (search) => async (dispatch) => {
    const onward = await axios.get(`${API_SERVER_URL_DEV}/api/flight/search`, {
        params: getSearchParams(search, 'DEPARTURE', NO_FILTERS, 0)
    })
    let returnResult = null
    if (search.tripType === 'ROUND_TRIP') {
        const resp = await axios.get(`${API_SERVER_URL_DEV}/api/flight/search`, {
            params: getSearchParams(search, 'RETURN', NO_FILTERS, 0)
        })
        returnResult = resp.data
    }
    dispatch({
        type: 'SEARCH_FLIGHTS',
        payload: { search, onward: onward.data, returnResult }
    })
}

// Get one page of flights again when a filter, the sorting or the page is changed
export const getFlights = (journeyType, search, filters, page) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/flight/search`, {
        params: getSearchParams(search, journeyType, filters, page)
    })
    dispatch({
        type: 'FETCH_FLIGHTS',
        payload: { journeyType, result: response.data }
    })
}

export const selectFlight = (journeyType, flight) => {
    return {
        type: 'SELECT_FLIGHT',
        payload: { journeyType, flight }
    }
}

export const getSeats = (instanceId, seatClass, journeyType) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/flight/seats/${instanceId}`, { params: { seatClass } })
    dispatch({
        type: 'FETCH_SEATS',
        payload: { journeyType, seats: response.data }
    })
}

export const createBooking = (booking) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/booking/add`, booking, authHeader())
    dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: response.data
    })
    return response.data
}

export const makePayment = (bookingId, payment) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/payment/${bookingId}`, payment, authHeader())
    const resp = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/booking/${bookingId}`, authHeader())
    dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: resp.data
    })
    return response.data
}

// Razorpay (test mode). Step 1: create the order. Step 2: verify the payment after checkout.
export const createPaymentOrder = (bookingId) => async () => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/payment/order/${bookingId}`, null, authHeader())
    return response.data
}

export const verifyPayment = (bookingId, payment) => async (dispatch) => {
    await axios.post(`${API_SERVER_URL_DEV}/api/passenger/payment/verify/${bookingId}`, payment, authHeader())
    const resp = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/booking/${bookingId}`, authHeader())
    dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: resp.data
    })
}

export const resetBooking = () => {
    return { type: 'RESET_BOOKING' }
}

export const getMyBookings = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/booking/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_BOOKINGS',
        payload: response.data
    })
}

export const getMyPayments = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/payment/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_PAYMENTS',
        payload: response.data
    })
}

export const getMyRefunds = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/refund/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_REFUNDS',
        payload: response.data
    })
}

export const requestRefund = (refund) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/refund/add`, refund, authHeader())
    dispatch({
        type: 'ADD_REFUND',
        payload: response.data
    })
    dispatch(getMyBookings())
}

export const getMyComplaints = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/complaint/all`, authHeader())
    dispatch({
        type: 'FETCH_MY_COMPLAINTS',
        payload: response.data
    })
}

export const addComplaint = (complaint) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/passenger/complaint/add`, complaint, authHeader())
    dispatch({
        type: 'ADD_COMPLAINT',
        payload: response.data
    })
}

export const getPassengerProfile = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/passenger/profile`, authHeader())
    dispatch({
        type: 'FETCH_PASSENGER_PROFILE',
        payload: response.data
    })
}

export const updatePassengerProfile = (profile) => async (dispatch) => {
    await axios.put(`${API_SERVER_URL_DEV}/api/passenger/profile`, profile, authHeader())
    dispatch(getPassengerProfile())
}
