// Step 1: Define the initial state for the Airline module.
const initialState = {
    stats: null,
    profile: null,
    airports: [],
    routes: [],
    flights: [],
    instances: [],
    passengers: [],
    bookings: [],
    refunds: [],
    complaints: []
}

// Step 2: Create the Airline Reducer.
const AirlineReducer = (state = initialState, action) => {

    // Step 3: Check the action type and update the state accordingly.
    switch (action.type) {

        // Store the dashboard statistics of the airline.
        case 'FETCH_AIRLINE_STATS':
            return { ...state, stats: action.payload }

        // Store the profile of the airline.
        case 'FETCH_AIRLINE_PROFILE':
            return { ...state, profile: action.payload }

        // Store all airports.
        case 'FETCH_AIRPORTS_AIRLINE':
            return { ...state, airports: action.payload }

        // Store the fetched route list.
        case 'FETCH_ROUTES':
            return { ...state, routes: action.payload }

        // Add a newly created route to the existing route list.
        case 'ADD_ROUTE':
            return { ...state, routes: [...state.routes, action.payload] }

        // Update one particular route (for example active / inactive).
        case 'UPDATE_ROUTE':
            return {
                ...state,
                routes: state.routes.map(r => r.routeId === action.payload.routeId ? action.payload : r)
            }

        // Store the fetched flight list.
        case 'FETCH_FLIGHTS':
            return { ...state, flights: action.payload }

        // Add a newly created flight to the existing flight list.
        case 'ADD_FLIGHT':
            return { ...state, flights: [...state.flights, action.payload] }

        // Update one particular flight.
        case 'UPDATE_FLIGHT':
            return {
                ...state,
                flights: state.flights.map(f => f.flightId === action.payload.flightId ? action.payload : f)
            }

        // Store the passengers of one flight instance.
        case 'FETCH_FLIGHT_PASSENGERS':
            return { ...state, passengers: action.payload }

        // Store the dated flights (flight instances).
        case 'FETCH_INSTANCES':
            return { ...state, instances: action.payload }

        // Update the status and delay of one flight instance.
        case 'UPDATE_INSTANCE_STATUS':
            return {
                ...state,
                instances: state.instances.map(i => i.instanceId === action.payload.instanceId
                    ? { ...i, status: action.payload.status, delayMinutes: action.payload.delayMinutes } : i)
            }

        // Store the bookings of the airline.
        case 'FETCH_AIRLINE_BOOKINGS':
            return { ...state, bookings: action.payload }

        // Store the refund requests of the airline.
        case 'FETCH_AIRLINE_REFUNDS':
            return { ...state, refunds: action.payload }

        // Update one particular refund request (approve / reject).
        case 'UPDATE_AIRLINE_REFUND':
            return {
                ...state,
                refunds: state.refunds.map(r => r.refundId === action.payload.refundId ? action.payload : r)
            }

        // Store the complaints of the airline.
        case 'FETCH_AIRLINE_COMPLAINTS':
            return { ...state, complaints: action.payload }

        // Update one particular complaint (after the airline responds).
        case 'UPDATE_AIRLINE_COMPLAINT':
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
export default AirlineReducer