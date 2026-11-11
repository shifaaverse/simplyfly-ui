import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
    getAirlineProfile,
    updateAirlineProfile
} from "../../store/actions/AirlineAction"

import StatusBadge from "../common/StatusBadge"
import Alert from "../common/Alert"

import { getErrorMessage } from "../../utils/format"


function AirlineProfile() {

    // Step 1: Get airline profile details from the Redux store
    const profile = useSelector(state => state.airline.profile)

    // Step 2: Get dispatch to call Redux actions
    const dispatch = useDispatch()

    // Step 3: Store the editable company information
    const [form, setForm] = useState({
        email: '',
        contact: '',
        address: '',
        logoUrl: ''
    })

    // Store error and success messages
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")


    // Step 4: Fetch airline profile details when the component loads
    useEffect(() => {

        dispatch(getAirlineProfile())

    }, [dispatch])


    // Step 5: Save the updated airline profile
    const save = async (e) => {

        // Prevent the browser from refreshing the page
        e.preventDefault()

        try {

            // Send updated company information to the backend
            await dispatch(updateAirlineProfile(form))

            // Display success message after successful update
            setMsg('Profile updated')

        }
        catch (err) {

            // Display error message if profile update fails
            setErrMsg(getErrorMessage(err))
        }
    }


    // Step 6: Show loading message until profile details are available
    if (!profile) {
        return <p className="text-muted">Loading...</p>
    }


    // Step 7: Display airline profile and update form
    return (
        <div className="row g-4">

            {/* Left section: Display existing airline information */}
            <div className="col-lg-5">

                <div className="card sf-card">

                    <div className="card-body">

                        {/* Display airline logo, name, code and status */}
                        <div className="d-flex align-items-center gap-3 mb-3">

                            {/* Show uploaded logo if available, otherwise show building icon */}
                            {profile.logoUrl

                                ? (
                                    <img
                                        src={profile.logoUrl}
                                        alt="logo"
                                        style={{
                                            width: 56,
                                            height: 56,
                                            objectFit: 'contain'
                                        }}
                                    />
                                )

                                : (
                                    <div className="brand-icon">
                                        <i className="bi bi-building fs-4 text-primary"></i>
                                    </div>
                                )
                            }

                            <div>

                                {/* Display airline name */}
                                <h5 className="mb-0">
                                    {profile.name}
                                </h5>

                                {/* Display airline code and registration status */}
                                <span className="text-muted">
                                    {profile.code}
                                </span>

                                <StatusBadge status={profile.status} />

                            </div>

                        </div>


                        {/* Display registered airline company details */}
                        <dl className="row small mb-0">

                            <dt className="col-5">Registration No</dt>
                            <dd className="col-7">
                                {profile.registrationNumber}
                            </dd>

                            <dt className="col-5">Email</dt>
                            <dd className="col-7">
                                {profile.email}
                            </dd>

                            <dt className="col-5">Contact</dt>
                            <dd className="col-7">
                                {profile.contact}
                            </dd>

                            <dt className="col-5">Address</dt>
                            <dd className="col-7">
                                {profile.address || '-'}
                            </dd>

                            <dt className="col-5">Login</dt>
                            <dd className="col-7">
                                {profile.username}
                            </dd>

                        </dl>

                    </div>

                </div>

            </div>


            {/* Right section: Update airline company information */}
            <div className="col-lg-7">

                <div className="card sf-card">

                    <div className="card-header bg-white fw-semibold">
                        Update company information
                    </div>

                    <div className="card-body">

                        {/* Display error message */}
                        <Alert
                            msg={errMsg}
                            onClose={() => setErrMsg("")}
                        />

                        {/* Display success message */}
                        <Alert
                            msg={msg}
                            type="success"
                            onClose={() => setMsg("")}
                        />


                        {/* Form for updating airline profile */}
                        <form
                            onSubmit={(e) => save(e)}
                            className="row g-2"
                        >

                            {/* Generate input fields dynamically using map() */}
                            {['email', 'contact', 'address', 'logoUrl'].map(f => (

                                <div className="col-md-6" key={f}>

                                    {/* Display the input field label */}
                                    <label className="form-label small text-capitalize">

                                        {f === 'logoUrl' ? 'Logo URL' : f}

                                    </label>

                                    {/* Update the corresponding form state when the user types */}
                                    <input
                                        className="form-control"
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                [f]: e.target.value
                                            })
                                        }
                                    />

                                </div>

                            ))}


                            {/* Submit button to save profile changes */}
                            <div className="col-12">

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-2"
                                >
                                    Save changes
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AirlineProfile
