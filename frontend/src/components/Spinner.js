const Spinner = () => {
  const spinnerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    margin: "-5rem 0 0 -5rem",
    height: "10rem",
    width: "10rem",
  }

  return (
    <div className='d-flex'>
      <div className="spinner-border text-light" role="status" style={spinnerStyle}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner