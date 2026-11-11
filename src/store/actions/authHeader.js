// Same header used in every secured API call

// Step 1: Create a reusable authentication header function.
export const authHeader = () => {

    // Step 2: Return the Authorization header containing the JWT token.
    return {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }
}
