import {Outlet} from "react-router-dom"
import {useState, useEffect} from "react"
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import Spinner from "./Spinner"

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const {auth, persist} = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        // console.error("refresh error", err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

    return () => isMounted = false
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {!persist
        ? <Outlet/>
        : isLoading
          ? <Spinner/>
          : <Outlet/>
      }
    </>
  )
}

export default PersistLogin