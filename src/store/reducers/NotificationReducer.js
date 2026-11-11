// Step 1: Define the initial state for notifications.
const initialState = {
    list: [],
    unread: 0
}

// Step 2: Create the Notification Reducer.
const NotificationReducer = (state = initialState, action) => {

    // Step 3: Check the action type and update the notification state.
    switch (action.type) {

        // Fetch and store all notifications and the unread count.
        case 'FETCH_NOTIFICATIONS':
            return {
                list: action.payload.list,
                unread: Number(action.payload.unread)
            }

        // Mark all notifications as read and reset the unread count.
        case 'READ_ALL_NOTIFICATIONS':
            return {
                list: state.list.map(n => ({ ...n, isRead: true })),
                unread: 0
            }

        // Mark one particular notification as read.
        case 'READ_NOTIFICATION':
            return {
                list: state.list.map(n => n.notificationId === action.payload
                    ? { ...n, isRead: true } : n),
                unread: Math.max(0, state.unread - 1)
            }

        // Return the existing state for unhandled action types.
        default:
            return state
    }
}

// Step 4: Export the reducer.
export default NotificationReducer
