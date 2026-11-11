import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { API_SERVER_URL_DEV } from "../../../config"
import axios from "axios"

function Login() {

    // Step 1: Store the username and password entered by the user.
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // Step 2: Store error messages returned by the backend.
    const [errMsg, setErrMsg] = useState("")
    const [errComment, setErrComment] = useState("")

    // Step 3: Define the API URLs for login and fetching user details.
    const apiUrl = API_SERVER_URL_DEV + '/api/auth/login'
    const userDetailsUrl = API_SERVER_URL_DEV + '/api/auth/user-details'

    // Step 4: Get the navigation function to redirect users to their dashboards.
    const navigate = useNavigate()

    // Step 5: Process the login request.
    const processLogin = async (e) => {
        e.preventDefault()

        // Clear previous error messages.
        setErrMsg("")
        setErrComment("")

        // Step 6: Create Basic Authentication credentials.
        const token = 'Basic ' + window.btoa(username + ':' + password)

        try {

            // Step 7: Send login request and fetch the JWT token.
            const response = await axios.get(apiUrl, {
                headers: { 'Authorization': token }
            })

            // Store the JWT token and username in localStorage.
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('username', username)

            // Step 8: Fetch user details using the JWT token.
            const resp = await axios.get(userDetailsUrl, {
                headers: { 'Authorization': 'Bearer ' + response.data.token }
            })

            // Store the user's role in localStorage.
            localStorage.setItem('role', resp.data.role)

            // Step 9: Redirect the user based on their role.
            switch (resp.data.role) {

                case 'PASSENGER':
                    navigate(`/passenger/${response.data.token}`)
                    break;

                case 'AIRLINE':
                    navigate(`/airline/${response.data.token}`)
                    break;

                case 'ADMIN':
                    navigate(`/admin/${response.data.token}`)
                    break;

                default:
                    setErrMsg('Something went wrong...')
                    break;
            }
        }
        catch (err) {

            // Clear stored login information if authentication fails.
            localStorage.clear()

            // Display the appropriate error message.
            if (err?.response?.data === undefined || err?.response?.data === '') {
                setErrMsg("Invalid Credentials")
            }
            else {
                setErrMsg(err?.response?.data?.message)
                setErrComment(err?.response?.data?.comments)
            }
        }
    }

    return (
        <div className="sf-auth-bg">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4">

                        {/* Login Card */}
                        <div className="card shadow-sm border-0 rounded-4 p-4 p-sm-5 bg-white">
                            <div className="card-body p-0">

                                {/* Branding and Header */}
                                <div className="text-center mb-4">
                                    <div className="brand-icon mb-3">
                                        <i className="bi bi-airplane-fill fs-3 text-primary"></i>
                                    </div>

                                    <h1 className="h4 fw-bold text-dark mb-1">SimplyFly</h1>
                                    <p className="text-muted small">Please enter your details to sign in.</p>
                                </div>

                                {/* Display error messages when login fails. */}
                                {errMsg && (
                                    <div className="text-center mb-3">
                                        <p className="mb-1" style={{ color: 'red', fontSize: '1.05rem' }}>
                                            {errMsg}
                                        </p>
                                        <p className="text-muted small mb-0">{errComment}</p>
                                    </div>
                                )}

                                {/* Login Form */}
                                <form onSubmit={(e) => processLogin(e)}>

                                    {/* Username Input */}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="login-username"
                                            className="form-label small fw-semibold text-secondary"
                                        >
                                            Username
                                        </label>

                                        <input
                                            id="login-username"
                                            type="text"
                                            className="form-control form-control-lg"
                                            required
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between">
                                            <label
                                                htmlFor="login-password"
                                                className="form-label small fw-semibold text-secondary"
                                            >
                                                Password
                                            </label>

                                            <Link to="/forgot-password" className="small text-decoration-none">
                                                Forgot password?
                                            </Link>
                                        </div>

                                        <input
                                            id="login-password"
                                            type="password"
                                            className="form-control form-control-lg"
                                            placeholder="••••••••"
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    {/* Submit Login Form */}
                                    <div className="d-grid mb-3">
                                        <button type="submit" className="btn btn-primary btn-lg fw-semibold">
                                            Sign in
                                        </button>
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="text-center">
                                        <p className="small text-muted mb-1">
                                            New traveller? <Link to="/passenger/signup" className="text-primary text-decoration-none fw-semibold">Sign up</Link>
                                        </p>

                                        <p className="small text-muted mb-1">
                                            Are you an airline? <Link to="/airline/register" className="text-primary text-decoration-none fw-semibold">Register your airline</Link>
                                        </p>

                                        <p className="small text-muted mb-0">
                                            Just checking a flight? <Link to="/flight-status" className="text-primary text-decoration-none fw-semibold">Flight status</Link>
                                        </p>
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

export default Login
