import React, { useState, useEffect } from 'react';
import './index.css';

function TournamentPreview( {new_key, new_data} ) {
    // Data should be an Obj
    const [name, setName] = useState(new_key);
    const [data, setData] = useState(new_data);

    useEffect ( () => {
        setName(new_key)
        setData(new_data)
    }, [new_key, new_data])

    // Things needed:

    // Banner (get from forum post) // TO-DO

    // Tournament name

    // Start date 

    // Forum post
    // console.log(data)
    let start = data[name]['date_f'].split("T")[0]
    let img = data[name]['banner']
    let info = ""
    
    if (data[name]['forum'] != "") {
        info = data[name]['forum'];
    } else if (data[name]['tourn_sheet']) {
        info = data[name]['tourn_sheet'];
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
            <a href={data[name]['forum']} style={{textDecoration: "none", width: "50%"}}>
              <div style={{paddingLeft: "7%", width: "90%", height: "100%", display: "flex", justifyContent: "center", paddingTop: "10px"}}>
                <div style={{width: "100%", height: "100%", wordWrap: "break-word", marginRight: "2%", marginBottom: "10px", top: "50%"}}>
                  <h1 style={{userSelect: "none", color: "black", fontSize: "200%", margin: "0"}}>{name}</h1>
                  <p style={{userSelect: "none", color: "black", fontSize: "100%", margin: "0"}}>{start}<br></br>{info}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
       
      );
}

export default TournamentPreview;