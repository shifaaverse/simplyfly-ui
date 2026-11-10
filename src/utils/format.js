// "13:30:00" -> "1:30 PM"
export const formatTime = (time) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = Number(h)
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12}:${m} ${suffix}`
}

// 2026-11-10 -> 10 Nov 2026
export const formatDate = (date) => {
    if (!date) return ''
    return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

export const formatDateTime = (instant) => {
    if (!instant) return ''
    return new Date(instant).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    })
}

export const formatDuration = (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`

export const formatMoney = (amount) =>
    '₹' + Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })

// Local date (not UTC) as yyyy-MM-dd
export const today = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const label = (value) => value ? value.replaceAll('_', ' ') : ''

// Error message from backend ErrorDto or validation map
export const getErrorMessage = (err) => {
    if (err?.response?.status === 401) return 'Session expired. Please login again'
    const data = err?.response?.data
    if (!data) return 'Server not reachable'
    if (data.message) return data.message
    if (typeof data === 'object') return Object.values(data).join(', ')
    return 'Something went wrong'
}