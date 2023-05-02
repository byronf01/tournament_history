
import './HomePage.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import osu_logo from '../assets/osu_logo.png';
import sheets_logo from '../assets/sheets_logo.png';
import challonge_logo from '../assets/challonge_logo.png';

function TournamentDetails(props) {
    const { id } = useParams();
    const [name, setName] = useState("")
    const [data, setData] = useState(false)
    

    useEffect ( () => {
        
        fetch(`http://localhost:5000/api/data/${id}`).then( resp => resp.json())
            .then( (result) => {
                const k = Object.keys(result).filter(e => e !== '_id')[0]
                setName(k)
                setData(result[k])
                
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
                            <h1 style={{fontSize: "4.5em"}}>{name}</h1>
                            <p style={{fontSize: "2em"}}>Gimmick: {data['notes'] ? data['notes'] : "None"}</p>
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
                        <p>{data['rank_range']}</p>

                        
                    </div>

                    
            }
        </div>

    );

}

export { TournamentDetails };