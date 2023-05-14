import {Link} from "react-router-dom"
import FormBody from "./AuthForm/AuthFormPartials/FormBody"

const Missing = () => {
  const buttonGroupStyle = "mt-4 d-flex justify-content-around"
  const buttonStyle = "btn btn-outline-light"

  return (
    <FormBody>
      <img src="/404.jpg" alt="404 Not Found" style={{width: "100%"}}/>
      <div className={buttonGroupStyle}>
        <Link to="/" className={buttonStyle}>Homepage</Link>
        <Link to="/chill" className={buttonStyle}>Just Chill</Link>
      </div>
    </FormBody>
  )
}

export default Missing
