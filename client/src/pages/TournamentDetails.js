
import './Pages.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import osu_logo from '../assets/osu_logo.png';
import osu_logo_missing from '../assets/osu_logo_missing.png'
import sheets_logo from '../assets/sheets_logo.png';
import sheets_logo_missing from '../assets/sheets_logo_missing.png'
import challonge_logo from '../assets/challonge_logo.png';
import challonge_logo_missing from '../assets/challonge_logo_missing.png'
import { RangeSlider } from '../components/RangeSlider'
import { Teammates } from '../components/Teammates';
import MatchPreview from '../components/MatchPreview';
import ImageContainer from '../components/ImageContainer'


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
                        all_stages.push(<MatchPreview acronym={result[0]['acronym']} mp={mp} stage={stage_name} match_name={matches_arr[i][mp]["match_name"]} result={matches_arr[i][mp]["result"]} teams={matches_arr[i][mp]['teams']} />);
                    }
                }
                setMatches(all_stages);
            })
           
    }, []);

    const url =( data['bracket'] ? `${data['bracket']}/module` : "")
    const banner = { url: data['banner'], alt: 'banner' };
    const logo1 = osu_logo ? data['forum'] !== '' : osu_logo_missing;
    const logo2 = sheets_logo ? data['spreadsheet'] !== '' : sheets_logo_missing;
    const logo3 = challonge_logo ? data['bracket'] !== '': challonge_logo_missing;

    return (
        <div>
            <Navbar />
            {
                data != false && 
                    <div style={{marginLeft: "15%", marginRight: "15%", fontFamily: 'trebuchet ms'}}>
                        <div style={{display: "flex", alignItems: 'center', width: "100%"}}>
                            <div style={{textAlign: "left"}}>
                                <h1 style={{fontSize: "3.5vw", marginBottom: "0"}}>{data["title"]}</h1>
                                <div style={{fontSize: "1.4vw", overflowWrap: 'break-word'}}>
                                    <p style={{marginTop: '0.5vw', marginBottom: '0'}}>Start Date: {data['date']}</p>
                                    <p style={{marginTop: '0.5vw', marginBottom: '0'}}>Format: {data['format']}</p>
                                    <p style={{marginTop: '0.5vw', marginBottom: '0'}}>Gimmick: {data['notes'] ? data['notes'] : "No Gimmick"}</p>
                                    <p style={{marginTop: '0.5vw', marginBottom: '0'}}><i>"{data['comments']}"</i></p>
                                </div>
                            </div>
                            <div style={{justifyContent: 'center', width: "50%"}}>
                                <ImageContainer image={banner} width='33vw' height='11vw'/>
                            </div>
                        </div>
                        
                        <div style={{marginBottom: '0', display: 'flex'}}>
                            <div style={{display: "flex", paddingLeft: '2%', paddingRight: '7%', marginTop: '1vw', gap: "4vw", alignItems: 'flex-start', fontSize: '1vw'}}>
                                
                                <div style={{marginRight: "0", width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                                    <p>Forum Post</p> 
                                    
                                    { data['forum'] !== '' ? 
                                        <a href={data['forum']} target="_blank" rel="noreferrer" style={{textAlign: 'center'}}>
                                            <div style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <ImageContainer image={{url: osu_logo, alt: 'osu'}} width='5vw' height='5vw' />
                                            </div>
                                        </a>
                                        : 
                                        <a>
                                            <div style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <ImageContainer image={{url: osu_logo_missing, alt: 'osu missing'}} width='5vw' height='5vw' />
                                            </div>
                                        </a>
                                    }   
                                
                                </div>
                                
                                <div style={{marginRight: "0", width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                                    <p>Spreadsheet</p> 
                                
                                    { data['tourn_sheet'] !== '' ? 
                                        <a target="_blank" rel="noreferrer" href={data['tourn_sheet']} style={{textAlign: 'center'}}>
                                            <div style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <ImageContainer image={{url: sheets_logo, alt: 'sheet'}} width='5vw' height='5vw' />
                                            </div>
                                        </a>
                                        : 
                                        <a>
                                            <div style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <ImageContainer image={{url: sheets_logo_missing, alt: 'sheet missing'}} width='5vw' height='5vw' />
                                            </div>
                                        </a>
                                    }
                                    
                                </div>
                                
                                <div style={{marginRight: "0", width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                                    <p>Bracket</p> 
                                    
                                    { data['tourn_sheet'] !== '' ? 
                                        <a href={data['bracket']} target="_blank" rel="noreferrer" style={{textAlign: 'center'}}>
                                            <div style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <ImageContainer image={{url: challonge_logo, alt: 'bracket'}} width='5vw' height='5vw' />
                                            </div>
                                        </a> :
                                        <a>
                                            <div style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <ImageContainer image={{url: challonge_logo_missing, alt: 'bracket_missing'}} width='5vw' height='5vw' />
                                            </div>
                                        </a>
                                    }
                                </div>
                                
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', fontSize: '1.3vw', justifyContent: 'center', alignItems: 'center'}}>
                                <p>Rank Range</p>
                                <RangeSlider range={data['rank_range']}/>
                            </div>
                        </div>

                        <div style={{marginTop: '-2vw'}}>
                            <h2 style={{fontSize: "1.7vw", marginRight: "10%", marginTop: '0'}}>Team Name: {data['team_name']} </h2>
                        </div>
                        
                        <Teammates members={data['teammates']} />

                        <div style={{fontSize: '1.3vw', lineHeight: '1.8vw', paddingBottom: '0.7vw'}}>
                            <p style={{margin: '0'}}>Seed: <b><u>{data['seed']}</u></b></p>
                            <p style={{margin: '0'}}>Placement: <b><u>{data['placement']}</u></b></p>
                        </div>

                        { data['bracket'] != false && <iframe src={url} width="100%" height="500" frameborder="0" scrolling="auto" allowtransparency="true"></iframe>}
                        
                        <div>
                            <ul style={{position: 'relative', left: '2.5vw'}}>{matches}</ul>
                        </div>
                    </div>

                    
            }
        </div>

    );

}

export { TournamentDetails };