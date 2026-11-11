import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyRefunds } from "../../store/actions/PassengerAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDate, formatMoney } from "../../utils/format"

// Step 1: Store all the possible refund statuses.
const REFUND_STATUSES = [
    'REQUESTED',
    'FORWARDED_TO_AIRLINE',
    'APPROVED',
    'REJECTED',
    'PROCESSING',
    'REFUNDED',
    'FAILED'
]

// Step 2: Create the MyRefunds component.
function MyRefunds() {

    // Get the passenger's refund records from Redux.
    const refunds = useSelector(state => state.passenger.refunds)

    const dispatch = useDispatch()

    // Step 3: Store search text, status filter and current page.
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    // Step 4: Fetch refund records when the component loads.
    useEffect(() => {
        dispatch(getMyRefunds())
    }, [dispatch])

    // Step 5: Filter refunds by status and search text.
    const shown = refunds.filter(r =>
        (!statusFilter || r.status === statusFilter)
        &&
        `${r.pnr} ${r.airlineName} ${r.flightNumber}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Get only the refund records for the current page.
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    // Step 6: Display the cancellation and refund history.
    return (
        <>
            {/* Search and status filter section. */}
            <div className="d-flex justify-content-between align-items-center mb-2">

                <h4 className="sf-section-title mb-0">
                    Cancellation & refund status
                </h4>

                <div className="d-flex gap-2">

                    {/* Search using PNR, airline name or flight number. */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search PNR / flight"
                    />

                    {/* Filter refunds using their status. */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All status"
                        options={REFUND_STATUSES}
                    />

                </div>
            </div>

            {/* Display the refund workflow. */}
            <p className="small text-muted">
                REQUESTED → FORWARDED TO AIRLINE → REFUNDED / REJECTED
            </p>

            {/* Step 7: Display refund records in a table. */}
            <div className="card sf-card">
                <table className="table align-middle mb-0">

                    <thead>
                        <tr>
                            <th>PNR</th>
                            <th>Flight</th>
                            <th>Travel</th>
                            <th>Paid</th>
                            <th>Refund</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Display an empty row when no refunds match. */}
                        {shown.length === 0 &&
                            <EmptyRow cols={7} />}

                        {/* Display refund records for the current page. */}
                        {rows.map(r => (
                            <tr key={r.refundId}>

                                <td className="fw-semibold">
                                    {r.pnr}
                                </td>

                                <td>
                                    {r.airlineName} {r.flightNumber}
                                </td>

                                <td>
                                    {formatDate(r.travelDate)}
                                </td>

                                <td>
                                    {formatMoney(r.journeyAmount)}
                                </td>

                                <td className="fw-semibold">
                                    {formatMoney(r.refundAmount)}
                                </td>

                                <td className="small">
                                    {r.reason}

                                    {/* Display the airline's rejection reason if available. */}
                                    {r.rejectionReason &&
                                        <div className="text-danger">
                                            Airline: {r.rejectionReason}
                                        </div>
                                    }
                                </td>

                                <td>
                                    <StatusBadge status={r.status} />
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>

                {/* Step 8: Display pagination. */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>
        </>
    )
}

export default MyRefunds
