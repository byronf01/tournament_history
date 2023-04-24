const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const tournSchema = new mongoose.Schema({ });
const Tourn = mongoose.model('tournament_history', tournSchema);

app.get("/api/data", (req, res) => {

    const PASSWORD = process.env.mongo-password
    console.log(PASSWORD)
    const URI = "mongodb+srv://byronfong:" + PASSWORD + "@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"
    connect(URI).catch(err => console.log(err));

    getItems().then( (foundItems) => {
        res.json(foundItems);
    });

    
})

async function getItems() {
    const docs = await Tourn.find({});
    return docs;
}

async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}

app.listen(5000, () => {console.log("Server started on port 5000")})
