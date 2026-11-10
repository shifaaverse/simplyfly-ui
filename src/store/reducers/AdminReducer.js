const initialState = {
    stats: null,
    airlineBookings: [],
    airlines: [],
    passengers: [],
    passengerBookings: {},
    airports: [],
    flights: [],
    bookings: [],
    payments: [],
    refunds: [],
    complaints: []
}

const AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ADMIN_STATS':
            return {
                ...state,
                stats: action.payload.stats,
                airlineBookings: action.payload.airlineBookings
            }
        case 'FETCH_AIRLINES':
            return { ...state, airlines: action.payload }
        case 'ADD_AIRLINE':
            return { ...state, airlines: [...state.airlines, action.payload] }
        case 'UPDATE_AIRLINE':
            return {
                ...state,
                airlines: state.airlines.map(a => a.airlineId === action.payload.airlineId ? action.payload : a)
            }
        case 'FETCH_PASSENGERS':
            return { ...state, passengers: action.payload }
        case 'UPDATE_PASSENGER_STATUS':
            return {
                ...state,
                passengers: state.passengers.map(p => p.passengerId === action.payload.passengerId
                    ? { ...p, isActive: action.payload.active } : p)
            }
        case 'FETCH_PASSENGER_BOOKINGS':
            return {
                ...state,
                passengerBookings: { ...state.passengerBookings, [action.payload.passengerId]: action.payload.bookings }
            }
        case 'FETCH_AIRPORTS_ADMIN':
            return { ...state, airports: action.payload }
        case 'FETCH_ALL_FLIGHTS':
            return { ...state, flights: action.payload }
        case 'FETCH_ALL_BOOKINGS':
            return { ...state, bookings: action.payload }
        case 'FETCH_ALL_PAYMENTS':
            return { ...state, payments: action.payload }
        case 'FETCH_ALL_REFUNDS':
            return { ...state, refunds: action.payload }
        case 'UPDATE_REFUND_ADMIN':
            return {
                ...state,
                refunds: state.refunds.map(r => r.refundId === action.payload.refundId ? action.payload : r)
            }
        case 'FETCH_ALL_COMPLAINTS':
            return { ...state, complaints: action.payload }
        case 'UPDATE_COMPLAINT_ADMIN':
            return {
                ...state,
                complaints: state.complaints.map(c => c.complaintId === action.payload.complaintId ? action.payload : c)
            }
        default:
            return state
    }
}

export default AdminReducer
