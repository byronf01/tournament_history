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
        <div style={{border: "1px solid black", borderStyle: "solid", borderRadius: "3%"}}>
            <h1>{name}</h1>
            <p>{start}</p>
            <p>{info}</p>
        </div>
    )
}

export default TournamentPreview;