
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser')

const app = express();



const SELF = 16626263;




app.use(bodyParser.json());
app.use(cors());
const TournSchema = mongoose.Schema({ any: {} }, { collection: "tournament_historyV1.1" });
const tournament_history = mongoose.model("tournament_historyV1.1", TournSchema, "tournament_historyV1.1");


// require('dotenv').config({path:__dirname+'../../.env'}); // will this work?
const PASSWORD = process.env.mongo_password;
const CLIENT_SECRET = process.env.client_secret;



app.get("/", (req, res) => {
    res.send("Online");
});

app.get("/api", (req, res) => {
    res.send("Api Online");
});


app.get("/api/data", async (req, res) => {
    // Return all db items

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getItems().then( (foundItems) => {
        res.json(foundItems);
    });

})

app.get("/api/data/:id", async (req, res) => {
    // Return tournament item 

    const id = req.params.id;
    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getTourn(id).then( (foundItems) => {
        res.json(foundItems);
        
        })  
})

app.get("/api/name/:id", async (req, res) => {
    // Get name and disc tag from osu id

    const id = req.params.id;

    const inf = {
        'client_id': 21309,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'public',
    }

    axios.post('https://osu.ppy.sh/oauth/token', data=inf).then( (resp) => {
        const token = resp['data']['access_token']

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        };

        axios.get(`https://osu.ppy.sh/api/v2/users/${id}`, { headers })
        .then( (resp2) => {
            console.log('Data requested from osu apiv2')
            res.json({"username": resp2['data']['username'], 
                        "discord": resp2['data']['discord']})
        })
        .catch(error => {
            console.error(error);
        });
    })
})

/*

app.post("/api/name", async (req, res) => {
    // Get osu usernames of a series of ids {id: username}
    const ids = req.body;

    const inf = {
        'client_id': 21309,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'public',
    }

    axios.post('https://osu.ppy.sh/oauth/token', data=inf).then( (resp) => {
        const token = resp['data']['access_token']

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        };

        axios.get(`https://osu.ppy.sh/api/v2/users/`, { 
            headers, 
            params: {
                ids
            },
        })
        .then( (resp2) => {
            console.log('Data requested from osu apiv2')
            // console.log(resp2)
            const users = resp2["data"]["users"];
            let usermap = {};
            for (let i in users) {
                const id = users[i]["id"]
                const username = users[i]["username"]
                usermap[[id]] = username;
            }

            res.json(usermap)
        })
        .catch(error => {
            console.error(error);
        });
    })
})

app.get("/api/matches", async (req, res) => {
    // Return all matches in the db

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getMatches().then( (foundItems) => {
        res.json(foundItems);
    });

})

app.get("/api/matches/:acr/:id", async (req, res) => {
    // Return a specific match given tournament acronym and mp link id

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getMatch(req.params.acr, req.params.id).then( (foundItems) => {
        res.json(foundItems);
    });

})

app.get("/api/stats", async (req, res) => {
    // Calculates and returns tournament statistics

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getItems(req.params.acr, req.params.id).then( async (foundItems) => {
        // need:
        // lifetime match record (W/L)
        let match_record = [0, 0];
        // lifetime map record (W/L)
        let map_record = [0, 0];
        // Placements -> {Grand Finals: 3, Finals: 5, ..., RO128: 0, DNQ: 3}
        let placements = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0};
        // Most teamed -> {138453: 34, ...}  
        let most_teamed = {};
        // Banners from osu profile ??!!? lolol
        let banners_won = [];
        // Most played mod combination {HD: 0.345534, NM: 0.2144, ...} percentages add up to 1
        let most_played_mods = {'NM': 0, 'HD': 0, 'HR': 0, 'DT': 0, 'EZ': 0, 'FL': 0, 'HDHR': 0, 'HDDT': 0, 'OTHER': 0}
        // Win rate per mod combination { HDHR: 0.333, ...} arrays are [W/L]
        let win_rate_per_mod = {'NM': [0,0], 'HD': [0,0], 'HR': [0,0], 'DT': [0,0], 'EZ': [0,0], 'FL': [0,0], 'HDHR': [0,0], 'HDDT': [0,0], 'OTHER': [0,0]}
        // Avg. score per mod (after normalization) { HD: 504853, ...}
        let avg_score_per_mod = {'NM': [], 'HD': [], 'HR': [], 'DT': [], 'EZ': [], 'FL': [], 'HDHR': [], 'HDDT': [], 'OTHER': []}
        const NORMALIZE = {'NM': 1.00, 'HD': 1.06, 'HR': 1.10, 'DT': 1.20, 'FL': 1.12, 'EZ': 0.5, 'HDHR': 1.16, 'HDDT': 1.26, 'OTHER': 1}
        // Most common team sizes/formats
        let most_common_team_size = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,'other':0};
        let most_common_format = {1:0,2:0,3:0,4:0,'other':0};
        // Tournaments in over time -> {2021: Arr[12], 2022: ...} plot as graph
            // note: if theres no way to get when the last match ended, just pretend every stage = 1 week of time
            // thank god all the dates are when quals started !!! thank you 2021 byron
        let tourns_over_time = {};

        let weeks_per_tourn = {};

        // Times matches are played at, by hour
        // let match_times_by_hour = {};     ERR THIS DATA NOT STORED

        // good question's stats? lol
        let good_question = {};
        // average matchcost per tournament mayhaps
        let avg_mc_per_tourn = {};
        // avg matches per tournament
        let avg_matches_per_tourn = {};
        // avg stages in losers
        let avg_stages_losers = {};
        // avg stages in winners
        let avg_stages_winners = {};
        // longest losers run, {ACR: (stages, matches in losers)}
        let longest_losers_run = {};
        
        const PLACEMENT_CHART = {'1st Place': 1, '2nd Place': 2, '3rd Place': 3, 'Finals': 4, 'Semifinals': 5, 'Quarterfinals': 6,
                                'Round of 16': 7, 'Round of 32': 8, 'Round of 64': 9, 'Round of 128': 10, 'DNQ': 11};
        const ROUNDS_CHART = [[128, 'Round of 128'], [64, 'Round of 64'], [32, 'Round of 32'], [16, 'Round of 16'], [8, 'Quarterfinals'],
        [4, 'Semifinals'], [3, 'Finals'], [3, 'Grand Finals']] // ending values really shouldnt matter too much here
        

        for (const i in foundItems) {
            const doc = foundItems[i].toJSON()
            
            // Base tournament stats
            placements[PLACEMENT_CHART[doc['placement']]] += 1;
            most_common_team_size[doc['team_size']] += 1;
            if (doc['format'].charAt(0) in most_common_format) {
                most_common_format[doc['format'].charAt(0)] += 1;
            } else most_common_format['other'] += 1;

            for (let i=0; i < doc['teammates'].length; i++) {
                teammate = doc['teammates'][i]
                if (teammate == SELF) {
                    continue; // self
                } 
                if (!(teammate in most_teamed)) {
                    most_teamed[teammate] = 0;
                }
                most_teamed[teammate] += 1;
            }

            // matches per tournament stat
            avg_matches_per_tourn[doc['title']] = 0;

            // Find weeks tournament spanned based on starting # competitors and round knocked out
            let weeks;
            let entrants;
            if (doc['seed'].includes('/')) {
                entrants = 32
            } else entrants = parseInt(doc['seed'].split(/\//)[1])
        
            let start = 0;
            let end = 0;
            let inc_end = false;
            let iter = 0;
            while (iter < ROUNDS_CHART.length) {
                if (ROUNDS_CHART[iter][0] == entrants) {
                    inc_end = true; // do not increment start any more
                } else if (ROUNDS_CHART[iter][1] == doc['placement']) {
                    // placement has been reached, break
                    end += 1;
                    break
                }
                if (inc_end == false) {
                    start += 1;
                }
                end += 1;
                iter += 1
            }
            weeks = end - start;
            
            // Date calculations
            const date = doc['date'];
            let [yr, mth, day] = date.split(/-/);
            [yr, mth, day] = [parseInt(yr), parseInt(mth), parseInt(day)]
            day += (weeks * 7);
            const months_spanned = 1 + Math.floor(day / 30);

            // Final processing of dates and add to tourns_over_time statistic
            if (yr in tourns_over_time == false) {
                tourns_over_time[yr] = Array(12).fill(0);
            }
            let counter = 0;
            mth -= 1; // tourns_over_time 0-indexed
            while (counter < months_spanned) {
                if (mth + counter > 12) yr++; // December 2021 -> Jan 2022 case 
                tourns_over_time[yr][(mth + counter) % 12] += 1;
                counter++;
            }
            
            for (const i in doc['stages']) {
                // stage stuff 
                stage = doc['stages'][i]

                // need to handle quals differently
                if ('Qualifiers' in stage) {
                    // Only need to calculate avg. score per mod
                    for (const m in stage) {
                        const matches = stage[m];
                        for (let j in matches) {
                            avg_matches_per_tourn[doc['title']] += 1;
                            const match = matches[j];
                            for (let mp in match) {
                                const details = match[mp];
                                for (let e in details['events']) {
                                    const map = details['events'][e]

                                    // Check if i played in this map
                                    if (!(SELF in map['red_scores'])) continue;
                                    const user_score = map['red_scores'][SELF];
                                    const [mods, multiplier] = modChecking(user_score)
                                    avg_score_per_mod[mods].push((user_score['value'] / multiplier));
                                    
                                }

                            }
                        }
                    }
                    continue;
                } else {

                    for (const k in stage) {
                        // match stuff
                        const rounds = stage[k];

                        for (const m in rounds) {
                            avg_matches_per_tourn[doc['title']] += 1
                            const mp = Object.keys(rounds[m])[0]
                            const match = rounds[m][mp]
                            // find out which team i was on, 0 -> blue, 1 -> red
                            
                            let team;
                            
                            if (match['team-type'] == 'head-to-head') {
                                team = 0;
                            } else { 
                                // check team SELF was in
                                if (match['teams'] && match['teams']['team_blue'].includes(SELF)) {
                                    team = 0;
                                } else if (match['teams'] && match['teams']['team_red'].includes(SELF)) {
                                    team = 1;
                                }
                            }
                            
                            // check if user won the match (results are blue-red)
                            if ((team == 0 && match['result'][0] > match['result'][1]) || 
                                    team == 1 && match['result'][1] > match['result'][0]) {
                                match_record[0] += 1
                            } else {
                                match_record[1] += 1
                            }

                            // Add average matchcost
                            if (doc['title'] in avg_mc_per_tourn == false) avg_mc_per_tourn[doc['title']] = [];
                            let t1 = match['matchcosts'][0][Object.keys(match['matchcosts'][0])[0]];
                            let t2 = match['matchcosts'][1][Object.keys(match['matchcosts'][1])[0]];
                            if (SELF in t1) {
                                avg_mc_per_tourn[doc['title']].push(t1[SELF])
                            } else if (SELF in t2) {
                                avg_mc_per_tourn[doc['title']].push(t2[SELF]) 
                            } else {
                                ; // match that i didnt play in ??
                            }

                            for (let j in match['events']) {
                                
                                // Map stuff
                                let event = match['events'][j]

                                // Check if i played in this map
                                
                                if (!(event['red_scores'] && SELF in event['red_scores']) && 
                                    !(event['blue_scores'] && SELF in event['blue_scores'])) continue;

                                let red_win = event['red_total'] >= event['blue_total'] ? true : false;
                                let user_win = 1; // 0 win 1 lose
                                if ((team == 0 && !red_win) || (team == 1 && red_win) ) {
                                    map_record[0] += 1;
                                    user_win = 0;
                                } else if ((team == 0 && red_win) || (team == 1 && !red_win)) map_record[1] += 1;
                                else throw new Error("unknown error in map record");
                               
                                
                                // Score checking
                                let user_score;
                                if (SELF in event['red_scores']) user_score = event['red_scores'][SELF];
                                else if (SELF in event['blue_scores']) user_score = event['blue_scores'][SELF];
                                else throw new Error('user not in either team')

                                const [mods, multiplier] = modChecking(user_score);
                                avg_score_per_mod[mods].push((user_score['value'] / multiplier));
                                most_played_mods[mods] += 1;
                                win_rate_per_mod[mods][user_win] += 1

                            }

                        }
                        
                    }

                }
            }
                
        }

        // Average out matches per tournament
        let avg_matches = 0;
        for (const i in avg_matches_per_tourn) {
            avg_matches += avg_matches_per_tourn[i];
        }
        
        avg_matches_per_tourn = avg_matches / Object.keys(avg_matches_per_tourn).length;

        // Calculate avg mc per tourn
        for (const i in avg_mc_per_tourn) {
            avg_mc_per_tourn[i] = avg_mc_per_tourn[i].reduce( (a, b) => a + b) / avg_mc_per_tourn[i].length
        }
        // Sort avg mc per tourn descending
        let foo = Object.keys(avg_mc_per_tourn).map( k => { return [k, avg_mc_per_tourn[k]] })
        foo.sort( (a, b) => {
            if (a[1] <= b[1]) return 1;
            else return -1;
        });
        avg_mc_per_tourn = foo;
    
        // take top 15 most teamed
        const TEAMED_CUTOFF = 15;
        let tmp = Object.keys(most_teamed).map( (k) => { return [k, most_teamed[k]]})
        tmp.sort( (a, b) => {
            if (a[1] <= b[1]) return 1;
            else return -1
        });
        most_teamed = tmp.slice(0, TEAMED_CUTOFF);

        // normalize most played mods
        for (const mod in most_played_mods) {
            most_played_mods[mod] = most_played_mods[mod] / (map_record[0]+map_record[1]);
        }
        
        // wr per mod
        for (const mod in win_rate_per_mod) {
            win_rate_per_mod[mod] = win_rate_per_mod[mod][0] / (win_rate_per_mod[mod][0]+win_rate_per_mod[mod][1]);
        }

        // average out scores for each mod
        let scores;
        for (const mod in avg_score_per_mod) {
            scores = avg_score_per_mod[mod];
            let avg = scores.reduce( (a, b) => a + b)
            avg_score_per_mod[mod] = (avg / scores.length) / NORMALIZE[mod];
        }

        
        // get banners won from tournament
        const inf = {
            'client_id': 21309,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'scope': 'public',
        }
    
        axios.post('https://osu.ppy.sh/oauth/token', data=inf).then( (resp) => {
            const token = resp['data']['access_token']
    
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            };
    
            axios.get(`https://osu.ppy.sh/api/v2/users/${SELF}`, { 
                headers, 
                params: {
                    "key": "id"
                },
            })
            .then( (res2) => {
                console.log('Data requested from osu apiv2')

                let raw = res2['data']['page']['raw'];
                const regex = /\[box=banners\](.*?)\[\/box\]/s;
                const found = raw.match(regex);
                
                if (found) {
                    const content = found[1].split(/\n/).filter( (l) => { return l != ""; } );
                    for (const l in content) {
                        const found2 = content[l].match(/\[img\](.*?)\[\/img\]/)
                        banners_won.push(found2[1]);
                    }
                } 
                
                // Final json object returned
                res.json(
                    {
                        'match_record': match_record,
                        'map_record': map_record,
                        'placements': placements,
                        'most_teamed': most_teamed,
                        'banners_won': banners_won,
                        'most_played_mods': most_played_mods,
                        'win_rate_per_mod': win_rate_per_mod,
                        'avg_score_per_mod': avg_score_per_mod,
                        'most_common_team_size': most_common_team_size,
                        'most_common_format': most_common_format,
                        'tourns_over_time': tourns_over_time,
                        'good_question': good_question,
                        'avg_mc_per_tourn': avg_mc_per_tourn,
                        'avg_matches_per_tourn': avg_matches_per_tourn,
                        'avg_stages_losers': avg_stages_losers,
                        'avg_stages_winners': avg_stages_winners,
                        'longest_losers_run': longest_losers_run,
                    }
        
                );
                
            })
            .catch(error => {
                console.error(error);
            });
        
        

            
        })
 
        
    });

})

function modChecking(score) {
    // Function that calculates the mod(s) used for a score.
    // Returns the mod combination used, as well as the multiplier for the mod combination.
    let mods = score['mods'];
    mods = mods.filter( (mod) => {
        return mod !== 'NF';
    });
    // mod checking 
    if (mods.includes('HD')) {
        if (mods.length == 1) return ['HD', 1.06];
        else if (mods.includes('HR') && mods.length == 2) return ['HDHR', 1.17];
        else if (mods.includes('DT') && mods.length == 2) return ['HDDT', 1.27];
        else return ['OTHER', 1.00];
    } else {
        if (mods.length == 0) return ['NM', 1.00];
        else if (mods.includes('HR') && mods.length == 1) return ['HR', 1.10];
        else if (mods.includes('DT') && mods.length == 1) return ['DT', 1.20];
        else if (mods.includes('EZ') && mods.length == 1) return ['EZ', 0.57143];
        else if (mods.includes('FL') && mods.length == 1) return ['FL', 1.12];
        else return ['OTHER', 1.00];
    }
    
}

async function getTourn(id) {
    // const query = await tournament_history.find({acronym: id})
    // changed to url_id as of 5/31
    const query = await tournament_history.find({url_id: id})
    return query;
}

*/

async function getItems() {
    const query = await tournament_history.find()
    return query    
}

async function getMatches() {
    // Return a collection of Objects for previewing matches, with keys 
    // { acronym: "", mp: "", stage: "", match_name: "", result: [] }
    // Note there can be multiple objects with the same acronym

    // 6/6: added player usernames for each match
    const all_data = []
    const query = await tournament_history.find()
    let map = new Map(); // player id -> list of INDEXES in data, representing matches the player has been in
    let all_players = [];
    
    let ct = 0;
    for (let i=0; i < query.length; i++) {
        const doc = query[i].toJSON()
        const all_stages = doc["stages"]
        const acronym = doc["acronym"]
        for (let j=0; j < all_stages.length; j++) {
            const stage_name = Object.keys(all_stages[j])[0]
            const stage_data = all_stages[j][stage_name];
            // Type of stage_data: array of dicts
            for (let k = 0; k < stage_data.length; k++) {
                const all_matches = Object.keys(stage_data[k])
                for (let match_key = 0; match_key < all_matches.length; match_key++) {
                    const match_details = all_matches[match_key];
                    const teams = stage_data[k][match_details]['teams'];
                    const match_ret = { "acronym": acronym,
                                        "mp": all_matches[match_key],
                                        "stage": stage_name,
                                        "match_name": stage_data[k][match_details]["match_name"],
                                        "result": stage_data[k][match_details]["result"],
                                        "teams": teams,
                                        "users": [],
                                    };
                    all_data.push(match_ret);

                    for (let t in teams) {
                        const players = teams[t]
                        for (let p in players) {
                            if (!map.has(players[p])) {
                                map.set(players[p], []);
                                all_players.push(players[p]);
                            }
                            let indexes = map.get(players[p])
                            indexes.push(ct)
                            map.set(players[p], indexes )
                        }
                    }
                    ct += 1;
                }
            }
        }
    }

    // Get usernames of all players in map with multiple osu api calls

    selection = 0;
    const queries = [];
    do {
        const ids = all_players.slice(50*selection, 50*(selection+1));
        queries.push(ids);
        ++selection;
        
    } while (50*selection < all_players.length);
    
    
    const foo = await Promise.all(
        queries.map(async q => getUsernamesBulk(q, all_data, map) )
    )
    
    console.log('All players fetched')
    return all_data;  
}

async function getUsernamesBulk(ids, all_data, map) {
    // Gets upwards of 50 users and their current usernames from the osu api. 

    const inf = {
        'client_id': 21309,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'public',
    }

    return new Promise((resolve, reject) => {
        axios.post('https://osu.ppy.sh/oauth/token', data = inf)
          .then(resp => {
            const token = resp.data.access_token;
    
            const headers = {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            };
    
            axios.get(`https://osu.ppy.sh/api/v2/users/`, {
              headers,
              params: {
                ids
              },
            })
              .then(resp2 => {
                console.log(`Players from ${ids[0]} queued`);
                const users = resp2.data.users;
    
                for (let i in users) {
                  const id = users[i].id;
                  const username = users[i].username;
    
                  const user_matches = map.get(id);
                  for (let j in user_matches) {
                    all_data[user_matches[j]].users.push(username);
                  }
                }
    
                resolve(1);
              })
              .catch(error => {
                console.error(error);
                reject(error);
              });
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      });

}

async function getMatch(acr, id) {
    const query = await tournament_history.find({acronym: acr})

    // Do a sequential search of all documents to find one with matching acronym :sob:
    // Remember edge case with tournaments with the same acronym
    for (let i = 0; i < query.length; i++) {
        const doc = query[i].toJSON()
        
        // Sequential search of all stages (binary search little advantage here)
        const stages = doc['stages'];
        
        for (let i = 0; i < stages.length; i++) {
            for (const [_, matches] of Object.entries(stages[i])) {
                for (let j in matches) {
                    if (id == Object.keys(matches[j])[0]) {
                        return matches[j][id];
                    }
                }
            }
        }
    }

    // No match found
    return {"Error": "Match Not Found"}

}

async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}


// app.listen(5000, () => {console.log("Server started on port 5000")})



module.exports = app;
// export default app;