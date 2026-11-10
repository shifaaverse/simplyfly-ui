const initialState = {
    airports: [],
    availableRoutes: [],
    search: null,
    onwardResult: null,   // one page of departure flights: { list, paginationInfo, airlines }
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

const PassengerReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_AIRPORTS_PASSENGER':
            return { ...state, airports: action.payload }
        case 'FETCH_AVAILABLE_ROUTES':
            return { ...state, availableRoutes: action.payload }
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
        case 'FETCH_FLIGHTS':
            return action.payload.journeyType === 'DEPARTURE'
                ? { ...state, onwardResult: action.payload.result }
                : { ...state, returnResult: action.payload.result }
        case 'SELECT_FLIGHT': {
            const { journeyType, flight } = action.payload
            const key = journeyType === 'DEPARTURE' ? 'selectedOnward' : 'selectedReturn'
            // clicking the already selected flight again removes the selection
            return { ...state, [key]: state[key]?.instanceId === flight.instanceId ? null : flight }
        }
        case 'FETCH_SEATS':
            return {
                ...state,
                seats: { ...state.seats, [action.payload.journeyType]: action.payload.seats }
            }
        case 'SET_CURRENT_BOOKING':
            return { ...state, currentBooking: action.payload }
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
        case 'FETCH_MY_BOOKINGS':
            return { ...state, bookings: action.payload }
        case 'FETCH_MY_PAYMENTS':
            return { ...state, payments: action.payload }
        case 'FETCH_MY_REFUNDS':
            return { ...state, refunds: action.payload }
        case 'ADD_REFUND':
            return { ...state, refunds: [action.payload, ...state.refunds] }
        case 'FETCH_MY_COMPLAINTS':
            return { ...state, complaints: action.payload }
        case 'ADD_COMPLAINT':
            return { ...state, complaints: [action.payload, ...state.complaints] }
        case 'FETCH_PASSENGER_PROFILE':
            return { ...state, profile: action.payload }
        default:
            return state
    }
}

export default PassengerReducer