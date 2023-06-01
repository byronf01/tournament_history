
function MapDetails( props ) {
    const data = props.data;
    const nameMap = props.nameMap;

    // console.log(data);
    // console.log(nameMap);

    // Edge case with qual lobbies with one person
    const bg = (data["map-background"] == "" ? "https://osu.ppy.sh/images/headers/profile-covers/c8.jpg" : data["map-background"]);
    return (
        <div>
            <div style={{border: "3px solid black"}}>
                <a href={data["map-link"]}>
                    <div style={{backgroundImage: `url(${bg})`, height: "200px"}}>
                        <p>{data["map-title"]}</p>
                    </div>
                </a>
                
                <div style={{borderTop: "1px solid black", display: "flex"}}>
                { 
                    ("blue_scores" in data) &&
                    <div style={{width: "50%"}}>
                    blue team
                    {Object.entries(data["blue_scores"])
                        .sort((s1, s2) => s2[1].value - s1[1].value )
                        .map(([id, score]) => 
                            
                            <div style={{padding: "0px 0px 10px 0px"}}>
                                <p>{nameMap[id]} - {score['value']}</p>
                                <p>Mods: {score['mods'].map((mod) => `${mod} `)}</p>
                                <p>Accuracy: {(Number(score['acc'])*100).toFixed(2)}% (
                                    {score['stats']['count_300']}/
                                    {score['stats']['count_100']}/
                                    {score['stats']['count_50']}/
                                    {score['stats']['count_miss']}
                                )</p>
                                <p>Combo: {score['combo']}</p>
                            </div>
                        )
                     }
                  
                </div>
                }
                {
                    ("red_scores" in data) &&
                        <div style={{width: "50%"}}>
                            red team
                            {Object.entries(data["red_scores"])
                                .sort((s1, s2) => s2[1].value - s1[1].value )
                                .map(([id, score]) => 
                                    
                                    <div style={{padding: "0px 0px 10px 0px"}}>
                                        <p>{nameMap[id]} - {score['value']}</p>
                                        <p>Mods: {score['mods'].map((mod) => `${mod} `)}</p>
                                        <p>Accuracy: {(Number(score['acc'])*100).toFixed(2)}% (
                                            {score['stats']['count_300']}/
                                            {score['stats']['count_100']}/
                                            {score['stats']['count_50']}/
                                            {score['stats']['count_miss']}
                                        )</p>
                                        <p>Combo: {score['combo']}</p>
                                    </div>
                                )
                            }
                        </div>
                }
                </div>
                <div style={{textAlign: "center"}}>
                    {data["blue_total"] >= data["red_total"] ? <div><b>{data["blue_total"]}</b> - {data["red_total"]}</div> : 
                    <div>{data["blue_total"]} - <b>{data["red_total"]}</b></div>}
                </div>
            </div>
        </div>
    )

}

export default MapDetails;