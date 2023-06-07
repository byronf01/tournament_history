import React, { useState, useEffect } from 'react';
import ImageContainer from './ImageContainer'

const API_URL_LOCAL = 'http://localhost:5000/api/data';
const API_URL = 'https://tournament-history-9rmu-maxy7da5q-byronf01.vercel.app';

function Member(props) {
    const id = props.id;
    const index = props.index
    const pfp = `https://a.ppy.sh/${id}?1677187336.png`
    const profile = `https://osu.ppy.sh/users/${id}`;
    const [username, setUsername] = useState('Loading...')
    const [discord, setDiscord] = useState('Loading...')
    const [fetchCount, setFetchCount] = useState(0);
    
    useEffect( () => {
        async function fetchData() {
            const resp = await fetch(`${API_URL}}/api/name/${id}`);
            const data = await resp.json();
            setUsername(data['username'])
            
            if (data['discord'] !== null) setDiscord(data['discord']);
            else setDiscord('(no tag linked)')
            setFetchCount(fetchCount => fetchCount+1)
        }
        // fetchData();
        const intervalId = setInterval( () => {
            fetchData();
        }, 4000);

        if (fetchCount >= 1) {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [fetchCount])

    

    return (
        <div style={{display: "inline", marginRight: "2.5vw", wordWrap: 'break-word', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column', alignContent: 'flex-start'}}>
            <div style={{height: '2vw', fontSize: '1.2vw'}}>
                { index === 0 &&
                    <p style={{margin: '0'}}>(c)</p>
                }
            </div>
            <div style={{marginTop: '0.3vw', display: 'flex', justifyContent: 'center'}}>
                <a href={profile} target="_blank" rel="noreferrer">
                    <div>
                        <ImageContainer image={{url: pfp, alt: 'pfp'}} width='5vw' height='5vw'/>
                    </div>
                </a>
            </div>
            
            <div style={{margin: '0', lineHeight: '0.3vw', wordWrap: 'break-text'}}>
                <p style={{fontSize: '1.2vw'}}><b>{username}</b></p>
                <p style={{fontSize: '0.9vw'}}><i>{discord}</i></p>
            </div>
            
        </div>
    )
    
}


function Teammates(props) {
    const members = props.members;
    const team = members.map((member, i) => <Member id={member} index={i}/>)

    return (
      <div style={{display: "flex", alignItems: "stretch", justifyContent: "center", paddingTop: '1vw'}}>
        <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", padding: 0, marginTop: '-2vw', marginBottom: '0vw' }}>
            {team}
        </ul>
      </div>
    )
}

export { Teammates };