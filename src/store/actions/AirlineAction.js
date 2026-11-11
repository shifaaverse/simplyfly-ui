import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

// Step 1: Fetch airline dashboard statistics.
export const getAirlineStats = () => async (dispatch) => {

    // Get airline dashboard statistics.
    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/stats`,
        authHeader()
    )

    // Store the statistics in Redux.
    dispatch({
        type: 'FETCH_AIRLINE_STATS',
        payload: response.data
    })
}

// Step 2: Fetch airline profile information.
export const getAirlineProfile = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/profile`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_AIRLINE_PROFILE',
        payload: response.data
    })
}

// Step 3: Update airline profile information.
export const updateAirlineProfile = (profile) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/profile`,
        profile,
        authHeader()
    )

    // Update Redux with the latest profile response.
    dispatch({
        type: 'FETCH_AIRLINE_PROFILE',
        payload: response.data
    })
}

// Step 4: Fetch the list of airports.
export const getAirportList = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airport/all`
    )

    dispatch({
        type: 'FETCH_AIRPORTS_AIRLINE',
        payload: response.data
    })
}

// Step 5: Fetch routes belonging to the airline.
export const getRoutes = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/route/all`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_ROUTES',
        payload: response.data
    })
}

// Step 6: Add a new route.
export const addRoute = (route) => async (dispatch) => {

    const response = await axios.post(
        `${API_SERVER_URL_DEV}/api/airline/route/add`,
        route,
        authHeader()
    )

    dispatch({
        type: 'ADD_ROUTE',
        payload: response.data
    })
}

// Step 7: Activate or deactivate a route.
export const updateRouteStatus = (routeId, active) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/route/status/${routeId}`,
        null,
        {
            ...authHeader(),
            params: { active }
        }
    )

    dispatch({
        type: 'UPDATE_ROUTE',
        payload: response.data
    })
}

// Step 8: Fetch flights belonging to the airline.
export const getFlights = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/flight/all`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_FLIGHTS',
        payload: response.data
    })
}

// Step 9: Add a new flight.
export const addFlight = (flight) => async (dispatch) => {

    const response = await axios.post(
        `${API_SERVER_URL_DEV}/api/airline/flight/add`,
        flight,
        authHeader()
    )

    dispatch({
        type: 'ADD_FLIGHT',
        payload: response.data
    })
}

// Step 10: Create a flight schedule.
export const addSchedule = (schedule) => async (dispatch) => {

    const response = await axios.post(
        `${API_SERVER_URL_DEV}/api/airline/schedule/add`,
        schedule,
        authHeader()
    )

    // Fetch updated flight instances after adding the schedule.
    dispatch(getInstances())

    // Return the response data to the calling component.
    return response.data
}

// Step 11: Fetch flight instances.
export const getInstances = (fromDate) => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/instance/all`,
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
        type: 'FETCH_INSTANCES',
        payload: response.data
    })
}

// Step 12: Update flight instance status.
export const updateInstanceStatus = (instanceId, status, delayMinutes) => async (dispatch) => {

    await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/instance/status/${instanceId}`,
        null,
        {
            ...authHeader(),
            params: {
                status,
                delayMinutes: status === 'DELAYED' ? delayMinutes : undefined
            }
        }
    )

    dispatch({
        type: 'UPDATE_INSTANCE_STATUS',
        payload: {
            instanceId,
            status,
            delayMinutes: status === 'DELAYED' ? delayMinutes : 0
        }
    })
}

// Step 13: Update flight information.
export const updateFlight = (flightId, flight) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/flight/${flightId}`,
        flight,
        authHeader()
    )

    dispatch({
        type: 'UPDATE_FLIGHT',
        payload: response.data
    })
}

// Step 14: Activate or deactivate a flight.
export const updateFlightStatus = (flightId, active) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/flight/status/${flightId}`,
        null,
        {
            ...authHeader(),
            params: { active }
        }
    )

    dispatch({
        type: 'UPDATE_FLIGHT',
        payload: response.data
    })
}

// Step 15: Fetch passengers for a particular flight instance.
export const getFlightPassengers = (instanceId) => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/instance/passengers/${instanceId}`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_FLIGHT_PASSENGERS',
        payload: response.data
    })
}

// Step 16: Fetch airline bookings.
export const getAirlineBookings = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/booking/all`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_AIRLINE_BOOKINGS',
        payload: response.data
    })
}

// Step 17: Fetch airline refund requests.
export const getAirlineRefunds = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/refund/all`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_AIRLINE_REFUNDS',
        payload: response.data
    })
}

// Step 18: Approve a refund request.
export const approveRefund = (refundId) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/refund/approve/${refundId}`,
        null,
        authHeader()
    )

    dispatch({
        type: 'UPDATE_AIRLINE_REFUND',
        payload: response.data
    })
}

// Step 19: Reject a refund request with a reason.
export const rejectRefund = (refundId, reason) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/refund/reject/${refundId}`,
        null,
        {
            ...authHeader(),
            params: { reason }
        }
    )

    dispatch({
        type: 'UPDATE_AIRLINE_REFUND',
        payload: response.data
    })
}

// Step 20: Fetch airline complaints.
export const getAirlineComplaints = () => async (dispatch) => {

    const response = await axios.get(
        `${API_SERVER_URL_DEV}/api/airline/complaint/all`,
        authHeader()
    )

    dispatch({
        type: 'FETCH_AIRLINE_COMPLAINTS',
        payload: response.data
    })
}

// Step 21: Send a response to a passenger complaint.
export const respondComplaint = (complaintId, body) => async (dispatch) => {

    const response = await axios.put(
        `${API_SERVER_URL_DEV}/api/airline/complaint/respond/${complaintId}`,
        body,
        authHeader()
    )

    dispatch({
        type: 'UPDATE_AIRLINE_COMPLAINT',
        payload: response.data
    })
}
