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

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getItems().then( (foundItems) => {
        res.json(foundItems);
    });

})

app.get("/api/data/:id", async (req, res) => {
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
            res.json({"username": resp2['data']['username'], 
                        "discord": resp2['data']['discord']})
        })
        .catch(error => {
            console.error(error);
        });


    })
    
    

    

})

async function getTourn(id) {
    const query = await tournament_history.find()
    
    return query;
}

async function getItems() {
    const query = await tournament_history.find()
    
    return query    
}

async function getName(id) {
    

}

async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}

app.listen(5000, () => {console.log("Server started on port 5000")})
