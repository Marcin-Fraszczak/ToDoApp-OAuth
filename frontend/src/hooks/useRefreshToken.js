import axios from '../api/axios'
import useAuth from './useAuth'
import useDecodeToken from "./useDecodeToken"

const useRefreshToken = () => {
  const {setAuth} = useAuth()
  const decodeToken = useDecodeToken()

  const refresh = async () => {
    try {
      const response = await axios.get('users/token/refresh', {
        withCredentials: true
      })
      const decoded = decodeToken(response.data.access_token)
      setAuth(prev => {
        return {
          ...prev,
          username: decoded?.sub,
          verified: decoded?.ver,
          accessToken: response.data.access_token
        }
      })
      return response.data.access_token
    } catch (err) {
      // console.log("errror w userefresh", err)
    }
  }
  return refresh
}

export default useRefreshToken
