import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

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
  } else if (err.response?.status === 400) {
    setErrMsg(`Missing Username or Password: ${err.response?.data?.detail?.msg || err.response?.data?.detail}`)
  } else if (err.response?.status === 401) {
    setErrMsg(`Unauthorized: ${err.response?.data?.detail?.msg || err.response?.data?.detail}`)
  } else if (err.response?.status === 403) {
    setErrMsg(`403: ${err.response?.data?.detail?.msg || err.response?.data?.detail}`)
  } else {
    setErrMsg(`Action Failed: ${err.response?.data?.detail?.msg || err.response?.data?.detail}`)
  }
}