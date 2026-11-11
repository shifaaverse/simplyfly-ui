import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getPassengerBookings,
    getPassengers,
    updatePassengerStatus
} from "../../store/actions/AdminAction"

import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import FilterSelect from "../common/FilterSelect"

import {
    formatDate,
    formatMoney
} from "../../utils/format"


function AdminPassengers() {

    // Step 1: Get passenger details and booking history from the Redux store
    const passengers = useSelector(state => state.admin.passengers)
    const passengerBookings = useSelector(state => state.admin.passengerBookings)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 3: Create state variables to manage passengers
    const [search, setSearch] = useState("")
    const [openId, setOpenId] = useState(null)
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(0)


    // Step 4: Fetch all passengers when the component loads
    useEffect(() => {

        // Pass an empty string to fetch all passengers
        dispatch(getPassengers(""))

    }, [dispatch])


    // Step 5: Search passengers using the entered search text
    const onSearch = (e) => {

        // Prevent the form from refreshing the page
        e.preventDefault()

        // Reset pagination to the first page
        setPage(0)

        // Fetch passengers matching the search text
        dispatch(getPassengers(search))
    }


    // Step 6: Show or hide a passenger's booking history
    const toggleHistory = (id) => {

        // Close the history if the same passenger is clicked again
        if (openId === id) {
            setOpenId(null)
            return
        }

        // Store the selected passenger ID
        setOpenId(id)

        // Fetch booking history for the selected passenger
        dispatch(getPassengerBookings(id))
    }


    // Step 7: Filter passengers based on active or inactive status
    const shown = passengers.filter(p =>
        !statusFilter || (statusFilter === 'ACTIVE') === p.isActive
    )

    // Display only the passengers belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 8: Display the passenger management interface
    return (
        <>

            {/* Page heading, status filter and search form */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="sf-section-title mb-0">
                    Passenger Management
                </h4>

                <div className="d-flex gap-2">

                    {/* Filter passengers based on account status */}
                    <FilterSelect
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v)
                            setPage(0)
                        }}
                        allText="All passengers"
                        options={['ACTIVE', 'INACTIVE']}
                    />


                    {/* Search passengers by name, email or username */}
                    <form
                        className="d-flex gap-2"
                        onSubmit={(e) => onSearch(e)}
                    >

                        <input
                            className="form-control form-control-sm"
                            placeholder="Search name / email / username"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Submit the search form */}
                        <button
                            type="submit"
                            className="btn btn-sm btn-primary"
                        >
                            <i className="bi bi-search"></i>
                        </button>

                    </form>

                </div>
            </div>


            {/* Display all filtered passengers in a table */}
            <div className="card sf-card">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        {/* Passenger table column headings */}
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>DOB</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>


                        {/* Display passenger records */}
                        <tbody>

                            {/* Show an empty message when no passengers are found */}
                            {shown.length === 0 && <EmptyRow cols={7} />}

                            {/* Loop through the current page's passenger records */}
                            {rows.map(p => (

                                <Fragment key={p.passengerId}>

                                    {/* Display passenger details */}
                                    <tr>

                                        <td className="fw-semibold">
                                            {p.name}
                                        </td>

                                        <td>{p.username}</td>

                                        <td>{p.email}</td>

                                        <td>{p.contact}</td>

                                        {/* Display formatted date of birth */}
                                        <td>
                                            {formatDate(p.dateOfBirth)}
                                        </td>

                                        {/* Display passenger account status */}
                                        <td>
                                            <StatusBadge status={p.isActive} />
                                        </td>


                                        {/* Display passenger actions */}
                                        <td className="text-end text-nowrap">

                                            {/* View the passenger's booking history */}
                                            <button
                                                className="btn btn-sm btn-outline-primary me-1"
                                                onClick={() => toggleHistory(p.passengerId)}
                                            >
                                                Bookings
                                            </button>


                                            {/* Show Block or Activate based on account status */}
                                            {p.isActive
                                                ? (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            dispatch(updatePassengerStatus(p.passengerId, false))
                                                        }
                                                    >
                                                        Block
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() =>
                                                            dispatch(updatePassengerStatus(p.passengerId, true))
                                                        }
                                                    >
                                                        Activate
                                                    </button>
                                                )
                                            }

                                        </td>

                                    </tr>


                                    {/* Display booking history when a passenger is selected */}
                                    {openId === p.passengerId && (

                                        <tr>

                                            <td colSpan={7} className="bg-light">

                                                {/* Check whether the selected passenger has bookings */}
                                                {(passengerBookings[p.passengerId] || []).length === 0

                                                    ? (

                                                        // Display message when no bookings are available
                                                        <span className="text-muted small">
                                                            No bookings
                                                        </span>

                                                    )
                                                    : (

                                                        // Display all bookings of the selected passenger
                                                        (passengerBookings[p.passengerId] || []).map(b => (

                                                            <div
                                                                key={b.bookingId}
                                                                className="small mb-1"
                                                            >

                                                                {/* Display booking PNR, trip type, amount and status */}
                                                                <b>{b.pnr}</b>
                                                                {" · "}
                                                                {b.tripType}
                                                                {" · "}
                                                                {formatMoney(b.totalAmount)}
                                                                {" · "}

                                                                <StatusBadge status={b.status} />


                                                                {/* Display all journeys under this booking */}
                                                                {b.journeys.map(j => (

                                                                    <span
                                                                        key={j.journeyId}
                                                                        className="ms-2 text-muted"
                                                                    >
                                                                        {j.flightNumber} {j.source}→{j.destination}
                                                                        {" ("}
                                                                        {formatDate(j.travelDate)}
                                                                        {")"}
                                                                    </span>

                                                                ))}

                                                            </div>

                                                        ))
                                                    )
                                                }

                                            </td>

                                        </tr>

                                    )}

                                </Fragment>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Handle pagination for passenger records */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>

        </>
    )
}

export default AdminPassengers
