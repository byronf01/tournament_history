import React, { useState, useEffect } from 'react';

function MatchPreview( {round_name, new_data, tourn_name, extra} ) {
    // Data should be an Obj
    const [round, setRound] = useState(round_name);
    const [data, setData] = useState(new_data[0]);

    // Get the match title
    
    const mp = Object.keys(data)[0]
    const match_name = data[mp]['match_name']
    const acr = extra['acronym']
    
    return (
        
        <div>
            <a href={`/matches/${acr}/${mp}`} style={{textDecoration: "none"}}>
            <div style={{display: "flex", border: "1px solid black", width: "90%", height: "100px",
                        justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display: "flex", marginLeft: "10%", paddingRight: "10%", borderRight: "1px dotted black", width: "20%", height: "100%"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", color: "black"}}>{round}</div>
                </div>
                <div style={{display: "flex", marginRight: "10%", height: "100%", width: "50%"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", color: "black"}}>{match_name}</div>
                </div>
            </div>
            </a>
        </div>
       
      );
}

export default MatchPreview;