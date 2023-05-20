import React, {useEffect, useState} from 'react'
import Alert from 'react-bootstrap/Alert'

const AlertElement = (props) => {
  const [show, setShow] = useState(props.showAlert)
  const [alertText, setAlertText] = useState(props.text)

  const handleEsc = e => e.key === 'Escape' && hideText()

  useEffect(() => {
    const timeoutId = setTimeout(hideText, 10000)
    window.addEventListener('keydown', handleEsc)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('keydown', handleEsc)
    }
    // eslint-disable-next-line
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
    left: props?.fullScreen ? "50%" : "0px",
    width: "100%",
    zIndex: "10",
    borderRadius: "1.5rem",
    opacity: "0.95",
    transform: props?.fullScreen ? "translate(-50%, -50%)" : "translate(0, -50%)",
    maxWidth: "1000px",
  }

  const hideText = () => {
    setShow(false)
    props.setText("")
  }

  if (show) {
    return (
      <div style={style} className="text-center m-auto">
        <Alert variant={props.info ? "success" : "danger"} onClose={hideText} dismissible>
          <Alert.Heading>{props.info ? "Info" : "Error!"}</Alert.Heading>
          <div>
            {alertText.includes("$#") ? alertText.split("$#").map(item => <p key={item}>{item}</p>) : alertText}
          </div>
        </Alert>
      </div>
    )
  }
}

export default AlertElement