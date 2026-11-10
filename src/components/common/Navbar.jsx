import NotificationBell from "./NotificationBell"

function Navbar({ title, tabs, activeTab, setActiveTab, logout }) {
    return (
        <>
            <nav className="navbar sf-navbar navbar-dark">
                <div className="container-fluid px-4">
                    <span className="navbar-brand fw-bold">
                        <i className="bi bi-airplane-fill me-2"></i>SimplyFly
                        <span className="sf-role-pill ms-3">{title}</span>
                    </span>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white-50 small d-none d-md-inline">
                            <i className="bi bi-person-circle me-1"></i>{localStorage.getItem('username')}
                        </span>
                        <NotificationBell />
                        <button className="btn btn-sm btn-outline-light" onClick={() => logout()}>
                            <i className="bi bi-box-arrow-right me-1"></i>Logout
                        </button>
                    </div>
                </div>
            </nav>
            <div className="sf-tabs">
                <div className="container-fluid px-4">
                    <ul className="nav">
                        {tabs.map(t => (
                            <li className="nav-item" key={t.key}>
                                <button className={`nav-link ${activeTab === t.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(t.key)}>
                                    <i className={`bi ${t.icon} me-1`}></i>{t.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar
