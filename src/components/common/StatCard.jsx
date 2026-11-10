function StatCard({ label, value, icon, tone = 'primary' }) {
    return (
        <div className="col-6 col-md-4 col-xl-3">
            <div className="card sf-stat h-100">
                <div className="card-body d-flex align-items-center gap-3">
                    <div className={`sf-stat-icon text-${tone} bg-${tone}-subtle`}>
                        <i className={`bi ${icon}`}></i>
                    </div>
                    <div>
                        <div className="sf-stat-value">{value}</div>
                        <div className="sf-stat-label">{label}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatCard
