const FormBody = (props) => {

  const cardStyle = {
    borderRadius: "1.5rem",
    opacity: "0.93",
    backgroundColor: "#375e5f"
  }

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-9 col-lg-6 col-xl-5">
            <div className="card shadow-lg" style={cardStyle}>
              <div className="card-body p-5 text-center">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FormBody