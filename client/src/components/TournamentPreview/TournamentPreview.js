import React, { useState } from 'react';

function TournamentPreview( {new_key, new_data} ) {
    // console.log(new_data[new_key]['date_f'].split("T")[0])
    // Data should be an Obj
    const [name, setName] = useState(new_key);
    const [data, setData] = useState(new_data);
    console.log(data)
    // Things needed:

    // Banner (get from forum post) // TO-DO

    // Tournament name

    // Start date 

    // Forum post
    // console.log(data)
    let start = data[new_key]['date_f'].split("T")[0]
    let info = ""
    
    if (data[new_key]['forum'] != "") {
        info = data[new_key]['forum'];
    } else if (data[new_key]['tourn_sheet']) {
        info = data[new_key]['tourn_sheet'];
    } else {
        info = "No Preview";
    }
    

    return (
        <div style={{border: "1px solid black", borderStyle: "solid", borderRadius: "3%"}}>
            <h1>{name}</h1>
            <p>{start}</p>
            <p>{info}</p>
        </div>
    )
}

export default TournamentPreview;