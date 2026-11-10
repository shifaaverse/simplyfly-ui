import { formatMoney, label } from "../../utils/format"
import { BAGGAGE_PRICE_PER_KG, TAX_PERCENT } from "../../utils/addons"

const DISCOUNT = { CHILD: ' (75% of adult fare)', INFANT: ' (10% of adult fare)' }

// Shows step by step how the fare of one traveller is calculated
function FareBreakup({ traveller, seatClass }) {
    const t = traveller

    const lines = [[`Base fare - ${label(seatClass)}, ${label(t.category)}${DISCOUNT[t.category] || ''}`, t.baseFare]]
    if (t.seatCharge > 0)
        lines.push([`Seat charge - ${label(t.seatPosition)} seat`, t.seatCharge])
    if (t.mealCharge > 0)
        lines.push([label(t.mealOption === 'VEG' ? 'Veg meal' : 'Non-veg meal'), t.mealCharge])
    if (t.baggageCharge > 0)
        lines.push([`Extra baggage - ${t.extraBaggageKg} kg x ${formatMoney(BAGGAGE_PRICE_PER_KG)}`, t.baggageCharge])
    lines.push([`Tax (${TAX_PERCENT}%)`, t.tax])

    return (
        <div className="border rounded p-2 mt-2 small">
            <div className="fw-semibold mb-1">{t.travellerName}</div>
            {lines.map(([text, amount]) => (
                <div className="d-flex justify-content-between" key={text}>
                    <span className="text-muted">{text}</span><span>{formatMoney(amount)}</span>
                </div>
            ))}
            <div className="d-flex justify-content-between fw-semibold border-top mt-1 pt-1">
                <span>Total</span><span>{formatMoney(t.fare)}</span>
            </div>
        </div>
    )
}

export default FareBreakup
