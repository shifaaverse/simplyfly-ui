import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { API_SERVER_URL_DEV } from "../../../config"
import axios from "axios"
import { getErrorMessage } from "../../utils/format"

// Step 1: Create the SignUp component.
function SignUp() {

    // Step 2: Create states to store passenger registration details.
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [contact, setContact] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState("")

    // Used to navigate to another page.
    const navigate = useNavigate()

    // Step 3: Define the passenger registration API URL.
    const signUpApi = API_SERVER_URL_DEV + "/api/passenger/add"

    // Step 4: Function to process passenger registration.
    const processSignup = async (e) => {

        // Prevent the default form submission and page refresh.
        e.preventDefault()

        // Create an object containing the passenger's entered details.
        let passengerDto = {
            'name': name,
            'email': email,
            'contact': contact,
            'dateOfBirth': dateOfBirth,
            'username': username,
            'password': password
        }

        try {

            // Send passenger registration details to the backend using Axios.
            await axios.post(signUpApi, passengerDto)

            // Navigate to the login page after successful registration.
            navigate("/")
        }
        catch (err) {

            // Display the error message if registration fails.
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 5: Display the passenger registration form.
    return (
        <div className="sf-auth-bg">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6">

                        <div className="card shadow-sm border-0 rounded-4 p-4 p-sm-5 bg-white">
                            <div className="card-body p-0">

                                {/* Registration heading. */}
                                <div className="text-center mb-4">
                                    <h1 className="h4 fw-bold text-dark mb-1">
                                        Create your SimplyFly account
                                    </h1>
                                    <p className="text-muted small">
                                        Book flights for yourself and your family.
                                    </p>
                                </div>

                                {/* Display an error message if registration fails. */}
                                {errMsg &&
                                    <p className="text-center" style={{ color: 'red' }}>
                                        {errMsg}
                                    </p>
                                }

                                {/* Registration form. */}
                                <form onSubmit={(e) => processSignup(e)}>

                                    <div className="row g-3">

                                        {/* Full name input. */}
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="signup-full-name"
                                                className="form-label small fw-semibold text-secondary"
                                            >
                                                Full Name
                                            </label>

                                            <input
                                                id="signup-full-name"
                                                type="text"
                                                className="form-control"
                                                required
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        {/* Email input. */}
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="signup-email"
                                                className="form-label small fw-semibold text-secondary"
                                            >
                                                Email
                                            </label>

                                            <input
                                                id="signup-email"
                                                type="email"
                                                className="form-control"
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        {/* Mobile number input. */}
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="signup-mobile-number"
                                                className="form-label small fw-semibold text-secondary"
                                            >
                                                Mobile Number
                                            </label>

                                            <input
                                                id="signup-mobile-number"
                                                type="text"
                                                className="form-control"
                                                required
                                                maxLength={10}
                                                pattern="[0-9]{10}"
                                                onChange={(e) => setContact(e.target.value)}
                                            />
                                        </div>

                                        {/* Date of birth input. */}
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="signup-date-of-birth"
                                                className="form-label small fw-semibold text-secondary"
                                            >
                                                Date of Birth
                                            </label>

                                            <input
                                                id="signup-date-of-birth"
                                                type="date"
                                                className="form-control"
                                                required
                                                onChange={(e) => setDateOfBirth(e.target.value)}
                                            />
                                        </div>

                                        {/* Username input. */}
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="signup-username"
                                                className="form-label small fw-semibold text-secondary"
                                            >
                                                Username
                                            </label>

                                            <input
                                                id="signup-username"
                                                type="text"
                                                className="form-control"
                                                required
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>

                                        {/* Password input. */}
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="signup-password"
                                                className="form-label small fw-semibold text-secondary"
                                            >
                                                Password
                                            </label>

                                            <input
                                                id="signup-password"
                                                type="password"
                                                className="form-control"
                                                placeholder="••••••••"
                                                required
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                    </div>

                                    {/* Submit button. */}
                                    <div className="d-grid my-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg fw-semibold"
                                        >
                                            Sign up
                                        </button>
                                    </div>

                                    {/* Link to the login page for existing users. */}
                                    <div className="text-center">
                                        <p className="small text-muted mb-0">
                                            Have an account?{" "}
                                            <Link
                                                to="/"
                                                className="text-primary text-decoration-none fw-semibold"
                                            >
                                                Login
                                            </Link>
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

export default SignUp
