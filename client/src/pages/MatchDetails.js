
import './Pages.css';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import MatchCosts from '../components/MatchCosts';
import MapDetails from '../components/MapDetails';
import Spinner from '../components/Spinner';
import ScrollButton from '../components/ScrollButton';
import StickyBox from "react-sticky-box";

const API_URL_LOCAL = 'http://localhost:5000/api/data';
const API_URL = 'https://tournament-history-9rmu-maxy7da5q-byronf01.vercel.app';


function MatchDetails(props) {
    const { acr, mp } = useParams();
    const [data, setData] = useState(false);
    const [nameMap, setNameMap] = useState({}); // Maps a user's osu id to their osu username
    const [isLoading, setIsLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);
    const navbarRef = useRef(null);
    const horizontalLineRef = useRef(null);

    useEffect( () => {
        fetch(`${API_URL}/api/matches/${acr}/${mp}`).then( resp => resp.json())
            .then( (result) => {
                setIsLoading(false)
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
                
                fetch(`${API_URL}/api/name`, {
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

    
    useEffect(() => {
        const handleScroll = () => {
          const navbarHeight = navbarRef.current ? navbarRef.current.offsetHeight : 0;
          // const navbarTop = navbarRef.current ? navbarRef.current.getBoundingClientRect().top : 0;
          const horizontalLineBottom = horizontalLineRef.current ? horizontalLineRef.current.getBoundingClientRect().bottom : 0;
            
          setIsSticky(horizontalLineBottom <= navbarHeight);
        };
      
        setTimeout(() => {
          handleScroll();
          window.addEventListener('scroll', handleScroll);
        }, 0);
      
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
    
    return (
        <div>
            
            <div style={{ position: 'sticky', top: '0', zIndex: '100'}}>
                <div ref={navbarRef}>
                    <Navbar />
                </div>
            </div>
            
            {isLoading && <Spinner />}
            <ScrollButton />
            {   
                data != false && 
                    
                    <div style={{fontFamily: 'trebuchet ms'}}>
                        
                        <div style={{display: 'flex', justifyContent: 'center', }}>
                            <a class='styled2' target="_blank" rel="noreferrer">
                                <p style={{fontSize: '7vh', color: '#FFFFFF', cursor: 'pointer', margin: 'auto', 
                                    marginTop: '2vw', marginBottom: '2vw', textAlign: 'center'}} 
                                    onClick={(e) => {
                                        const selection = window.getSelection();
                                        const selectedText = selection.toString();
                                        if (selectedText.length === 0) {
                                            window.open(`https://osu.ppy.sh/mp/${mp}`, '_blank');                                         
                                        }
                                    }}>
                                    {data["match_name"]
                                }</p>
                            </a>
                        </div>

                        <hr ref={horizontalLineRef} style={{width: '80%', height: '0.6vw', backgroundColor: '#D0D0D0', marginBottom: '1.5vw'}}/>
                        
                        <div className='margin' style={{display: 'flex', color: '#FFFFFF'}}>

                            <div style={{width: '29%', marginLeft: '1%'}}>
                                <StickyBox offsetTop={120}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <h1 style={{marginTop: '0', marginBottom: '0.3vw', fontSize: '5vh'}}>Match Costs</h1>
                                    <div>
                                        <MatchCosts new_data={data["matchcosts"]} nameMap={nameMap} result={data["result"]} isSticky={isSticky} />
                                    </div>
                                </div>
                                </StickyBox >
                            </div>

                            <div style={{ width: '4%' }}>
                                <div
                                    style={{
                                    borderLeft: '0.5vw solid #D0D0D0',
                                    height: '80vh',
                                    position: isSticky ? 'sticky' : 'static',
                                    top: '17vh',
                                    }}
                                ></div>
                            </div>

                            <div style={{width: '65%', marginRight: '1%'}}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <h1 style={{marginTop: '0', fontSize: '5vh'}}>Match Procedure</h1>
                                    <div style={{paddingBottom: "20px"}}>
                                        {data["events"].map((event) => 
                                            <MapDetails data={event} nameMap={nameMap} />
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
   
                    </div>
                
            }
            
        </div>
    )

}
    


export { MatchDetails };