import React, { useState, useEffect } from 'react';
import './index.css';
import ImageContainer from '../ImageContainer'

function TournamentPreview( {new_data} ) {
    // Data should be an Obj
    const [data, setData] = useState(new_data);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect ( () => {
        setData(new_data)
    }, [new_data])

    useEffect(() => {
      const handleResize = () => {
          setWindowWidth(window.innerWidth);
      };
    
      window.addEventListener('resize', handleResize);
    
      return () => {
          window.removeEventListener('resize', handleResize);
      };
    }, []);
  
  const blockView = () => {
    if (windowWidth < 600) {
        return (
          <div style={{fontFamily: 'trebuchet ms'}}>
            <div class="inner margin" style={{border: "1px solid black", borderStyle: "solid", 
                        marginBottom: '5%',  borderRadius: "30px",
                        backgroundColor: "#7F9C96", 
                        display: "flex", maxHeight: "70em",
                        boxShadow: "2px 5px #1a1d21", overflow: "hidden",
                        justifyContent: 'center', alignItems: "center", cursor: 'pointer',
                        flexDirection: 'column'}}
                  onClick={(e) => {
                          // Check if text is selected
                          const selection = window.getSelection();
                          const selectedText = selection.toString();
                          if (selectedText.length === 0) {
                            
                            if (e.target.tagName !== 'A') {
                              // Redirect to the link when no text is selected
                              window.location.href = `/tournaments/${data["url_id"]}`;
                            } else {
                                window.open(info, '_blank');
                            }
                          }
                          }}>
              
              <div style={{paddingTop: '0em'}}>
                <ImageContainer image={img} width='25em' height='15em' />
              </div>
                
              <div
                style={{
                  textDecoration: "none",
                  width: '85%',
                  marginLeft: '5%',
                  marginRight: '10%',
                  marginBottom: '1.5em',
                  display: 'flex', 
                  overflowWrap: 'break-word',
                  flexWrap: 'wrap',
                  cursor: "pointer" // Add cursor pointer to indicate it's clickable
                }}
                
              >
                    <h1
                      style={{
                        
                        color: "black",
                        fontSize: "2.1em",
                        margin: "0"
                      }}
                    >
                      {data['title']}
                    </h1>
                    <p
                      style={{
                        display: 'flex', 
                        overflowWrap: 'break-word',
                        flexWrap: 'wrap',
                        color: "black",
                        fontSize: "1.1em",
                        margin: "0",
                        
                      }}
                    >
                      {start}
                      <br></br>
                      <a class='styled'>{info}</a>
                    </p>
                  </div>
                </div>
              </div>

          
          
        );
    } else {
        return (
          <div style={{fontFamily: 'trebuchet ms'}}>
            <div class="inner margin" style={{border: "1px solid black", borderStyle: "solid", 
                        marginBottom: '2%',  borderRadius: "30px",
                        backgroundColor: "#7F9C96", 
                        display: "flex", maxHeight: "20em",
                        boxShadow: "2px 5px #1a1d21", overflow: "hidden",
                        justifyContent: 'center', alignItems: "center", cursor: 'pointer'}}
                  onClick={(e) => {
                          // Check if text is selected
                          const selection = window.getSelection();
                          const selectedText = selection.toString();
                          if (selectedText.length === 0) {
                            
                            if (e.target.tagName !== 'A') {
                              // Redirect to the link when no text is selected
                              window.location.href = `/tournaments/${data["url_id"]}`;
                            } else {
                                window.open(info, '_blank');
                            }
                          }
                          }}>
              <div style={{width: "60%", height: "100%", display: "flex", 
                          justifyContent: "center",
                          }}> 
                <div style={{padding: '10px 0px 10px 0px'}}>
                  <ImageContainer image={img} width='42vw' height='9vw' />
                </div>
                
                
              </div>
              <div
                style={{
                  textDecoration: "none",
                  width: "40%",
                  cursor: "pointer" // Add cursor pointer to indicate it's clickable
                }}
                
              >
                <div
                  className='margin-tpreview'
                  style={{
                    
                    width: "90%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px"
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      wordWrap: "break-word",
                      marginRight: "2%",
                      marginBottom: "10px",
                      top: "50%"
                    }}
                  >
                    <h1
                      style={{
                        
                        color: "black",
                        fontSize: "2.1em",
                        margin: "0"
                      }}
                    >
                      {data['title']}
                    </h1>
                    <p
                      style={{
                        
                        color: "black",
                        fontSize: "1.1em",
                        margin: "0"
                      }}
                    >
                      {start}
                      <br></br>
                      <a class='styled'>{info}</a>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
    }
  }
  


    let start = data['date_f'].split("T")[0]
    let banner = data['banner']
    let info = ""
    
    if (data['forum'] != "") {
        info = data['forum'];
    } else if (data['tourn_sheet']) {
        info = data['tourn_sheet'];
    } else {
        info = "No Preview";
    }

    const img = { url: banner, alt: 'banner' };

    return (
        <div>
          {blockView()}
        </div>
      );
}

export default TournamentPreview;