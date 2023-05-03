function Member(props) {
    const id = props.id;
    const pfp = `https://a.ppy.sh/${id}?1677187336.png`
    const profile = `https://osu.ppy.sh/users/${id}`;
    return (
        <div style={{display: "inline", marginRight: "10px"}}>
            <a href={profile}>
                <img src={pfp} style={{width: "6em", height: "6em"}} />
            </a>
            <p>the name here</p>
            
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