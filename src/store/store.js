import { configureStore } from "@reduxjs/toolkit";
import AdminReducer from "./reducers/AdminReducer";
import AirlineReducer from "./reducers/AirlineReducer";
import PassengerReducer from "./reducers/PassengerReducer";
import NotificationReducer from "./reducers/NotificationReducer";

// One reducer per actor (same pattern as CustomerReducer)
export const store = configureStore({
    reducer: {
        admin: AdminReducer,
        airline: AirlineReducer,
        passenger: PassengerReducer,
        notification: NotificationReducer
    }
})
