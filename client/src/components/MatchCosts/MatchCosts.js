import { useState, useEffect } from 'react';

function MatchCosts( {new_data, nameMap} ) {
    // new_data type: Array -> [Obj, Obj]
    const [team_win, setTeam_win] = useState(new_data[0]);
    const [team_lose, setTeam_lose] = useState(new_data[1]);
    const [win_names, setWin_names] = useState({});
    const [lose_names, setLose_names] = useState({});
    


    // Edge case for qualifiers: team_lose may be empty
    if (Object.keys(team_lose).length === 0) {
        // Sort matchcosts reverse order 
        let ordered = [];
        let winner_img;
        let top_mc = -1;
        
        let team = Object.keys(team_win);
        for (let id in team_win[team]) {
            // Keep track of the id of the highest mc that we have seen
            if (team_win[team][id] >= top_mc) {
                winner_img = id;
                top_mc = team_win[team][id];
            }
            ordered.push({ [id] : team_win[team][id]});
            
        }
        ordered = ordered.sort((obj1, obj2) => {
            if (obj1[Object.keys(obj1)] <= obj2[Object.keys(obj2)]) return 1;
            else return -1;
        });
        winner_img = `https://a.ppy.sh/${winner_img}?1677187336.png`
        return (
            <div>
                <h2>Match Costs</h2>
                <div style={{border: "1px solid black"}}>
                    <img src={winner_img} ></img>
                    <ol>
                        {ordered.map((ordered, index) => 
                            <li key={Object.keys(ordered)[0]}>
                                <a href={`https://osu.ppy.sh/users/${Object.keys(ordered)[0]}`}>
                                    {nameMap[Object.keys(ordered)[0]]}
                                </a>
                                - {ordered[Object.keys(ordered)[0]].toString().substring(0, 6)}
                                {index === 0 ? ' 🥇' : index === 1 ? ' 🥈' : index === 2 ? ' 🥉' : ''}
                            </li>
                        )}
                    </ol>
                </div>
            </div>
        );
    } else {
        // Sort matchcosts reverse order for both teams
        let win_ordered = [];
        let lose_ordered = [];
        let winner_img;
        let top_mc = -1;
       
        
        // Keep track of ids of top 3 performing players (edge case < 3 players)
        let mc1 = {"foo": -1};
        let mc2 = {"foo": -2};
        let mc3 = {"foo": -3};
        
        let team1 = Object.keys(team_win);
        for (let id in team_win[team1]) {
            // Keep track of the id of the highest mc that we have seen
            if (team_win[team1][id] >= top_mc) {
                winner_img = id;
                top_mc = team_win[team1][id];
            }
            // Top 3 check
            if (team_win[team1][id] >= mc1[Object.keys(mc1)[0]]) {
                [mc1, mc2, mc3] = [{[id]: team_win[team1][id]}, mc1, mc2];
            } else if (team_win[team1][id] >= mc2[Object.keys(mc2)[0]]) {
                [mc2, mc3] = [{[id]: team_win[team1][id]}, mc2];
            } else if (team_win[team1][id] >= mc3[Object.keys(mc3)[0]]) {
                mc3 = {[id]: team_win[team1][id]}
            }
            win_ordered.push({ [id] : team_win[team1][id]});
            
        }
       
        win_ordered = win_ordered.sort((obj1, obj2) => {
            if (obj1[Object.keys(obj1)] <= obj2[Object.keys(obj2)]) return 1;
            else return -1;
        });
       
        let team2 = Object.keys(team_lose);
        for (let id in team_lose[team2]) {
            
            if (team_lose[team2][id] >= top_mc) {
                winner_img = id;
                top_mc = team_lose[team2][id];
            }
            // continue top 3 check
            if (team_lose[team2][id] >= mc1[Object.keys(mc1)[0]]) {
                [mc1, mc2, mc3] = [{[id]: team_lose[team2][id]}, mc1, mc2];
            } else if (team_lose[team2][id] >= mc2[Object.keys(mc2)[0]]) {
                [mc2, mc3] = [{[id]: team_lose[team2][id]}, mc2];
            } else if (team_lose[team2][id] >= mc3[Object.keys(mc3)[0]]) {
                mc3 = {[id]: team_lose[team2][id]}
            }
            lose_ordered.push({ [id] : team_lose[team2][id]});
            
        }
      
        lose_ordered = lose_ordered.sort((obj1, obj2) => {
            if (obj1[Object.keys(obj1)] <= obj2[Object.keys(obj2)]) return 1;
            else return -1;
        });
       

        winner_img = `https://a.ppy.sh/${winner_img}?1677187336.png`
        return (
            <div>
                <h2>Match Costs</h2>
                <div style={{border: "1px solid black"}}>
                    <img src={winner_img} ></img>
                    <ol>
                        {win_ordered.map((win_ordered, index) => 
                            <li key={Object.keys(win_ordered)[0]}>
                                <a href={`https://osu.ppy.sh/users/${Object.keys(win_ordered)[0]}`}>
                                {nameMap[Object.keys(win_ordered)[0]]}</a> - {win_ordered[Object.keys(win_ordered)[0]].toString().substring(0, 6)}
                                {Object.keys(win_ordered)[0] === Object.keys(mc1)[0] ? ' 🥇' 
                                : Object.keys(win_ordered)[0] === Object.keys(mc2)[0] ? ' 🥈' 
                                : Object.keys(win_ordered)[0] === Object.keys(mc3)[0] ? ' 🥉' 
                                : ''}
                            </li>
                        )}
                    </ol>

                    <ol>
                        {lose_ordered.map((lose_ordered, index) => 
                            <li key={Object.keys(lose_ordered)[0]}>
                                <a href={`https://osu.ppy.sh/users/${Object.keys(lose_ordered)[0]}`}>
                                {nameMap[Object.keys(lose_ordered)[0]]}</a> - {lose_ordered[Object.keys(lose_ordered)[0]].toString().substring(0, 6)}
                                {Object.keys(lose_ordered)[0] === Object.keys(mc1)[0] ? ' 🥇' 
                                : Object.keys(lose_ordered)[0] === Object.keys(mc2)[0] ? ' 🥈' 
                                : Object.keys(lose_ordered)[0] === Object.keys(mc3)[0] ? ' 🥉' 
                                : ''}
                            </li>
                        )}
                    </ol>
                </div>
            </div>
        );
    }
    
}

export { MatchCosts };