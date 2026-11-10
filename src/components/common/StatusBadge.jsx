import { label } from "../../utils/format"

const TONES = {
    APPROVED: 'success', CONFIRMED: 'success', SUCCESS: 'success', REFUNDED: 'success',
    RESOLVED: 'success', SCHEDULED: 'success', ARRIVED: 'success', AVAILABLE: 'success',
    PENDING: 'warning', PENDING_PAYMENT: 'warning', REQUESTED: 'warning', OPEN: 'warning',
    DELAYED: 'warning', BOARDING: 'info', DEPARTED: 'info', IN_PROGRESS: 'info',
    FORWARDED_TO_AIRLINE: 'info', CANCELLATION_REQUESTED: 'warning', PROCESSING: 'info',
    PARTIALLY_CANCELLED: 'warning',
    REJECTED: 'danger', SUSPENDED: 'danger', FAILED: 'danger', PAYMENT_FAILED: 'danger',
    CANCELLED: 'danger', EXPIRED: 'secondary', true: 'success', false: 'danger'
}

function StatusBadge({ status }) {
    let text = label(String(status))
    if (status === true) text = 'ACTIVE'
    if (status === false) text = 'INACTIVE'
    return (
        <span className={`badge rounded-pill text-bg-${TONES[status] || 'secondary'}`}>
            {text}
        </span>
    )
}

export default StatusBadge
