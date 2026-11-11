import axios from "axios"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { API_SERVER_URL_DEV } from "../../../config"

/*
 Same check as AdminDashboard of helpdesk:
 1. token in URL must match token in localStorage
 2. user-details API must return the expected role
*/

// Custom hook to check whether the user can access a particular dashboard.
function useAuthGuard(expectedRole) {

    // Step 1: Get navigation function to redirect the user.
    const navigate = useNavigate()

    // Step 2: Get route parameters from the URL.
    const params = useParams()

    // Step 3: Define the API URL to fetch authenticated user details.
    const userDetailsUrl = API_SERVER_URL_DEV + '/api/auth/user-details'

    // Step 4: Run authentication checks when the dependencies change.
    useEffect(() => {

        // Get the token from the URL.
        const urlToken = params.token

        // Get the stored token from browser localStorage.
        const memToken = localStorage.getItem('token')

        // Step 5: Check whether both tokens match.
        if (urlToken !== memToken) {
            navigate("/no-access")
            return
        }

        // Step 6: Fetch authenticated user details from the backend.
        const getUserDetails = async () => {
            try {
                const resp = await axios.get(userDetailsUrl, {
                    headers: { 'Authorization': 'Bearer ' + memToken }
                })

                // Step 7: Check whether the user's role matches the expected role.
                if (resp.data.role !== expectedRole) {
                    navigate("/no-access")
                }
            }
            catch {
                // Redirect when the API request fails.
                navigate("/no-access")
            }
        }

        // Call the asynchronous function without waiting inside useEffect.
        void getUserDetails()

    }, [params, expectedRole, navigate, userDetailsUrl])

    // Step 8: Define the logout function.
    const logout = () => {

        // Clear stored login information.
        localStorage.clear()

        // Redirect the user to the login page.
        navigate("/")
    }

    // Step 9: Return the logout function to the component using this hook.
    return logout
}

export default useAuthGuard
