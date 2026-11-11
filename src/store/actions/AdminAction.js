import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

// Step 1: Fetch admin dashboard statistics.
export const getAdminStats = () => async (dispatch) => {

    // Get overall dashboard statistics.
    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/stats`,
        authHeader()
    )

    // Get airline-wise booking statistics.
    const resp = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/stats/airline-bookings`,
        authHeader()
    )

    // Store both responses in Redux.
    dispatch({
        type: 'FETCH_ADMIN_STATS',
        payload: {
            stats: response.data,
            airlineBookings: resp.data
        }
    })
}

// Step 2: Fetch all airlines based on their status.
export const getAirlines = (status) => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/airline/all`,
        {
            ...authHeader(),
            params: { status: status || undefined }
        }
    )

    dispatch({
        type: 'FETCH_AIRLINES',
        payload: response.data
    })
}

// Step 3: Register / onboard a new airline.
export const onboardAirline = (airline) => async (dispatch) => {

    const response = await axios.post(
        `${API_SERVER_URL_DEV}/api/admin/airline/add`,
        airline,
        authHeader()
    )

    dispatch({
        type: 'ADD_AIRLINE',
        payload: response.data
    })
}

// Step 4: Update the status of an airline.
export const updateAirlineStatus = (airlineId, status, reason) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/admin/airline/status/${airlineId}`,
        null,
        {
            ...authHeader(),
            params: {
                status,
                reason: reason || undefined
            }
        }
    )

    dispatch({
        type: 'UPDATE_AIRLINE',
        payload: response.data
    })
}

// Step 5: Fetch passenger records with optional search.
export const getPassengers = (search) => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/passenger/all`,
        {
            ...authHeader(),
            params: {
                search: search || undefined,
                page: 0,
                size: 50
            }
        }
    )

    dispatch({
        type: 'FETCH_PASSENGERS',
        payload: response.data
    })
}

// Step 6: Activate or deactivate a passenger.
export const updatePassengerStatus = (passengerId, active) => async (dispatch) => {

    await axios.put(
        `${API_SERVER_URL_DEV}/api/admin/passenger/status/${passengerId}`,
        null,
        {
            ...authHeader(),
            params: { active }
        }
    )

    dispatch({
        type: 'UPDATE_PASSENGER_STATUS',
        payload: {
            passengerId,
            active
        }
    })
}

// Step 7: Fetch bookings belonging to a particular passenger.
export const getPassengerBookings = (passengerId) => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/passenger/${passengerId}/bookings`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_PASSENGER_BOOKINGS',
        payload: {
            passengerId,
            bookings: response.data
        }
    })
}

// Step 8: Fetch all airports.
export const getAirports = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airport/all`
    )

    dispatch({
        type: 'FETCH_AIRPORTS_ADMIN',
        payload: response.data
    })
}

// Step 9: Add multiple airports.
export const addAirports = (list) => async (dispatch) => {

    await axios.post(
        `${API_SERVER_URL_DEV}/api/admin/airport/batch/add`,
        list,
        authHeader()
    )

    // Fetch the updated airport list after adding.
    dispatch(getAirports())
}

// Step 10: Fetch all flight instances.
export const getAllFlights = (fromDate) => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/instance/all`,
        {
            ...authHeader(),
            params: {
                fromDate: fromDate || undefined,
                page: 0,
                size: 100
            }
        }
    )

    dispatch({
        type: 'FETCH_ALL_FLIGHTS',
        payload: response.data
    })
}

// Step 11: Fetch all bookings.
export const getAllBookings = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/booking/all`,
        {
            ...authHeader(),
            params: {
                page: 0,
                size: 100
            }
        }
    )

    dispatch({
        type: 'FETCH_ALL_BOOKINGS',
        payload: response.data
    })
}

// Step 12: Fetch all payments, optionally filtered by status.
export const getAllPayments = (status) => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/payment/all`,
        {
            ...authHeader(),
            params: {
                status: status || undefined
            }
        }
    )

    dispatch({
        type: 'FETCH_ALL_PAYMENTS',
        payload: response.data
    })
}

// Step 13: Fetch all refund records.
export const getAllRefunds = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/refund/all`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_ALL_REFUNDS',
        payload: response.data
    })
}

// Step 14: Forward a refund request.
export const forwardRefund = (refundId) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/admin/refund/forward/${refundId}`,
        null,
        authHeader()
    )

    dispatch({
        type: 'UPDATE_REFUND_ADMIN',
        payload: response.data
    })
}

// Step 15: Fetch all complaints.
export const getAllComplaints = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/admin/complaint/all`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_ALL_COMPLAINTS',
        payload: response.data
    })
}

// Step 16: Forward a complaint to an airline.
export const forwardComplaint = (complaintId, airlineId) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/admin/complaint/forward/${complaintId}`,
        null,
        {
            ...authHeader(),
            params: {
                airlineId: airlineId || undefined
            }
        }
    )

    dispatch({
        type: 'UPDATE_COMPLAINT_ADMIN',
        payload: response.data
    })
}
