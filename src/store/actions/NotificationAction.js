import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

// Step 1: Get all notifications and the unread notification count.
export const getNotifications = () => async (dispatch) => {

    // Fetch the complete notification list from the backend.
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/notification/all`, authHeader())

    // Fetch the number of unread notifications.
    const resp = await axios.get(`${API_SERVER_URL_DEV}/api/notification/count`, authHeader())

    // Send both the notification list and unread count to Redux.
    dispatch({
        type: 'FETCH_NOTIFICATIONS',
        payload: { list: response.data, unread: resp.data }
    })
}

// Step 2: Mark all notifications as read.
export const markAllRead = () => async (dispatch) => {

    // Send a PUT request to mark every notification as read.
    await axios.put(`${API_SERVER_URL_DEV}/api/notification/read`, null, authHeader())

    // Update the Redux store after the backend request succeeds.
    dispatch({ type: 'READ_ALL_NOTIFICATIONS' })
}

// Step 3: Mark one particular notification as read.
export const markRead = (notificationId) => async (dispatch) => {

    // Send a PUT request with the notification ID.
    await axios.put(`${API_SERVER_URL_DEV}/api/notification/read/${notificationId}`, null, authHeader())

    // Send the notification ID to Redux.
    dispatch({ type: 'READ_NOTIFICATION', payload: notificationId })
}
