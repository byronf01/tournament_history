const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// npm run dev to start
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(cors());
const TournSchema = mongoose.Schema({ any: {} }, { collection: "tournament_historyV1.1" });
const tournament_history = mongoose.model("tournament_historyV1.1", TournSchema, "tournament_historyV1.1");
require('dotenv').config({path:__dirname+'../../.env'});
const PASSWORD = process.env.mongo_password;
const CLIENT_SECRET = process.env.client_secret;
console.log(tournament_history)

app.get("/api/data", async (req, res) => {
    // Return all db items

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getItems().then( (foundItems) => {
        res.json(foundItems);
    });

})

app.get("/api/data/:id", async (req, res) => {
    // Return db item by acronym

    const id = req.params.id;
    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getTourn(id).then( (foundItems) => {
        res.json(foundItems);
        /*
        let tourn;
        for (const [, i] of Object.entries(foundItems)) {
            doc = i.toJSON()
            const keys = Object.keys(doc).filter(e => e !== '_id');
            const k = keys[0];
            if (doc[k]['acronym'] == id) {
                tourn = i
                break;
            } 
        }
        res.json(tourn);
        */
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

async function getTourn(id) {
    const query = await tournament_history.find({acronym: id})
    return query;
}

async function getItems() {
    const query = await tournament_history.find()
    return query    
}

async function getMatches() {
    // Return a collection of Objects for previewing matches, with keys 
    // { acronym: "", mp: "", stage: "", match_name: "" }
    // Note there can be multiple objects with the same acronym
    const all_data = []
    const query = await tournament_history.find()
    
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
                    const match_ret = { "acronym": acronym,
                                        "mp": all_matches[match_key],
                                        "stage": stage_name,
                                        "match_name": stage_data[k][match_details]["match_name"]};
                    all_data.push(match_ret);
                }
            }
        }
    }
  
    return all_data;  
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
    /*
    const doc_ct = Object.keys(query);
    
    for (let i = 0; i < doc_ct.length; i++) {
        const doc = query[doc_ct[i]].toJSON()
        const t_key = Object.keys(doc).filter(e => e !== '_id')[0];
        
        if ( acr == doc[t_key]["acronym"]) {
            // A tournament with the correct acronym found
            
            // Sequential search of all stages (binary search little advantage here)
            const stages = doc[t_key]['stages'];
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
    }
    */

    // No match found
    return {"Error": "Match Not Found"}

}

async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}

app.listen(5000, () => {console.log("Server started on port 5000")})
