import { useEffect } from "react"
import { Link } from "react-router"

function PageNotFound() {
    useEffect(() => {
        localStorage.clear()
    }, [])
    return (
        <div className="container text-center py-5">
            <h1 className="display-5 fw-bold">Page not found</h1>
            <p className="text-muted">You may have been logged out or do not have access.</p>
            <Link to="/" className="btn btn-primary">Go to Login</Link>
        </div>
    )
}

export default PageNotFound
