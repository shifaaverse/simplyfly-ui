const initialState = {
    list: [],
    unread: 0
}

const NotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_NOTIFICATIONS':
            return { list: action.payload.list, unread: Number(action.payload.unread) }
        case 'READ_ALL_NOTIFICATIONS':
            return { list: state.list.map(n => ({ ...n, isRead: true })), unread: 0 }
        case 'READ_NOTIFICATION':
            return {
                list: state.list.map(n => n.notificationId === action.payload ? { ...n, isRead: true } : n),
                unread: Math.max(0, state.unread - 1)
            }
        default:
            return state
    }
}

export default NotificationReducer
