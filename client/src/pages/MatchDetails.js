
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
import MatchCosts from '../components/MatchCosts';
import MapDetails from '../components/MapDetails';


function MatchDetails(props) {
    const { acr, mp } = useParams();
    const [data, setData] = useState(false);
    const [nameMap, setNameMap] = useState({}); // Maps a user's osu id to their osu username

    useEffect( () => {
        fetch(`http://localhost:5000/api/matches/${acr}/${mp}`).then( resp => resp.json())
            .then( (result) => {
                setData(result);

                // Get a list of all users who played in the match by id
                let ids = [];
                for (let i in result["matchcosts"]) {
                    let team = result["matchcosts"][i];
                    if (Object.keys(team).length != 0) {
                        let mcs = Object.entries(team[Object.keys(team)])
                        for (let i in mcs) {
                            ids.push(mcs[i][0])
                        }
                    }  
                }
                
                fetch(`http://localhost:5000/api/name`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ids)
                    
                }).then( resp => resp.json()).then( (result) => {
                    setNameMap(result)
                })
                
            })
    }, [])

    console.log(data)

    if (data == false) {
        return (
            <div>
                <Navbar />
                Loading...
            
            </div>
        )
    } else {
        return (
            <div>
                <Navbar />
                {   
                    data != false && 
                        <div>
                            <a href={`https://osu.ppy.sh/mp/${mp}`}><div>{data["match_name"]}</div></a>
                            <hr></hr>
                            <div style={{display: "flex", height: "100vh"}}>
                                <div style={{flex: "1", overflowY: "hidden"}}>
                                    <h2>Match Costs</h2>
                                    <MatchCosts new_data={data["matchcosts"]} nameMap={nameMap} result={data["result"]} />
                                </div>
                                <div style={{flex: "1", overflowY: "auto"}}>
                                    <h2>Match Procedure</h2>
                                    
                                    <div style={{paddingBottom: "20px"}}>
                                        {data["events"].map((event) => 
                                            <MapDetails data={event} nameMap={nameMap} />
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    
                }
                
            </div>
        )
    
    }
    
}

export { MatchDetails };