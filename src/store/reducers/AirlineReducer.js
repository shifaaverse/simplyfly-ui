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

const AirlineReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_AIRLINE_STATS':
            return { ...state, stats: action.payload }
        case 'FETCH_AIRLINE_PROFILE':
            return { ...state, profile: action.payload }
        case 'FETCH_AIRPORTS_AIRLINE':
            return { ...state, airports: action.payload }
        case 'FETCH_ROUTES':
            return { ...state, routes: action.payload }
        case 'ADD_ROUTE':
            return { ...state, routes: [...state.routes, action.payload] }
        case 'UPDATE_ROUTE':
            return {
                ...state,
                routes: state.routes.map(r => r.routeId === action.payload.routeId ? action.payload : r)
            }
        case 'FETCH_FLIGHTS':
            return { ...state, flights: action.payload }
        case 'ADD_FLIGHT':
            return { ...state, flights: [...state.flights, action.payload] }
        case 'UPDATE_FLIGHT':
            return {
                ...state,
                flights: state.flights.map(f => f.flightId === action.payload.flightId ? action.payload : f)
            }
        case 'FETCH_FLIGHT_PASSENGERS':
            return { ...state, passengers: action.payload }
        case 'FETCH_INSTANCES':
            return { ...state, instances: action.payload }
        case 'UPDATE_INSTANCE_STATUS':
            return {
                ...state,
                instances: state.instances.map(i => i.instanceId === action.payload.instanceId
                    ? { ...i, status: action.payload.status, delayMinutes: action.payload.delayMinutes } : i)
            }
        case 'FETCH_AIRLINE_BOOKINGS':
            return { ...state, bookings: action.payload }
        case 'FETCH_AIRLINE_REFUNDS':
            return { ...state, refunds: action.payload }
        case 'UPDATE_AIRLINE_REFUND':
            return {
                ...state,
                refunds: state.refunds.map(r => r.refundId === action.payload.refundId ? action.payload : r)
            }
        case 'FETCH_AIRLINE_COMPLAINTS':
            return { ...state, complaints: action.payload }
        case 'UPDATE_AIRLINE_COMPLAINT':
            return {
                ...state,
                complaints: state.complaints.map(c => c.complaintId === action.payload.complaintId ? action.payload : c)
            }
        default:
            return state
    }
}

export default AirlineReducer
