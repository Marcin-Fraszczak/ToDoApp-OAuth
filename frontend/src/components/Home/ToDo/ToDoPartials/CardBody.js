const CardBody = (props) => {

  const cardStyle = {
    borderRadius: "1.5rem",
    opacity: "0.93",
    backgroundColor: "#375e5f",
    height: "fit-content"
  }

  return (
      <div className="container py-2">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-12 col-lg-11 col-xl-10">
            <div className="card shadow-lg" style={cardStyle}>
              <div className="card-body p-4 text-center" style={{marginTop: "0", position: "relative", float: "none",}}>
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CardBody