
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
                        <u style={{fontSize: "2em"}}>Start Date</u>
                        <p>{data['date']}</p>
                        <div style={{display: "flex"}}>
                            { data['forum'] != false && 
                                <div>
                                    <a href={data['forum']}>
                                    <img src={} alt="osu logo"></img>
                                    </a>
                                    
                                    <p>Forum Post</p> 
                                </div>
                                
                            }
                            { data['tourn_sheet'] != false && 
                                <p>Spreadsheet: {data['tourn_sheet']}</p>
                            }
                            { data['bracket'] != false && 
                                <p>Forum Post: {data['forum']}</p> 
                            }
                    
                        </div>
                        
                        { data['bracket'] != false && <iframe src={url} width="100%" height="500" frameborder="0" scrolling="auto" allowtransparency="true"></iframe>}
                        
                        
                    </div>
            }
        </div>

    );

}

export { TournamentDetails };