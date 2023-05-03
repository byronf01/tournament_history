import { useState, useEffect } from 'react';

function Member(props) {
    const id = props.id;
    const pfp = `https://a.ppy.sh/${id}?1677187336.png`
    const profile = `https://osu.ppy.sh/users/${id}`;
    const [username, setUsername] = useState('')
    const [discord, setDiscord] = useState('')

    useEffect( () => {
        fetch(`http://localhost:5000/api/name/${id}`).then( (resp) => {
            setUsername(resp['username'])
            setDiscord(resp['discord'])
        })
    }, [])

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