import defaultbg from '../../assets/defaultbg.png'
import './index.css'

function MapDetails( props ) {
    const data = props.data;
    const nameMap = props.nameMap;

    // console.log(data);
    // console.log(nameMap);

    // Edge case with qual lobbies with one person
    const bg = (data["map-background"] == "" ? "https://osu.ppy.sh/images/headers/profile-covers/c8.jpg" : data["map-background"]);
    
    return (
        <div>
            <div style={{border: "0.3vw solid #224476"}}>
                <a class='styled2' href={data["map-link"]} target="_blank" rel="noreferrer">
                    <div style={{backgroundImage: `url(${defaultbg})`, backgroundSize: 'cover', height: "15vw"}}>
                        <div style={{backgroundImage: `url(${bg})`, height: '100%', width: '100%'}}>
                            <div style={{display: 'flex', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                                <div style={{alignSelf: 'center', textAlign: 'center', marginLeft: '1vw', marginRight: '1vw'}}>
                                    <h2 style={{margin: '0', fontSize: '1.8vw', webkitTextStroke: '1px #000000'}}>{data["map-title"].slice(1, -1)}</h2>
                                </div>
                            </div>
                        </div>
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