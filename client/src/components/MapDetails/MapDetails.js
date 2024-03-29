import defaultbg from '../../assets/defaultbg.png'
import corner from '../../assets/corner.png'
import './index.css'
import React, { useState, useEffect } from 'react';

function MapDetails( props ) {
    const data = props.data;
    const nameMap = props.nameMap;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // console.log(data);
    // console.log(nameMap);

    // Edge case with qual lobbies with one person
    const bg = (data["map-background"] == "" ? "https://osu.ppy.sh/images/headers/profile-covers/c8.jpg" : data["map-background"]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const view = () => {
        if (windowWidth < 600) {
            return 2;
        } else {
            return 1;
        }
    }
    
    return (
        <div>
            <div style={{border: "0.2em solid #224476", marginBottom: '2em'}}>
                <a class='styled2' href={data["map-link"]} target="_blank" rel="noreferrer">
                    <div style={{backgroundImage: `url(${defaultbg})`, backgroundSize: 'cover', height: "13em"}}>
                        <div style={{backgroundImage: `url(${bg})`, height: '100%', width: '100%'}}>
                            <div style={{display: 'flex', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'relative'}}>
                            
                                <div style={{alignSelf: 'center', textAlign: 'center', marginLeft: '1em', marginRight: '1em'}}>
                                    <h2 style={{margin: '0', fontSize: '1.8em', webkitTextStroke: '1px #000000'}}>{data['map-title'] != 'deleted beatmap' ? data["map-title"].slice(1, -1) : data['map-title']}</h2>
                                </div>
                                
                                <div class='corners' style={{backgroundImage: `url(${corner})`, top: '0.7vw', left: '0.7vw', width: '2em', height: '2em'}}></div>
                                <div class='corners' style={{backgroundImage: `url(${corner})`, top: '0.7vw', right: '0.7vw', width: '2em', height: '2em', transform: 'rotate(90deg)'}}></div>
                                <div class='corners'style={{backgroundImage: `url(${corner})`, bottom: '0.7vw', right: '0.7vw', width: '2em', height: '2em', transform: 'rotate(180deg)'}}></div>
                                <div class='corners' style={{backgroundImage: `url(${corner})`, bottom: '0.7vw', left: '0.7vw', width: '2em', height: '2em', transform: 'rotate(270deg)'}}></div>

                          
                            </div>
                        </div>
                    </div>
                </a>
                
                <div style={{display: "flex"}}>
                { 
                    ("blue_scores" in data) &&
                    <div style={{width: "50%", backgroundColor: '#7B9ED2', paddingTop: `${0.4*view()}vw`, borderTop: "0.2vw solid #224476", borderRight: '0.2vw solid #224476', position: 'relative' }}>
                    
                    {Object.entries(data["blue_scores"])
                        .sort((s1, s2) => s2[1].value - s1[1].value )
                        .map(([id, score], index) => 
                            
                            <div>
                                { index != 0 && 
                                    <hr style={{marginLeft: '1vw', marginRight: '1vw', borderTop: '0.5vw dashed #FFFFFF', 
                                            borderLeft: '0', borderRight: '0', borderBottom: '0', borderWidth: '0.2vw'}} />
                                }

                                <div style={{paddingLeft: '1.5vw', paddingRight: '1.5vw'}}>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                        <div style={{display: 'flex', flexWrap: 'wrap', wordWrap: 'anywhere'}}>
                                            <p style={{width: '60%', margin: '0', fontSize: `${2*view()}vw`}}>{nameMap[id]}</p>
                                            <p style={{width: '40%', textAlign: 'right', marginTop: '0.2vw', marginBottom: '0', marginLeft: 'auto', fontSize: `${1.6*view()}vw`}}>{score['value'].toLocaleString('en-US')}</p>
                                        </div>
                                        <div style={{marginLeft: 'auto'}}>
                                            <p style={{marginTop: '0', fontSize: `${1*view()}vw`}}>{score['combo'].toLocaleString('en-US')}x</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{marginTop: `${-2.5*view()}vw`, fontSize: `${1.3*view()}vw`, lineHeight: `${1.7*view()}vw`}}>
                                        <p style={{marginBottom: 0, marginTop: `${0.7*view()}vw`}}>Mods: {score['mods'].map((mod) => `${mod} `)}</p>
                                        <div style={{flexWrap: 'wrap', wordWrap: 'break-word'}}>
                                            <p style={{marginTop: 0}}>Accuracy: {(Number(score['acc'])*100).toFixed(2)}% (
                                                {score['stats']['count_300']}/
                                                {score['stats']['count_100']}/
                                                {score['stats']['count_50']}/
                                                {score['stats']['count_miss']}
                                            )</p>
                                        </div>
                                    </div>
                                    
                                </div>
                    
                            </div>
                        )
                    }

                    <div style={{height: `${5*view()}vw`}}/>

                    <div style={{textAlign: 'center', width: '100%', height: `${5*view()}vw`, display: 'flex', justifyContent: 'center', position: 'absolute', bottom: 0}}>
                        
                        {parseInt(data["blue_total"]) >= parseInt(data['red_total']) ? 
                            <div style={{fontSize: `${2.7*view()}vw`, margin: 'auto'}}><b>{data["blue_total"].toLocaleString('en-US')}</b></div>
                        : <div style={{fontSize: `${1.7*view()}vw`, margin: 'auto'}}>{data["blue_total"].toLocaleString('en-US')}</div>
                        }
   

                    </div>
                  
                    </div>
                }
                {
                    ("red_scores" in data && "blue_scores" in data) &&
                        <div style={{width: "50%", backgroundColor: '#EE8181', paddingTop: '0.4vw', borderTop: "0.2vw solid #224476", position: 'relative'}}>
                            
                            {Object.entries(data["red_scores"])
                                .sort((s1, s2) => s2[1].value - s1[1].value )
                                .map(([id, score], index) => 
                                <div>
                                { index != 0 && 
                                    <hr style={{marginLeft: '1vw', marginRight: '1vw', borderTop: '0.5vw dashed #FFFFFF', 
                                            borderLeft: '0', borderRight: '0', borderBottom: '0', borderWidth: '0.2vw'}} />
                                }

                                <div style={{paddingLeft: '1.5vw', paddingRight: '1.5vw',}}>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                        <div style={{display: 'flex', flexWrap: 'wrap', wordWrap: 'anywhere'}}>
                                            <p style={{width: '60%', margin: '0', fontSize: `${2*view()}vw`}}>{nameMap[id]}</p>
                                            <p style={{width: '40%', textAlign: 'right', marginTop: '0.2vw', marginBottom: '0', marginLeft: 'auto', fontSize: `${1.6*view()}vw`}}>{score['value'].toLocaleString('en-US')}</p>
                                        </div>
                                        <div style={{marginLeft: 'auto'}}>
                                            <p style={{marginTop: '0', fontSize: `${1*view()}vw`}}>{score['combo'].toLocaleString('en-US')}x</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{marginTop: `${-2.5*view()}vw`, fontSize: `${1.3*view()}vw`, lineHeight: `${1.7*view()}vw`}}>
                                        <p style={{marginBottom: 0, marginTop: `${0.7*view()}vw`}}>Mods: {score['mods'].map((mod) => `${mod} `)}</p>
                                        <div style={{flexWrap: 'wrap', wordWrap: 'break-word'}}>
                                            <p style={{marginTop: 0}}>Accuracy: {(Number(score['acc'])*100).toFixed(2)}% (
                                                {score['stats']['count_300']}/
                                                {score['stats']['count_100']}/
                                                {score['stats']['count_50']}/
                                                {score['stats']['count_miss']}
                                            )</p>
                                        </div>
                                    </div>
                                    
                                </div>
                    
                            </div>
                                )
                            }

                        <div style={{height: `${5*view()}vw`}}/>

                        <div style={{textAlign: 'center', width: '100%', height: `${5*view()}vw`, display: 'flex', justifyContent: 'center', position: 'absolute', bottom: 0}}>
                            
                            {parseInt(data["red_total"]) >= parseInt(data['blue_total']) ? 
                                <div style={{fontSize: `${2.7*view()}vw`, margin: 'auto'}}><b>{data["red_total"].toLocaleString('en-US')}</b></div>
                            : <div style={{fontSize: `${1.7*view()}vw`, margin: 'auto'}}>{data["red_total"].toLocaleString('en-US')}</div>
                            }
                          
                        </div>
                            
                        </div>
                }
                {
                    ("red_scores" in data && !("blue_scores" in data)) &&
                    <div style={{width: "100%", backgroundColor: '#BAACBD', paddingTop: '0.4vw', borderTop: "0.2vw solid #224476", position: 'relative'}}>
                            
                    {Object.entries(data["red_scores"])
                        .sort((s1, s2) => s2[1].value - s1[1].value )
                        .map(([id, score], index) => 
                        <div>
                        { index != 0 && 
                            <hr style={{marginLeft: '1vw', marginRight: '1vw', borderTop: '0.5vw dashed #FFFFFF', 
                                    borderLeft: '0', borderRight: '0', borderBottom: '0', borderWidth: '0.2vw'}} />
                        }

                        <div style={{paddingLeft: '1.5vw', paddingRight: '1.5vw',}}>
                            
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                <div style={{display: 'flex', flexWrap: 'wrap', wordWrap: 'anywhere'}}>
                                    <p style={{width: '60%', margin: '0', fontSize: `${2*view()}vw`}}>{nameMap[id]}</p>
                                    <p style={{width: '40%', textAlign: 'right', marginTop: '0.2vw', marginBottom: '0', marginLeft: 'auto', fontSize: `${1.6*view()}vw`}}>{score['value'].toLocaleString('en-US')}</p>
                                </div>
                                <div style={{marginLeft: 'auto'}}>
                                    <p style={{marginTop: '0', fontSize: `${1*view()}vw`}}>{score['combo'].toLocaleString('en-US')}x</p>
                                </div>
                            </div>
                            
                            <div style={{marginTop: `${-2.5*view()}vw`, fontSize: `${1.3*view()}vw`, lineHeight: `${1.7*view()}vw`}}>
                                <p style={{marginBottom: 0, marginTop: `${0.7*view()}vw`}}>Mods: {score['mods'].map((mod) => `${mod} `)}</p>
                                <div style={{flexWrap: 'wrap', wordWrap: 'break-word'}}>
                                    <p style={{marginTop: 0}}>Accuracy: {(Number(score['acc'])*100).toFixed(2)}% (
                                        {score['stats']['count_300']}/
                                        {score['stats']['count_100']}/
                                        {score['stats']['count_50']}/
                                        {score['stats']['count_miss']}
                                    )</p>
                                </div>
                            </div>
                            
                        </div>
            
                    </div>
                        )
                    }

                
                    
                </div>
                            
                      
                }
                </div>
                
            </div>
        </div>
    )

}

export default MapDetails;