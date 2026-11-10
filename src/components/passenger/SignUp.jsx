import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { API_SERVER_URL_DEV } from "../../../config"
import axios from "axios"
import { getErrorMessage } from "../../utils/format"

function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [contact, setContact] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()

    const signUpApi = API_SERVER_URL_DEV + "/api/passenger/add"
    const processSignup = async (e) => {
        e.preventDefault()
        let passengerDto = {
            'name': name,
            'email': email,
            'contact': contact,
            'dateOfBirth': dateOfBirth,
            'username': username,
            'password': password
        }
        try {
            await axios.post(signUpApi, passengerDto)
            navigate("/")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }
    return (
        <div className="sf-auth-bg">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0 rounded-4 p-4 p-sm-5 bg-white">
                            <div className="card-body p-0">
                                <div className="text-center mb-4">
                                    <h1 className="h4 fw-bold text-dark mb-1">Create your SimplyFly account</h1>
                                    <p className="text-muted small">Book flights for yourself and your family.</p>
                                </div>
                                {errMsg && <p className="text-center" style={{ color: 'red' }}>{errMsg}</p>}

                                <form onSubmit={(e) => processSignup(e)}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="signup-full-name" className="form-label small fw-semibold text-secondary">Full Name</label>
                                            <input id="signup-full-name" type="text" className="form-control" required
                                                onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="signup-email" className="form-label small fw-semibold text-secondary">Email</label>
                                            <input id="signup-email" type="email" className="form-control" required
                                                onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="signup-mobile-number" className="form-label small fw-semibold text-secondary">Mobile Number</label>
                                            <input id="signup-mobile-number" type="text" className="form-control" required maxLength={10} pattern="[0-9]{10}"
                                                onChange={(e) => setContact(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="signup-date-of-birth" className="form-label small fw-semibold text-secondary">Date of Birth</label>
                                            <input id="signup-date-of-birth" type="date" className="form-control" required
                                                onChange={(e) => setDateOfBirth(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="signup-username" className="form-label small fw-semibold text-secondary">Username</label>
                                            <input id="signup-username" type="text" className="form-control" required
                                                onChange={(e) => setUsername(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="signup-password" className="form-label small fw-semibold text-secondary">Password</label>
                                            <input id="signup-password" type="password" className="form-control" placeholder="••••••••" required
                                                onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="d-grid my-4">
                                        <button type="submit" className="btn btn-primary btn-lg fw-semibold">Sign up</button>
                                    </div>
                                    <div className="text-center">
                                        <p className="small text-muted mb-0">Have an account? <Link to="/" className="text-primary text-decoration-none fw-semibold">Login</Link></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp