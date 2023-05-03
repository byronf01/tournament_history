import React, { useState, useEffect } from 'react';

function Member(props) {
    const id = props.id;
    const pfp = `https://a.ppy.sh/${id}?1677187336.png`
    const profile = `https://osu.ppy.sh/users/${id}`;
    const [username, setUsername] = useState('Loading...')
    const [discord, setDiscord] = useState('Loading...')
    const [fetchCount, setFetchCount] = useState(0);
    /*
    useEffect( () => {
        fetch(`http://localhost:5000/api/name/${id}`).then( (resp) => {
            setUsername(resp['username'])
            setDiscord(resp['discord'])
        })
    }, [])
    */
    useEffect( () => {
        async function fetchData() {
            const resp = await fetch(`http://localhost:5000/api/name/${id}`);
            const data = await resp.json();
            setUsername(data['username'])
            setDiscord(data['discord'])
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
        <div style={{display: "inline", marginRight: "10px"}}>
            <a href={profile}>
                <img src={pfp} style={{width: "6em", height: "6em"}} />
            </a>
            <p><b>{username}</b></p>
            <p><i>{discord}</i></p>
            
        </div>
    )
    
}


function Teammates(props) {
    const members = props.members;
    const team = members.map((member) => <Member id={member} />)

    return (
      <div style={{display: "flex", alignItems: "stretch", justifyContent: "center"}}>
        <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", padding: 0 }}>
            {team}
        </ul>
      </div>
    )
}

export { Teammates };