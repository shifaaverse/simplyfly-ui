import { useState } from "react"

/* Used by airline self registration and admin onboarding */
function AirlineForm({ onSubmit, buttonText }) {
    const [airline, setAirline] = useState({
        name: '', code: '', registrationNumber: '', email: '', contact: '',
        address: '', logoUrl: '', username: '', password: ''
    })

    const change = (field, value) => setAirline({ ...airline, [field]: value })

    const fields = [
        { key: 'name', label: 'Airline Name', placeholder: 'IndiGo' },
        { key: 'code', label: 'Airline Code', placeholder: '6E', maxLength: 3 },
        { key: 'registrationNumber', label: 'Registration Number', placeholder: 'DGCA-REG-001' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'contact', label: 'Contact Number', maxLength: 10 },
        { key: 'address', label: 'Address', required: false },
        { key: 'logoUrl', label: 'Logo URL', required: false },
        { key: 'username', label: 'Login Username' },
        { key: 'password', label: 'Login Password', type: 'password' }
    ]

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(airline) }}>
            <div className="row g-3">
                {fields.map(f => (
                    <div className="col-md-6" key={f.key}>
                        <label className="form-label small fw-semibold text-secondary">{f.label}</label>
                        <input type={f.type || 'text'} className="form-control" required={f.required !== false}
                            placeholder={f.placeholder} maxLength={f.maxLength} value={airline[f.key]}
                            onChange={(e) => change(f.key, e.target.value)} />
                    </div>
                ))}
            </div>
            <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary fw-semibold">{buttonText}</button>
            </div>
        </form>
    )
}

export default AirlineForm
