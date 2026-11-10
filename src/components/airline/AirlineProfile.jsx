import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAirlineProfile, updateAirlineProfile } from "../../store/actions/AirlineAction"
import StatusBadge from "../common/StatusBadge"
import Alert from "../common/Alert"
import { getErrorMessage } from "../../utils/format"

function AirlineProfile() {
    const profile = useSelector(state => state.airline.profile)
    const dispatch = useDispatch()
    const [form, setForm] = useState({ email: '', contact: '', address: '', logoUrl: '' })
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")

    useEffect(() => {
        dispatch(getAirlineProfile())
    }, [dispatch])

    const save = async (e) => {
        e.preventDefault()
        try {
            await dispatch(updateAirlineProfile(form))
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
                        <div className="d-flex align-items-center gap-3 mb-3">
                            {profile.logoUrl
                                ? <img src={profile.logoUrl} alt="logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                                : <div className="brand-icon"><i className="bi bi-building fs-4 text-primary"></i></div>}
                            <div>
                                <h5 className="mb-0">{profile.name}</h5>
                                <span className="text-muted">{profile.code}</span> <StatusBadge status={profile.status} />
                            </div>
                        </div>
                        <dl className="row small mb-0">
                            <dt className="col-5">Registration No</dt><dd className="col-7">{profile.registrationNumber}</dd>
                            <dt className="col-5">Email</dt><dd className="col-7">{profile.email}</dd>
                            <dt className="col-5">Contact</dt><dd className="col-7">{profile.contact}</dd>
                            <dt className="col-5">Address</dt><dd className="col-7">{profile.address || '-'}</dd>
                            <dt className="col-5">Login</dt><dd className="col-7">{profile.username}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="col-lg-7">
                <div className="card sf-card">
                    <div className="card-header bg-white fw-semibold">Update company information</div>
                    <div className="card-body">
                        <Alert msg={errMsg} onClose={() => setErrMsg("")} />
                        <Alert msg={msg} type="success" onClose={() => setMsg("")} />
                        <form onSubmit={(e) => save(e)} className="row g-2">
                            {['email', 'contact', 'address', 'logoUrl'].map(f => (
                                <div className="col-md-6" key={f}>
                                    <label className="form-label small text-capitalize">{f === 'logoUrl' ? 'Logo URL' : f}</label>
                                    <input className="form-control" onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                                </div>
                            ))}
                            <div className="col-12"><button className="btn btn-primary mt-2">Save changes</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AirlineProfile
