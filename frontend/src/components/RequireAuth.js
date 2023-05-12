import {useLocation, Navigate, Outlet} from "react-router-dom"
import useAuth from "../hooks/useAuth"

const RequireAuth = ({allowedRoles}) => {
  const {auth} = useAuth()
  const location = useLocation()

  return (
    auth?.accessToken //changed from user to accessToken to persist login after refresh
      ? <Navigate to="/" state={{from: location}} replace/>
      : <Navigate to="/auth" state={{from: location}} replace/>
  );
}

export default RequireAuth