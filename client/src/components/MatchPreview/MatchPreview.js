

const USER = 16626263;
function MatchPreview( {acronym, mp, stage, match_name, result, teams} ) {
    
    // Logic to display green/red based on if user won
    let won;
    if (stage == 'Qualifiers') {
        won = 'purple'
    } else {
        const blue = result[0];
        const red = result[1];
        const blue_win = true ? blue > red : false;
        const on_blue = true ? teams['team_blue'].includes(USER) : false;
        if (blue_win && on_blue) won = 'green'
        else if (blue_win == false && on_blue == false) won = 'green'
        else won = 'red';
    }
    
    return (
        
        <div>
            <a href={`/matches/${acronym}/${mp}`} style={{textDecoration: "none"}}>
            <div style={{display: "flex", border: "1px solid black", width: "90%", height: "100px",
                        justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display: "flex", marginRight: "10%", height: "100%", width: "50%"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", color: "black"}}>{match_name}</div>
                    <div>{result[0]} - {result[1]}</div>
                </div>
                <div style={{display: "flex", marginLeft: "10%", paddingRight: "10%", borderLeft: "1px dotted black", width: "20%", height: "100%"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", color: "black"}}>{stage}</div>
                    <div>
                        {won}
                    </div>
                </div>
                
            </div>
            </a>
        </div>
       
      );
}

export default MatchPreview;