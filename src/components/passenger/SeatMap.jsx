import { formatMoney } from "../../utils/format"

/* Seats grouped by row: A B C | aisle | D E F */

// Step 1: Create the SeatMap component.
// Receive seat information and selection details through props.
function SeatMap({ seats, selected, maxSelect, onChange }) {

    // Step 2: Group seats according to their row number.
    const rows = {}

    seats.forEach(s => {

        // Extract the numeric row number from the seat number.
        const row = Number.parseInt(s.seatNumber, 10)

        // Create an empty array for the row if it doesn't exist.
        rows[row] = rows[row] || []

        // Add the current seat to its corresponding row.
        rows[row].push(s)
    })

    // Step 3: Get the extra charge for a particular seat position.
    const charge = (position) =>
        seats.find(s => s.seatPosition === position)?.extraCharge || 0

    // Step 4: Handle seat selection and deselection.
    const toggle = (seat) => {

        // Do not allow selection of unavailable seats.
        if (seat.status !== 'AVAILABLE') return

        // If the seat is already selected, remove it.
        if (selected.includes(seat.seatId)) {
            onChange(selected.filter(id => id !== seat.seatId))
        }

        // Otherwise, add the seat if the selection limit is not reached.
        else if (selected.length < maxSelect) {
            onChange([...selected, seat.seatId])
        }
    }

    // Step 5: Create a reusable button for each seat.
    const seatBtn = (s) => {

        // Start with the default seat CSS class.
        let cls = 'sf-seat'

        // If the seat is unavailable, mark it as taken.
        if (s.status !== 'AVAILABLE')
            cls += ' taken'

        // If the seat is already selected, mark it as chosen.
        else if (selected.includes(s.seatId))
            cls += ' chosen'

        // Otherwise, apply the window seat style.
        else if (s.seatPosition === 'WINDOW')
            cls += ' window'

        // Otherwise, apply the aisle seat style.
        else if (s.seatPosition === 'AISLE')
            cls += ' aisle'

        return (
            <button
                type="button"
                key={s.seatId}
                className={cls}
                onClick={() => toggle(s)}
                title={`${s.seatNumber} · ${s.seatPosition} · +${formatMoney(s.extraCharge)} · ${s.status}`}
            >
                {/* Display the seat letter without its row number. */}
                {s.seatNumber.replace(/\d+/, '')}
            </button>
        )
    }

    // Step 6: Display the seat legend and seating arrangement.
    return (
        <div>

            {/* Explain the different seat colours and additional charges. */}
            <div className="sf-seat-legend small mb-2">

                <span>
                    <i className="sf-dot window"></i>
                    Window (+{formatMoney(charge('WINDOW'))})
                </span>

                <span>
                    <i className="sf-dot aisle"></i>
                    Aisle (+{formatMoney(charge('AISLE'))})
                </span>

                <span>
                    <i className="sf-dot"></i>
                    Middle (free)
                </span>

                <span>
                    <i className="sf-dot chosen"></i>
                    Selected
                </span>

                <span>
                    <i className="sf-dot taken"></i>
                    Booked / Held
                </span>

            </div>

            {/* Display seats grouped by row. */}
            <div className="sf-seatmap">

                {Object.keys(rows)
                    .sort((a, b) => a - b)
                    .map(r => (

                        <div className="sf-seat-row" key={r}>

                            {/* Display the row number. */}
                            <span className="sf-row-no">{r}</span>

                            {/* Display the first three seats. */}
                            {rows[r].slice(0, 3).map(seatBtn)}

                            {/* Display the aisle between seat groups. */}
                            <span className="sf-aisle"></span>

                            {/* Display the remaining seats. */}
                            {rows[r].slice(3).map(seatBtn)}

                        </div>
                    ))}

            </div>
        </div>
    )
}

export default SeatMap
