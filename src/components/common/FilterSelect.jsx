import { label } from "../../utils/format"

// Small dropdown filter, options is a list of values like ['CONFIRMED', 'CANCELLED']
function FilterSelect({ value, onChange, allText, options }) {
    return (
        <select className="form-select form-select-sm w-auto" value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">{allText}</option>
            {options.map(o => <option key={o} value={o}>{label(o)}</option>)}
        </select>
    )
}

export default FilterSelect
