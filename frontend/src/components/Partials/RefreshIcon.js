import {useState} from "react"
import {faArrowsRotate} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import useRefreshToken from "../../hooks/useRefreshToken"

const RefreshIcon = () => {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const refresh = useRefreshToken()

  return (
    <FontAwesomeIcon icon={faArrowsRotate}
                     style={{color: hovered ? "5A9A9B" : "#ffffff"}}
                     rotation={clicked ? 90 : 0}
                     onClick={refresh}
                     onMouseEnter={() => setHovered(true)}
                     onMouseLeave={() => setHovered(false)}
                     onMouseDown={() => setClicked(true)}
                     onMouseUp={() => setClicked(false)}
    />
  )
}

export default RefreshIcon