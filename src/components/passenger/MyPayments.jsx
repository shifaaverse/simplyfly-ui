import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyPayments } from "../../store/actions/PassengerAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"
import { formatDateTime, formatMoney, label } from "../../utils/format"

// Step 1: Store the available payment statuses.
const PAYMENT_STATUSES = [
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
]

// Step 2: Create the MyPayments component.
function MyPayments() {

    // Get the passenger's payment records from Redux.
    const payments = useSelector(state => state.passenger.payments)

    const dispatch = useDispatch()

    // Step 3: Store search text, status filter and current page.
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)

    // Step 4: Fetch payment history when the component loads.
    useEffect(() => {
        dispatch(getMyPayments())
    }, [dispatch])

    // Step 5: Filter payments by status and search text.
    const shown = payments.filter(p =>
        (!statusFilter || p.status === statusFilter)
        &&
        `${p.pnr} ${p.transactionId}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Get only the payment records belonging to the current page.
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    // Step 6: Display the payment history.
    return (
        <>
            {/* Search and status filter section. */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Payment history
                </h4>

                <div className="d-flex gap-2">

                    {/* Search payments using PNR or transaction ID. */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search PNR / transaction id"
                    />

                    {/* Filter payments using their status. */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All payments"
                        options={PAYMENT_STATUSES}
                    />

                </div>
            </div>

            {/* Step 7: Display payment records in a table. */}
            <div className="card sf-card">
                <table className="table align-middle mb-0">

                    <thead>
                        <tr>
                            <th>PNR</th>
                            <th>Transaction</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Display an empty row when no payments match. */}
                        {shown.length === 0 &&
                            <EmptyRow cols={6} />}

                        {/* Display payment records for the current page. */}
                        {rows.map(p => (
                            <tr key={p.paymentId}>

                                <td className="fw-semibold">
                                    {p.pnr}
                                </td>

                                <td className="font-monospace small">
                                    {p.transactionId || '-'}
                                </td>

                                <td>
                                    {label(p.method)}
                                </td>

                                <td>
                                    {formatMoney(p.amount)}
                                </td>

                                <td>
                                    <StatusBadge status={p.status} />
                                </td>

                                <td>
                                    {formatDateTime(p.createdAt)}
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>

                {/* Step 8: Display pagination for payment history. */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>
        </>
    )
}

export default MyPayments
