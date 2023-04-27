import React, { useState, useEffect } from 'react';

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
          <div style={{border: "1px solid black", borderStyle: "solid", margin: "10px 0"}}>
            <div style={{padding: "3%"}}>
              <h1 style={{userSelect: "none", color: "black"}}>{name}</h1>
              <p style={{userSelect: "none", color: "black"}}>{start}</p>
              <p style={{userSelect: "none", color: "black"}}>{info}</p>
            </div>
          </div>
        </a>
      );
}

export default TournamentPreview;