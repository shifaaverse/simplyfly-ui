// Same header used in every secured API call
export const authHeader = () => {
    return {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    }
}
