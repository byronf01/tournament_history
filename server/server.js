const mongoose = require("mongoose");
const express = require('express'); // do we need these last two
const cors = require('cors');

const app = express();
app.use(cors());
const PASSWORD = process.env.PASSWORD
const URI = "mongodb+srv://byronfong:" + PASSWORD + "@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"

connect(URI).catch(err => console.log(err));
const tournSchema = new mongoose.Schema({ });
const Tourn = mongoose.model('tournament_history', tournSchema);

app.get('/api/data', async (req, res) => {
    const data = await Tourn.find((err, tourns) => {
        if (err) {
            console.error(err);
        } else {
            data = tourns
        }
        });
    res.json(data)
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}



export default connect;