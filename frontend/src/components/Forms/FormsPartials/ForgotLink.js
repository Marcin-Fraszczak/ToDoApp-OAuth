import React, {useState} from "react"

const ForgotLink = (props) => {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  return (
    <span style={{textDecoration: hovered ? "underline" : "none",
      color: clicked ? "#363d3b" : "#9da3a1", cursor: "pointer"}}
      className="me-5"
       onClick={() => props.navigate("/reset_password")}
       onMouseEnter={() => setHovered(true)}
       onMouseLeave={() => setHovered(false)}
       onMouseDown={() => setClicked(true)}
       onMouseUp={() => setClicked(false)}
    >Forgot password?</span>
  )
}

export default ForgotLink