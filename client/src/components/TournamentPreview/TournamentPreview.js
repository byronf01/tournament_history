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
        <a href={data[name]['forum']} style={{textDecoration: "none"}}>
          <div class="background" style={{background: {img}}}>
            <div class="inner" style={{border: "1px solid black", borderStyle: "solid", 
                        margin: "30px 0", borderRadius: "30px",
                        width: "97%", backgroundColor: "#BEC5AD",
                        display: "flex", maxHeight: "200px",
                        boxShadow: "5px 10px #1a1d21"}}>
              <div style={{width: "40%", height: "100%", display: "block", 
                          overflow: "auto", objectFit: "cover"}}>
                
                <img src={img} style={{maxWidth: "100%", 
                                      maxHeight: "100%",
                                      objectFit: "cover"
                                      }}/>
              </div>
              <div style={{}}>
                <div style={{}}>
                  <h1 style={{userSelect: "none", color: "black"}}>{name}</h1>
                  <p style={{userSelect: "none", color: "black"}}>{start}</p>
                  <p style={{userSelect: "none", color: "black"}}>{info}</p>
                </div>
              </div>
            </div>
          </div>
        </a>
      );
}

export default TournamentPreview;