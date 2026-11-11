import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    addAirports,
    getAirports
} from "../../store/actions/AdminAction"

import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import Alert from "../common/Alert"

import { getErrorMessage } from "../../utils/format"


// Sample list of major Indian airports
const SAMPLE_AIRPORTS = [
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata' }
]


function AdminAirports() {

    // Step 1: Get the airport list from the Redux store
    const airports = useSelector(state => state.admin.airports)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 3: Create state variables to manage airport details
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)


    // Step 4: Fetch all airports when the component loads
    useEffect(() => {
        dispatch(getAirports())
    }, [dispatch])


    // Step 5: Add new airports to the database
    const add = async (list) => {

        try {

            // Send the airport details to the backend through Redux
            await dispatch(addAirports(list))

            // Clear the input fields after successful addition
            setCode("")
            setName("")
            setCity("")
        }
        catch (err) {

            // Display error message if adding airports fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 6: Search airports by code, name or city
    const shown = airports.filter(a =>
        `${a.code} ${a.name} ${a.city}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )

    // Step 7: Display only the airports belonging to the current page
    const rows = shown.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    )


    // Step 8: Find sample airports that are not already in the database
    const missingSamples = SAMPLE_AIRPORTS.filter(s =>
        !airports.some(a => a.code === s.code)
    )


    // Step 9: Display the airport management interface
    return (
        <>
            {/* Page heading */}
            <h4 className="sf-section-title">
                Airports
            </h4>


            {/* Display error messages */}
            <Alert
                msg={errMsg}
                onClose={() => setErrMsg("")}
            />


            {/* Form to add a new airport */}
            <div className="card sf-card mb-3">
                <div className="card-body">

                    <form
                        className="row g-2 align-items-end"
                        onSubmit={(e) => {
                            e.preventDefault()

                            // Send the entered airport details as a list
                            void add([{ code, name, city }])
                        }}
                    >

                        {/* Enter the airport code */}
                        <div className="col-md-2">

                            <label
                                htmlFor="airport-code"
                                className="form-label small"
                            >
                                Code
                            </label>

                            <input
                                id="airport-code"
                                className="form-control"
                                maxLength={3}
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />

                        </div>


                        {/* Enter the airport name */}
                        <div className="col-md-5">

                            <label
                                htmlFor="airport-airport-name"
                                className="form-label small"
                            >
                                Airport Name
                            </label>

                            <input
                                id="airport-airport-name"
                                className="form-control"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                        </div>


                        {/* Enter the airport city */}
                        <div className="col-md-3">

                            <label
                                htmlFor="airport-city"
                                className="form-label small"
                            >
                                City
                            </label>

                            <input
                                id="airport-city"
                                className="form-control"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />

                        </div>


                        {/* Submit the form to add the airport */}
                        <div className="col-md-2 d-grid">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add Airport
                            </button>

                        </div>

                    </form>


                    {/* Add all missing sample airports in one batch */}
                    {missingSamples.length > 0 &&
                        <button
                            className="btn btn-link btn-sm px-0 mt-2"
                            onClick={() => add(missingSamples)}
                        >
                            + Add major Indian airports in one batch (
                            {missingSamples.map(s => s.code).join(', ')}
                            )
                        </button>
                    }

                </div>
            </div>


            {/* Airport list heading and search box */}
            <div className="d-flex justify-content-between align-items-center mb-2">

                <h5 className="mb-0">
                    All Airports
                </h5>

                {/* Search airports by code, name or city */}
                <SearchBox
                    value={search}
                    onChange={(v) => {
                        setSearch(v)
                        setPage(0)
                    }}
                    placeholder="Search by code, name or city"
                />

            </div>


            {/* Display all airports in a table */}
            <div className="card sf-card">

                <table className="table align-middle mb-0">

                    {/* Table column headings */}
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>City</th>
                        </tr>
                    </thead>


                    {/* Display airport records */}
                    <tbody>

                        {/* Show an empty message when no airports are found */}
                        {shown.length === 0 && <EmptyRow cols={3} />}

                        {/* Loop through the current page's airport records */}
                        {rows.map(a => (

                            <tr key={a.id}>

                                <td>
                                    <b>{a.code}</b>
                                </td>

                                <td>{a.name}</td>

                                <td>{a.city}</td>

                            </tr>
                        ))}

                    </tbody>

                </table>


                {/* Handle pagination for the airport list */}
                <Pager
                    page={page}
                    total={shown.length}
                    onChange={setPage}
                />

            </div>
        </>
    )
}

export default AdminAirports
