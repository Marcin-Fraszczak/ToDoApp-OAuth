import {useNavigate} from "react-router-dom"

const useHandleEsc = (path) => {
  const navigate = useNavigate()
  const handleEsc = (e) => {
    e.key === 'Escape' && navigate(path)
  }
  return handleEsc
}

export default useHandleEsc