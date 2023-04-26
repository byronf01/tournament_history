const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const TournSchema = mongoose.Schema({ any: {} }, { collection: "tournament_history" });
const tournament_history = mongoose.model("tournament_history", TournSchema, "tournament_history");
require('dotenv').config({path:__dirname+'../../.env'});
const PASSWORD = process.env.mongo_password
console.log(tournament_history)

app.get("/api/data", async (req, res) => {

    const URI = `mongodb+srv://byronfong:${PASSWORD}@tournament-history.qp41sza.mongodb.net/tournament_history`
    await connect(URI).catch(err => console.log(err));

    getItems().then( (foundItems) => {
        res.json(foundItems);
    });

    
    
})

async function getItems() {
    const query = await tournament_history.find()
    query instanceof mongoose.Query;
    const docs = await query
    return docs    
}

async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}

app.listen(5000, () => {console.log("Server started on port 5000")})
