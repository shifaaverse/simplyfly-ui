import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addAirports, getAirports } from "../../store/actions/AdminAction"
import EmptyRow from "../common/EmptyRow"
import Pager, { PAGE_SIZE } from "../common/Pager"
import SearchBox from "../common/SearchBox"
import Alert from "../common/Alert"
import { getErrorMessage } from "../../utils/format"

const SAMPLE_AIRPORTS = [
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata' }
]

function AdminAirports() {
    const airports = useSelector(state => state.admin.airports)
    const dispatch = useDispatch()
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getAirports())
    }, [dispatch])

    const add = async (list) => {
        try {
            await dispatch(addAirports(list))
            setCode(""); setName(""); setCity("")
        }
        catch (err) {
            setErrMsg(getErrorMessage(err))
        }
    }

    // Step 2: Search by code, name or city
    const shown = airports.filter(a =>
        `${a.code} ${a.name} ${a.city}`.toLowerCase().includes(search.trim().toLowerCase()))
    const rows = shown.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const missingSamples = SAMPLE_AIRPORTS.filter(s => !airports.some(a => a.code === s.code))

    return (
        <>
            <h4 className="sf-section-title">Airports</h4>
            <Alert msg={errMsg} onClose={() => setErrMsg("")} />
            <div className="card sf-card mb-3">
                <div className="card-body">
                    <form className="row g-2 align-items-end" onSubmit={(e) => { e.preventDefault(); void add([{ code, name, city }]) }}>
                        <div className="col-md-2">
                            <label htmlFor="airport-code" className="form-label small">Code</label>
                            <input id="airport-code" className="form-control" maxLength={3} required value={code} onChange={(e) => setCode(e.target.value)} />
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="airport-airport-name" className="form-label small">Airport Name</label>
                            <input id="airport-airport-name" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="airport-city" className="form-label small">City</label>
                            <input id="airport-city" className="form-control" required value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="col-md-2 d-grid">
                            <button type="submit" className="btn btn-primary">Add Airport</button>
                        </div>
                    </form>
                    {missingSamples.length > 0 &&
                        <button className="btn btn-link btn-sm px-0 mt-2" onClick={() => add(missingSamples)}>
                            + Add major Indian airports in one batch ({missingSamples.map(s => s.code).join(', ')})
                        </button>}
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">All Airports</h5>
                <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search by code, name or city" />
            </div>
            <div className="card sf-card">
                <table className="table align-middle mb-0">
                    <thead><tr><th>Code</th><th>Name</th><th>City</th></tr></thead>
                    <tbody>
                        {shown.length === 0 && <EmptyRow cols={3} />}
                        {rows.map(a => (
                            <tr key={a.id}><td><b>{a.code}</b></td><td>{a.name}</td><td>{a.city}</td></tr>
                        ))}
                    </tbody>
                </table>
                <Pager page={page} total={shown.length} onChange={setPage} />
            </div>
        </>
    )
}

export default AdminAirports