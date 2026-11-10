import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

export const getAdminStats = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/stats`, authHeader())
    const resp = await axios.get(`${API_SERVER_URL_DEV}/api/admin/stats/airline-bookings`, authHeader())
    dispatch({
        type: 'FETCH_ADMIN_STATS',
        payload: { stats: response.data, airlineBookings: resp.data }
    })
}

export const getAirlines = (status) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/airline/all`,
        { ...authHeader(), params: { status: status || undefined } })
    dispatch({
        type: 'FETCH_AIRLINES',
        payload: response.data
    })
}

export const onboardAirline = (airline) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/admin/airline/add`, airline, authHeader())
    dispatch({
        type: 'ADD_AIRLINE',
        payload: response.data
    })
}

export const updateAirlineStatus = (airlineId, status, reason) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/admin/airline/status/${airlineId}`, null,
        { ...authHeader(), params: { status, reason: reason || undefined } })
    dispatch({
        type: 'UPDATE_AIRLINE',
        payload: response.data
    })
}

export const getPassengers = (search) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/passenger/all`,
        { ...authHeader(), params: { search: search || undefined, page: 0, size: 50 } })
    dispatch({
        type: 'FETCH_PASSENGERS',
        payload: response.data
    })
}

export const updatePassengerStatus = (passengerId, active) => async (dispatch) => {
    await axios.put(`${API_SERVER_URL_DEV}/api/admin/passenger/status/${passengerId}`, null,
        { ...authHeader(), params: { active } })
    dispatch({
        type: 'UPDATE_PASSENGER_STATUS',
        payload: { passengerId, active }
    })
}

export const getPassengerBookings = (passengerId) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/passenger/${passengerId}/bookings`, authHeader())
    dispatch({
        type: 'FETCH_PASSENGER_BOOKINGS',
        payload: { passengerId, bookings: response.data }
    })
}

export const getAirports = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airport/all`)
    dispatch({
        type: 'FETCH_AIRPORTS_ADMIN',
        payload: response.data
    })
}

export const addAirports = (list) => async (dispatch) => {
    await axios.post(`${API_SERVER_URL_DEV}/api/admin/airport/batch/add`, list, authHeader())
    dispatch(getAirports())
}

export const getAllFlights = (fromDate) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/instance/all`,
        { ...authHeader(), params: { fromDate: fromDate || undefined, page: 0, size: 100 } })
    dispatch({
        type: 'FETCH_ALL_FLIGHTS',
        payload: response.data
    })
}

export const getAllBookings = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/booking/all`,
        { ...authHeader(), params: { page: 0, size: 100 } })
    dispatch({
        type: 'FETCH_ALL_BOOKINGS',
        payload: response.data
    })
}

export const getAllPayments = (status) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/payment/all`,
        { ...authHeader(), params: { status: status || undefined } })
    dispatch({
        type: 'FETCH_ALL_PAYMENTS',
        payload: response.data
    })
}

export const getAllRefunds = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/refund/all`, authHeader())
    dispatch({
        type: 'FETCH_ALL_REFUNDS',
        payload: response.data
    })
}

export const forwardRefund = (refundId) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/admin/refund/forward/${refundId}`, null, authHeader())
    dispatch({
        type: 'UPDATE_REFUND_ADMIN',
        payload: response.data
    })
}

export const getAllComplaints = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/admin/complaint/all`, authHeader())
    dispatch({
        type: 'FETCH_ALL_COMPLAINTS',
        payload: response.data
    })
}

export const forwardComplaint = (complaintId, airlineId) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/admin/complaint/forward/${complaintId}`, null,
        { ...authHeader(), params: { airlineId: airlineId || undefined } })
    dispatch({
        type: 'UPDATE_COMPLAINT_ADMIN',
        payload: response.data
    })
}
