import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    approveRefund,
    getAirlineRefunds,
    rejectRefund
} from "../../store/actions/AirlineAction"

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


// Step 1: List of refund statuses available for filtering
const REFUND_STATUSES = [
    'FORWARDED_TO_AIRLINE',
    'APPROVED',
    'REJECTED',
    'PROCESSING',
    'REFUNDED',
    'FAILED'
]


function AirlineRefunds() {

    // Step 2: Get refund records from the Redux store
    const refunds = useSelector(state => state.airline.refunds)

    // Step 3: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 4: Store rejection reasons for individual refund requests
    const [reasons, setReasons] = useState({})

    // Store error message
    const [errMsg, setErrMsg] = useState("")

    // Store search text, selected status and current page
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)


    // Step 5: Fetch refund requests forwarded to the airline
    useEffect(() => {

        dispatch(getAirlineRefunds())

    }, [dispatch])


    // Step 6: Handle approve and reject actions
    const decide = async (action) => {

        try {

            // Dispatch the selected refund action
            await dispatch(action)

        }
        catch (err) {

            // Display error message if the action fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 7: Filter refund requests by status and search text
    const shown = refunds.filter(r =>
        (!statusFilter || r.status === statusFilter)
        &&
        `${r.pnr} ${r.passengerName} ${r.flightNumber}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the refund requests belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 8: Display refund management interface
    return (
        <>

            {/* Page heading, search and status filter */}
            <div className="d-flex justify-content-between align-items-center mb-2">

                <h4 className="sf-section-title mb-0">
                    Refund Requests
                </h4>

                <div className="d-flex gap-2">

                    {/* Search refund requests by PNR, passenger or flight */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search PNR / passenger / flight"
                    />

                    {/* Filter refund requests by their current status */}
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


            {/* Display the cancellation refund policy */}
            <p className="text-muted small">
                Cancellation policy: 48+ hrs before departure → 80% refund · 24-48 hrs → 50% · under 24 hrs → no refund.
            </p>


            {/* Display error messages */}
            <Alert
                msg={errMsg}
                onClose={() => setErrMsg("")}
            />


            {/* Refund requests table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Table column headings */}
                        <thead>
                            <tr>
                                <th>PNR</th>
                                <th>Passenger</th>
                                <th>Flight</th>
                                <th>Travel</th>
                                <th>Paid</th>
                                <th>Eligible Refund</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th style={{ minWidth: 280 }}>
                                    Decision
                                </th>
                            </tr>
                        </thead>


                        {/* Display refund records */}
                        <tbody>

                            {/* Show a message if no refund requests are found */}
                            {shown.length === 0 && (
                                <EmptyRow
                                    cols={9}
                                    text="No refund requests found"
                                />
                            )}


                            {/* Loop through the refund requests on the current page */}
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

                                    {/* Display flight number */}
                                    <td>
                                        {r.flightNumber}
                                    </td>

                                    {/* Display journey travel date */}
                                    <td>
                                        {formatDate(r.travelDate)}
                                    </td>

                                    {/* Display the amount originally paid */}
                                    <td>
                                        {formatMoney(r.journeyAmount)}
                                    </td>

                                    {/* Display the eligible refund amount */}
                                    <td className="fw-semibold">
                                        {formatMoney(r.refundAmount)}
                                    </td>

                                    {/* Display the passenger's refund reason */}
                                    <td className="small">
                                        {r.reason}
                                    </td>

                                    {/* Display current refund status */}
                                    <td>
                                        <StatusBadge status={r.status} />
                                    </td>


                                    {/* Display decision buttons for pending airline decisions */}
                                    <td>

                                        {r.status === 'FORWARDED_TO_AIRLINE'

                                            ? (

                                                <div className="d-flex gap-1">

                                                    {/* Approve the refund request */}
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() =>
                                                            decide(approveRefund(r.refundId))
                                                        }
                                                    >
                                                        Approve
                                                    </button>


                                                    {/* Enter a reason if the airline rejects the refund */}
                                                    <input
                                                        className="form-control form-control-sm"
                                                        placeholder="Rejection reason"
                                                        onChange={(e) =>
                                                            setReasons({
                                                                ...reasons,
                                                                [r.refundId]: e.target.value
                                                            })
                                                        }
                                                    />


                                                    {/* Reject the refund with the entered reason */}
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            decide(
                                                                rejectRefund(
                                                                    r.refundId,
                                                                    reasons[r.refundId]
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            )

                                            : (

                                                // Show rejection reason or decision information
                                                <span className="small text-muted">
                                                    {r.rejectionReason || 'Decided'}
                                                </span>

                                            )
                                        }

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for refund requests */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>

        </>
    )
}

export default AirlineRefunds
