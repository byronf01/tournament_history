import React, { useState, useEffect } from 'react';
import './index.css';

function TournamentPreview( {new_data} ) {
    // Data should be an Obj
    const [data, setData] = useState(new_data);

    useEffect ( () => {
        setData(new_data)
    }, [new_data])


    let start = data['date_f'].split("T")[0]
    let img = data['banner']
    let info = ""
    
    if (data['forum'] != "") {
        info = data['forum'];
    } else if (data['tourn_sheet']) {
        info = data['tourn_sheet'];
    } else {
        info = "No Preview";
    }
    
    return (
        
        <div>
          <div class="inner" style={{border: "1px solid black", borderStyle: "solid", 
                      margin: "30px 0", borderRadius: "30px",
                      width: "97%", backgroundColor: "#BEC5AD",
                      display: "flex", maxHeight: "200px",
                      boxShadow: "5px 10px #1a1d21", overflow: "hidden"}}>
            <div style={{width: "50%", height: "100%", display: "flex", 
                        overflow: "hidden", objectFit: "fill", justifyContent: "center",
                        }}>
              <img src={img} style={{maxWidth: "100%", 
                                    maxHeight: "100%",
                                    objectFit: "fill",
                                    justifyContent: "center",
                                    alignItems: "center",
                                 
                                    }}/>
            </div>
            <a href={`/tournaments/${data['acronym']}`} style={{textDecoration: "none", width: "50%"}}>
              <div style={{paddingLeft: "7%", width: "90%", height: "100%", display: "flex", justifyContent: "center", paddingTop: "10px"}}>
                <div style={{width: "100%", height: "100%", wordWrap: "break-word", marginRight: "2%", marginBottom: "10px", top: "50%"}}>
                  <h1 style={{userSelect: "none", color: "black", fontSize: "200%", margin: "0"}}>{data['title']}</h1>
                  <p style={{userSelect: "none", color: "black", fontSize: "100%", margin: "0"}}>{start}<br></br>{info}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
       
      );
}

export default TournamentPreview;