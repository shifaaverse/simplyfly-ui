function Alert({ msg, type = 'danger', onClose }) {
    if (!msg) return null
    return (
        <div className={`alert alert-${type} d-flex justify-content-between align-items-center py-2`}>
            <span>{msg}</span>
            {onClose && <button className="btn-close btn-sm" onClick={() => onClose()}></button>}
        </div>
    )
}

export default Alert
