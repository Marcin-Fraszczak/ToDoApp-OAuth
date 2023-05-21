import axios from 'axios'

// const BASE_URL = 'http://127.0.0.1:8000'
const BASE_URL = 'https://todoapp-oauth-production.up.railway.app'

export default axios.create({
  baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
})

export const axiosJson = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
})

export const handleAxiosErrors = (err, setErrMsg) => {
  if (!err?.response) {
    setErrMsg('No Server Response')
  } else {
    setErrMsg(`Action Failed: ${err.response?.data?.detail?.msg || err.response?.data?.detail}`)
  }
}