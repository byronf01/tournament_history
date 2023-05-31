
import './HomePage.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import osu_logo from '../assets/osu_logo.png';
import sheets_logo from '../assets/sheets_logo.png';
import challonge_logo from '../assets/challonge_logo.png';
import { RangeSlider } from '../components/RangeSlider'
import { Teammates } from '../components/Teammates';
import MatchPreview from '../components/MatchPreview';


function TournamentDetails(props) {
    const { id } = useParams();
    const [data, setData] = useState(false)
    const [matches, setMatches] = useState(false)
    

    useEffect ( () => {
        
        fetch(`http://localhost:5000/api/data/${id}`).then( resp => resp.json())
            .then( (result) => {
               
                setData(result[0])
                const all_stages = []
                // Iterate over all stages 
                for (const j in result[0]['stages']) {
                    const stage_name = Object.keys(result[0]['stages'][j])[0]
                    // iterate over an array of size 0-2 per stage     
                    const matches_arr = result[0]['stages'][j][stage_name]   
                    for (const i in matches_arr) {
                        const mp = Object.keys(matches_arr[i])
                        console.log(matches_arr[i][mp]["result"])
                        all_stages.push(<MatchPreview acronym={result[0]['acronym']} mp={mp} stage={stage_name} match_name={matches_arr[i][mp]["match_name"]} result={matches_arr[i][mp]["result"]} teams={matches_arr[i][mp]['teams']} />);
                    }
                }
                setMatches(all_stages);
            })
           
    }, []);

    const url =( data['bracket'] ? `${data['bracket']}/module` : "")

    return (
        <div>
            <Navbar />
            {
                data != false && 
                    <div style={{paddingLeft: "5%", paddingRight: "5%"}}>
                        <div style={{textAlign: "center"}}>
                            <h1 style={{fontSize: "4.5em"}}>{data["title"]}</h1>
                            <p style={{fontSize: "2em"}}>Gimmick: {data['notes'] ? data['notes'] : "No Gimmick"}</p>
                            <i style={{fontSize: "1.7em"}}>"{data['comments']}"</i>
                        </div>
                        <h2 style={{fontSize: "3em"}}><u>Start Date</u></h2>
                        <p>{data['date']}</p>
                        <div style={{display: "flex", paddingLeft: "20%", paddingRight: "20%", gap: "10px",}}>
                            { data['forum'] != false && 
                                <div style={{marginRight: "0",}}>
                                    <a href={data['forum']}>
                                    <img src={osu_logo} alt="osu logo" style={{maxWidth: "30%"}}></img>
                                    </a>
                                    <p>Forum Post</p> 
                                </div>
                            }
                            { data['tourn_sheet'] != false && 
                                <div>
                                    <a href={data['tourn_sheet']}>
                                    <img src={sheets_logo} alt="sheets logo" style={{maxWidth: "30%"}}></img>
                                    </a>
                                    <p>Spreadsheet</p> 
                                </div>
                            }
                            { data['bracket'] != false && 
                                <div>
                                    <a href={data['bracket']}>
                                    <img src={challonge_logo} alt="challonge logo" style={{maxWidth: "100%"}}></img>
                                    </a>
                                    <p>Bracket</p> 
                                </div>
                            }
                    
                        </div>
                        
                        { data['bracket'] != false && <iframe src={url} width="100%" height="500" frameborder="0" scrolling="auto" allowtransparency="true"></iframe>}
                        
                        <h2 style={{fontSize: "3em"}}><u>Rank Range</u></h2>
                       
                        <RangeSlider range={data['rank_range']}/>
                        
                        <div style={{display: "flex", justifyContent: "space-between", margin: "0em 0.3em 0 0.3em"}}>
                            <div>
                                <h2 style={{fontSize: "3em"}}><u>Format</u></h2>
                                <p>{data['format']}</p>
                            </div>
                            <div>
                                <h2 style={{fontSize: "3em"}}><u>Seed</u></h2>
                                <p>{data['seed']}</p>
                            </div>
                            <div>
                                <h2 style={{fontSize: "3em"}}><u>Placement</u></h2>
                                <p>{data['placement']}</p>
                            </div> 
                        </div>
                        <div style={{}}>
                            <h2 style={{fontSize: "2em", marginRight: "10%"}}>Team Name: </h2>
                            <p style={{textAlign: "bottom"}}>{data['team_name']}</p>
                        </div>
                     

                        <div style={{}}>
                            <h2 style={{fontSize: "2em", marginRight: "10%"}}>Team Members: </h2>
                        </div>
                        
                        <Teammates members={data['teammates']} />
                        
                        <hr style={{width: "100%", height: "0.7em", backgroundColor: "#FFFFFF", borderRadius: "30px"}}></hr>
                        
                        <ul>{matches}</ul>
                    </div>

                    
            }
        </div>

    );

}

export { TournamentDetails };