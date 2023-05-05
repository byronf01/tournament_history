
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


function MatchDetails(props) {
    const { acr, mp } = useParams();
    console.log(mp)
    const [data, setData] = useState(false);

    useEffect( () => {
        fetch(`http://localhost:5000/api/matches/${acr}/${mp}`).then( resp => resp.json())
            .then( (result) => {
                
                setData(result);
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
                                    <h3>Match Costs</h3>
                                    
                                </div>
                                <div style={{flex: "1", overflowY: "auto"}}>
                                    <h3>Match Procedure</h3>

                                </div>
                            </div>
                        </div>
                    
                }
                
            </div>
        )
    
    }
    
}

export { MatchDetails };