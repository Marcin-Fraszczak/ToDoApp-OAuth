import axios from '../api/axios'
import useAuth from './useAuth'

const parseJwt = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}


const useRefreshToken = () => {
  const {setAuth} = useAuth()

  const refresh = async () => {
    const response = await axios.get('users/token/refresh', {
      withCredentials: true
    })
    setAuth(prev => {
      return {
        ...prev,
        username: parseJwt(response.data.access_token)?.sub,
        accessToken: response.data.access_token
      }
    })
    return response.data.access_token
  }
  return refresh
}

export default useRefreshToken
