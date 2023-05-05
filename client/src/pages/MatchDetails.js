
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
                
                // console.log(JSON.stringify(ids))
                fetch(`http://localhost:5000/api/name`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ids)
                    
                }).then( resp => resp.json()).then( (result) => {
                    console.log(result)
                })
                
            })
    }, [])

    
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
                            <div>{data["match_name"]}</div>
                            <hr></hr>
                            <div style={{display: "flex", height: "100vh"}}>
                                <div style={{flex: "1", overflowY: "hidden"}}>
                                    <MatchCosts new_data={data["matchcosts"]} />

                                </div>
                                <div style={{flex: "1", overflowY: "auto"}}>
                                    

                                </div>
                            </div>
                        </div>
                    
                }
                
            </div>
        )
    
    }
    
}

export { MatchDetails };