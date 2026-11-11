// Step 1: Define the initial state for the Passenger module.
const initialState = {
    airports: [],
    availableRoutes: [],
    search: null,
    onwardResult: null,   // one page of departure flights
    returnResult: null,   // one page of return flights (round trip only)
    selectedOnward: null,
    selectedReturn: null,
    seats: { DEPARTURE: [], RETURN: [] },
    currentBooking: null,
    bookings: [],
    payments: [],
    refunds: [],
    complaints: [],
    profile: null
}

// Step 2: Create the Passenger Reducer.
const PassengerReducer = (state = initialState, action) => {

    // Step 3: Check the action type and update the state accordingly.
    switch (action.type) {

        // Store the available airport list.
        case 'FETCH_AIRPORTS_PASSENGER':
            return { ...state, airports: action.payload }

        // Store the available routes.
        case 'FETCH_AVAILABLE_ROUTES':
            return { ...state, availableRoutes: action.payload }

        // Store the search details and flight search results.
        case 'SEARCH_FLIGHTS':
            return {
                ...state,
                search: action.payload.search,
                onwardResult: action.payload.onward,
                returnResult: action.payload.returnResult,
                selectedOnward: null,
                selectedReturn: null,
                currentBooking: null
            }

        // Update the flight results for the selected journey type.
        case 'FETCH_FLIGHTS':
            return action.payload.journeyType === 'DEPARTURE'
                ? { ...state, onwardResult: action.payload.result }
                : { ...state, returnResult: action.payload.result }

        // Store or remove the selected flight.
        case 'SELECT_FLIGHT': {
            const { journeyType, flight } = action.payload

            // Choose the state property based on the journey type.
            const key = journeyType === 'DEPARTURE' ? 'selectedOnward' : 'selectedReturn'

            // Clicking the already selected flight again removes the selection.
            return { ...state, [key]: state[key]?.instanceId === flight.instanceId ? null : flight }
        }

        // Store available seats for the departure or return journey.
        case 'FETCH_SEATS':
            return {
                ...state,
                seats: { ...state.seats, [action.payload.journeyType]: action.payload.seats }
            }

        // Store the current booking.
        case 'SET_CURRENT_BOOKING':
            return { ...state, currentBooking: action.payload }

        // Clear the current booking journey data.
        case 'RESET_BOOKING':
            return {
                ...state,
                search: null,
                onwardResult: null,
                returnResult: null,
                selectedOnward: null,
                selectedReturn: null,
                seats: { DEPARTURE: [], RETURN: [] },
                currentBooking: null
            }

        // Store all bookings belonging to the passenger.
        case 'FETCH_MY_BOOKINGS':
            return { ...state, bookings: action.payload }

        // Store all payment records.
        case 'FETCH_MY_PAYMENTS':
            return { ...state, payments: action.payload }

        // Store all refund records.
        case 'FETCH_MY_REFUNDS':
            return { ...state, refunds: action.payload }

        // Add a newly created refund to the beginning of the refund list.
        case 'ADD_REFUND':
            return { ...state, refunds: [action.payload, ...state.refunds] }

        // Store all complaints belonging to the passenger.
        case 'FETCH_MY_COMPLAINTS':
            return { ...state, complaints: action.payload }

        // Add a newly created complaint to the beginning of the complaint list.
        case 'ADD_COMPLAINT':
            return { ...state, complaints: [action.payload, ...state.complaints] }

        // Store the passenger's profile.
        case 'FETCH_PASSENGER_PROFILE':
            return { ...state, profile: action.payload }

        // Return the existing state for unhandled action types.
        default:
            return state
    }
}

// Step 4: Export the reducer.
export default PassengerReducer
