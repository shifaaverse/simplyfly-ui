import axios from "axios"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { API_SERVER_URL_DEV } from "../../../config"

/*
 Same check as AdminDashboard of helpdesk:
 1. token in URL must match token in localStorage
 2. user-details API must return the expected role
*/
function useAuthGuard(expectedRole) {
    const navigate = useNavigate()
    const params = useParams()
    const userDetailsUrl = API_SERVER_URL_DEV + '/api/auth/user-details'

    useEffect(() => {
        const urlToken = params.token
        const memToken = localStorage.getItem('token')
        if (urlToken !== memToken) {
            navigate("/no-access")
            return
        }

        const getUserDetails = async () => {
            try {
                const resp = await axios.get(userDetailsUrl, {
                    headers: { 'Authorization': 'Bearer ' + memToken }
                })
                if (resp.data.role !== expectedRole) {
                    navigate("/no-access")
                }
            }
            catch {
                navigate("/no-access")
            }
        }

        getUserDetails()
    }, [params, expectedRole, navigate, userDetailsUrl])

    const logout = () => {
        localStorage.clear()
        navigate("/")
    }
    return logout
}

export default useAuthGuard
