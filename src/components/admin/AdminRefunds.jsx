
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    forwardRefund,
    getAllRefunds
} from "../../store/actions/AdminAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"

import {
    formatDate,
    formatMoney,
    getErrorMessage
} from "../../utils/format"


// Step 1: List of available refund statuses for filtering
const REFUND_STATUSES = [
    'REQUESTED',
    'FORWARDED_TO_AIRLINE',
    'APPROVED',
    'REJECTED',
    'PROCESSING',
    'REFUNDED',
    'FAILED'
]


function AdminRefunds() {

    // Step 2: Get all refund records from the Redux store
    const refunds = useSelector(state => state.admin.refunds)

    // Step 3: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 4: Create state variables to manage refund requests
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)


    // Step 5: Fetch all refund requests when the component loads
    useEffect(() => {

        // Get all refund requests from the backend through Redux
        dispatch(getAllRefunds())

    }, [dispatch])


    // Step 6: Forward a refund request to the airline
    const forward = async (id) => {

        try {

            // Send the refund ID to the backend through Redux
            await dispatch(forwardRefund(id))

        }
        catch (err) {

            // Display error message if forwarding fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 7: Filter refunds based on status and search text
    const shown = refunds.filter(r =>
        (!statusFilter || r.status === statusFilter)
        &&
        `${r.pnr} ${r.passengerName} ${r.airlineName} ${r.flightNumber}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the refund records belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 8: Display the refund management interface
    return (
        <>

            {/* Page heading, search and status filter */}
            <div className="d-flex justify-content-between align-items-center mb-2">

                <h4 className="sf-section-title mb-0">
                    Cancellation & Refund Requests
                </h4>

                <div className="d-flex gap-2">

                    {/* Search refunds by PNR, passenger or flight */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search PNR / passenger / flight"
                    />

                    {/* Filter refund requests based on their status */}
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


            {/* Explain the admin's role in the refund process */}
            <p className="text-muted small">
                Admin forwards each request to the airline. The airline makes the final decision.
            </p>


            {/* Display error messages */}
            <Alert
                msg={errMsg}
                onClose={() => setErrMsg("")}
            />


            {/* Display all filtered refund requests in a table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Refund table column headings */}
                        <thead>
                            <tr>
                                <th>PNR</th>
                                <th>Passenger</th>
                                <th>Airline</th>
                                <th>Flight</th>
                                <th>Travel</th>
                                <th>Paid</th>
                                <th>Eligible Refund</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>


                        {/* Display refund records */}
                        <tbody>

                            {/* Show an empty message when no refund requests are found */}
                            {shown.length === 0 && <EmptyRow cols={10} />}

                            {/* Loop through the current page's refund records */}
                            {rows.map(r => (

                                <tr key={r.refundId}>

                                    {/* Display booking PNR */}
                                    <td className="fw-semibold">
                                        {r.pnr}
                                    </td>

                                    {/* Display passenger name */}
                                    <td>
                                        {r.passengerName}
                                    </td>

                                    {/* Display airline name */}
                                    <td>
                                        {r.airlineName}
                                    </td>

                                    {/* Display flight number */}
                                    <td>
                                        {r.flightNumber}
                                    </td>

                                    {/* Display formatted travel date */}
                                    <td>
                                        {formatDate(r.travelDate)}
                                    </td>

                                    {/* Display the amount paid for the journey */}
                                    <td>
                                        {formatMoney(r.journeyAmount)}
                                    </td>

                                    {/* Display the eligible refund amount */}
                                    <td>
                                        {formatMoney(r.refundAmount)}
                                    </td>

                                    {/* Display refund reason and rejection reason if available */}
                                    <td className="small">

                                        {r.reason}

                                        {r.rejectionReason && (
                                            <div className="text-danger">
                                                Rejected: {r.rejectionReason}
                                            </div>
                                        )}

                                    </td>

                                    {/* Display current refund status */}
                                    <td>
                                        <StatusBadge status={r.status} />
                                    </td>


                                    {/* Display forwarding action for requested refunds */}
                                    <td className="text-end">

                                        {/* Show the Forward button only for requested refunds */}
                                        {r.status === 'REQUESTED' &&

                                            <button
                                                className="btn btn-sm btn-primary text-nowrap"
                                                onClick={() => forward(r.refundId)}
                                            >
                                                Forward to Airline
                                            </button>

                                        }

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for refund records */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>

        </>
    )
}

export default AdminRefunds
