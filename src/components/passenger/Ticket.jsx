import StatusBadge from "../common/StatusBadge"
import { extrasText } from "../../utils/addons"
import { formatDate, formatMoney, formatTime, label } from "../../utils/format"

/* E-ticket. "Download" uses the browser print-to-PDF */

// Step 1: Create the Ticket component.
// Receive booking information through props.
function Ticket({ booking }) {

    // Step 2: Display the passenger's E-Ticket.
    return (
        <div className="sf-ticket print-area">

            {/* Ticket header: Display airline name, trip type and PNR. */}
            <div className="sf-ticket-head">
                <div>

                    <div className="fw-bold fs-5">
                        <i className="bi bi-airplane-fill me-2"></i>
                        SimplyFly E-Ticket
                    </div>

                    {/* Display trip type and booking date. */}
                    <div className="small opacity-75">
                        {label(booking.tripType)} · Booked {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </div>

                </div>

                {/* Display the booking PNR. */}
                <div className="text-end">
                    <div className="small opacity-75">PNR</div>
                    <div className="fs-3 fw-bold font-monospace">
                        {booking.pnr}
                    </div>
                </div>
            </div>

            {/* Step 3: Loop through all journeys in the booking. */}
            {booking.journeys.map(j => (

                <div className="sf-ticket-journey" key={j.journeyId}>

                    {/* Display journey type, airline, flight number and statuses. */}
                    <div className="d-flex justify-content-between align-items-center mb-2">

                        <div className="fw-semibold">
                            {label(j.journeyType)} · {j.airlineName} {j.flightNumber}
                        </div>

                        <div>
                            <StatusBadge status={j.status} />
                            <StatusBadge status={j.flightStatus} />
                        </div>

                    </div>

                    {/* Display departure and arrival information. */}
                    <div className="row text-center align-items-center mb-2">

                        <div className="col">
                            <div className="fs-4 fw-bold">
                                {formatTime(j.departureTime)}
                            </div>
                            <div>{j.source}</div>
                        </div>

                        <div className="col">
                            <i className="bi bi-airplane"></i>
                            <div className="small text-muted">
                                {formatDate(j.travelDate)}
                            </div>
                        </div>

                        <div className="col">
                            <div className="fs-4 fw-bold">
                                {formatTime(j.arrivalTime)}
                            </div>
                            <div>{j.destination}</div>
                        </div>

                    </div>

                    {/* Step 4: Display traveller details for this journey. */}
                    <table className="table table-sm mb-0">

                        <thead>
                            <tr>
                                <th>Traveller</th>
                                <th>Type</th>
                                <th>Class</th>
                                <th>Seat</th>
                                <th>Meal / Baggage</th>
                                <th className="text-end">Fare</th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* Loop through all travellers in this journey. */}
                            {j.travellers.map(t => (

                                <tr key={`${t.travellerName}-${t.category}-${t.seatNumber}`}>

                                    <td>{t.travellerName}</td>

                                    <td>{label(t.category)}</td>

                                    <td>{label(j.seatClass)}</td>

                                    <td className="fw-semibold">
                                        {t.seatNumber}
                                    </td>

                                    <td className="small">
                                        {extrasText(t)}
                                    </td>

                                    <td className="text-end">
                                        {formatMoney(t.fare)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>
                    </table>

                </div>

            ))}

            {/* Step 5: Display booking status, total amount and print button. */}
            <div className="sf-ticket-foot">

                <span>
                    Booking status: <StatusBadge status={booking.status} />
                </span>

                <span className="fw-bold">
                    Total paid: {formatMoney(booking.totalAmount)}
                </span>

                {/* Print or save the ticket as PDF. */}
                <button
                    className="btn btn-sm btn-outline-primary no-print"
                    onClick={() => window.print()}
                >
                    <i className="bi bi-download me-1"></i>
                    Download / Print
                </button>

            </div>
        </div>
    )
}

export default Ticket
