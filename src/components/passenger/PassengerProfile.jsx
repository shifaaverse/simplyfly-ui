import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPassengerProfile, updatePassengerProfile } from "../../store/actions/PassengerAction"
import Alert from "../common/Alert"
import { formatDate, getErrorMessage } from "../../utils/format"

function PassengerProfile() {
    const profile = useSelector(state => state.passenger.profile)
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [contact, setContact] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")

    useEffect(() => {
        dispatch(getPassengerProfile())
    }, [dispatch])

    const save = async (e) => {
        e.preventDefault()
        try {
            await dispatch(updatePassengerProfile({ name, contact }))
            setMsg('Profile updated')
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    if (!profile) return <p className="text-muted">Loading...</p>
    return (
        <div className="row g-4">
            <div className="col-lg-5">
                <div className="card sf-card">
                    <div className="card-body">
                        <h5>{profile.name}</h5>
                        <dl className="row small mb-0">
                            <dt className="col-5">Username</dt><dd className="col-7">{profile.username}</dd>
                            <dt className="col-5">Email</dt><dd className="col-7">{profile.email}</dd>
                            <dt className="col-5">Mobile</dt><dd className="col-7">{profile.contact}</dd>
                            <dt className="col-5">Date of birth</dt><dd className="col-7">{formatDate(profile.dateOfBirth)}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="col-lg-7">
                <div className="card sf-card">
                    <div className="card-header bg-white fw-semibold">Update profile</div>
                    <div className="card-body">
                        <Alert msg={errMsg} onClose={() => setErrMsg("")} />
                        <Alert msg={msg} type="success" onClose={() => setMsg("")} />
                        <form className="row g-2" onSubmit={(e) => save(e)}>
                            <div className="col-md-6">
                                <label htmlFor="profile-name" className="form-label small">Name</label>
                                <input id="profile-name" className="form-control" onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="profile-mobile" className="form-label small">Mobile</label>
                                <input id="profile-mobile" className="form-control" maxLength={10} onChange={(e) => setContact(e.target.value)} />
                            </div>
                            <div className="col-12"><button type="submit" className="btn btn-primary mt-2">Save</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PassengerProfile