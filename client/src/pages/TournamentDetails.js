
import './HomePage.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import osu_logo from '../assets/osu_logo.png';
import sheets_logo from '../assets/sheets_logo.png';
import challonge_logo from '../assets/challonge_logo.png';

const Slider = (props) => {
    const raw_range = props.range;
    const MIN_RANGE = 1;
    const MAX_RANGE = 100000;
    const [lo, setLo] = useState(MIN_RANGE);
    const [hi, setHi] = useState(MAX_RANGE)


    useEffect( () => {
        if (raw_range == 'Open Rank') {
            ; // 1-100000
        } else if (raw_range.includes('-')) {
            let [first, sec] = raw_range.split('-');
            // Interesting case with input like '7.5k' -> '7500'
            if (first.includes('.') && first.includes('k')) {
                first = first.replace('+', '').replace('.', '').replace('k', '00')
            } else {
                first = first.replace('+', '').replace('.', '').replace('k', '000')
            }

            if (sec.includes('.') && sec.includes('k')) {
                sec = sec.replace('+', '').replace('.', '').replace('k', '00')
            } else {
                sec = sec.replace('+', '').replace('.', '').replace('k', '000')
            }
            
            first = parseInt(first);
            sec = parseInt(sec);
    
            setLo(first);
            setHi(sec);
            
        } else if (raw_range.includes('+')) {
            // Interesting case with input like '7.5k' -> '7500'
            let lower;
            if (raw_range.includes('.')) {
                lower = raw_range.replace('+', '').replace('.', '').replace('k', '00')
            } else {
                lower = raw_range.replace('+', '').replace('.', '').replace('k', '000')
            }
            lower = parseInt(lower)
            setLo(lower);
        } else { // Unexpected case
            ;
        }
    }, [])

    const fillColor = () => {
        let percent1 = (lo / MAX_RANGE) * 100;
        let percent2 = (hi / MAX_RANGE) * 100;
        return {
            background: `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`
        }
    }
        
    
    return (
      <div>
        <div class="wrapper" style={{backgroundColor: "#617285", width: "90%"}}>
            <div class="values" style={{marginBottom: "-3rem"}}>
                <span id="range1">
                    {lo}
                </span>
                <span> - </span>
                <span id="range2">
                    {hi}
                </span>
            </div>
            <div class="labels" style={{marginBottom: "-3rem"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{fontSize: "1.5em", color: "#FFFFFF"}}>{MIN_RANGE}</p>
                        <p style={{fontSize: "1.5em", color: "#FFFFFF"}}>{MAX_RANGE}</p>
                    </div>
                </div>
            <div class="container">
                
                <div class="sliders">
                    <div class="slider-track" style={fillColor()}></div>
                    <input type="range" min={MIN_RANGE} max={MAX_RANGE} value={lo} id="slider-1" on/>
                    <input type="range" min={MIN_RANGE} max={MAX_RANGE} value={hi} id="slider-2" />
                </div>
                
                
                
                
            </div>
        </div>
       
      </div>
    );
  };

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
                       
                        
                        <Slider range={data['rank_range']}/>
                        
                    </div>

                    
            }
        </div>

    );

}

export { TournamentDetails };