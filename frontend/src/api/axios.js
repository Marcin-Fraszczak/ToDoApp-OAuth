import axios from 'axios'
const BASE_URL = 'http://localhost:8000'

export default axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

export const handleAxiosErrors = (err, setErrMsg) => {
    if (!err?.response) {
      setErrMsg('No Server Response')
    } else if (err.response?.status === 400) {
      setErrMsg(`Missing Username or Password: ${err?.detail?.msg}`)
    } else if (err.response?.status === 401) {
      setErrMsg(`Unauthorized: ${err?.detail?.msg}`)
    } else {
      setErrMsg(`Action Failed: ${err?.detail?.msg}`)
    }
  }