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
      // console.log(JSON.stringify(prev))
      console.log("from use refresh", response.data.access_token)
      console.log(parseJwt(response.data.access_token))
      return {
        ...prev,
        accessToken: response.data.access_token
      }
    })
    return response.data.access_token
  }
  return refresh
}

export default useRefreshToken
