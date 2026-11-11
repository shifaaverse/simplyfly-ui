import { useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import Alert from "../common/Alert"
import { getErrorMessage } from "../../utils/format"

// Two steps: 1. Enter username and get OTP.
// 2. Enter OTP and create a new password.
function ForgotPassword() {

    // Step 1: Store the current step of the password recovery process.
    const [step, setStep] = useState(1)

    // Step 2: Store the username entered by the user.
    const [username, setUsername] = useState("")

    // Step 3: Store the OTP entered by the user.
    const [otp, setOtp] = useState("")

    // Step 4: Store the new password entered by the user.
    const [newPassword, setNewPassword] = useState("")

    // Step 5: Store the OTP received from the backend (demo).
    const [shownOtp, setShownOtp] = useState(null)

    // Step 6: Store error messages.
    const [errMsg, setErrMsg] = useState("")

    // Step 7: Request an OTP using the entered username.
    const getOtp = async (e) => {
        e.preventDefault()
        setErrMsg("")

        try {
            const response = await axios.post(
                API_SERVER_URL_DEV + '/api/auth/forgot-password',
                { username }
            )

            // Store the response and move to the OTP verification step.
            setShownOtp(response.data)
            setStep(2)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 8: Verify the OTP and reset the password.
    const resetPassword = async (e) => {
        e.preventDefault()
        setErrMsg("")

        try {
            await axios.post(
                API_SERVER_URL_DEV + '/api/auth/reset-password',
                { username, otp, newPassword }
            )

            // Move to the success step after the password is reset.
            setStep(3)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    return (
        <div className="sf-auth-bg">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4">
                        <div className="card shadow-sm border-0 rounded-4 p-4 p-sm-5 bg-white">

                            <h1 className="h4 fw-bold text-center mb-3">Forgot password</h1>

                            {/* Display an error message when an API request fails. */}
                            <Alert msg={errMsg} onClose={() => setErrMsg("")} />

                            {/* STEP 1: Enter username and request an OTP. */}
                            {step === 1 && (
                                <form onSubmit={(e) => getOtp(e)}>
                                    <p className="small text-muted">
                                        Enter your username to get a 6-digit OTP.
                                    </p>

                                    <input
                                        className="form-control form-control-lg mb-3"
                                        placeholder="Username"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            Get OTP
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 2: Enter OTP and the new password. */}
                            {step === 2 && (
                                <form onSubmit={(e) => resetPassword(e)}>

                                    {/* Display the demo OTP and its validity duration. */}
                                    <div className="alert alert-info small">
                                        Demo: your OTP is <b className="fs-5">{shownOtp.otp}</b>
                                        (valid for {shownOtp.validMinutes} minutes).
                                        A real app would send it by SMS or email.
                                    </div>

                                    {/* OTP input field. */}
                                    <input
                                        className="form-control form-control-lg mb-3"
                                        placeholder="6-digit OTP"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />

                                    {/* New password input field. */}
                                    <input
                                        type="password"
                                        className="form-control form-control-lg mb-3"
                                        placeholder="New password (min 6 characters)"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            Reset password
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 3: Display success after the password is changed. */}
                            {step === 3 && (
                                <div className="text-center">
                                    <i className="bi bi-check-circle-fill text-success fs-1"></i>
                                    <p className="mt-2">
                                        Password changed. You can sign in now.
                                    </p>
                                </div>
                            )}

                            {/* Navigate back to the sign-in page. */}
                            <p className="text-center small mt-3 mb-0">
                                <Link to="/" className="text-decoration-none">
                                    Back to sign in
                                </Link>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
