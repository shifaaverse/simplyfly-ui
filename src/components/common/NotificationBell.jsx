import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getNotifications, markAllRead, markRead } from "../../store/actions/NotificationAction"
import { formatDateTime } from "../../utils/format"

// Bell icon with unread count. Checks for new notifications every 30 seconds.
function NotificationBell() {
    const list = useSelector(state => state.notification.list)
    const unread = useSelector(state => state.notification.unread)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const load = () => dispatch(getNotifications()).catch(() => { })
        load()
        const timer = setInterval(load, 30000)
        return () => clearInterval(timer)
    }, [dispatch])

    return (
        <div className="position-relative">
            <button className="btn btn-sm btn-outline-light position-relative" title="Notifications" onClick={() => setOpen(!open)}>
                <i className="bi bi-bell"></i>
                {unread > 0 &&
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unread}</span>}
            </button>
            {open && (
                <div className="card shadow sf-notify">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">Notifications</span>
                        <button className="btn btn-link btn-sm p-0" disabled={unread === 0}
                            onClick={() => dispatch(markAllRead())}>Mark all read</button>
                    </div>
                    <div className="list-group list-group-flush sf-notify-list">
                        {list.length === 0 && <div className="p-3 text-muted small text-center">No notifications yet</div>}
                        {list.map(n => (
                            <button key={n.notificationId}
                                className={`list-group-item list-group-item-action ${n.isRead ? '' : 'sf-unread'}`}
                                onClick={() => !n.isRead && dispatch(markRead(n.notificationId))}>
                                <div className="fw-semibold small">{n.title}</div>
                                <div className="small text-secondary">{n.message}</div>
                                <div className="text-muted" style={{ fontSize: 11 }}>{formatDateTime(n.createdAt)}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationBell
