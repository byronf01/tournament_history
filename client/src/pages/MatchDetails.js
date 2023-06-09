
import './Pages.css';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import MatchCosts from '../components/MatchCosts';
import MapDetails from '../components/MapDetails';
import Spinner from '../components/Spinner';
import ScrollButton from '../components/ScrollButton';
import StickyBox from "react-sticky-box";
import expand2 from '../assets/expandmc2.png';
import xbutton from '../assets/xbutton.png';

const API_URL_LOCAL = 'http://localhost:5000/api/data';
const API_URL = 'https://tournament-history-9rmu-maxy7da5q-byronf01.vercel.app';


function MatchcostMenu(props) {
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    const fadeOut = (cb) => {
        setIsFadingOut(true);
        // cb();
    };
    const handleRemoveItem = () => {
        props.removeItem();
        setIsFadingOut(false);
    };
    return (
        <div className={isFadingOut ? 'mcmenu-fadeout' : 'mcmenu'} style={{color: '#FFFFFF', position: 'fixed', width: '90%', height: '100%', zIndex: '9999'}}>
            <div style={{backgroundColor: '#76877a', border: '5px solid #3f6648', zIndex: 10, position: 'relative'}}>
                
                <div style={{position: 'absolute', top: '3%', right: '5%'}}>
                    <div style={{backgroundImage: `url(${xbutton})`,
                            backgroundSize: 'cover', width: '30px', height: '30px', cursor: 'pointer', zIndex: 9999}}
                        onClick={() => fadeOut(setTimeout(() => handleRemoveItem(), 300))}>
                        
                    </div>
                </div>
                
                <div style={{padding: '20px', paddingBottom: 0}}>
                    <h1 style={{marginTop: 0, marginBottom: '0.2em', fontSize: '5vh'}}>Match Costs</h1>
                    <MatchCosts new_data={props.new_data} nameMap={props.nameMap} result={props.result} isSticky={false}/>
                </div>
                
                
            </div>
            
        </div>
    );
}




function MatchDetails(props) {
    const { acr, mp } = useParams();
    const [data, setData] = useState(false);
    const [nameMap, setNameMap] = useState({}); // Maps a user's osu id to their osu username
    const [isLoading, setIsLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showMC, setShowMC] = useState(false);
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
            return (
                <div style={{fontFamily: 'trebuchet ms', position: 'relative'}}>
                        
                        <div style={{backgroundImage: `url(${expand2})`, backgroundSize: 'cover', position: 'fixed', left: 0, top: '50%',
                                    width: '100px', height: '100px', zIndex: 5, cursor: 'pointer'}} 
                                    onClick={ () => {
                                        setShowMC(true);
                                    }}      
                        />

                        {/*MCs displayed differently on mobile*/}
                        {showMC && 
                            <div style={{position: 'fixed', left: '3%', top: '12%', width: '94%', zIndex: 10}}>
                                <MatchcostMenu 
                                    new_data={data["matchcosts"]} 
                                    nameMap={nameMap} 
                                    result={data["result"]} 
                                    removeItem={() => setShowMC(false) } /> 
                            </div> 
                        }
                            
                        


                        <div style={{display: 'flex', justifyContent: 'center', marginLeft: '3%', marginRight: '3%'}}>
                            <a class='styled2' target="_blank" rel="noreferrer">
                                <p style={{fontSize: '7vh', color: '#FFFFFF', cursor: 'pointer', margin: 'auto', 
                                    marginTop: '2vw', marginBottom: '2vw', textAlign: 'center', flexWrap: 'wrap', wordWrap: 'anywhere'}} 
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
                        
                        <div className='margin' style={{display: 'flex', color: '#FFFFFF', paddingTop: '1em'}}>

                            <div style={{width: '98%', marginRight: '1%'}}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <h1 style={{marginTop: '0', fontSize: '5vh', textAlign: 'center'}}>Match Procedure</h1>
                                    <div style={{paddingBottom: "20px"}}>
                                        {data["events"].map((event) => 
                                            <MapDetails data={event} nameMap={nameMap} />
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
   
                    </div>
            )
        } else {
            return (
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
            );
        }
    }
    
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
                    
                    view()
                
            }
            
        </div>
    )

}
    


export { MatchDetails };