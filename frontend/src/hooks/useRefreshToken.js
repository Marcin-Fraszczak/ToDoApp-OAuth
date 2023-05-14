import axios from '../api/axios'
import useAuth from './useAuth'
import useDecodeToken from "./useDecodeToken"

const useRefreshToken = () => {
  const {setAuth} = useAuth()
  const decodeToken = useDecodeToken()

  const refresh = async () => {
    const response = await axios.get('users/token/refresh', {
      withCredentials: true
    })
    setAuth(prev => {
      return {
        ...prev,
        username: decodeToken(response.data.access_token)?.sub,
        accessToken: response.data.access_token
      }
    })
    return response.data.access_token
  }
  return refresh
}

export default useRefreshToken
