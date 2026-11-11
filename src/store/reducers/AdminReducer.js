// Step 1: Define the initial state for the Admin module.
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

// Step 2: Create the Admin Reducer.
const AdminReducer = (state = initialState, action) => {

    // Step 3: Check the action type and update the state accordingly.
    switch (action.type) {

        // Update admin dashboard statistics and airline bookings.
        case 'FETCH_ADMIN_STATS':
            return {
                ...state,
                stats: action.payload.stats,
                airlineBookings: action.payload.airlineBookings
            }

        // Store the fetched airline list.
        case 'FETCH_AIRLINES':
            return { ...state, airlines: action.payload }

        // Add a newly created airline to the existing airline list.
        case 'ADD_AIRLINE':
            return { ...state, airlines: [...state.airlines, action.payload] }

        // Update the details of a particular airline.
        case 'UPDATE_AIRLINE':
            return {
                ...state,
                airlines: state.airlines.map(a => a.airlineId === action.payload.airlineId ? action.payload : a)
            }

        // Store the fetched passenger list.
        case 'FETCH_PASSENGERS':
            return { ...state, passengers: action.payload }

        // Update the active/inactive status of a particular passenger.
        case 'UPDATE_PASSENGER_STATUS':
            return {
                ...state,
                passengers: state.passengers.map(p => p.passengerId === action.payload.passengerId
                    ? { ...p, isActive: action.payload.active } : p)
            }

        // Store the bookings belonging to a particular passenger.
        case 'FETCH_PASSENGER_BOOKINGS':
            return {
                ...state,
                passengerBookings: { ...state.passengerBookings, [action.payload.passengerId]: action.payload.bookings }
            }

        // Store all airports in the Admin state.
        case 'FETCH_AIRPORTS_ADMIN':
            return { ...state, airports: action.payload }

        // Store all flights.
        case 'FETCH_ALL_FLIGHTS':
            return { ...state, flights: action.payload }

        // Store all bookings.
        case 'FETCH_ALL_BOOKINGS':
            return { ...state, bookings: action.payload }

        // Store all payment records.
        case 'FETCH_ALL_PAYMENTS':
            return { ...state, payments: action.payload }

        // Store all refund records.
        case 'FETCH_ALL_REFUNDS':
            return { ...state, refunds: action.payload }

        // Update one particular refund record.
        case 'UPDATE_REFUND_ADMIN':
            return {
                ...state,
                refunds: state.refunds.map(r => r.refundId === action.payload.refundId ? action.payload : r)
            }

        // Store all complaints.
        case 'FETCH_ALL_COMPLAINTS':
            return { ...state, complaints: action.payload }

        // Update one particular complaint record.
        case 'UPDATE_COMPLAINT_ADMIN':
            return {
                ...state,
                complaints: state.complaints.map(c => c.complaintId === action.payload.complaintId ? action.payload : c)
            }

        // If the action type does not match, return the existing state.
        default:
            return state
    }
}

// Step 4: Export the reducer so it can be registered in the Redux store.
export default AdminReducer
