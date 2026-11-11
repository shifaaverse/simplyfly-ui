import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAirlines,
    onboardAirline,
    updateAirlineStatus
} from "../../store/actions/AdminAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import Alert from "../common/Alert"
import AirlineForm from "../common/AirlineForm"

import { getErrorMessage } from "../../utils/format"

function AdminAirlines() {

    // Step 1: Get the airline list from the Redux store
    const airlines = useSelector(state => state.admin.airlines)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 3: Create state variables to manage the component
    const [filter, setFilter] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")


    // Step 4: Fetch airlines whenever the status filter changes
    useEffect(() => {
        dispatch(getAirlines(filter))
    }, [dispatch, filter])


    // Step 5: Change the airline status
    const changeStatus = async (airlineId, status) => {

        let reason = ""

        // Ask for a reason when rejecting or suspending an airline
        if (status === 'REJECTED' || status === 'SUSPENDED') {

            reason = window.prompt(`Reason for ${status.toLowerCase()}ing this airline?`)

            // Stop if the admin cancels the prompt
            if (reason === null) return

            // A reason is required for rejection or suspension
            if (reason.trim() === '') {
                setErrMsg('A reason is required')
                return
            }
        }

        try {

            // Send the new status and reason to the backend through Redux
            await dispatch(updateAirlineStatus(airlineId, status, reason.trim()))

            // Show success message after updating the status
            setErrMsg("")
            setMsg(`Airline ${status.toLowerCase()}`)
        }
        catch (err) {

            // Show the error message if the update fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 6: Onboard a new airline
    const onboard = async (airline) => {

        try {

            // Send the airline details to the backend through Redux
            await dispatch(onboardAirline(airline))

            // Close the form after successful onboarding
            setShowForm(false)

            // Display success message
            setMsg('Airline onboarded and approved')
        }
        catch (err) {

            // Display error message if onboarding fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 7: Filter airlines using name, code or email
    const shown = airlines.filter(a =>
        `${a.name} ${a.code} ${a.email}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Step 8: Display only the airlines belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 9: Display the airline management interface
    return (
        <>
            {/* Page heading, search, status filter and onboard button */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Airline Management
                </h4>

                <div className="d-flex gap-2">

                    {/* Search airlines by name, code or email */}
                    <SearchBox
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setPage(0)
                        }}
                        placeholder="Search name / code / email"
                    />

                    {/* Filter airlines based on their status */}
                    <select
                        className="form-select form-select-sm"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value)
                            setPage(0)
                        }}
                    >
                        <option value="">All statuses</option>
                        <option>PENDING</option>
                        <option>APPROVED</option>
                        <option>REJECTED</option>
                        <option>SUSPENDED</option>
                    </select>

                    {/* Show or hide the airline onboarding form */}
                    <button
                        className="btn btn-sm btn-primary text-nowrap"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <i className="bi bi-plus-lg me-1"></i>
                        Onboard Airline
                    </button>

                </div>
            </div>


            {/* Display success and error messages */}
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <Alert msg={msg} type="success" onClose={() => setMsg("")} />


            {/* Display the airline form only when showForm is true */}
            {showForm && (
                <div className="card sf-card mb-3">
                    <div className="card-body">

                        <AirlineForm
                            onSubmit={onboard}
                            buttonText="Onboard (auto approved)"
                        />

                    </div>
                </div>
            )}


            {/* Display all filtered airlines in a table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        {/* Table column headings */}
                        <thead>
                            <tr>
                                <th>Airline</th>
                                <th>Code</th>
                                <th>Reg. No</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Login</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>


                        {/* Display airline details */}
                        <tbody>

                            {/* Show an empty message when no airlines are found */}
                            {shown.length === 0 && <EmptyRow cols={8} />}

                            {/* Loop through the current page's airline records */}
                            {rows.map(a => (

                                <tr key={a.airlineId}>

                                    <td className="fw-semibold">{a.name}</td>

                                    <td>
                                        <span className="badge text-bg-light border">
                                            {a.code}
                                        </span>
                                    </td>

                                    <td>{a.registrationNumber}</td>

                                    <td>{a.email}</td>

                                    <td>{a.contact}</td>

                                    <td>{a.username}</td>

                                    {/* Display airline status and rejection reason */}
                                    <td>
                                        <StatusBadge status={a.status} />

                                        {a.rejectionReason && (
                                            <div
                                                className="small text-muted"
                                                style={{ maxWidth: 180 }}
                                            >
                                                {a.rejectionReason}
                                            </div>
                                        )}
                                    </td>


                                    {/* Display actions based on airline status */}
                                    <td className="text-end text-nowrap">

                                        {/* Show Approve button if airline is not approved */}
                                        {a.status !== 'APPROVED' &&
                                            <button
                                                className="btn btn-sm btn-success me-1"
                                                onClick={() => changeStatus(a.airlineId, 'APPROVED')}
                                            >
                                                Approve
                                            </button>
                                        }

                                        {/* Show Reject button only for pending airlines */}
                                        {a.status === 'PENDING' &&
                                            <button
                                                className="btn btn-sm btn-outline-danger me-1"
                                                onClick={() => changeStatus(a.airlineId, 'REJECTED')}
                                            >
                                                Reject
                                            </button>
                                        }

                                        {/* Show Suspend button only for approved airlines */}
                                        {a.status === 'APPROVED' &&
                                            <button
                                                className="btn btn-sm btn-outline-warning"
                                                onClick={() => changeStatus(a.airlineId, 'SUSPENDED')}
                                            >
                                                Suspend
                                            </button>
                                        }

                                    </td>

                                </tr>
                            ))}

                        </tbody>
                    </table>

                </div>


                {/* Handle pagination for the airline list */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>
        </>
    )
}

export default AdminAirlines
