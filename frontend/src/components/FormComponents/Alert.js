import React, {useEffect, useState} from 'react'
import Alert from 'react-bootstrap/Alert'
import FormBody from "./FormBody"

const AlertElement = (props) => {
  const [show, setShow] = useState(props.showAlert)
  const [text, setText] = useState(props.text)

  useEffect(() => {
    setShow(props.showAlert)
  }, [props.showAlert])

  useEffect(() => {
    setText(props.text)
  }, [props.text])

  const style = {
    position: "absolute",
    top: "50%",
    left: "0px",
    width: "100%",
    zIndex: "10",
    borderRadius: "1.5rem",
    opacity: "0.95",
    transform: "translate(0, -50%)"
  }

  const hideErrors = () => {
    setShow(false)
    props.setErrMsg("")
  }

  if (show) {
    return (
      <div style={style}>
          <Alert variant="danger" onClose={hideErrors} dismissible>
            <Alert.Heading>Error!</Alert.Heading>
            <p>
              {text}
            </p>
          </Alert>
      </div>
    )
  }
}

export default AlertElement