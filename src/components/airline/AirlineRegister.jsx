import { useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import AirlineForm from "../common/AirlineForm"
import { getErrorMessage } from "../../utils/format"

function AirlineRegister() {
    const [errMsg, setErrMsg] = useState("")
    const [done, setDone] = useState(false)

    const register = async (airline) => {
        try {
            await axios.post(API_SERVER_URL_DEV + '/api/airline/register', airline)
            setDone(true)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    return (
        <div className="sf-auth-bg">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4 p-4 p-sm-5 bg-white">
                            <div className="text-center mb-4">
                                <h1 className="h4 fw-bold mb-1">Register your Airline</h1>
                                <p className="text-muted small">SimplyFly Admin reviews every registration before login access is given.</p>
                            </div>
                            {done ? (
                                <div className="text-center">
                                    <i className="bi bi-hourglass-split display-4 text-warning"></i>
                                    <h5 className="mt-3">Registration submitted</h5>
                                    <p className="text-muted">Status: <b>PENDING</b>. You can login once Admin approves your airline.</p>
                                    <Link to="/" className="btn btn-primary">Back to Login</Link>
                                </div>
                            ) : (
                                <>
                                    {errMsg && <p className="text-center" style={{ color: 'red' }}>{errMsg}</p>}
                                    <AirlineForm onSubmit={register} buttonText="Submit Registration" />
                                    <p className="small text-muted text-center mt-3 mb-0">Already approved? <Link to="/">Login</Link></p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AirlineRegister
