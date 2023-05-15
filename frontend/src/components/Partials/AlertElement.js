import React, {useEffect, useState} from 'react'
import Alert from 'react-bootstrap/Alert'

const AlertElement = (props) => {
  const [show, setShow] = useState(props.showAlert)
  const [alertText, setAlertText] = useState(props.text)

  useEffect(() => {
    let timeoutId
    if (props.info) {
      timeoutId = setTimeout(hideErrors, 3000)
    }
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    setShow(props.showAlert)
  }, [props.showAlert])

  useEffect(() => {
    setAlertText(props.text)
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
    props.setText("")
  }

  if (show) {
    return (
      <div style={style}>
        <Alert variant={props.info ? "success" : "danger"} onClose={hideErrors} dismissible>
          <Alert.Heading>{props.info ? "Info" : "Error!"}</Alert.Heading>
          <p>
            {alertText}
          </p>
        </Alert>
      </div>
    )
  }
}

export default AlertElement