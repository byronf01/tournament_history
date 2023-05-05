import React, { useState, useEffect } from 'react';

function MatchPreview( {acronym, mp, stage, match_name} ) {
  
    return (
        
        <div>
            <a href={`/matches/${acronym}/${mp}`} style={{textDecoration: "none"}}>
            <div style={{display: "flex", border: "1px solid black", width: "90%", height: "100px",
                        justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display: "flex", marginLeft: "10%", paddingRight: "10%", borderRight: "1px dotted black", width: "20%", height: "100%"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", color: "black"}}>{stage}</div>
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