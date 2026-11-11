import { useSelector } from "react-redux"
import { formatDate } from "../../utils/format"

/* Routes that have bookable flights. Clicking one fills From / To */
function AvailableRoutes({ onPick }) {

    // Step 1: Get available routes from the Redux store.
    const routes = useSelector(state => state.passenger.availableRoutes)

    // Step 2: Display a message if no routes are available.
    if (routes.length === 0)
        return <p className="small text-white-50 mt-3 mb-0">No airline has published flights yet.</p>

    return (
        <div className="mt-3">

            {/* Heading for the available routes section. */}
            <div className="small text-white-50 mb-1">
                Flights available on these routes (click to fill):
            </div>

            <div className="d-flex flex-wrap gap-2">

                {/* Step 3: Display each available route as a clickable button. */}
                {routes.map(r => (
                    <button
                        type="button"
                        key={r.sourceCode + r.destinationCode}
                        className="btn btn-sm sf-route-chip"
                        onClick={() => onPick(r)}
                        title={`${r.numberOfFlights} dated flights`}
                    >
                        {r.sourceCity} → {r.destinationCity}

                        <span className="opacity-75 ms-1">
                            till {formatDate(r.lastDate)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default AvailableRoutes
