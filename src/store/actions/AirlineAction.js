import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

export const getAirlineStats = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/stats`, authHeader())
    dispatch({
        type: 'FETCH_AIRLINE_STATS',
        payload: response.data
    })
}

export const getAirlineProfile = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/profile`, authHeader())
    dispatch({
        type: 'FETCH_AIRLINE_PROFILE',
        payload: response.data
    })
}

export const updateAirlineProfile = (profile) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/airline/profile`, profile, authHeader())
    dispatch({
        type: 'FETCH_AIRLINE_PROFILE',
        payload: response.data
    })
}

export const getAirportList = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airport/all`)
    dispatch({
        type: 'FETCH_AIRPORTS_AIRLINE',
        payload: response.data
    })
}

export const getRoutes = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/route/all`, authHeader())
    dispatch({
        type: 'FETCH_ROUTES',
        payload: response.data
    })
}

export const addRoute = (route) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/airline/route/add`, route, authHeader())
    dispatch({
        type: 'ADD_ROUTE',
        payload: response.data
    })
}

export const updateRouteStatus = (routeId, active) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/airline/route/status/${routeId}`, null,
        { ...authHeader(), params: { active } })
    dispatch({
        type: 'UPDATE_ROUTE',
        payload: response.data
    })
}

export const getFlights = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/flight/all`, authHeader())
    dispatch({
        type: 'FETCH_FLIGHTS',
        payload: response.data
    })
}

export const addFlight = (flight) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/airline/flight/add`, flight, authHeader())
    dispatch({
        type: 'ADD_FLIGHT',
        payload: response.data
    })
}

export const addSchedule = (schedule) => async (dispatch) => {
    const response = await axios.post(`${API_SERVER_URL_DEV}/api/airline/schedule/add`, schedule, authHeader())
    dispatch(getInstances())
    return response.data
}

export const getInstances = (fromDate) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/instance/all`,
        { ...authHeader(), params: { fromDate: fromDate || undefined, page: 0, size: 100 } })
    dispatch({
        type: 'FETCH_INSTANCES',
        payload: response.data
    })
}

export const updateInstanceStatus = (instanceId, status, delayMinutes) => async (dispatch) => {
    await axios.put(`${API_SERVER_URL_DEV}/api/airline/instance/status/${instanceId}`, null,
        { ...authHeader(), params: { status, delayMinutes: status === 'DELAYED' ? delayMinutes : undefined } })
    dispatch({
        type: 'UPDATE_INSTANCE_STATUS',
        payload: { instanceId, status, delayMinutes: status === 'DELAYED' ? delayMinutes : 0 }
    })
}

export const updateFlight = (flightId, flight) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/airline/flight/${flightId}`, flight, authHeader())
    dispatch({
        type: 'UPDATE_FLIGHT',
        payload: response.data
    })
}

export const updateFlightStatus = (flightId, active) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/airline/flight/status/${flightId}`, null,
        { ...authHeader(), params: { active } })
    dispatch({
        type: 'UPDATE_FLIGHT',
        payload: response.data
    })
}

export const getFlightPassengers = (instanceId) => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/instance/passengers/${instanceId}`, authHeader())
    dispatch({
        type: 'FETCH_FLIGHT_PASSENGERS',
        payload: response.data
    })
}

export const getAirlineBookings = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/booking/all`, authHeader())
    dispatch({
        type: 'FETCH_AIRLINE_BOOKINGS',
        payload: response.data
    })
}

export const getAirlineRefunds = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/refund/all`, authHeader())
    dispatch({
        type: 'FETCH_AIRLINE_REFUNDS',
        payload: response.data
    })
}

export const approveRefund = (refundId) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/airline/refund/approve/${refundId}`, null, authHeader())
    dispatch({
        type: 'UPDATE_AIRLINE_REFUND',
        payload: response.data
    })
}

export const rejectRefund = (refundId, reason) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/airline/refund/reject/${refundId}`, null,
        { ...authHeader(), params: { reason } })
    dispatch({
        type: 'UPDATE_AIRLINE_REFUND',
        payload: response.data
    })
}

export const getAirlineComplaints = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/airline/complaint/all`, authHeader())
    dispatch({
        type: 'FETCH_AIRLINE_COMPLAINTS',
        payload: response.data
    })
}

export const respondComplaint = (complaintId, body) => async (dispatch) => {
    const response = await axios.put(`${API_SERVER_URL_DEV}/api/airline/complaint/respond/${complaintId}`, body, authHeader())
    dispatch({
        type: 'UPDATE_AIRLINE_COMPLAINT',
        payload: response.data
    })
}
