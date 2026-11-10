// Small search box, the list is filtered while typing
function SearchBox({ value, onChange, placeholder }) {
    return (
        <input className="form-control form-control-sm" style={{ width: 240 }} placeholder={placeholder}
            value={value} onChange={(e) => onChange(e.target.value)} />
    )
}

export default SearchBox
