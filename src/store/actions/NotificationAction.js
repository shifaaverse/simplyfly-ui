import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import { authHeader } from "./authHeader"

export const getNotifications = () => async (dispatch) => {
    const response = await axios.get(`${API_SERVER_URL_DEV}/api/notification/all`, authHeader())
    const resp = await axios.get(`${API_SERVER_URL_DEV}/api/notification/count`, authHeader())
    dispatch({
        type: 'FETCH_NOTIFICATIONS',
        payload: { list: response.data, unread: resp.data }
    })
}

export const markAllRead = () => async (dispatch) => {
    await axios.put(`${API_SERVER_URL_DEV}/api/notification/read`, null, authHeader())
    dispatch({ type: 'READ_ALL_NOTIFICATIONS' })
}

export const markRead = (notificationId) => async (dispatch) => {
    await axios.put(`${API_SERVER_URL_DEV}/api/notification/read/${notificationId}`, null, authHeader())
    dispatch({ type: 'READ_NOTIFICATION', payload: notificationId })
}
