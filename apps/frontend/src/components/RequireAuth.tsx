import { Navigate, Outlet } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import Loading from "./Loading"

const RequireAuth = () => {
  const { currentUser, isLoading } = useAuth()
  if (isLoading) return <Loading />
  if (!currentUser) return <Navigate to="/login" replace />
  return <Outlet />
}

export default RequireAuth
