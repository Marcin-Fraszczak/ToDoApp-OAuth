const Divider = () => {
  const lineStyle = {flex: 1, height: '1px', backgroundColor: 'lightgrey'}
  const textStyle = {width: '3rem', textAlign: 'center'}

  return (
    <div className="d-flex align-items-baseline mt-3 mb-1 text-white-50">
      <div style={lineStyle}/>

      <div>
        <p style={textStyle}>OR</p>
      </div>

      <div style={lineStyle}/>
    </div>
  )
}

export default Divider