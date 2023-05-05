import { useState, useEffect } from 'react';

function MatchCosts( {new_data} ) {
    // new_data type: Array -> [Obj, Obj]
    const [team_win, setTeam_win] = useState(new_data[0]);
    const [team_lose, setTeam_lose] = useState(new_data[1]);
    const [win_names, setWin_names] = useState({});
    const [lose_names, setLose_names] = useState({});

    useEffect( () => {

    }, [])

    // Edge case for qualifiers: team_lose may be empty
    if (Object.keys(team_lose).length === 0) {
        // Sort matchcosts reverse order 
        let ordered = [];
        
        let team = Object.keys(team_win);
        for (let id in team_win[team]) {

            ordered.push({ [id] : team_win[team][id]});
            
        }
        ordered = ordered.sort((obj1, obj2) => {
            if (obj1[Object.keys(obj1)] <= obj2[Object.keys(obj2)]) return 1;
            else return -1;
        });
        return (
            <div>
                <h2>Match Costs</h2>
                <div style={{border: "1px solid black"}}>
                    
                    <ol>
                        {ordered.map((ordered, index) => 
                            <li key={Object.keys(ordered)[0]}>
                                {Object.keys(ordered)[0]} - {ordered[Object.keys(ordered)[0]].toString().substring(0, 5)}
                                {index === 0 ? ' 🥇' : index === 1 ? ' 🥈' : index === 2 ? ' 🥉' : ''}
                            </li>
                        )}
                    </ol>
                </div>
            </div>
        );
    } else {
        // console.log("team_lose: " + team_lose);
        return (
            <div>
                <h2>Match Costs</h2>
                <div style={{border: "1px solid black"}}>
                  <p>bruh</p>
                </div>
            </div>
        )
    }
    
}

export { MatchCosts };