import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {axiosPrivate} from "../api/axios"
import useRefreshToken from "./useRefreshToken"
import useAuth from "./useAuth"

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const {auth} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {

    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      }, (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosPrivate(prevRequest)
        }
        if (error?.response?.status === 401) {
          return navigate("/auth", {state: {"infoMsg": "Session expired. Please log in again to gain access."}})
        } else return Promise.reject(error)

      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
    // eslint-disable-next-line
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate