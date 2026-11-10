import { useState } from "react"

const FIELDS = [
    ['businessFare', 'Business fare'], ['premiumFare', 'Premium Eco fare'], ['economyFare', 'Economy fare'],
    ['windowCharge', 'Window extra'], ['aisleCharge', 'Aisle extra']
]

// Airline changes fares, seat charges and baggage of a flight. Timings and seat rows stay fixed.
function FlightEdit({ flight, onSave, onCancel }) {
    const [values, setValues] = useState({
        businessFare: flight.businessFare, premiumFare: flight.premiumFare, economyFare: flight.economyFare,
        windowCharge: flight.windowCharge, aisleCharge: flight.aisleCharge, baggageInfo: flight.baggageInfo || ''
    })

    const change = (field, value) => setValues({ ...values, [field]: value })

    const save = (e) => {
        e.preventDefault()
        onSave(flight, values)
    }

    return (
        <div className="card sf-card mb-3 border-primary">
            <div className="card-body">
                <form onSubmit={(e) => save(e)}>
                    <div className="sf-subhead">Edit {flight.flightNumber} (fares and baggage)</div>
                    <div className="row g-2">
                        {FIELDS.map(([key, text]) => (
                            <div className="col-6 col-md-3 col-xl-2" key={key}>
                                <label className="form-label small">{text}</label>
                                <input type="number" min="0" className="form-control" required value={values[key]}
                                    onChange={(e) => change(key, e.target.value)} />
                            </div>
                        ))}
                        <div className="col-md-6">
                            <label className="form-label small">Baggage info</label>
                            <input className="form-control" value={values.baggageInfo}
                                onChange={(e) => change('baggageInfo', e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                        <button className="btn btn-primary btn-sm">Save</button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onCancel()}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FlightEdit
