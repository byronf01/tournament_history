import './index.css'

const USER = 16626263;
function MatchPreview( {acronym, mp, stage, match_name, result, teams} ) {
    
    // Logic to display green/red based on if user won
    let color;
    if (stage == 'Qualifiers') {
        color = '#BAACBD'
    } else {
        const blue = result[0];
        const red = result[1];
        const blue_win = true ? blue > red : false;
        const on_blue = true ? teams['team_blue'].includes(USER) : false;
        if (blue_win && on_blue) color = '#8CDB8E'
        else if (blue_win == false && on_blue == false) color = '#8CDB8E'
        else color = '#D07272';
    }

    const match_url = `https://osu.ppy.sh/community/matches/${mp}`;
    
    return (
        
        <div>
            <div
                className="container"
                onClick={(e) => {
                // Check if text is selected
                const selection = window.getSelection();
                const selectedText = selection.toString();
                if (selectedText.length === 0) {
                   
                    if (e.target.tagName !== 'A') {
                        
                        window.location.href = `/matches/${acronym}/${mp}`;
                     } else {
                        // Open a new page when the <a> tag is clicked
                        
                        window.open(match_url, '_blank');
                      }
                    
                }
                }}
                style={{
                textDecoration: "none",
                cursor: "pointer",
                backgroundColor: color,
                width: "90%",
                marginBottom: "2%",
                fontFamily: "trebuchet ms",
                height: 'auto',
                display: "flex",
                flexDirection: "column",
                borderRadius: '10px',
                
                }}
            >
                <div className="title" style={{ display: "flex", marginLeft: '1vw', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{width: '80%'}}>
                        <h2 style={{ marginTop: "0.8vw", marginBottom: "0", fontSize: "1.9vw" }}>{match_name}</h2>
                    </div>
                    <div style={{margin: '1.2vw 1vw 0 auto', alignItems: 'flex-end', alignSelf: 'flex-start'}}>
                        <h2 style={{margin: 'auto 0.3vw 0 0', fontSize: '1.5vw'}}>{stage}</h2>
                    </div>
                    
                </div>
                <div className="link" style={{ display: 'flex', marginTop: "0vw", fontSize: "1.1vw", marginLeft: '1vw' }}>
                    <p style={{ marginTop: "0.8vw" }}><a class='styled' >{match_url}</a></p>
                    <p style={{marginTop: "0.8vw", marginLeft: 'auto', marginRight: '1.5vw', alignItems: 'flex-end'}}>{result[0]} - {result[1]}</p>
                    
                </div>
            </div>
        </div>
       
      );
}

export default MatchPreview;