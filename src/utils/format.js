// Step 1: Convert 24-hour time into 12-hour format.
// Example: "13:30:00" -> "1:30 PM"
export const formatTime = (time) => {

    // Return an empty string if no time is provided.
    if (!time) return ''

    // Extract the hour and minute from the time string.
    const [h, m] = time.split(':')

    // Convert the hour into a number.
    const hour = Number(h)

    // Decide whether the time is AM or PM.
    const suffix = hour >= 12 ? 'PM' : 'AM'

    // Convert the hour into 12-hour format.
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    // Return the formatted time.
    return `${hour12}:${m} ${suffix}`
}

// Step 2: Convert a date into Indian date display format.
// Example: 2026-11-10 -> 10 Nov 2026
export const formatDate = (date) => {

    // Return an empty string if no date is provided.
    if (!date) return ''

    // Create a Date object and format it using Indian locale.
    return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

// Step 3: Format a date and time together.
export const formatDateTime = (instant) => {

    // Return an empty string if no date-time value is provided.
    if (!instant) return ''

    // Convert the instant into a readable local date and time.
    return new Date(instant).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    })
}

// Step 4: Convert journey duration in minutes into hours and minutes.
export const formatDuration = (minutes) =>
    `${Math.floor(minutes / 60)}h ${minutes % 60}m`

// Step 5: Format a number as Indian currency.
export const formatMoney = (amount) =>
    '₹' + Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })

// Step 6: Get today's local date in yyyy-MM-dd format.
export const today = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Step 7: Replace underscores with spaces in a text value.
export const label = (value) =>
    value ? value.replaceAll('_', ' ') : ''

// Step 8: Extract a meaningful error message from an API error.
export const getErrorMessage = (err) => {

    // Check whether the session has expired or the user is unauthorized.
    if (err?.response?.status === 401) return 'Session expired. Please login again'

    // Extract the error response data from the backend.
    const data = err?.response?.data

    // Return a message if the server cannot be reached.
    if (!data) return 'Server not reachable'

    // Return the backend message if it exists.
    if (data.message) return data.message

    // If the response is an object, combine its values into one message.
    if (typeof data === 'object') return Object.values(data).join(', ')

    // Return a general error message for other cases.
    return 'Something went wrong'
}
