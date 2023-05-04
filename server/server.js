const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// npm run dev to start
const app = express();
app.use(cors());
const TournSchema = mongoose.Schema({ any: {} }, { collection: "tournament_history" });
const tournament_history = mongoose.model("tournament_history", TournSchema, "tournament_history");
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
        })  
    
})

app.get("/api/name/:id", async (req, res) => {
    // Get name and disc tag from osu id

    const id = req.params.id;

    const cunt = {
        'client_id': 21309,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'public',
    }

    axios.post('https://osu.ppy.sh/oauth/token', data=cunt).then( (resp) => {
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

app.get("/api/matches", async (req, res) => {
    // Return all matches in the db

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getMatches().then( (foundItems) => {
        res.json(foundItems);
    });

})

/* ???
app.get("/api/match/:id", async (req, res) => {
    console.log(req.query)
    // THINK ABT OTHER QUERIES IN BODY HOW TO MAKE THIS EASIER?
    // return match object given by key, and its stage
    const id = req.params.id;
    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    res.json({})

    
    getTourn(id).then( (foundItems) => {
        // Its Algorithm time.



        // put all matches into dict with 
        // mp: stage
        res.json({});
        })  
    
    
})

*/
async function getTourn(id) {
    const query = await tournament_history.find()
    
    return query;
}

async function getItems() {
    const query = await tournament_history.find()
    
    return query    
}

async function getMatches() {
    // Return a collection of Objects, with keys 
    // { acronym: "", mp: "", stage: "", Match: {Match obj} }
    // Note there can be multiple objects with the same acronym
    const all_data = []
    const query = await tournament_history.find()
    const doc_ct = Object.keys(query);
    
    for (let i = 0; i < doc_ct.length; i++) {
        const doc = query[doc_ct[i]].toJSON()
        const t_key = Object.keys(doc).filter(e => e !== '_id')[0];
        const acronym = doc[t_key]["acronym"]
        const all_stages = doc[t_key]["stages"];
        for (let j = 0; j < all_stages.length; j++) {
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
                                        "match": stage_data[k][match_details]};
                    all_data.push(match_ret);
                }
            }
        }
    }
    
    return all_data;  
}


async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}

app.listen(5000, () => {console.log("Server started on port 5000")})
