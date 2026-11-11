import { useState } from "react"


// Step 1: Define the fare and seat charge fields
const FIELDS = [
    ['businessFare', 'Business fare'],
    ['premiumFare', 'Premium Eco fare'],
    ['economyFare', 'Economy fare'],
    ['windowCharge', 'Window extra'],
    ['aisleCharge', 'Aisle extra']
]


// Airline can edit fares, seat charges and baggage information.
// Flight timings and seat rows remain fixed.
function FlightEdit({ flight, onSave, onCancel }) {

    // Step 2: Store the editable flight information
    const [values, setValues] = useState({
        businessFare: flight.businessFare,
        premiumFare: flight.premiumFare,
        economyFare: flight.economyFare,
        windowCharge: flight.windowCharge,
        aisleCharge: flight.aisleCharge,
        baggageInfo: flight.baggageInfo || ''
    })


    // Step 3: Update the selected field in the values state
    const change = (field, value) => {

        setValues({
            ...values,
            [field]: value
        })

    }


    // Step 4: Handle the flight edit form submission
    const save = (e) => {

        // Prevent the browser from refreshing the page
        e.preventDefault()

        // Pass the original flight and updated values to the parent component
        onSave(flight, values)

    }


    // Step 5: Display the flight editing form
    return (
        <div className="card sf-card mb-3 border-primary">

            <div className="card-body">

                <form onSubmit={(e) => save(e)}>

                    {/* Display flight number in the form heading */}
                    <div className="sf-subhead">
                        Edit {flight.flightNumber} (fares and baggage)
                    </div>


                    {/* Display fare and seat charge input fields */}
                    <div className="row g-2">

                        {/* Generate input fields dynamically using map() */}
                        {FIELDS.map(([key, text]) => (

                            <div
                                className="col-6 col-md-3 col-xl-2"
                                key={key}
                            >

                                {/* Display the corresponding field label */}
                                <label className="form-label small">
                                    {text}
                                </label>

                                {/* Input for updating fare or seat charges */}
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    required
                                    value={values[key]}
                                    onChange={(e) =>
                                        change(key, e.target.value)
                                    }
                                />

                            </div>

                        ))}


                        {/* Input for updating baggage information */}
                        <div className="col-md-6">

                            <label
                                htmlFor="edit-flight-baggage-info"
                                className="form-label small"
                            >
                                Baggage info
                            </label>

                            <input
                                id="edit-flight-baggage-info"
                                className="form-control"
                                value={values.baggageInfo}
                                onChange={(e) =>
                                    change('baggageInfo', e.target.value)
                                }
                            />

                        </div>

                    </div>


                    {/* Save and Cancel buttons */}
                    <div className="mt-3 d-flex gap-2">

                        {/* Submit the updated flight information */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                        >
                            Save
                        </button>

                        {/* Cancel editing and notify the parent component */}
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default FlightEdit
