import { Route, Routes } from "react-router"
import Login from "./components/auth/Login"
import SignUp from "./components/passenger/SignUp"
import AirlineRegister from "./components/airline/AirlineRegister"
import PageNotFound from "./components/PageNotFound"
import PassengerDashboard from "./components/passenger/PassengerDashboard"
import AirlineDashboard from "./components/airline/AirlineDashboard"
import AdminDashboard from "./components/admin/AdminDashboard"
import FlightStatus from "./components/common/FlightStatus"
import ForgotPassword from "./components/auth/ForgotPassword"

function App() {
  return (
    <Routes>
      <Route path="" element={<Login />} />
      <Route path="passenger/signup" element={<SignUp />} />
      <Route path="airline/register" element={<AirlineRegister />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="flight-status" element={<FlightStatus />} />
      <Route path="passenger/:token" element={<PassengerDashboard />} />
      <Route path="airline/:token" element={<AirlineDashboard />} />
      <Route path="admin/:token" element={<AdminDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App
