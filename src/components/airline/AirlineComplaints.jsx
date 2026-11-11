import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAirlineComplaints,
    respondComplaint
} from "../../store/actions/AirlineAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Alert from "../common/Alert"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import FilterSelect from "../common/FilterSelect"

import {
    getErrorMessage,
    label
} from "../../utils/format"


// Step 1: List of available complaint statuses for filtering
const COMPLAINT_STATUSES = [
    'FORWARDED_TO_AIRLINE',
    'IN_PROGRESS',
    'RESOLVED'
]


function AirlineComplaints() {

    // Step 2: Get complaint records from the Redux store
    const complaints = useSelector(state => state.airline.complaints)

    // Step 3: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 4: Create state variables to manage complaints
    const [responses, setResponses] = useState({})
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)


    // Step 5: Fetch complaints forwarded by the admin
    useEffect(() => {

        // Get airline complaints from the backend through Redux
        dispatch(getAirlineComplaints())

    }, [dispatch])


    // Step 6: Send a response and update the complaint status
    const respond = async (complaintId, status) => {

        try {

            // Send the complaint ID, airline response and new status to the backend
            await dispatch(
                respondComplaint(
                    complaintId,
                    {
                        response: responses[complaintId],
                        status
                    }
                )
            )

        }
        catch (err) {

            // Display error message if the response update fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 7: Filter complaints based on status and search text
    const shown = complaints.filter(c =>
        (!statusFilter || c.status === statusFilter)
        &&
        `${c.passengerName} ${c.pnr} ${c.subject}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Display only the complaints belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 8: Display the airline complaint management interface
    return (
        <>

            {/* Page heading, search and status filter */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Complaints forwarded by Admin
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
                                <th>Status</th>
                                <th style={{ minWidth: 320 }}>
                                    Response
                                </th>
                            </tr>
                        </thead>


                        {/* Display complaint records */}
                        <tbody>

                            {/* Show an empty message when no complaints are found */}
                            {shown.length === 0 && <EmptyRow cols={6} />}

                            {/* Loop through the current page's complaint records */}
                            {rows.map(c => (

                                <tr key={c.complaintId}>

                                    {/* Display passenger name */}
                                    <td>
                                        {c.passengerName}
                                    </td>

                                    {/* Display PNR or '-' if unavailable */}
                                    <td>
                                        {c.pnr || '-'}
                                    </td>

                                    {/* Convert complaint category into a readable label */}
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

                                    {/* Display current complaint status */}
                                    <td>
                                        <StatusBadge status={c.status} />
                                    </td>


                                    {/* Display response or complaint action buttons */}
                                    <td>

                                        {/* Show the saved response when complaint is resolved */}
                                        {c.status === 'RESOLVED'

                                            ? (

                                                <span className="small">
                                                    {c.airlineResponse}
                                                </span>

                                            )
                                            : (

                                                <div className="d-flex gap-1">

                                                    {/* Enter or edit the response for the passenger */}
                                                    <input
                                                        className="form-control form-control-sm"
                                                        placeholder="Reply to passenger"
                                                        defaultValue={c.airlineResponse || ''}
                                                        onChange={(e) =>
                                                            setResponses({
                                                                ...responses,
                                                                [c.complaintId]: e.target.value
                                                            })
                                                        }
                                                    />


                                                    {/* Update complaint status to IN_PROGRESS */}
                                                    <button
                                                        className="btn btn-sm btn-outline-primary text-nowrap"
                                                        onClick={() =>
                                                            respond(c.complaintId, 'IN_PROGRESS')
                                                        }
                                                    >
                                                        In progress
                                                    </button>


                                                    {/* Update complaint status to RESOLVED */}
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() =>
                                                            respond(c.complaintId, 'RESOLVED')
                                                        }
                                                    >
                                                        Resolve
                                                    </button>

                                                </div>
                                            )
                                        }

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

export default AirlineComplaints
