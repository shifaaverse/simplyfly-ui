import { formatMoney } from "../../utils/format"

/* Seats grouped by row: A B C | aisle | D E F */
function SeatMap({ seats, selected, maxSelect, onChange }) {
    const rows = {}
    seats.forEach(s => {
        const row = parseInt(s.seatNumber)
        rows[row] = rows[row] || []
        rows[row].push(s)
    })

    const toggle = (seat) => {
        if (seat.status !== 'AVAILABLE') return
        if (selected.includes(seat.seatId)) {
            onChange(selected.filter(id => id !== seat.seatId))
        } else if (selected.length < maxSelect) {
            onChange([...selected, seat.seatId])
        }
    }

    const seatBtn = (s) => {
        let cls = 'sf-seat'
        if (s.status !== 'AVAILABLE') cls += ' taken'
        else if (selected.includes(s.seatId)) cls += ' chosen'
        else if (s.seatPosition === 'WINDOW') cls += ' window'
        else if (s.seatPosition === 'AISLE') cls += ' aisle'
        return (
            <button type="button" key={s.seatId} className={cls} onClick={() => toggle(s)}
                title={`${s.seatNumber} · ${s.seatPosition} · +${formatMoney(s.extraCharge)} · ${s.status}`}>
                {s.seatNumber.replace(/\d+/, '')}
            </button>
        )
    }

    return (
        <div>
            <div className="sf-seat-legend small mb-2">
                <span><i className="sf-dot window"></i>Window</span>
                <span><i className="sf-dot aisle"></i>Aisle</span>
                <span><i className="sf-dot"></i>Middle</span>
                <span><i className="sf-dot chosen"></i>Selected</span>
                <span><i className="sf-dot taken"></i>Booked / Held</span>
            </div>
            <div className="sf-seatmap">
                {Object.keys(rows).sort((a, b) => a - b).map(r => (
                    <div className="sf-seat-row" key={r}>
                        <span className="sf-row-no">{r}</span>
                        {rows[r].slice(0, 3).map(seatBtn)}
                        <span className="sf-aisle"></span>
                        {rows[r].slice(3).map(seatBtn)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SeatMap
