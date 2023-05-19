import React, {useState} from "react"

const ForgotLink = (props) => {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  return (
    <a style={{textDecoration: hovered ? "underline" : "none", color: clicked ? "#363d3b" : "#9da3a1"}}
      className="me-5" href="#"
       onClick={() => props.navigate("/reset_password")}
       onMouseEnter={() => setHovered(true)}
       onMouseLeave={() => setHovered(false)}
       onMouseDown={() => setClicked(true)}
       onMouseUp={() => setClicked(false)}
    >Forgot password?</a>
  )
}

export default ForgotLink