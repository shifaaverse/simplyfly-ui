import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    forwardComplaint,
    getAirlines,
    getAllComplaints
} from "../../store/actions/AdminAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"

import {
    formatDateTime,
    getErrorMessage,
    label
} from "../../utils/format"


// List of available complaint statuses for filtering
const COMPLAINT_STATUSES = [
    'OPEN',
    'FORWARDED_TO_AIRLINE',
    'IN_PROGRESS',
    'RESOLVED'
]


function AdminComplaints() {

    // Step 1: Get complaints and airlines from the Redux store
    const complaints = useSelector(state => state.admin.complaints)
    const airlines = useSelector(state => state.admin.airlines)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 3: Create state variables to manage complaints
    const [airlineChoice, setAirlineChoice] = useState({})
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)


    // Step 4: Fetch all complaints and approved airlines when the component loads
    useEffect(() => {

        // Fetch all passenger complaints
        dispatch(getAllComplaints())

        // Fetch only approved airlines for forwarding complaints
        dispatch(getAirlines('APPROVED'))

    }, [dispatch])


    // Step 5: Forward a complaint to the selected airline
    const forward = async (c) => {

        try {

            // Send complaint ID and selected airline ID to the backend
            await dispatch(
                forwardComplaint(
                    c.complaintId,
                    airlineChoice[c.complaintId]
                )
            )

        }
        catch (err) {

            // Display error message if forwarding fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 6: Filter complaints based on status and search text
    const shown = complaints.filter(c =>
        (!statusFilter || c.status === statusFilter)
        &&
        `${c.passengerName} ${c.pnr} ${c.subject} ${c.airlineName}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the complaints belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 7: Display the complaint management interface
    return (
        <>

            {/* Page heading, search and status filter */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Complaints & Support
                </h4>

                <div className="d-flex gap-2">

                    {/* Search complaints by passenger, PNR or subject */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search passenger / PNR / subject"
                    />

                    {/* Filter complaints based on their status */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All status"
                        options={COMPLAINT_STATUSES}
                    />

                </div>
            </div>


            {/* Display error messages */}
            <Alert
                msg={errMsg}
                onClose={() => setErrMsg("")}
            />


            {/* Display all filtered complaints in a table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Complaint table column headings */}
                        <thead>
                            <tr>
                                <th>Passenger</th>
                                <th>PNR</th>
                                <th>Category</th>
                                <th>Complaint</th>
                                <th>Airline</th>
                                <th>Airline Response</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>


                        {/* Display complaint records */}
                        <tbody>

                            {/* Show an empty message when no complaints are found */}
                            {shown.length === 0 && <EmptyRow cols={8} />}

                            {/* Loop through the current page's complaint records */}
                            {rows.map(c => (

                                <tr key={c.complaintId}>

                                    {/* Display passenger name and complaint date */}
                                    <td>
                                        {c.passengerName}

                                        <div className="small text-muted">
                                            {formatDateTime(c.createdAt)}
                                        </div>
                                    </td>


                                    {/* Display PNR or '-' if unavailable */}
                                    <td>
                                        {c.pnr || '-'}
                                    </td>


                                    {/* Display complaint category in a readable format */}
                                    <td>
                                        {label(c.category)}
                                    </td>


                                    {/* Display complaint subject and description */}
                                    <td>
                                        <b>{c.subject}</b>

                                        <div className="small text-muted">
                                            {c.description}
                                        </div>
                                    </td>


                                    {/* Display assigned airline name */}
                                    <td>
                                        {c.airlineName || '-'}
                                    </td>


                                    {/* Display airline response */}
                                    <td className="small">
                                        {c.airlineResponse || '-'}
                                    </td>


                                    {/* Display complaint status */}
                                    <td>
                                        <StatusBadge status={c.status} />
                                    </td>


                                    {/* Display forwarding action for open complaints */}
                                    <td
                                        className="text-end"
                                        style={{ minWidth: 200 }}
                                    >

                                        {c.status === 'OPEN' && (

                                            <div className="d-flex gap-1">

                                                {/* Show airline selection only when PNR is unavailable */}
                                                {!c.pnr && (

                                                    <select
                                                        className="form-select form-select-sm"
                                                        onChange={(e) =>
                                                            setAirlineChoice({
                                                                ...airlineChoice,
                                                                [c.complaintId]: e.target.value
                                                            })
                                                        }
                                                    >

                                                        <option value="">
                                                            Airline...
                                                        </option>

                                                        {/* Display all approved airlines */}
                                                        {airlines.map(a => (
                                                            <option
                                                                key={a.airlineId}
                                                                value={a.airlineId}
                                                            >
                                                                {a.name}
                                                            </option>
                                                        ))}

                                                    </select>
                                                )}


                                                {/* Forward the complaint to the selected airline */}
                                                <button
                                                    className="btn btn-sm btn-primary text-nowrap"
                                                    onClick={() => forward(c)}
                                                >
                                                    Forward
                                                </button>

                                            </div>
                                        )}

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for complaint records */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>
        </>
    )
}

export default AdminComplaints
