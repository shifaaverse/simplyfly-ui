import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAirlines, onboardAirline, updateAirlineStatus } from "../../store/actions/AdminAction"
import StatusBadge from "../common/StatusBadge"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import Alert from "../common/Alert"
import AirlineForm from "../common/AirlineForm"
import { getErrorMessage } from "../../utils/format"

function AdminAirlines() {
    const airlines = useSelector(state => state.admin.airlines)
    const dispatch = useDispatch()
    const [filter, setFilter] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)
    const [errMsg, setErrMsg] = useState("")
    const [msg, setMsg] = useState("")

    useEffect(() => {
        dispatch(getAirlines(filter))
    }, [dispatch, filter])

    // Reject and suspend need a reason (shown to the airline when it tries to log in)
    const changeStatus = async (airlineId, status) => {
        let reason = ""
        if (status === 'REJECTED' || status === 'SUSPENDED') {
            reason = window.prompt(`Reason for ${status.toLowerCase()}ing this airline?`)
            if (reason === null) return
            if (reason.trim() === '') {
                setErrMsg('A reason is required')
                return
            }
        }
        try {
            await dispatch(updateAirlineStatus(airlineId, status, reason.trim()))
            setErrMsg("")
            setMsg(`Airline ${status.toLowerCase()}`)
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    const onboard = async (airline) => {
        try {
            await dispatch(onboardAirline(airline))
            setShowForm(false)
            setMsg('Airline onboarded and approved')
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 1: Search by name, code or email, then show only one page
    const shown = airlines.filter(a => `${a.name} ${a.code} ${a.email}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="sf-section-title mb-0">Airline Management</h4>
                <div className="d-flex gap-2">
                    <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search name / code / email" />
                    <select className="form-select form-select-sm" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(0) }}>
                        <option value="">All statuses</option>
                        <option>PENDING</option>
                        <option>APPROVED</option>
                        <option>REJECTED</option>
                        <option>SUSPENDED</option>
                    </select>
                    <button className="btn btn-sm btn-primary text-nowrap" onClick={() => setShowForm(!showForm)}>
                        <i className="bi bi-plus-lg me-1"></i>Onboard Airline
                    </button>
                </div>
            </div>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <Alert msg={msg} type="success" onClose={() => setMsg("")} />

            {showForm && <div className="card sf-card mb-3"><div className="card-body">
                <AirlineForm onSubmit={onboard} buttonText="Onboard (auto approved)" />
            </div></div>}

            <div className="card sf-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr><th>Airline</th><th>Code</th><th>Reg. No</th><th>Email</th><th>Contact</th><th>Login</th><th>Status</th><th className="text-end">Actions</th></tr>
                        </thead>
                        <tbody>
                            {shown.length === 0 && <EmptyRow cols={8} />}
                            {rows.map(a => (
                                <tr key={a.airlineId}>
                                    <td className="fw-semibold">{a.name}</td>
                                    <td><span className="badge text-bg-light border">{a.code}</span></td>
                                    <td>{a.registrationNumber}</td>
                                    <td>{a.email}</td>
                                    <td>{a.contact}</td>
                                    <td>{a.username}</td>
                                    <td><StatusBadge status={a.status} />
                                        {a.rejectionReason && <div className="small text-muted" style={{ maxWidth: 180 }}>{a.rejectionReason}</div>}</td>
                                    <td className="text-end text-nowrap">
                                        {a.status !== 'APPROVED' &&
                                            <button className="btn btn-sm btn-success me-1" onClick={() => changeStatus(a.airlineId, 'APPROVED')}>Approve</button>}
                                        {a.status === 'PENDING' &&
                                            <button className="btn btn-sm btn-outline-danger me-1" onClick={() => changeStatus(a.airlineId, 'REJECTED')}>Reject</button>}
                                        {a.status === 'APPROVED' &&
                                            <button className="btn btn-sm btn-outline-warning" onClick={() => changeStatus(a.airlineId, 'SUSPENDED')}>Suspend</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default AdminAirlines
