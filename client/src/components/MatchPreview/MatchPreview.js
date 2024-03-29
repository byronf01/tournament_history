import './index.css'
import React, { useState, useEffect } from 'react';

const USER = 16626263;
function MatchPreview( {acronym, mp, stage, match_name, result, teams} ) {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Logic to display green/red based on if user won
    let color;
    let match_result;
    if (stage == 'Qualifiers') {
        color = '#BAACBD'
        match_result = ''
    } else {
        const blue = result[0];
        const red = result[1];
        const blue_win = true ? blue > red : false;
        const on_blue = true ? teams['team_blue'].includes(USER) : false;
        if (blue_win && on_blue) {
            color = '#8CDB8E';
            match_result = result[0] > result[1] ? `${result[0]} - ${result[1]}` : `${result[1]} - ${result[0]}`
        } else if (blue_win == false && on_blue == false) {
            color = '#8CDB8E'
            match_result = result[0] > result[1] ? `${result[0]} - ${result[1]}` : `${result[1]} - ${result[0]}`
        } else {
            color = '#D07272';
            match_result = result[0] < result[1] ? `${result[0]} - ${result[1]}` : `${result[1]} - ${result[0]}`
        }
        
    }

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
      
        window.addEventListener('resize', handleResize);
      
        return () => {
            window.removeEventListener('resize', handleResize);
        };
      }, []);
    
    const blockView = () => {
      if (windowWidth < 600) {
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
                        
                            window.open(match_url, '_blank');
                        }
                        
                    }
                    }}
                    style={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: color,
                    width: "100%",
                    marginBottom: "2%",
                    fontFamily: "trebuchet ms",
                    height: 'auto',
                    maxHeight: '10em',
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: '10px',
                    }}
                >
                    <div className="title" style={{ display: "flex", marginLeft: '1vw', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{width: '70%'}}>
                            <h2 style={{ marginTop: "0.8vw", marginBottom: "0", fontSize: "1.9em" }}>{match_name}</h2>
                        </div>
                        <div style={{margin: '1.2vw 1vw 0 auto', alignItems: 'flex-end', alignSelf: 'flex-start'}}>
                            <h2 style={{margin: 'auto 0.3vw 0 0', fontSize: '1.5em'}}>{stage}</h2>
                        </div>
                        
                    </div>
                    <div className="link" style={{ display: 'flex', marginTop: "0vw", fontSize: "1.1em", marginLeft: '1vw' }}>
                        <p style={{ marginTop: "0.8vw", width: '70%', display: 'flex', flexWrap: 'break-word' }}><a class='styled' >{match_url}</a></p>
                        <p style={{marginTop: "0.8vw", marginLeft: 'auto', marginRight: '1.5em', alignItems: 'flex-end'}}>{match_result}</p>
                        
                    </div>
                </div>
            </div>
          );
      } else {
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
                        
                            window.open(match_url, '_blank');
                        }
                        
                    }
                    }}
                    style={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: color,
                    width: "100%",
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
                        <p style={{marginTop: "0.8vw", marginLeft: 'auto', marginRight: '1.5vw', alignItems: 'flex-end'}}>{match_result}</p>
                        
                    </div>
                </div>
            </div>
          );
      }
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
                        
                            window.open(match_url, '_blank');
                        }
                        
                    }
                    }}
                    style={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: color,
                    width: "100%",
                    marginBottom: "2%",
                    fontFamily: "trebuchet ms",
                    height: 'auto',
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: '10px',
                    boxShadow: "1px 2px #1a1d21",
                    }}
                >
                    <div style={{ display: "flex", marginLeft: '1em', flexWrap: 'wrap', alignItems: 'center', flexWrap: 'wrap', wordWrap: 'anywhere' }}>
                        <div style={{width: '70%', marginRight: '10%'}}>
                            <h2 style={{ marginTop: "0.8vw", marginBottom: "0", fontSize: "1.9em" }}>{match_name}</h2>
                        </div>
                        <div style={{width: '18%', marginTop: '0.8em', marginRight: '2%', marginBottom: '0', marginLeft: 'auto', alignItems: 'flex-end', alignSelf: 'flex-start', textAlign: 'right'}}>
                            <h2 style={{margin: 'auto 0.3vw 0 0', fontSize: '1.5em'}}>{stage}</h2>
                        </div>
                    </div>

                    <div className="link" style={{ display: 'flex', marginTop: "0vw", fontSize: "1.1em", marginLeft: '1em', flexWrap: 'wrap' }}>
                        <div style={{width: '70%', marginRight: '10%', marginTop: "0.8em", marginBottom: '0.8em', flexWrap: 'wrap', wordWrap: 'anywhere'}}>
                            <p style={{margin: 0, fontSize: '1em' }}><a class='styled' >{match_url}</a></p>
                        </div>
                        
                        <div style={{width: '18%', marginTop: "0.8em", marginBottom: '0.8em', marginRight: '2%', marginLeft: 'auto', alignItems: 'flex-end', alignSelf: 'flex-start', textAlign: 'right'}}>
                            <p style={{margin: 'auto 0.3vw 0 0', fontSize: '1em', alignItems: 'flex-end'}}>{match_result}</p>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
       
      );
}

export default MatchPreview;