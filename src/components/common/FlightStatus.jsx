import { useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { API_SERVER_URL_DEV } from "../../../config"
import Alert from "./Alert"
import StatusBadge from "./StatusBadge"
import { formatDate, formatTime, getErrorMessage, today } from "../../utils/format"

// Public page: anyone can check a flight status using flight number and date
function FlightStatus() {
    const [flightNumber, setFlightNumber] = useState("")
    const [date, setDate] = useState(today())
    const [result, setResult] = useState(null)
    const [errMsg, setErrMsg] = useState("")

    const check = async (e) => {
        e.preventDefault()
        setErrMsg("")
        setResult(null)
        try {
            const response = await axios.get(API_SERVER_URL_DEV + '/api/flight/status',
                { params: { flightNumber: flightNumber.trim(), date } })
            setResult(response.data)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    return (
        <div className="sf-auth-bg">
            <div className="container" style={{ maxWidth: 640 }}>
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                    <h1 className="h4 fw-bold mb-3"><i className="bi bi-broadcast me-2 text-primary"></i>Flight status</h1>
                    <form onSubmit={(e) => check(e)} className="row g-2 align-items-end">
                        <div className="col-sm-5">
                            <label className="form-label small">Flight number</label>
                            <input className="form-control" placeholder="6E-201" required value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)} />
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label small">Date</label>
                            <input type="date" className="form-control" required value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="col-sm-3 d-grid"><button className="btn btn-primary">Check</button></div>
                    </form>
                    <div className="mt-3"><Alert msg={errMsg} onClose={() => setErrMsg("")} /></div>

                    {result && (
                        <div className="border rounded-3 p-3 mt-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="fw-semibold">{result.airlineName} · {result.flightNumber}</div>
                                <StatusBadge status={result.status} />
                            </div>
                            <div className="row text-center align-items-center mb-2">
                                <div className="col"><div className="fs-4 fw-bold">{formatTime(result.departureTime)}</div><div>{result.source}</div></div>
                                <div className="col"><i className="bi bi-airplane"></i><div className="small text-muted">{formatDate(result.travelDate)}</div></div>
                                <div className="col"><div className="fs-4 fw-bold">{formatTime(result.arrivalTime)}</div><div>{result.destination}</div></div>
                            </div>
                            {result.delayMinutes > 0 &&
                                <div className="small">Delayed by <b>{result.delayMinutes} min</b>. Expected departure: <b>{formatTime(result.expectedDeparture)}</b></div>}
                            <div className="small text-secondary mt-1">{result.message}</div>
                        </div>
                    )}
                    <p className="text-center small mt-3 mb-0"><Link to="/" className="text-decoration-none">Back to sign in</Link></p>
                </div>
            </div>
        </div>
    )
}

export default FlightStatus
