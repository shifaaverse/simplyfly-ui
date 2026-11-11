import { formatMoney, label } from "../../utils/format"
import { BAGGAGE_PRICE_PER_KG, TAX_PERCENT } from "../../utils/addons"

// Store the discount description for children and infants.
const DISCOUNT = {
    CHILD: ' (75% of adult fare)',
    INFANT: ' (10% of adult fare)'
}

// Step 1: Receive traveller details and seat class from the parent component.
function FareBreakup({ traveller, seatClass }) {

    // Store the received traveller object in a shorter variable.
    const t = traveller

    // Step 2: Create the first fare breakdown line (base fare).
    const lines = [[
        `Base fare - ${label(seatClass)}, ${label(t.category)}${DISCOUNT[t.category] || ''}`,
        t.baseFare
    ]]

    // Step 3: Add seat charge if the traveller has an extra seat charge.
    if (t.seatCharge > 0)
        lines.push([`Seat charge - ${label(t.seatPosition)} seat`, t.seatCharge])

    // Step 4: Add meal charge if a paid meal was selected.
    if (t.mealCharge > 0)
        lines.push([
            label(t.mealOption === 'VEG' ? 'Veg meal' : 'Non-veg meal'),
            t.mealCharge
        ])

    // Step 5: Add extra baggage charge if applicable.
    if (t.baggageCharge > 0)
        lines.push([
            `Extra baggage - ${t.extraBaggageKg} kg x ${formatMoney(BAGGAGE_PRICE_PER_KG)}`,
            t.baggageCharge
        ])

    // Step 6: Add the tax amount to the fare breakdown.
    lines.push([`Tax (${TAX_PERCENT}%)`, t.tax])

    // Step 7: Display all fare details and the final traveller fare.
    return (
        <div className="border rounded p-2 mt-2 small">

            {/* Display the traveller's name. */}
            <div className="fw-semibold mb-1">{t.travellerName}</div>

            {/* Display each fare item and its amount. */}
            {lines.map(([text, amount]) => (
                <div className="d-flex justify-content-between" key={text}>
                    <span className="text-muted">{text}</span>
                    <span>{formatMoney(amount)}</span>
                </div>
            ))}

            {/* Display the final total fare. */}
            <div className="d-flex justify-content-between fw-semibold border-top mt-1 pt-1">
                <span>Total</span>
                <span>{formatMoney(t.fare)}</span>
            </div>
        </div>
    )
}

export default FareBreakup
