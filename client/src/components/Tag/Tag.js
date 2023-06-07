import './Tag.css'

function Tag() {
    return (
      <div>
        
          <div className='tag-margin' style={{ marginTop: "4%"}}>
            <img className='tag-pfp' src='https://a.ppy.sh/16626263?1677187336.png' style={{ height: "auto"}}></img>
          </div>
          <div className='tag-margin' style={{ marginTop: "1%",}}>
            <p className='tag-text' style={{
              color: 'white',
              fontFamily: 'trebuchet ms',
              
              marginTop: '0px',
              marginBottom: '0px'
            }}>hiyah's Tournament History</p>
          </div>
        
        <div className='tag-margin' style={{marginTop: '1.5%'}}>
          <hr style={{
            backgroundColor: '#FFFFFF',
            width: '88%',
            height: '1em',
            marginLeft: '0px',
          }}/>
        </div>
        
      </div>
    )
  }

  export default Tag;