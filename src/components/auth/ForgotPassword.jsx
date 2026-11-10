import { useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import Alert from "../common/Alert"
import { getErrorMessage } from "../../utils/format"

// Two steps: 1. enter username (OTP is shown, demo)  2. enter OTP + new password
function ForgotPassword() {
    const [step, setStep] = useState(1)
    const [username, setUsername] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [shownOtp, setShownOtp] = useState(null)
    const [errMsg, setErrMsg] = useState("")

    const getOtp = async (e) => {
        e.preventDefault()
        setErrMsg("")
        try {
            const response = await axios.post(API_SERVER_URL_DEV + '/api/auth/forgot-password', { username })
            setShownOtp(response.data)
            setStep(2)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        setErrMsg("")
        try {
            await axios.post(API_SERVER_URL_DEV + '/api/auth/reset-password', { username, otp, newPassword })
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
                            <Alert msg={errMsg} onClose={() => setErrMsg("")} />

                            {step === 1 && (
                                <form onSubmit={(e) => getOtp(e)}>
                                    <p className="small text-muted">Enter your username to get a 6-digit OTP.</p>
                                    <input className="form-control form-control-lg mb-3" placeholder="Username" required
                                        value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <div className="d-grid">
                                        <button className="btn btn-primary btn-lg">Get OTP</button>
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={(e) => resetPassword(e)}>
                                    <div className="alert alert-info small">
                                        Demo: your OTP is <b className="fs-5">{shownOtp.otp}</b> (valid for {shownOtp.validMinutes} minutes).
                                        A real app would send it by SMS or email.
                                    </div>
                                    <input className="form-control form-control-lg mb-3" placeholder="6-digit OTP" required maxLength={6}
                                        value={otp} onChange={(e) => setOtp(e.target.value)} />
                                    <input type="password" className="form-control form-control-lg mb-3" placeholder="New password (min 6 characters)"
                                        required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    <div className="d-grid">
                                        <button className="btn btn-primary btn-lg">Reset password</button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <div className="text-center">
                                    <i className="bi bi-check-circle-fill text-success fs-1"></i>
                                    <p className="mt-2">Password changed. You can sign in now.</p>
                                </div>
                            )}

                            <p className="text-center small mt-3 mb-0"><Link to="/" className="text-decoration-none">Back to sign in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
