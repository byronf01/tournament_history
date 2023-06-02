import React, { useState, useEffect } from 'react';
import './index.css';
import ImageContainer from '../ImageContainer'

function TournamentPreview( {new_data} ) {
    // Data should be an Obj
    const [data, setData] = useState(new_data);

    useEffect ( () => {
        setData(new_data)
    }, [new_data])


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
          <div class="inner" style={{border: "1px solid black", borderStyle: "solid", 
                      marginBottom: '2%', marginLeft: '12%', marginRight: '12%', borderRadius: "30px",
                      width: "76%", backgroundColor: "#7F9C96",
                      display: "flex", maxHeight: "20vw",
                      boxShadow: "2px 5px #1a1d21", overflow: "hidden",
                      justifyContent: 'center', alignItems: "center"}}>
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
              onClick={(e) => {
                // Check if text is selected
                const selection = window.getSelection();
                const selectedText = selection.toString();
                if (selectedText.length === 0) {
                  // Redirect to the link when no text is selected
                  window.location.href = `/tournaments/${data["url_id"]}`;
                }
              }}
            >
              <div
                style={{
                  paddingLeft: "7%",
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
                      fontSize: "2.2vw",
                      margin: "0"
                    }}
                  >
                    {data['title']}
                  </h1>
                  <p
                    style={{
                      
                      color: "black",
                      fontSize: "1.2vw",
                      margin: "0"
                    }}
                  >
                    {start}
                    <br></br>
                    {info}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
       
      );
}

export default TournamentPreview;